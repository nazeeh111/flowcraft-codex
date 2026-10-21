'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const {inspect,dependency} = require('../scripts/svg.cjs');
const scripts = path.join(__dirname,'../scripts');
const wrap = b => `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100">${b}</svg>`;
function fixture(t,source) {
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'paperbanana-test-'));
 t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
 const input=path.join(dir,'input.svg'); fs.writeFileSync(input,source);
 return {dir,input};
}
function run(script,...args) {return spawnSync(process.execPath,[path.join(scripts,script),...args],{encoding:'utf8',timeout:15000});}

test('valid SVG produces correctly sized PNG and preserves old output',async t=>{
 const {dir,input}=fixture(t,wrap('<rect width="200" height="100" fill="#16824b"/>'));
 const output=path.join(dir,'out.png');
 let r=run('render_svg.cjs',input,output,'--width','400');assert.equal(r.status,0,r.stderr);
 const sharp=dependency('sharp'), meta=await sharp(output).metadata();
 assert.equal(meta.width,400);assert.equal(meta.height,200);
 const {data}=await sharp(output).removeAlpha().raw().toBuffer({resolveWithObject:true});
 assert.deepEqual([...data.subarray(0,3)],[22,130,75]);
 const before=fs.readFileSync(output);
 r=run('render_svg.cjs',input,output);assert.notEqual(r.status,0);assert.match(r.stderr,/Output exists/);
 assert.deepEqual(fs.readFileSync(output),before);
});
for (const [name,source] of [
 ['malformed','<svg broken'],
 ['wrong root','<html/>'],
 ['duplicate IDs',wrap('<g id="x"/><g id="x"/>')],
 ['broken reference',wrap('<path marker-end="url(#missing)"/>')],
 ['external href',wrap('<image href="https://example.com/a.png"/>')],
 ['entity-encoded external href',wrap('<image href="https&#58;//example.com/a.png"/>')],
 ['relative CSS resource',wrap('<rect width="100" height="100" style="fill:url(external.svg#g)"/>')],
 ['relative CSS stylesheet',wrap('<style>.x{fill:url(external.svg#g)}</style><rect class="x"/>')],
 ['escaped CSS',wrap('<rect style="fill:u\\72l(external.svg)"/>')],
 ['active handler',wrap('<rect onload="alert(1)"/>')],
 ['script',wrap('<script>alert(1)</script>')],
 ['document type','<!DOCTYPE svg [<!ENTITY x "abc">]>'+wrap('<text>&x;</text>')],
 ['projected tall raster','<svg xmlns="http://www.w3.org/2000/svg" width="1" height="10000"><rect width="1" height="10000"/></svg>']
]) test(`${name} fails without creating output`,t=>{
 const {dir,input}=fixture(t,source),output=path.join(dir,'out.png');
 const r=run('render_svg.cjs',input,output);assert.notEqual(r.status,0);assert.equal(fs.existsSync(output),false);
});

test('local markers and gradient references remain valid',t=>{
 const {input}=fixture(t,wrap('<defs><linearGradient id="g"><stop stop-color="red"/></linearGradient></defs><rect width="200" height="100" fill="url(#g)"/>'));
 assert.equal(inspect(input).report.representation,'vector');
});
test('embedded bitmap is classified hybrid',async t=>{
 const png=await dependency('sharp')({create:{width:2,height:2,channels:3,background:'red'}}).png().toBuffer();
 const {input}=fixture(t,wrap(`<image width="20" height="20" href="data:image/png;base64,${png.toString('base64')}"/>`));
 assert.equal(inspect(input).report.representation,'hybrid');assert.equal(inspect(input).report.embeddedImages,1);
});
test('PDF is vector for basic shapes, physically sized, and refuses overwrites',t=>{
 const {dir,input}=fixture(t,wrap('<rect width="200" height="100" fill="white"/><text x="10" y="40">Vector labels</text>'));
 const output=path.join(dir,'out.pdf');let r=run('export_pdf.cjs',input,output,'--width-mm','100');
 assert.equal(r.status,0,r.stderr);const bytes=fs.readFileSync(output);assert.equal(bytes.subarray(0,5).toString(),'%PDF-');
 const raw=bytes.toString('latin1');assert.doesNotMatch(raw,/\/Subtype \/Image/);
 const box=raw.match(/\/MediaBox \[0 0 ([\d.]+) ([\d.]+)\]/);assert.ok(box);
 assert.ok(Math.abs(Number(box[1])-100*72/25.4)<0.01);assert.ok(Math.abs(Number(box[2])-50*72/25.4)<0.01);
 r=run('export_pdf.cjs',input,output);assert.notEqual(r.status,0);assert.deepEqual(fs.readFileSync(output),bytes);
});
test('unsupported PDF features fail without partial output',t=>{
 const {dir,input}=fixture(t,wrap('<defs><filter id="f"/></defs><rect width="10" height="10" filter="url(#f)"/>'));
 const output=path.join(dir,'out.pdf');const r=run('export_pdf.cjs',input,output);assert.notEqual(r.status,0);assert.equal(fs.existsSync(output),false);
});
test('invalid PNG width is rejected',t=>{
 const {dir,input}=fixture(t,wrap('<rect width="10" height="10"/>'));
 const output=path.join(dir,'out.png');assert.notEqual(run('render_svg.cjs',input,output,'--width','0').status,0);assert.equal(fs.existsSync(output),false);
});
test('examples render in fresh directory and plotted coordinates match data',t=>{
 const {dir}=fixture(t,wrap(''));const out=path.join(dir,'examples');
 const r=spawnSync(process.execPath,[path.join(__dirname,'../examples/generate.cjs'),out],{encoding:'utf8',timeout:20000});assert.equal(r.status,0,r.stderr);
 const checked=inspect(path.join(out,'plot.svg')),data=require('../examples/data.json');
 const circles=checked.elements.filter(n=>n.localName==='circle');assert.equal(circles.length,data.points.length);
 data.points.forEach(([x,y],i)=>{assert.equal(Number(circles[i].getAttribute('cx')),110+(x-1)*180);assert.equal(Number(circles[i].getAttribute('cy')),310-y*8);});
 const method=inspect(path.join(out,'method.svg'));
 for(const id of ['module-loss','edge-update-encoder','edge-update-classifier','edge-label-loss','edge-prediction-loss']) assert.ok(method.elements.some(n=>n.getAttribute('id')===id));
});
