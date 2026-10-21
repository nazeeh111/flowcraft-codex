#!/usr/bin/env node
'use strict';
// Codex-native helper. No upstream inference code or model calls.
const path = require('node:path');
const {dependency, inspect, newOutput, write} = require('./svg.cjs');
async function main() {
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === '--help') {
    console.log('Usage: node render_svg.cjs input.svg output.png [--width PIXELS]\nRequires Sharp and xmldom. Refuses to overwrite. No network or model calls.'); return;
  }
  if (!(args.length === 2 || (args.length === 4 && args[2] === '--width'))) throw new Error('Usage: node render_svg.cjs input.svg output.png [--width PIXELS]');
  const width = args.length === 4 ? Number(args[3]) : 1800;
  if (!Number.isInteger(width) || width < 1 || width > 12000) throw new Error('Width must be an integer between 1 and 12000.');
  const input = path.resolve(args[0]), output = path.resolve(args[1]);
  newOutput(output, '.png');
  const {bytes, report} = inspect(input), sharp = dependency('sharp');
  const meta = await sharp(bytes, {density: 144, limitInputPixels: 40000000}).metadata();
  const height = Math.round(width * meta.height / meta.width);
  if (!Number.isFinite(height) || height < 1 || height > 12000 || width * height > 40000000) throw new Error('Projected PNG exceeds dimension limits (12000 per side; 40 million pixels).');
  const png = await sharp(bytes, {density: 144, limitInputPixels: 40000000}).resize({width}).png().toBuffer();
  const info = await sharp(png).metadata();
  write(output, png);
  console.log(JSON.stringify({input, output, width: info.width, height: info.height, bytes: png.length, ...report}));
}
main().catch(e => {console.error(`render_svg: ${e.message}`); process.exitCode = 1;});
