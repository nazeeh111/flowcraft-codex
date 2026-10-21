'use strict';
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const data = require('./data.json');
const out = process.argv[2] ? path.resolve(process.argv[2]) : fs.mkdtempSync(path.join(os.tmpdir(), 'flowcraft-examples-'));
fs.mkdirSync(out, {recursive: true});
function text(x,y,s,size=20) {return `<text x="${x}" y="${y}" text-anchor="middle" font-family="Helvetica" font-size="${size}" fill="#17212e">${s}</text>`;}
function wrap(body,w,h) {return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><title>Scientific figure demonstration</title><rect width="100%" height="100%" fill="white"/>${body}</svg>`;}
let body='<defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#34465a"/></marker></defs>';
function edge(id,d,dashed=false) {return `<path id="${id}" d="${d}" stroke="#34465a" stroke-width="2" ${dashed?'stroke-dasharray="6 5"':''} fill="none" marker-end="url(#arrow)"/>`;}
for (const [i,x] of [210,440,670].entries()) body+=edge(`edge-forward-${i}`,`M${x} 135 H${x+50}`);
body+=edge('edge-prediction-loss','M840 185 V250');
body+=edge('edge-label-loss','M1015 287 H930');
body+=edge('edge-update-encoder','M750 287 H350 V187',true);
body+=edge('edge-update-classifier','M930 267 H960 V210 H875 V187',true);
for (const [id,x,title,sub,fill] of [['input',30,'Input','Observed sequence','#edf2f7'],['encoder',260,'Encoder','Shared features','#e4f0fc'],['pool',490,'Pooling','Token mean','#e7f3ed'],['classifier',720,'Classifier','Predicted label','#f1eaf8']]) {
 body+=`<g id="module-${id}"><title>${title}</title><rect x="${x}" y="85" width="180" height="100" rx="10" fill="${fill}" stroke="#6c7b8b" stroke-width="1.5"/>${text(x+90,125,title)}${text(x+90,155,sub,15)}</g>`;
}
body+=`<g id="module-loss"><title>Training loss</title><rect x="750" y="250" width="180" height="75" rx="10" fill="#fcf0dc" stroke="#6c7b8b"/>${text(840,282,'Training loss',18)}${text(840,307,'Training only',14)}</g>`;
body+=text(1020,270,'True label',16)+text(450,350,'Dashed: parameter updates during training only',16);
fs.writeFileSync(path.join(out,'method.svg'),wrap(body,1100,390),{flag:'wx'});
const points = data.points;
const coords=points.map(([x,y])=>[110+(x-1)*180,310-y*8]);
body='';
for (const value of [0,10,20,30]) { const y=310-value*8; body+=`<path d="M110 ${y} H690" stroke="#e1e6eb"/>`+text(78,y+5,String(value),15); }
body+='<path d="M110 65 V310 H690" fill="none" stroke="#34465a" stroke-width="2"/>';
body+=`<polyline id="series-latency" points="${coords.map(p=>p.join(',')).join(' ')}" fill="none" stroke="#25669b" stroke-width="3"/>`;
points.forEach(([x,y],i)=>{const [px,py]=coords[i]; body+=`<circle id="point-${i}" cx="${px}" cy="${py}" r="5" fill="#25669b"/>`+text(px,py-15,String(y),16)+text(px,335,String(x),15);});
body+=text(400,40,'Synthetic validation data',22)+text(410,375,'Samples',18)+'<text x="30" y="205" transform="rotate(-90 30 205)" text-anchor="middle" font-family="Helvetica" font-size="18">Latency (ms)</text>';
fs.writeFileSync(path.join(out,'plot.svg'),wrap(body,800,400),{flag:'wx'});
for (const name of ['method','plot']) for (const [script,ext,flags] of [['render_svg.cjs','png',['--width','1800']],['export_pdf.cjs','pdf',['--width-mm','178']]]) {
 const run=spawnSync(process.execPath,[path.join(__dirname,'../scripts',script),path.join(out,`${name}.svg`),path.join(out,`${name}.${ext}`),...flags],{encoding:'utf8'});
 if(run.status!==0) throw new Error(run.stderr);
}
console.log(JSON.stringify({output:out,source:'examples/brief.md',data:'examples/data.json'}));
