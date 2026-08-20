const fs = require('fs');
const path = 'c:/Users/Gianni/Documents/scadenziario flotta mezzi_progetto/index.html';
let html = fs.readFileSync(path, 'utf8');
html = html.replace(/max-h-\[90vh\]/g, 'max-h-[90dvh]');
fs.writeFileSync(path, html);
console.log('Replaced 90vh with 90dvh');
