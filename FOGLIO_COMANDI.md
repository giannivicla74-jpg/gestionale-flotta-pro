# 📋 Foglio Comandi & Prontuario Moduli GC CodeLab
## Gestionale Flotta Mezzi & Conducenti • VI.CLA FUTURE S.R.L. • Giovanni Cavallo

---

### 🚀 MODULO STANDARD 20 / 20 (INCREMENTATO)
#### `20. GC-ENTERPRISE-CARDS` • Category: `Animation / Design`

> **Nome Modulo:** Stile Card Enterprise Pro (Fascia Superiore & Hover 3D)  
> **Descrizione:** Troverai il nuovo interruttore per attivare o disattivare a piacimento la linea colorata superiore e l'effetto 3D al passaggio del mouse sulle schede.

#### 📋 Frase Pronta da Copiare (Prompt per l'AI):
```text
Applica lo Stile Card Enterprise Pro (Fascia Superiore & Hover 3D) a tutte le schede della dashboard. Include:
1. Fascia dinamica superiore (h-1.5 w-full bg-gradient-to-r) colorata in base allo stato (Rosso = Scaduto/Critico, Giallo = In Scadenza, Gradient Brand = In Regola).
2. Effetto Hover 3D fluido (-translate-y-1.5 scale-1005, ombra profonda shadow-xl e bagliore di stato).
3. Bordi accentati di conformità (border-l-4).
4. Pulsante di toggle rapido nella barra comandi principale ('Stile Pro: ON/OFF') e switch dedicato nel modal Impostazioni con persistenza localStorage ('fleet_pro_card_design_vicla').
```

#### 💻 Snippet di Codice Integrato (CSS & JS):
```css
/* Classi CSS Stile Card Enterprise Pro */
.vehicle-card-pro {
    background: #ffffff;
    border-radius: 1rem;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}
.dark .vehicle-card-pro {
    background: #1e293b;
    border-color: #334155;
}
.vehicle-card-pro:hover {
    transform: translateY(-4px) scale(1.005);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
```

```javascript
/* Funzioni JS di Commutazione e Sincronizzazione UI */
let showProCardDesign = localStorage.getItem('fleet_pro_card_design_vicla') !== 'false';

function toggleProCardDesign() {
    showProCardDesign = !showProCardDesign;
    localStorage.setItem('fleet_pro_card_design_vicla', showProCardDesign ? 'true' : 'false');
    const elProDesign = document.getElementById('settingProCardDesign');
    if (elProDesign) elProDesign.checked = showProCardDesign;
    updateProCardDesignUI();
    applyFilters();
    showToast(showProCardDesign ? "Stile Card Enterprise Pro attivato" : "Stile Card Standard attivato", "info");
}

function updateProCardDesignUI() {
    const btn = document.getElementById('proCardToggleBtn');
    const icon = document.getElementById('proCardIcon');
    const text = document.getElementById('proCardText');
    if (!btn || !text) return;

    if (showProCardDesign) {
        text.innerText = "Stile Pro: ON";
        if (icon) icon.className = "w-4 h-4 text-brand-500";
        btn.className = "text-sm px-3 py-2 rounded-xl transition flex items-center space-x-1.5 bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 font-bold shadow-sm";
    } else {
        text.innerText = "Stile Pro: OFF";
        if (icon) icon.className = "w-4 h-4 text-slate-400";
        btn.className = "text-sm px-3 py-2 rounded-xl transition flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 font-semibold";
    }
    if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}
```

---

### 🎨 1. Comandi Grafici e Stile Card
* **Pulsante `Stile Pro: ON / OFF` (Barra Strumenti Principale)**
  * Alterna al volo lo **Stile Card Enterprise Pro** (accent bar sfumata superiore, elevazione 3D dinamica al passaggio del mouse e bordi di stato coordinati).
  * Troverai il nuovo interruttore per attivare o disattivare a piacimento la linea colorata superiore e l'effetto 3D al passaggio del mouse sulle schede.
  * Il comando si sincronizza automaticamente con la casella spuntabile presente nel menu **Impostazioni**.
* **Pulsante `Logistica Visibile / Nascosta`**
  * Mostra o nasconde i dati riservati di logistica (numeri Telepass, Carte Carburante DKV / Q8 / Tamoil e relativi PIN).
* **Pulsante Notturno / Diurno (🌙 / ☀️ nella Topbar)**
  * Alterna la modalità Dark Mode (visione notturna) e Light Mode (visione diurna) preservando le preferenze in memoria locale.

---

### ⚡ 2. Comandi Operativi Rapidi
* **Rinnovi Veloci (⚡ su ogni Card Mezzo)**
  * Apre la modale per registrare velocemente il rinnovo di: Revisione (+1 anno), Tachigrafo (+2 anni), Scarico Dati (+90 gg), Assicurazione (+6 mesi o 1 anno), Bollo (+1 anno), Verifica Gru (+1 anno).
* **Diario di Bordo (📖 su ogni Card Mezzo)**
  * Permette di inserire interventi meccanici, tagliandi, manutenzioni straordinarie con data, chilometraggio e costo (€).
  * Incontra il comando **Esporta in Excel (.xlsx)** per scaricare lo storico interventi formattato per singolo mezzo.
* **Scarico Progressivo Conducente (⚡ su Card Conducente)**
  * Calcola e aggiorna la nuova scadenza limite a catena (+28 giorni) mantenendo la sequenza cronologica.

---

### 📥 3. Drag & Drop Automatismi Tachigrafici (.DDD)
* **Trascina & Rilascia File .DDD**
  * Trascina uno o più file tachigrafici `.DDD` in qualsiasi punto della pagina.
  * Il sistema decodifica le intestazioni binari, riconosce la **Targa**, **Carta Conducente** o **Cognome Autista**, ed aggiorna automaticamente la data di scarico nel database.

---

### 📅 4. Sincronizzazione & Esportazioni Dati
* **Esporta Backup (.json)**: Genera la copia di sicurezza completa dell'intero database flotta e conducenti.
* **Importa Backup (.json)**: Ripristina o migra il database da qualsiasi file di salvataggio JSON.
* **Sincronizza Calendario (.ics)**: Crea il file iCalendar con tutte le imminenze e scadenze scoperte per l'importazione in Google Calendar, Outlook o Apple Calendar.
* **Stampa Report (🖨️)**: Genera un documento PDF/Stampa con intestazione ufficiale **VI.CLA FUTURE S.R.L.** filtrabile per mezzi, conducenti e stato di gravità.

---

### 🔒 5. Sicurezza e Protezione PIN
* **Attivazione PIN Master (Menu Impostazioni ⚙️)**
  * Impostando un PIN a 4 cifre, tutte le modifiche, le eliminazioni ed la visualizzazione in chiaro dei PIN delle carte carburante vengono protette da verifica.

---

### 🔊 6. Assistente Vocale & Segnalazioni Acustiche
* **Lettura Vocale Scadenze (🔊 nella Topbar)**
  * L'assistente sintetizzato riproduce a voce il report completo delle criticità.
* **Selezione Voce e Tono (Menu Impostazioni)**
  * Permette di selezionare voci femminili/maschili HD Natural, regolare la velocità (rate), il tono (pitch) ed il tipo di avviso sonoro (Chime, Beep, Bell).
