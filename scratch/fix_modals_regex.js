const fs = require('fs');
const path = 'c:/Users/Gianni/Documents/scadenziario flotta mezzi_progetto/index.html';
let html = fs.readFileSync(path, 'utf8');

// The strategy is to move the footer (buttons) from inside `<div class="p-6 overflow-y-auto..."> <form ...> ... FOOTER </form> </div>`
// To outside the `overflow-y-auto` container, but still inside the `max-h-[90dvh]` flex-col container.

// We will target `vehicleModal` and `operatorModal`.
// Actually, let's just make the changes using generic regular expressions to extract the footers.

// 1. Vehicle Modal
let m1 = html.match(/(<div id="vehicleModal"[\s\S]*?)<div class="mt-8 flex justify-end space-x-3 border-t border-slate-150 dark:border-slate-700 pt-4">([\s\S]*?)<\/div>\s*<\/form>\s*<\/div>\s*<\/div>\s*<\/div>/);
if (m1) {
    let footerContent = m1[2];
    // Add form="vehicleForm" to the submit button
    footerContent = footerContent.replace(/type="submit"/, 'type="submit" form="vehicleForm"');
    
    let newFooter = `\n        <!-- Fixed Footer -->\n        <div class="px-6 py-4 border-t border-slate-150 dark:border-slate-700 flex justify-end space-x-3 bg-slate-50 dark:bg-slate-900 rounded-b-2xl shrink-0">` + footerContent + `</div>`;
    
    let replacement = m1[1] + `</form>\n            </div>` + newFooter + `\n        </div>\n    </div>`;
    html = html.replace(m1[0], replacement);
    console.log("Fixed vehicleModal");
} else {
    console.log("Could not find vehicleModal pattern.");
}

// 2. Operator Modal
let m2 = html.match(/(<div id="operatorModal"[\s\S]*?)<div class="mt-6 flex justify-end space-x-3 border-t border-slate-150 dark:border-slate-700 pt-4">([\s\S]*?)<\/div>\s*<\/form>\s*<\/div>\s*<\/div>\s*<\/div>/);
if (m2) {
    let footerContent = m2[2];
    footerContent = footerContent.replace(/type="submit"/, 'type="submit" form="operatorForm"');
    
    let newFooter = `\n        <!-- Fixed Footer -->\n        <div class="px-6 py-4 border-t border-slate-150 dark:border-slate-700 flex justify-end space-x-3 bg-slate-50 dark:bg-slate-900 rounded-b-2xl shrink-0">` + footerContent + `</div>`;
    
    let replacement = m2[1] + `</form>\n            </div>` + newFooter + `\n        </div>\n    </div>`;
    html = html.replace(m2[0], replacement);
    console.log("Fixed operatorModal");
} else {
    console.log("Could not find operatorModal pattern.");
}

fs.writeFileSync(path, html);
console.log("Done");
