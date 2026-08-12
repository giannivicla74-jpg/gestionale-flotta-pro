const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Add ID to download label
html = html.replace(
  '<label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Ultimo Scarico Dati Effettuato *</label>',
  '<label id="lblOperatorDownload" class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Data ULTIMO Scarico Dati Effettuato *</label>'
);

// 2. Update toggleOperatorFormLabels
const sToggle = html.indexOf('function toggleOperatorFormLabels');
const eToggle = html.indexOf('function saveOperator', sToggle);
if(sToggle > -1) {
    let block = html.slice(sToggle, eToggle);
    block = block.replace(/divDl\.classList\.add\('hidden'\);/g, "divDl.classList.remove('hidden');");
    block = block.replace(/const lblExp = document.getElementById\('lblOperatorExpiration'\);/, 
        "const lblExp = document.getElementById('lblOperatorExpiration');\n            const lblDl = document.getElementById('lblOperatorDownload');");
    
    block = block.replace(/lblExp\.innerText = "Prossima Scadenza Scarico Obbligatorio \*";/, 'lblExp.innerText = "Scadenza Validità Card Aziendale (5 Anni) *";\n                if(lblDl) lblDl.innerText = "Data ULTIMO Scarico (Prossimo a 90gg) *";');
    block = block.replace(/lblExp\.innerText = "Prossima Scadenza Scarico Obbligatorio Mezzo \*";/, 'lblExp.innerText = "Scadenza Tachigrafo Mezzo *";\n                if(lblDl) lblDl.innerText = "Data ULTIMO Scarico (Prossimo a 90gg) *";');
    block = block.replace(/lblExp\.innerText = "Scadenza Validità Carta del Conducente \\(5 Anni\\) \*";/, 'lblExp.innerText = "Scadenza Validità Carta del Conducente (5 Anni) *";\n                if(lblDl) lblDl.innerText = "Data ULTIMO Scarico (Prossimo a 28gg) *";');

    html = html.slice(0, sToggle) + block + html.slice(eToggle);
}

// 3. Update saveOperator
const sSave = html.indexOf('function saveOperator(e)');
const eSave = html.indexOf('function confirmDeleteOperator', sSave);
if(sSave > -1) {
    let blockSave = html.slice(sSave, eSave);
    blockSave = blockSave.replace(
        /lastDownload: \(type === 'driver'\) \? \(lastDownload \|\| new Date\(\)\.toISOString\(\)\.split\('T'\)\[0\]\) : undefined/,
        'lastDownload: lastDownload || new Date().toISOString().split(\'T\')[0]'
    );
    html = html.slice(0, sSave) + blockSave + html.slice(eSave);
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Fixed toggle labels and save operator');
