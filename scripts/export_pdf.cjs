#!/usr/bin/env node
'use strict';
const path = require('node:path');
const {dependency, inspect, newOutput, write} = require('./svg.cjs');
async function main() {
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === '--help') {
    console.log('Usage: node export_pdf.cjs input.svg output.pdf [--width-mm MILLIMETERS]\nVector PDF export. Unsupported features fail; no raster fallback.'); return;
  }
  if (!(args.length === 2 || (args.length === 4 && args[2] === '--width-mm'))) throw new Error('Usage: node export_pdf.cjs input.svg output.pdf [--width-mm MILLIMETERS]');
  const mm = args.length === 4 ? Number(args[3]) : 178;
  if (!Number.isFinite(mm) || mm < 1 || mm > 2000) throw new Error('PDF width must be between 1 and 2000 mm.');
  const input = path.resolve(args[0]), output = path.resolve(args[1]);
  newOutput(output, '.pdf');
  const checked = inspect(input), sharp = dependency('sharp');
  const meta = await sharp(checked.bytes, {limitInputPixels: 40000000}).metadata();
  const width = mm * 72 / 25.4, height = width * meta.height / meta.width;
  if (!Number.isFinite(height) || height < 1 || height > 14400) throw new Error('Projected PDF height is unsupported.');
  if (checked.elements.some(n => ['filter','mask','pattern','style'].includes(n.localName))) throw new Error('This PDF exporter does not support filters, masks, patterns or style sheets. Use basic SVG/inline styles or another vector exporter.');
  const PDFDocument = dependency('pdfkit'), SVGtoPDF = dependency('svg-to-pdfkit');
  const doc = new PDFDocument({size: [width, height], margin: 0, compress: true}), chunks = [];
  const complete = new Promise((resolve, reject) => {
    doc.on('data', chunk => chunks.push(chunk)); doc.on('error', reject);
    doc.on('end', () => resolve(Buffer.concat(chunks)));
  });
  const warnings = [];
  SVGtoPDF(doc, checked.source, 0, 0, {width, height, preserveAspectRatio:'xMidYMid meet', warningCallback: message => warnings.push(message)});
  doc.end();
  const bytes = await complete;
  if (warnings.length) throw new Error(`PDF exporter reported unsupported or missing content: ${warnings.join('; ')}`);
  write(output, bytes);
  console.log(JSON.stringify({input, output, widthMm: mm, heightMm: height * 25.4 / 72, bytes: bytes.length, ...checked.report, fontNote: 'PDF uses PDFKit font substitution; inspect labels and glyphs against SVG/PNG.'}));
}
main().catch(e => {console.error(`export_pdf: ${e.message}`); process.exitCode = 1;});
