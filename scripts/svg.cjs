'use strict';
// Structural checks for authored SVG, not an arbitrary-content sandbox.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
function dependency(name) {
  for (const root of [path.dirname(__dirname), process.cwd(), path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node')]) {
    let resolved;
    try { resolved = require.resolve(name, {paths: [root]}); }
    catch (e) { if (e.code === 'MODULE_NOT_FOUND') continue; throw e; }
    return require(resolved);
  }
  throw new Error(`${name} unavailable. Run npm ci in the skill folder or use an available renderer.`);
}
function inspect(input) {
  if (path.extname(input).toLowerCase() !== '.svg') throw new Error('Expected an .svg input.');
  if (fs.statSync(input).size > 20 * 1024 * 1024) throw new Error('SVG exceeds the 20 MiB input limit.');
  const bytes = fs.readFileSync(input), source = bytes.toString('utf8');
  if (/<!DOCTYPE|<!ENTITY/i.test(source)) throw new Error('SVG entities and document types are unsupported.');
  const {DOMParser} = dependency('@xmldom/xmldom');
  const errors = [];
  const dom = new DOMParser({onError: (level, message) => errors.push(`${level}: ${message}`)}).parseFromString(source, 'image/svg+xml');
  if (errors.length) throw new Error(`Invalid SVG: ${errors[0]}`);
  const root = dom.documentElement;
  if (!root || root.localName !== 'svg' || root.namespaceURI !== 'http://www.w3.org/2000/svg') throw new Error('Expected a namespaced SVG root.');
  const ids = new Set(), references = [], elements = [];
  let images = 0;
  const reject = new Set(['script', 'foreignObject', 'animate', 'animateMotion', 'animateTransform', 'set', 'a']);
  function css(value) {
    if (value.includes('\\') || /\/\*|@import|@font-face|expression\s*\(/i.test(value)) throw new Error('Unsupported CSS escape, comment, import, font or expression.');
    for (const m of value.matchAll(/url\s*\(([^)]*)\)/gi)) {
      const target = m[1].trim().replace(/^(['"])(.*)\1$/, '$2');
      if (!/^#[^\s]+$/.test(target)) throw new Error('CSS resources must be local #id fragments.');
      references.push(target.slice(1));
    }
  }
  function visit(node) {
    if (node.nodeType === 7 && node.nodeName !== 'xml') throw new Error('SVG processing instructions are unsupported.');
    if (node.nodeType === 1) {
      if (node.namespaceURI !== 'http://www.w3.org/2000/svg' || reject.has(node.localName)) throw new Error(`Unsupported SVG element: ${node.nodeName}`);
      elements.push(node);
      if (node.hasAttribute('id')) {
        const id = node.getAttribute('id');
        if (!id || ids.has(id)) throw new Error(`Empty or duplicate SVG id: ${id}`);
        ids.add(id);
      }
      if (node.localName === 'image') images++;
      if (node.localName === 'style') css(node.textContent);
      for (let i = 0; i < node.attributes.length; i++) {
        const attr = node.attributes.item(i);
        if (/^on/i.test(attr.localName) || attr.name === 'xml:base') throw new Error(`Unsupported active attribute: ${attr.name}`);
        if (attr.localName === 'href') {
          const target = attr.value.trim();
          if (target.startsWith('#')) references.push(target.slice(1));
          else if (!(node.localName === 'image' && /^data:image\/(png|jpeg|webp);base64,[a-z0-9+/=\s]+$/i.test(target))) throw new Error('Use local #id references or embedded PNG/JPEG/WebP images.');
        }
        if (/url\s*\(/i.test(attr.value) || attr.localName === 'style') css(attr.value);
      }
    }
    for (let child = node.firstChild; child; child = child.nextSibling) visit(child);
  }
  visit(dom);
  for (const id of references) if (!ids.has(id)) throw new Error(`Missing SVG reference: #${id}`);
  return {bytes, source, root, elements, report: {elements: elements.length, ids: ids.size, embeddedImages: images, representation: images ? 'hybrid' : 'vector', limitations: 'Structural checks only; inspect scientific meaning, text, fonts, clipping and final-size layout visually.'}};
}
function newOutput(output, ext) {
  if (path.extname(output).toLowerCase() !== ext) throw new Error(`Expected ${ext} output.`);
  try { fs.lstatSync(output); } catch (e) { if (e.code === 'ENOENT') return; throw e; }
  throw new Error('Output exists; choose a new versioned filename.');
}
function write(output, bytes) { fs.writeFileSync(output, bytes, {flag: 'wx'}); }
module.exports = {dependency, inspect, newOutput, write};
if (require.main === module) {
  try {
    if (process.argv.length !== 3) throw new Error('Usage: node svg.cjs input.svg');
    console.log(JSON.stringify(inspect(path.resolve(process.argv[2])).report));
  } catch (e) { console.error(`svg: ${e.message}`); process.exitCode = 1; }
}
