const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. loadFromStorage migration
const loadStorageTarget = `
            if (Array.isArray(parsedOp) && parsedOp.length > 0) {
                operators = parsedOp.map(op => {
                    if (op.name === 'SCARICO DATI MEZZI' && !op.type) {
                        op.type = 'vehicle_company';
                    }
                    return op;
                });
            }
`;
const loadStorageReplacement = `
            if (Array.isArray(parsedOp) && parsedOp.length > 0) {
                operators = parsedOp.map(op => {
                    if (op.name === 'SCARICO DATI MEZZI' && !op.type) {
                        op.type = 'vehicle_company';
                    }
                    if ((op.type === 'company' || op.type === 'vehicle_company') && op.expiration && !op.lastDownload) {
                        const d = new Date(op.expiration);
                        d.setDate(d.getDate() - 90);
                        op.lastDownload = d.toISOString().split('T')[0];
                        delete op.expiration; 
                    }
                    return op;
                });
            }
`;
html = html.replace(loadStorageTarget, loadStorageReplacement);

// 2. Add company download deadline calculators
const calcTarget = `
        function checkDownloadDeadlineState(lastDownloadStr) {
            const nextDate = calculateNextDownloadDate(lastDownloadStr);
            return checkDeadlineState(nextDate);
        }
`;
const calcReplacement = `
        function checkDownloadDeadlineState(lastDownloadStr) {
            const nextDate = calculateNextDownloadDate(lastDownloadStr);
            return checkDeadlineState(nextDate);
        }

        function calculateNextCompanyDownloadDate(lastDownloadStr) {
            if (!lastDownloadStr) return '';
            const lastDownload = new Date(lastDownloadStr);
            lastDownload.setDate(lastDownload.getDate() + 90);
            return lastDownload.toISOString().split('T')[0];
        }

        function checkCompanyDownloadDeadlineState(lastDownloadStr) {
            const nextDate = calculateNextCompanyDownloadDate(lastDownloadStr);
            return checkDeadlineState(nextDate);
        }
`;
html = html.replace(calcTarget, calcReplacement);

// 3. getOperatorOverallStatus
const overallStatusTarget = `
        function getOperatorOverallStatus(op) {
            if (op.type === 'driver') {
                const stateExp = checkDeadlineState(op.expiration);
                const stateDl = checkDownloadDeadlineState(op.lastDownload);
                if (stateExp === 'red' || stateDl === 'red') return 'red';
                if (stateExp === 'amber' || stateDl === 'amber') return 'amber';
                return 'emerald';
            } else {
                return checkDeadlineState(op.expiration);
            }
        }
`;
const overallStatusReplacement = `
        function getOperatorOverallStatus(op) {
            if (op.type === 'driver') {
                const stateExp = checkDeadlineState(op.expiration);
                const stateDl = checkDownloadDeadlineState(op.lastDownload);
                if (stateExp === 'red' || stateDl === 'red') return 'red';
                if (stateExp === 'amber' || stateDl === 'amber') return 'amber';
                return 'emerald';
            } else {
                const stateExp = checkDeadlineState(op.expiration);
                const stateDl = checkCompanyDownloadDeadlineState(op.lastDownload);
                if (stateExp === 'red' || stateDl === 'red') return 'red';
                if (stateExp === 'amber' || stateDl === 'amber') return 'amber';
                if (!op.expiration && !op.lastDownload) return 'none';
                return 'emerald';
            }
        }
`;
html = html.replace(overallStatusTarget, overallStatusReplacement);

// 4. toggleOperatorFormLabels
const formLabelsTarget = `
            if (type === 'company' || type === 'vehicle_company') {
                lblName.innerText = "Identificativo Card *";
                txtName.placeholder = "Es. Sede Principale, Card Ufficio";
                lblCardNum.innerText = "Numero Card *";
                lblExp.innerText = "Scadenza Validità Card (5a)";
                divDl.classList.add('hidden');
                document.getElementById('operatorLastDownload').value = '';
            }
`;
const formLabelsReplacement = `
            if (type === 'company' || type === 'vehicle_company') {
                lblName.innerText = "Identificativo Card *";
                txtName.placeholder = "Es. Sede Principale, Card Ufficio";
                lblCardNum.innerText = "Numero Card *";
                lblExp.innerText = "Scadenza Validità Card (5a)";
                divDl.classList.remove('hidden');
                const lblDl = document.getElementById('lblOperatorDownload');
                lblDl.innerText = "Data Ultimo Scarico *";
            }
`;
html = html.replace(formLabelsTarget, formLabelsReplacement);

