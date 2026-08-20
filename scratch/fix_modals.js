const fs = require('fs');
const path = 'c:/Users/Gianni/Documents/scadenziario flotta mezzi_progetto/index.html';
let html = fs.readFileSync(path, 'utf8');

// Vehicle Modal: Move footer out of scrollable body
// Locate the form inside vehicleModal
// We can use string replacement for specific parts if we are careful.

let newHtml = html;

// 1. VEHICLE MODAL
// We want the form to WRAP the whole modal content so submit works naturally without 'form=' attribute (which sometimes doesn't work in older browsers).
// Actually, using `form="vehicleForm"` on the submit button is well supported in all modern browsers and much easier to do with string replacement.

// Find the vehicleModal footer
const vehicleFooterOriginal = `<div class="mt-8 flex justify-end space-x-3 border-t border-slate-150 dark:border-slate-700 pt-4">
                        <button type="button" onclick="closeModal()" class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                            Annulla
                        </button>
                        <button type="submit" class="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-500/10 transition">
                            Salva Configurazione
                        </button>
                    </div>`;

const vehicleFooterNew = `
        <!-- Fixed Footer -->
        <div class="px-6 py-4 border-t border-slate-150 dark:border-slate-700 flex justify-end space-x-3 bg-slate-50 dark:bg-slate-900 rounded-b-2xl shrink-0">
            <button type="button" onclick="closeModal()" class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                Annulla
            </button>
            <button type="submit" form="vehicleForm" class="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-500/10 transition">
                Salva Configurazione
            </button>
        </div>`;

if (newHtml.includes(vehicleFooterOriginal)) {
    // Remove the footer from inside the form
    newHtml = newHtml.replace(vehicleFooterOriginal, '');
    
    // Inject the new footer right after the form container closes
    // Look for:
    //                 </form>
    //             </div>
    //         </div>
    //     </div>
    // inside vehicleModal
    
    // Let's replace the end of vehicleModal:
    const vehicleEndStr = `                </form>
            </div>
        </div>
    </div>`;
    
    const vehicleEndNew = `                </form>
            </div>
            ${vehicleFooterNew}
        </div>
    </div>`;
    
    if (newHtml.includes(vehicleEndStr)) {
        newHtml = newHtml.replace(vehicleEndStr, vehicleEndNew);
        console.log("Vehicle Modal fixed.");
    } else {
        console.log("Could not find end of Vehicle Modal.");
    }
} else {
    console.log("Could not find Vehicle Modal footer.");
}


// 2. OPERATOR MODAL
const operatorFooterOriginal = `<div class="mt-6 flex justify-end space-x-3 border-t border-slate-150 dark:border-slate-700 pt-4">
                        <button type="button" onclick="closeOperatorModal()" class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                            Annulla
                        </button>
                        <button type="submit" class="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-bold shadow-md transition">
                            Salva Informazioni
                        </button>
                    </div>`;

const operatorFooterNew = `
        <!-- Fixed Footer -->
        <div class="px-6 py-4 border-t border-slate-150 dark:border-slate-700 flex justify-end space-x-3 bg-slate-50 dark:bg-slate-900 rounded-b-2xl shrink-0">
            <button type="button" onclick="closeOperatorModal()" class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                Annulla
            </button>
            <button type="submit" form="operatorForm" class="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-bold shadow-md transition">
                Salva Informazioni
            </button>
        </div>`;

if (newHtml.includes(operatorFooterOriginal)) {
    newHtml = newHtml.replace(operatorFooterOriginal, '');
    
    const operatorEndStr = `                </form>
            </div>
        </div>
    </div>`;
    
    const operatorEndNew = `                </form>
            </div>
            ${operatorFooterNew}
        </div>
    </div>`;
    
    // operatorModal is right after vehicleModal, let's just make sure we replace the right one by using regex or split.
    // Actually, both ends look exactly the same! 
    // To be safe, we can use a more precise string replacement using `index` or replace the last instance within the modal block.
}

fs.writeFileSync(path, newHtml);
