const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetDaysFunc = `
        function formatDateString(str) {
`;
const replacementDaysFunc = `
        function calculateDaysRemaining(dateString) {
            if (!dateString) return 0;
            const today = new Date();
            today.setHours(0,0,0,0);
            const d = new Date(dateString);
            d.setHours(0,0,0,0);
            return Math.ceil((d - today) / (1000 * 60 * 60 * 24));
        }

        function formatDateString(str) {
`;
html = html.replace(targetDaysFunc, replacementDaysFunc);

const targetCompanyRender = `
                } else {
                    const labelStr = (isCompany || isVehicleCompany) ? 'Scarico Obbligatorio' : 'Scadenza Card';
                    let sColor = 'text-slate-900 dark:text-white';
                    let sDaysStr = '';
                    if (op.expiration) {
                        const sState = checkDeadlineState(op.expiration);
                        const days = calculateDaysRemaining(op.expiration);
                        if (sState === 'red') {
                            sColor = 'text-red-500 font-bold';
                            sDaysStr = \`<span class="text-red-500">Scaduto da \${Math.abs(days)} giorni ⚠️</span>\`;
                        } else if (sState === 'amber') {
                            sColor = 'text-amber-500 font-bold';
                            sDaysStr = \`<span class="text-amber-500">Mancano \${days} giorni ⏳</span>\`;
                        } else {
                            sColor = 'text-emerald-500 font-bold';
                            sDaysStr = \`<span class="text-emerald-500">Mancano \${days} giorni ✅</span>\`;
                        }
                    }
                    
                    scadenzeHTML = \`
                        <div class="text-[11px] flex flex-col gap-0.5">
                            <div class="flex justify-between">
                                <span class="text-slate-400">\${labelStr}:</span>
                                <span class="\${sColor} font-mono">\${formatDateString(op.expiration)}</span>
                            </div>
                            \${op.expiration ? \`<div class="text-[10px] text-right font-bold mt-1">\${sDaysStr}</div>\` : ''}
                        </div>
                    \`;

                    renewAction = \`
                        <button onclick="quickRenewOperator('\${op.id}', 90)" class="text-[10px] bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 hover:bg-brand-100 px-2 py-1 rounded-md font-bold transition flex items-center gap-0.5 border border-brand-200/40 dark:border-brand-900" title="Scarico effettuato oggi, posticipa di 90gg">
                            <i data-lucide="refresh-cw" class="w-3 h-3"></i> Rinnova (90gg)
                        </button>
                    \`;
                }
`;
const replacementCompanyRender = `
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

                    scadenzeHTML = \`
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
                        <div class="mt-2 text-[10px] text-center">
                            \${sDaysStrDl}
                        </div>
                    \`;

                    renewAction = \`
                        <button onclick="quickRenewOperator('\${op.id}', 90)" class="text-[10px] bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 hover:bg-brand-100 px-2 py-1 rounded-md font-bold transition flex items-center gap-0.5 border border-brand-200/40 dark:border-brand-900" title="Scarico effettuato oggi, posticipa di 90gg">
                            <i data-lucide="refresh-cw" class="w-3 h-3"></i> Rinnova (90gg)
                        </button>
                    \`;
                }
`;
html = html.replace(targetCompanyRender, replacementCompanyRender);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Applied apply_fixes9.');
