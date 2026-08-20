const fs = require('fs'); 
let html = fs.readFileSync('index.html', 'utf8'); 

// 1. Update saveVehicle to default scaricoTachigrafo to today if empty
const oldVeh = 'revision, tachimetro, scaricoTachigrafo, assicurazione, gru, gruStrutturale, tassaPossesso, altro, altroNota'; 
const newVeh = 'revision, tachimetro, scaricoTachigrafo: scaricoTachigrafo || new Date().toISOString().split(\'T\')[0], assicurazione, gru, gruStrutturale, tassaPossesso, altro, altroNota'; 
html = html.replace(oldVeh, newVeh); 

// 2. Update DEMO_VEHICLES empty scaricoTachigrafo
html = html.replace(/"scaricoTachigrafo": ""/g, '"scaricoTachigrafo": "2026-07-15"'); 

// 3. Update the label for Vehicle scaricoTachigrafo
html = html.replace('<label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Scarico Dati Tachigrafo (3 Mesi)</label>', '<label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Data ULTIMO Scarico Dati Tachigrafo (Prossimo a 90gg) *</label>');

fs.writeFileSync('index.html', html, 'utf8'); 
console.log('Fixed vehicles!');