// 5. renderOperators
// We need to replace the company/vehicle_company render block
const renderOpTarget = `
                    } else {
                        // Aziendale o Scarico Mezzo
                        let expColor = 'text-slate-500';
                        if (sState === 'red') expColor = 'text-red-500 font-bold';
                        else if (sState === 'amber') expColor = 'text-amber-500 font-bold';
                        else if (op.expiration) expColor = 'text-emerald-500 font-bold';

                        cardHTML += \`
                        <div class="mt-2 space-y-1 text-[11px]">
                            <div class="flex justify-between">
                                <span class="text-slate-400">Scadenza Validità:</span>
                                <span class="\${expColor} font-mono">\${formatDateString(op.expiration)}</span>
                            </div>
                        </div>
                        <div class="mt-3 text-[10px] text-center">
                            \${sDaysStr}
                        </div>
                        \`;
                    }
`;
const renderOpReplacement = `
                    } else {
                        // Aziendale o Scarico Mezzo
                        let expColor = 'text-slate-500';
                        const sState = checkDeadlineState(op.expiration);
                        if (sState === 'red') expColor = 'text-red-500 font-bold';
                        else if (sState === 'amber') expColor = 'text-amber-500 font-bold';
                        else if (op.expiration) expColor = 'text-emerald-500 font-bold';

                        let dlColor = 'text-slate-500';
                        let nextDlDate = '';
                        let sDaysStrDl = '';
                        if (op.lastDownload) {
                            nextDlDate = calculateNextCompanyDownloadDate(op.lastDownload);
                            const stateDl = checkCompanyDownloadDeadlineState(op.lastDownload);
                            if (stateDl === 'red') dlColor = 'text-red-500 font-bold';
                            else if (stateDl === 'amber') dlColor = 'text-amber-500 font-bold';
                            else dlColor = 'text-emerald-500 font-bold';
                            
                            const dlDays = calculateDaysRemaining(nextDlDate);
                            if (stateDl === 'red') {
                                sDaysStrDl = \`<span class="text-red-500">Scarico scaduto da \${Math.abs(dlDays)} giorni ⚠️</span>\`;
                            } else if (stateDl === 'amber') {
                                sDaysStrDl = \`<span class="text-amber-500">Scarico tra \${dlDays} giorni ⏳</span>\`;
                            } else {
                                sDaysStrDl = \`<span class="text-emerald-500">Scarico tra \${dlDays} giorni ✅</span>\`;
                            }
                        }

                        cardHTML += \`
                        <div class="space-y-1 text-[11px]">
                            <div class="flex justify-between border-b dark:border-slate-700/50 pb-0.5">
                                <span class="text-slate-400">Scadenza Card (5a):</span>
                                <span class="\${expColor} font-mono">\${formatDateString(op.expiration)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-slate-400">Scarico (90gg):</span>
                                <span class="\${dlColor} font-mono">\${formatDateString(nextDlDate)}</span>
                            </div>
                        </div>
                        <div class="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center gap-2">
                            <button onclick="event.stopPropagation(); quickRenewOperator('\${op.id}', 90)" class="flex-1 py-1.5 px-2 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/30 dark:hover:bg-brand-800/50 text-brand-600 dark:text-brand-400 rounded text-[10px] font-bold transition-colors shadow-sm active:scale-95">
                                Scaricato Oggi (+90gg)
                            </button>
                        </div>
                        <div class="mt-2 text-[10px] text-center">
                            \${sDaysStrDl}
                        </div>
                        \`;
                    }
`;
html = html.replace(renderOpTarget, renderOpReplacement);

// 6. Update buildNotificationPanelList
const notifTarget = `
                } else {
                    const state = checkDeadlineState(op.expiration);
                    if (state === 'red' || state === 'amber') {
                        issues.push({
                            label: \`\${op.name} (\${op.type === 'company' ? 'Aziendale' : 'Scarico Mezzo'})\`,
                            state: state,
                            date: op.expiration
                        });
                    }
                }
`;
const notifReplacement = `
                } else {
                    const stateExp = checkDeadlineState(op.expiration);
                    if (stateExp === 'red' || stateExp === 'amber') {
                        issues.push({
                            label: \`\${op.name} (Fisica Card \${op.type === 'company' ? 'Aziendale' : 'Scarico Mezzo'})\`,
                            state: stateExp,
                            date: op.expiration
                        });
                    }
                    const stateDl = checkCompanyDownloadDeadlineState(op.lastDownload);
                    if (stateDl === 'red' || stateDl === 'amber') {
                        issues.push({
                            label: \`\${op.name} (Scarico 90gg \${op.type === 'company' ? 'Aziendale' : 'Scarico Mezzo'})\`,
                            state: stateDl,
                            date: calculateNextCompanyDownloadDate(op.lastDownload)
                        });
                    }
                }
`;
html = html.replace(notifTarget, notifReplacement);

// Fix updateStatsPanel counts for operators
const updateStatsTarget = `
                } else {
                    if (op.expiration) {
                        hasAny = true;
                        const s = checkDeadlineState(op.expiration);
                        if (s === 'red') hasRed = true;
                        if (s === 'amber') hasAmber = true;
                    }
                }
`;
const updateStatsReplacement = `
                } else {
                    if (op.expiration || op.lastDownload) {
                        hasAny = true;
                        const sExp = checkDeadlineState(op.expiration);
                        const sDl = checkCompanyDownloadDeadlineState(op.lastDownload);
                        if (sExp === 'red' || sDl === 'red') hasRed = true;
                        if (sExp === 'amber' || sDl === 'amber') hasAmber = true;
                    }
                }
`;
html = html.replace(updateStatsTarget, updateStatsReplacement);


fs.writeFileSync('index.html', html, 'utf8');
console.log('Applied 90gg fixes.');
