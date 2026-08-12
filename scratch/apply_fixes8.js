const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const labelsTarget = `
            if (type === 'company') {
                lblName.innerText = "Identificativo Card Aziendale *";
                txtName.placeholder = "Es. Sede Principale, Card Ufficio";
                lblCardNum.innerText = "Numero Card Aziendale *";
                lblExp.innerText = "Prossima Scadenza Scarico Obbligatorio *";
                divDl.classList.add('hidden');
                document.getElementById('operatorLastDownload').value = '';
            } else if (type === 'vehicle_company') {
                lblName.innerText = "Identificativo Mezzo (Targa) *";
                txtName.placeholder = "Es. AB123CD";
                lblCardNum.innerText = "Nessuna Card *";
                lblExp.innerText = "Prossima Scadenza Scarico Obbligatorio *";
                divDl.classList.add('hidden');
                document.getElementById('operatorLastDownload').value = '';
            } else {
`;
const labelsReplacement = `
            if (type === 'company') {
                lblName.innerText = "Identificativo Card Aziendale *";
                txtName.placeholder = "Es. Sede Principale, Card Ufficio";
                lblCardNum.innerText = "Numero Card Aziendale *";
                lblExp.innerText = "Scadenza Validità Card (5a)";
                divDl.classList.remove('hidden');
                document.getElementById('lblOperatorDownload').innerText = "Ultimo Scarico (calcola 90gg) *";
            } else if (type === 'vehicle_company') {
                lblName.innerText = "Identificativo Mezzo (Targa) *";
                txtName.placeholder = "Es. AB123CD";
                lblCardNum.innerText = "Nessuna Card *";
                lblExp.innerText = "Nessuna Scadenza";
                divDl.classList.remove('hidden');
                document.getElementById('lblOperatorDownload').innerText = "Ultimo Scarico (calcola 90gg) *";
            } else {
`;
html = html.replace(labelsTarget, labelsReplacement);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Applied Form fixes.');
