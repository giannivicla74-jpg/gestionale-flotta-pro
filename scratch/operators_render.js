<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Fleet Deadline Manager - VI.CLA FUTURE S.R.L.</title>
    
    <!-- PWA Manifest & Icons -->
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#1e3a8a">
    <link rel="apple-touch-icon" href="logo-192.png">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="FleetDeadline">
    <!-- Caricamento di Tailwind CSS e configurazione dei colori di brand di VI.CLA -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        brand: {
                            50: '#f0f7ff',
                            100: '#e0effe',
                            500: '#3b82f6',
                            600: '#2563eb',
                            700: '#1d4ed8',
                            900: '#1e3a8a',
                        }
                    }
                }
            }
        }
    </script>
    <!-- Caricamento delle icone Lucide per una visualizzazione vettoriale pulita -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js"></script>
    <style>
        @keyframes pulse-ring {
            0% { transform: scale(0.95); opacity: 1; }
            50% { transform: scale(1.08); opacity: 0.5; }
            100% { transform: scale(0.95); opacity: 1; }
        }
        .pulse-alert {
            animation: pulse-ring 2s infinite ease-in-out;
        }
        .glow-red {
            box-shadow: 0 0 15px rgba(239, 68, 68, 0.15);
        }
        .glow-amber {
            box-shadow: 0 0 15px rgba(245, 158, 11, 0.15);
        }
        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
        }
        .dark ::-webkit-scrollbar-thumb {
            background: #475569;
        }
    </style>

    <!-- Firebase Compat Libraries -->
    <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js"></script>
</head>

<body class="bg-slate-50 dark:bg-slate-900 min-h-screen text-slate-800 dark:text-slate-100 font-sans pb-4 transition-colors duration-200 flex flex-col justify-between">

    <div>
        <!-- HEADER -->
        <header class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40 shadow-sm transition-colors duration-200">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                
                <div class="flex items-center space-x-3">
                    <div class="bg-brand-600 p-2.5 rounded-xl text-white shadow-md shadow-brand-500/20">
                        <i data-lucide="shield-alert" class="w-6 h-6"></i>
                    </div>
                    <div>
                        <h1 class="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                            VI.CLA FUTURE S.R.L. <span class="bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-brand-200 dark:border-brand-800">FLEET PRO</span>
                        </h1>
                        <p class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Controllo Avanzato Parco Mezzi d'Opera & Scadenze Card Autisti</p>
                    </div>
                </div>
                
                <div class="flex items-center space-x-2">
                    <!-- Export Buttons -->
                    <button onclick="exportToPDF()" class="hidden md:flex items-center space-x-1.5 p-2.5 rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50 dark:hover:bg-red-900/50" title="Esporta Report PDF">
                        <i data-lucide="file-text" class="w-4 h-4"></i>
                        <span class="text-xs font-bold">PDF</span>
                    </button>
                    <button onclick="exportToExcel()" class="hidden md:flex items-center space-x-1.5 p-2.5 rounded-xl bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 transition dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50 dark:hover:bg-green-900/50" title="Esporta Report Excel">
                        <i data-lucide="sheet" class="w-4 h-4"></i>
                        <span class="text-xs font-bold">Excel</span>
                    </button>

                    <!-- Bottone Licenza d'Uso -->
                    <button onclick="openLicenseModal()" class="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600 transition" title="Dettagli Sviluppatore e Licenza">
                        <i data-lucide="award" class="w-4 h-4 text-brand-600 dark:text-brand-400"></i>
                    </button>

                    <!-- BOTTONE LOCK/UNLOCK RAPIDO -->
                    <button onclick="togglePinProtectionVisual()" id="lockStatusBtn" class="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600 transition" title="Attiva/Disattiva Protezione PIN">
                        <i data-lucide="lock-open" class="w-4 h-4 text-emerald-500" id="lockIcon"></i>
                    </button>

                    <button onclick="toggleTheme()" id="themeToggleBtn" class="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600 transition" title="Cambia Modalità Visiva">
                        <i data-lucide="moon" class="w-4 h-4" id="themeIcon"></i>
                    </button>

                    <button onclick="toggleAudioSystem()" id="audioStatusBtn" class="hidden sm:flex items-center space-x-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-3 py-2 rounded-xl text-xs font-semibold border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition">
                        <i data-lucide="volume-2" class="w-4 h-4"></i>
                        <span>Audio Attivo</span>
                    </button>
                    <button onclick="togglePushNotifications()" id="pushStatusBtn" class="hidden sm:flex items-center space-x-1.5 bg-slate-50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                        <i data-lucide="bell-off" id="pushStatusIcon" class="w-4 h-4"></i>
                        <span id="pushStatusText">Push Off</span>
                    </button>
                    <button onclick="testPushNotification()" id="testPushBtn" title="Invia una notifica di prova" class="hidden sm:flex items-center space-x-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-2.5 py-2 rounded-xl text-xs font-semibold border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition">
                        <i data-lucide="zap" class="w-3.5 h-3.5"></i>
                        <span>Test</span>
                    </button>
                    
                    <div class="relative">
                        <button onclick="toggleNotificationPanel()" class="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600 transition relative">
                            <i data-lucide="bell" class="w-4 h-4"></i>
                            <span id="notificationBadge" class="hidden absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center pulse-alert">0</span>
                        </button>
                        <div id="notificationPanel" class="hidden absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl z-50 p-4 transition-all">
                            <div class="flex items-center justify-between border-b dark:border-slate-700 pb-2 mb-2">
                                <span class="font-bold text-xs uppercase tracking-wider text-slate-400">Riepilogo Anomalie</span>
                                <button onclick="speakDeadlines()" class="text-[10px] text-brand-600 dark:text-brand-400 font-bold flex items-center gap-1 hover:underline">
                                    <i data-lucide="megaphone" class="w-3.5 h-3.5"></i> Leggi Avviso
                                </button>
                            </div>
                            <div id="notificationList" class="space-y-2 max-h-60 overflow-y-auto text-xs"></div>
                        </div>
                    </div>

                    <button onclick="openSettingsModal()" class="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600 transition" title="Impostazioni Soglia Scadenze e PIN">
                        <i data-lucide="sliders" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        </header>

        <!-- ALARM BANNER -->
        <div id="alarmBanner" class="hidden bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 shadow-lg border-b border-red-800">
            <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <div class="flex items-center space-x-3">
                    <div class="bg-white/20 p-2 rounded-xl">
                        <i data-lucide="alert-octagon" class="w-5 h-5 text-white pulse-alert"></i>
                    </div>
                    <div>
                        <p class="font-bold text-sm sm:text-base">SCADENZE CRITICHE SUPERATE!</p>
                        <p class="text-xs text-white/80">Rilevate anomalie urgenti nel parco mezzi d'opera o nelle card personali dei conducenti di VI.CLA FUTURE S.R.L.</p>
                    </div>
                </div>
                <div class="flex items-center space-x-2">
                    <button onclick="speakDeadlines()" class="bg-white text-red-700 hover:bg-red-50 px-4 py-2 rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-1.5">
                        <i data-lucide="volume-2" class="w-4 h-4"></i>
                        <span>Ascolta Avviso Vocale</span>
                    </button>
                    <button onclick="dismissBanner()" class="text-white/70 hover:text-white text-xs underline px-2 py-1">
                        Ignora
                    </button>
                </div>
            </div>
        </div>

        <!-- MAIN CONTAINER -->
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">

            <!-- STATS CARDS -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
                <div class="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div id="cardScaduti" onclick="filterByStatusStat('expired')" class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-[0.98]" title="Clicca per filtrare solo le scadenze critiche">
                        <div>
                            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Risorse con Scadenze Critiche</p>
                            <h3 id="statExpired" class="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">0</h3>
                            <span class="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 hidden" id="expiredWarningLabel">
                                <i data-lucide="alert-circle" class="w-3 h-3"></i> Intervenire subito!
                            </span>
                        </div>
                        <div id="iconScaduti" class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-500 transition-all duration-300">
                            <i data-lucide="alert-triangle" class="w-6 h-6"></i>
                        </div>
                    </div>

                    <div onclick="filterByStatusStat('expiring')" class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between cursor-pointer hover:scale-[1.02] active:scale-[0.98]" title="Clicca per filtrare solo le scadenze imminenti">
                        <div>
                            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">In Scadenza imminente</p>
                            <h3 id="statExpiring" class="text-3xl font-extrabold text-amber-500 dark:text-amber-400 mt-1">0</h3>
                            <span class="text-[10px] text-slate-400 font-medium mt-1 block">Prossimi <span class="thresholdLabel text-amber-500 font-bold">30</span> giorni</span>
                        </div>
                        <div class="bg-amber-50 dark:bg-amber-950/40 p-3.5 rounded-xl text-amber-500">
                            <i data-lucide="clock" class="w-6 h-6"></i>
                        </div>
                    </div>

                    <div onclick="filterByStatusStat('ok')" class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between cursor-pointer hover:scale-[1.02] active:scale-[0.98]" title="Clicca per filtrare solo i record in regola">
                        <div>
                            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Risorse 100% OK</p>
                            <h3 id="statOk" class="text-3xl font-extrabold text-emerald-500 dark:text-emerald-400 mt-1">0</h3>
                            <span class="text-[10px] text-slate-400 font-medium mt-1 block" id="statTotalLabel">0 risorse totali</span>
                        </div>
                        <div class="bg-emerald-50 dark:bg-emerald-950/40 p-3.5 rounded-xl text-emerald-500">
                            <i data-lucide="check-circle" class="w-6 h-6"></i>
                        </div>
                    </div>
                </div>

                <!-- HEALTH INDEX -->
                <div class="lg:col-span-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                    <div class="flex justify-between items-center">
                        <div>
                            <h4 class="font-bold text-sm text-slate-900 dark:text-white">Indice Conformità Flotta</h4>
                            <p class="text-[11px] text-slate-400">Calcolato su VI.CLA FUTURE S.R.L.</p>
                        </div>
                        <span id="healthScorePercentage" class="text-2xl font-extrabold text-brand-600 dark:text-brand-400">100%</span>
                    </div>
                    
                    <div class="w-full bg-slate-100 dark:bg-slate-700 h-3.5 rounded-full overflow-hidden my-3">
                        <div id="healthScoreBar" class="bg-gradient-to-r from-emerald-500 to-brand-500 h-full transition-all duration-500" style="width: 100%"></div>
                    </div>

                    <div class="flex justify-between text-[11px] text-slate-400 font-semibold items-center">
                        <span id="healthEvaluationText">Tutto in perfetta regola 🚀</span>
                        <div class="flex gap-2">
                            <button onclick="openDiagnosticsModal()" class="hover:text-brand-500 flex items-center gap-1 text-xs text-brand-600 dark:text-brand-400 font-bold bg-brand-50 dark:bg-brand-950/40 px-2.5 py-1 rounded-lg border border-brand-200/40">
                                <i data-lucide="activity" class="w-3.5 h-3.5"></i> Diagnosi
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            <!-- ADVANCED DASHBOARD (CHARTS) -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <!-- Fleet Chart -->
                <div class="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/80 p-5 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-lg flex flex-col relative overflow-hidden">
                    <div class="absolute -right-10 -top-10 w-64 h-64 bg-brand-500/30 dark:bg-brand-500/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten pointer-events-none"></div>
                    <h4 class="font-semibold text-base text-slate-700 dark:text-slate-200 mb-6 flex items-center gap-2 tracking-wide z-10"><i data-lucide="truck" class="w-5 h-5 text-brand-500"></i> Stato Flotta Mezzi</h4>
                    
                    <div class="flex flex-col md:flex-row items-center justify-between gap-8 z-10">
                        <div class="relative w-44 h-24 flex-shrink-0 flex items-end justify-center">
                            <canvas id="fleetStatusChart" style="position:absolute; top:0; left:0; width:100%; height:200%;"></canvas>
                            <div class="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end pointer-events-none" style="padding-bottom: 5px;">
                                <span class="text-3xl font-extrabold text-slate-800 dark:text-white leading-none" id="fleetTotalCenter">0</span>
                                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Totali</span>
                            </div>
                        </div>
                        
                        <div class="flex-1 w-full grid grid-cols-1 gap-2.5">
                            <div class="flex justify-between items-center bg-white dark:bg-slate-900/60 border border-emerald-100 dark:border-emerald-900/30 p-2.5 rounded-xl shadow-sm transition hover:scale-[1.02] cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-500" onclick="switchTab('vehicles'); filterByStatusStat('ok')">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500"><i data-lucide="check-circle" class="w-4 h-4"></i></div>
                                    <span class="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">In Regola</span>
                                </div>
                                <span class="text-lg font-bold text-emerald-500" id="fleetGreenCount">0</span>
                            </div>
                            <div class="flex justify-between items-center bg-white dark:bg-slate-900/60 border border-amber-100 dark:border-amber-900/30 p-2.5 rounded-xl shadow-sm transition hover:scale-[1.02] cursor-pointer hover:border-amber-400 dark:hover:border-amber-500" onclick="switchTab('vehicles'); filterByStatusStat('expiring')">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-500 pulse-amber-slow"><i data-lucide="clock" class="w-4 h-4"></i></div>
                                    <span class="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">In Scadenza</span>
                                </div>
                                <span class="text-lg font-bold text-amber-500" id="fleetAmberCount">0</span>
                            </div>
                            <div class="flex justify-between items-center bg-white dark:bg-slate-900/60 border border-red-100 dark:border-red-900/30 p-2.5 rounded-xl shadow-sm transition hover:scale-[1.02] cursor-pointer hover:border-red-400 dark:hover:border-red-500" onclick="switchTab('vehicles'); filterByStatusStat('expired')">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 pulse-alert"><i data-lucide="alert-triangle" class="w-4 h-4"></i></div>
                                    <span class="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">Scaduti</span>
                                </div>
                                <span class="text-lg font-bold text-red-500" id="fleetRedCount">0</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Operators Chart -->
                <div class="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/80 p-5 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-lg flex flex-col relative overflow-hidden">
                    <div class="absolute -left-10 -bottom-10 w-64 h-64 bg-emerald-500/30 dark:bg-emerald-500/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten pointer-events-none"></div>
                    <h4 class="font-semibold text-base text-slate-700 dark:text-slate-200 mb-6 flex items-center gap-2 tracking-wide z-10"><i data-lucide="users" class="w-5 h-5 text-emerald-500"></i><i data-lucide="credit-card" class="w-5 h-5 text-emerald-500"></i> Card Tachigrafiche & Card Conducente</h4>
                    
                    <div class="flex flex-col md:flex-row items-center justify-between gap-8 z-10">
                        <div class="relative w-44 h-24 flex-shrink-0 flex items-end justify-center">
                            <canvas id="operatorStatusChart" style="position:absolute; top:0; left:0; width:100%; height:200%;"></canvas>
                            <div class="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end pointer-events-none" style="padding-bottom: 5px;">
                                <span class="text-3xl font-extrabold text-slate-800 dark:text-white leading-none" id="operatorTotalCenter">0</span>
                                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Totali</span>
                            </div>
                        </div>
                        
                        <div class="flex-1 w-full grid grid-cols-1 gap-2.5">
                            <div class="flex justify-between items-center bg-white dark:bg-slate-900/60 border border-emerald-100 dark:border-emerald-900/30 p-2.5 rounded-xl shadow-sm transition hover:scale-[1.02] cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-500" onclick="switchTab('operators'); filterByStatusStat('ok')">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500"><i data-lucide="check-circle" class="w-4 h-4"></i></div>
                                    <span class="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">In Regola</span>
                                </div>
                                <span class="text-lg font-bold text-emerald-500" id="operatorGreenCount">0</span>
                            </div>
                            <div class="flex justify-between items-center bg-white dark:bg-slate-900/60 border border-amber-100 dark:border-amber-900/30 p-2.5 rounded-xl shadow-sm transition hover:scale-[1.02] cursor-pointer hover:border-amber-400 dark:hover:border-amber-500" onclick="switchTab('operators'); filterByStatusStat('expiring')">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-500 pulse-amber-slow"><i data-lucide="clock" class="w-4 h-4"></i></div>
                                    <span class="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">In Scadenza</span>
                                </div>
                                <span class="text-lg font-bold text-amber-500" id="operatorAmberCount">0</span>
                            </div>
                            <div class="flex justify-between items-center bg-white dark:bg-slate-900/60 border border-red-100 dark:border-red-900/30 p-2.5 rounded-xl shadow-sm transition hover:scale-[1.02] cursor-pointer hover:border-red-400 dark:hover:border-red-500" onclick="switchTab('operators'); filterByStatusStat('expired')">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 pulse-alert"><i data-lucide="alert-triangle" class="w-4 h-4"></i></div>
                                    <span class="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">Scaduti</span>
                                </div>
                                <span class="text-lg font-bold text-red-500" id="operatorRedCount">0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- CHRONOLOGICAL TIMELINE -->
            <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
                    <h4 class="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                        <i data-lucide="calendar-days" class="w-4 h-4 text-brand-500"></i> Prossime Scadenze Cronologiche Singole (Top 5)
                    </h4>
                    <span class="text-[10px] text-slate-400 italic">Nota: mostra le scadenze individuali, non il numero di mezzi fisici.</span>
                </div>
                <div id="chronologicalTimeline" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3"></div>
            </div>

            <!-- TAB SWITCHER -->
            <div class="flex border-b border-slate-200 dark:border-slate-700 mb-6 bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-sm gap-2 transition-colors duration-200">
                <button onclick="switchTab('vehicles')" id="tabVehiclesBtn" class="flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition duration-200 bg-brand-600 text-white shadow-md">
                    <i data-lucide="truck" class="w-5 h-5"></i>
                    <span>Flotta Automezzi (<span id="badgeVehiclesCount">0</span>)</span>
                </button>
                <button onclick="switchTab('operators')" id="tabOperatorsBtn" class="flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition duration-200 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                    <div class="flex items-center gap-1"><i data-lucide="users" class="w-5 h-5"></i><i data-lucide="credit-card" class="w-5 h-5"></i></div>
                    <span>Card Tachigrafiche & Card Conducente (<span id="badgeOperatorsCount">0</span>)</span>
                </button>
                <button onclick="switchTab('calendar')" id="tabCalendarBtn" class="flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition duration-200 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                    <i data-lucide="calendar" class="w-5 h-5"></i>
                    <span class="hidden sm:inline">Calendario</span>
                </button>
            </div>

            <!-- SEARCH AND CONTROLS -->
            <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-4 mb-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                            <i data-lucide="search" class="w-4 h-4"></i>
                        </span>
                        <input type="text" id="searchInput" oninput="applyFilters()" placeholder="Cerca..." class="w-full pl-9 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors">
                    </div>
                    <div>
                        <select id="statusFilter" onchange="applyFilters()" class="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors">
                            <option value="all">Tutti gli stati</option>
                            <option value="expired">Ha almeno una scadenza Scaduta 🔴</option>
                            <option value="expiring">Ha almeno una scadenza In Scadenza 🟡</option>
                            <option value="ok">Tutto in regola / Nessun problema 🟢</option>
                        </select>
                    </div>
                    <div>
                        <select id="sortFilter" onchange="applyFilters()" class="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors">
                            <option value="default">Ordinamento predefinito</option>
                            <option value="name">Targa o Nome (A-Z)</option>
                            <option value="severity">Priorità Gravità Scadenza ⚠️</option>
                        </select>
                    </div>
                </div>

                <div class="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-700 pt-3">
                    <div class="flex flex-wrap items-center gap-2">
                        <button id="mainAddBtn" onclick="openAddModal()" class="bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-md transition flex items-center space-x-2">
                            <i data-lucide="plus-circle" class="w-4 h-4"></i>
                            <span id="mainAddBtnText">Nuovo Mezzo</span>
                        </button>
                        
                        <button onclick="toggleLogistics()" id="logisticsToggleBtn" class="text-sm px-3 py-2 rounded-xl transition flex items-center space-x-1.5" title="Mostra o nascondi i dati della logistica">
                            <i id="logisticsIcon" data-lucide="eye" class="w-4 h-4"></i>
                            <span id="logisticsText">Logistica Visibile</span>
                        </button>

                        <button onclick="exportJSON()" class="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm px-3 py-2 rounded-xl transition flex items-center space-x-1.5" title="Esporta Backup Dati in formato .json">
                            <i data-lucide="download" class="w-4 h-4"></i>
                            <span class="hidden sm:inline">Esporta (.json)</span>
                        </button>
                        <button onclick="triggerImport()" class="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm px-3 py-2 rounded-xl transition flex items-center space-x-1.5" title="Importa Backup Dati da file .json">
                            <i data-lucide="upload" class="w-4 h-4"></i>
                            <span class="hidden sm:inline">Importa (.json)</span>
                        </button>
                        <input type="file" id="importFile" class="hidden" accept=".json" onchange="importJSON(event)">

                        <button onclick="exportAllToCalendar()" class="bg-amber-500/10 dark:bg-amber-500/20 hover:bg-amber-500/20 text-amber-600 dark:text-amber-300 text-sm px-3 py-2 rounded-xl transition flex items-center space-x-1.5 border border-amber-200 dark:border-amber-500/30 font-bold" title="Esporta file di calendario per sincronizzazione">
                            <i data-lucide="calendar" class="w-4 h-4 text-amber-500"></i>
                            <span>Sincronizza Calendario (.ics)</span>
                        </button>

                        <button onclick="openPrintModal()" class="bg-brand-500/10 dark:bg-brand-500/20 hover:bg-brand-500/20 text-brand-600 dark:text-brand-300 text-sm px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 border border-brand-200/50 dark:border-brand-500/30 font-bold" title="Stampa Report Personalizzato">
                            <i data-lucide="printer" class="w-4 h-4"></i>
                            <span>Stampa Report</span>
                        </button>

                        <button onclick="generateEmailForDirezione()" class="bg-indigo-500/10 dark:bg-indigo-500/20 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-sm px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 border border-indigo-200/50 dark:border-indigo-500/30 font-bold" title="Genera Email per la Direzione con i mezzi in allerta">
                            <i data-lucide="mail" class="w-4 h-4"></i>
                            <span>Email Direzione</span>
                        </button>
                    </div>

                    <div class="flex items-center space-x-2">
                        <button onclick="confirmResetToDemo()" class="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-semibold underline">
                            Ripristina Database Esempio
                        </button>
                    </div>
                </div>
            </div>

            <!-- DYNAMIC TABS CONTENTS -->
            <div id="tabVehiclesContent" class="space-y-6">
                <div id="vehiclesContainer" class="space-y-4"></div>
            </div>

            <div id="tabOperatorsContent" class="space-y-6 hidden">
                <div id="operatorsContainer" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"></div>
            </div>

            
            <!-- CALENDAR VIEW -->
            <div id="tabCalendarContent" class="hidden space-y-6">
                <div class="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <!-- Header Calendario -->
                    <div class="flex items-center justify-between mb-6">
                        <button onclick="changeMonth(-1)" class="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                            <i data-lucide="chevron-left" class="w-5 h-5"></i>
                        </button>
                        <h2 id="calendarMonthYear" class="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Mese Anno</h2>
                        <button onclick="changeMonth(1)" class="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                            <i data-lucide="chevron-right" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <!-- Griglia Giorni Settimana -->
                    <div class="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
                        <div class="text-center text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Lun</div>
                        <div class="text-center text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Mar</div>
                        <div class="text-center text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Mer</div>
                        <div class="text-center text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Gio</div>
                        <div class="text-center text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Ven</div>
                        <div class="text-center text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Sab</div>
                        <div class="text-center text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Dom</div>
                    </div>

                    <!-- Griglia Calendario -->
                    <div id="calendarGrid" class="grid grid-cols-7 gap-1 sm:gap-2">
                        <!-- Giorni generati da JS -->
                    </div>
                </div>
            </div>
<!-- EMPTY STATE -->
            <div id="emptyState" class="hidden bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center shadow-sm">
                <div class="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-700 text-slate-400 flex items-center justify-center rounded-full mb-4">
                    <i data-lucide="folder" class="w-8 h-8"></i>
                </div>
                <h4 class="text-lg font-bold text-slate-900 dark:text-white">Nessuna risorsa trovata</h4>
                <p class="text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto text-sm">Non ci sono elementi che corrispondono ai filtri di ricerca selezionati.</p>
            </div>

        </main>
    </div>

    <!-- MODERN FOOTER & LICENSE INFORMATION -->
    <footer class="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-6 mt-12 transition-colors duration-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
                <p class="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                    Questa copia di <span class="text-brand-600 dark:text-brand-400 font-extrabold">Fleet Deadline Manager - Pro Edition</span> è stata sviluppata in esclusiva e concessa in licenza d'uso perpetua a <span class="font-bold text-slate-800 dark:text-white">VI.CLA FUTURE S.R.L.</span>
                </p>
                <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-1 flex items-center justify-center sm:justify-start gap-1">
                    <i data-lucide="code-2" class="w-3.5 h-3.5"></i> Software Engineered & Designed by: 
                    <strong class="text-slate-600 dark:text-slate-300 font-semibold hover:text-brand-500 transition-colors">GC CodeLab • Giovanni Cavallo</strong>
                </p>
            </div>
            <div class="flex items-center gap-3">
                <span class="text-[11px] bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 px-3 py-1 rounded-full font-bold border border-brand-200 dark:border-brand-800 shadow-sm">
                    Versione 1.9.6
                </span>
                <button onclick="openLicenseModal()" class="text-xs text-brand-600 dark:text-brand-400 font-extrabold hover:underline flex items-center gap-1">
                    <i data-lucide="info" class="w-3.5 h-3.5"></i> Info Licenza
                </button>
            </div>
        </div>
    </footer>

    <!-- MODAL: DETTAGLI LICENZA -->
    <div id="licenseModal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 hidden backdrop-blur-sm">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-md w-full transition-all">
            <div class="px-6 py-4 border-b border-slate-150 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900 rounded-t-2xl">
                <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <i data-lucide="award" class="w-4 h-4 text-brand-600"></i>
                    <span>Licenza d'Uso Software</span>
                </h3>
                <button onclick="closeLicenseModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>
            <div class="p-6 text-center space-y-4">
                <div class="mx-auto w-16 h-16 bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 flex items-center justify-center rounded-2xl">
                    <i data-lucide="shield-check" class="w-10 h-10"></i>
                </div>
                <div>
                    <h4 class="text-base font-extrabold text-slate-900 dark:text-white">Fleet Deadline Manager</h4>
                    <p class="text-xs text-brand-600 dark:text-brand-400 font-extrabold uppercase tracking-widest mt-0.5">Pro Edition - v1.9.6</p>
                </div>
                <div class="border-t border-b dark:border-slate-700 py-4 text-xs text-slate-600 dark:text-slate-300 text-left space-y-2.5">
                    <p>
                        Questa copia del software è stata sviluppata in esclusiva ed è concessa in <strong>licenza d'uso perpetua e non trasferibile</strong> a:
                    </p>
                    <div class="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-700 font-bold text-slate-800 dark:text-white text-center tracking-wide">
                        VI.CLA FUTURE S.R.L.
                    </div>
                    <p class="text-[10px] text-slate-400 text-center tracking-wide space-y-1">
                        <strong>Sede Legale:</strong> Viale Michelangelo n. 33 - 80129 Napoli (NA)<br>
                        <strong>Sede Operativa:</strong> Strada Consortile, s.n.c. Condominio Sviluppo - 81032 Carinaro (CE)
                    </p>
                    <p class="border-t dark:border-slate-700 pt-3">
                        Progettazione, architettura logica e sviluppo del codice sorgente:
                    </p>
                    <div class="flex items-center justify-center gap-2 font-bold text-slate-800 dark:text-white bg-brand-50/50 dark:bg-brand-950/30 p-2.5 rounded-xl border border-brand-100 dark:border-brand-900">
                        <i data-lucide="terminal" class="w-4 h-4 text-brand-500"></i>
                        <span>GC CodeLab • Giovanni Cavallo</span>
                    </div>
                </div>
                <div class="flex justify-end">
                    <button onclick="closeLicenseModal()" class="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition w-full shadow-md shadow-brand-500/10">
                        Chiudi Finestra
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- MODAL: ADD/EDIT VEHICLE -->
    <div id="vehicleModal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 hidden overflow-y-auto backdrop-blur-sm">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-3xl w-full max-h-[90vh] flex flex-col transition-all">
            <div class="px-6 py-4 border-b border-slate-150 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900 rounded-t-2xl">
                <h3 id="modalTitle" class="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <i data-lucide="plus" class="w-5 h-5 text-brand-600"></i>
                    <span>Aggiungi Nuovo Mezzo alla Flotta</span>
                </h3>
                <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-lg">
                    <i data-lucide="x" class="w-6 h-6"></i>
                </button>
            </div>

            <div class="p-6 overflow-y-auto flex-1 space-y-6">
                <form id="vehicleForm" onsubmit="saveVehicle(event)">
                    <input type="hidden" id="vehicleId">
                    <div>
                        <h4 class="text-sm font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b dark:border-slate-700 pb-1">
                            <i data-lucide="info" class="w-4 h-4"></i> Dati Principali del Veicolo
                        </h4>
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Targa Mezzo *</label>
                                <input type="text" id="formPlate" required placeholder="Es. AA 123 BB" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-sm uppercase focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Descrizione / Modello *</label>
                                <input type="text" id="formModel" required placeholder="Es. Iveco 130, Scania 450" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Portata Utile (Kg)</label>
                                <input type="number" id="formPayload" placeholder="Es. 4750" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors">
                            </div>
                        </div>
                    </div>

                    <div class="mt-6">
                        <h4 class="text-sm font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b dark:border-slate-700 pb-1">
                            <i data-lucide="credit-card" class="w-4 h-4"></i> Telepass & Carte Carburante
                        </h4>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Pedaggio / Telepass</label>
                                <input type="text" id="formTelepass" placeholder="Codice Telepass" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Carta Carburante 1 (es. DKV)</label>
                                <div class="grid grid-cols-2 gap-2">
                                    <input type="text" id="formCard1Num" placeholder="N. Carta" class="w-full px-2 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors">
                                    <input type="text" id="formCard1Pin" placeholder="PIN" class="w-full px-2 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors">
                                </div>
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Carta Carburante 2 (es. Q8)</label>
                                <div class="grid grid-cols-2 gap-2">
                                    <input type="text" id="formCard2Num" placeholder="N. Carta" class="w-full px-2 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors">
                                    <input type="text" id="formCard2Pin" placeholder="PIN" class="w-full px-2 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors">
                                </div>
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Carta Carburante 3 (es. Tamoil)</label>
                                <div class="grid grid-cols-2 gap-2">
                                    <input type="text" id="formCard3Num" placeholder="N. Carta" class="w-full px-2 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors">
                                    <input type="text" id="formCard3Pin" placeholder="PIN" class="w-full px-2 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-6">
                        <h4 class="text-sm font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b dark:border-slate-700 pb-1">
                            <i data-lucide="calendar" class="w-4 h-4"></i> Scadenziario Tecnico e Fiscale
                        </h4>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Revisione Veicolo</label>
                                <input type="date" id="deadlineRevision" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Revisione Tachigrafo (Biennale)</label>
                                <input type="date" id="deadlineTachimetro" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Data ULTIMO Scarico Dati Tachigrafo (Prossimo a 90gg) *</label>
                                <input type="date" id="deadlineScaricoTachigrafo" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Polizza Assicurazione RC</label>
                                <input type="date" id="deadlineAssicurazione" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Verifica / Revisione Gru</label>
                                <input type="date" id="deadlineGru" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Verifica Gru Ventennale (Strutturale)</label>
                                <input type="date" id="deadlineGruStrutturale" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Tassa di Possesso / Bollo</label>
                                <input type="date" id="deadlineTassaPossesso" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Altra Scadenza Generica</label>
                                <input type="date" id="deadlineAltro" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Nota per altra scadenza</label>
                                <input type="text" id="deadlineAltroNota" placeholder="Es. Estintori, Linea Vita" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors">
                            </div>
                        </div>
                    </div>

                    <div class="mt-8 flex justify-end space-x-3 border-t border-slate-150 dark:border-slate-700 pt-4">
                        <button type="button" onclick="closeModal()" class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                            Annulla
                        </button>
                        <button type="submit" class="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-500/10 transition">
                            Salva Configurazione
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- MODAL: REGISTER OPERATOR CARD -->
    <div id="operatorModal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 hidden backdrop-blur-sm">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-md w-full transition-all">
            <div class="px-6 py-4 border-b border-slate-150 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900 rounded-t-2xl">
                <h3 id="operatorModalTitle" class="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <i data-lucide="user-plus" class="w-5 h-5 text-brand-600"></i>
                    <span>Registra Nuova Carta del Conducente</span>
                </h3>
                <button onclick="closeOperatorModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-lg">
                    <i data-lucide="x" class="w-6 h-6"></i>
                </button>
            </div>

            <div class="p-6">
                <form id="operatorForm" onsubmit="saveOperator(event)" class="space-y-4">
                    <input type="hidden" id="operatorId">
                    <div>
                        <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Tipo di Card *</label>
                        <select id="operatorType" onchange="toggleOperatorFormLabels()" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors">
                            <option value="driver">Carta del Conducente</option>
                            <option value="company">Card Aziendale (Scarico 3 mesi)</option>
                            <option value="vehicle_company">Scarico Dati Mezzi</option>
                        </select>
                    </div>
                    <div>
                        <label id="lblOperatorName" class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Nome e Cognome Conducente *</label>
                        <input type="text" id="operatorName" required placeholder="Es. Mario Rossi" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors">
                    </div>
                    <div>
                        <label id="lblOperatorCardNum" class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Codice Card Tachigrafica *</label>
                        <input type="text" id="operatorCardNum" required placeholder="Es. IT00923456F" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors">
                    </div>
                    <div>
                        <label id="lblOperatorExpiration" class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Data Scadenza Validità Card *</label>
                        <input type="date" id="operatorExpiration" required class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors">
                    </div>
                    <div id="divOperatorDownload">
                        <label id="lblOperatorDownload" class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Data ULTIMO Scarico Dati Effettuato *</label>
                        <input type="date" id="operatorDownload" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors">
                    </div>

                    <div class="mt-6 flex justify-end space-x-3 border-t border-slate-150 dark:border-slate-700 pt-4">
                        <button type="button" onclick="closeOperatorModal()" class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                            Annulla
                        </button>
                        <button type="submit" class="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-bold shadow-md transition">
                            Salva Informazioni
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- MODAL: WARNING THRESHOLDS -->
    <div id="settingsModal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 hidden backdrop-blur-sm">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-sm w-full transition-all">
            <div class="px-6 py-4 border-b border-slate-150 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900 rounded-t-2xl">
                <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <i data-lucide="settings" class="w-4 h-4 text-brand-600"></i>
                    <span>Soglie Allarme Applicazione</span>
                </h3>
                <button onclick="closeSettingsModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>
            <div class="p-6 space-y-4">
                <div>
                    <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Giorni Pre-allarme (Stato Giallo):</label>
                    <select id="settingWarningDays" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-sm">
                        <option value="15">15 Giorni</option>
                        <option value="30" selected>30 Giorni (Standard)</option>
                        <option value="45">45 Giorni</option>
                        <option value="60">60 Giorni</option>
                        <option value="90">90 Giorni</option>
                    </select>
                    <p class="text-[11px] text-slate-400 mt-1">Le scadenze comprese in questo raggio temporale verranno segnalate in arancione prima della scadenza effettiva.</p>
                </div>

                <!-- SEZIONE PERSONALIZZAZIONE AUDIO & VOCE -->
                <div class="border-t border-slate-150 dark:border-slate-700 pt-4 space-y-3">
                    <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 font-sans flex items-center justify-between">
                        <span id="lblVoiceSectionTitle" class="flex items-center gap-1"><i data-lucide="volume-2" class="w-3.5 h-3.5 text-brand-500"></i> Personalizzazione Voce & Suoni</span>
                        <button type="button" onclick="testVoiceSynthesis()" class="text-[10px] bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300 hover:bg-brand-100 px-2.5 py-1 rounded-lg border border-brand-200 dark:border-brand-800 font-bold transition flex items-center gap-1">
                            <i data-lucide="play" class="w-3 h-3"></i> Prova Audio
                        </button>
                    </label>

                    <!-- FILTRO GENERE VOCE (Femminile / Maschile / Tutte) -->
                    <div>
                        <span class="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Filtro Genere Voci:</span>
                        <div class="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-700/60 p-1 rounded-xl">
                            <button type="button" id="btnVoiceFemale" onclick="setVoiceGenderFilter('female')" class="py-1 px-2 text-[11px] font-bold rounded-lg transition bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-300 shadow-sm">
                                👩 Femminile
                            </button>
                            <button type="button" id="btnVoiceMale" onclick="setVoiceGenderFilter('male')" class="py-1 px-2 text-[11px] font-bold rounded-lg transition text-slate-600 dark:text-slate-300 hover:text-slate-900">
                                👨 Maschile
                            </button>
                            <button type="button" id="btnVoiceAll" onclick="setVoiceGenderFilter('all')" class="py-1 px-2 text-[11px] font-bold rounded-lg transition text-slate-600 dark:text-slate-300 hover:text-slate-900">
                                🌐 Tutte
                            </button>
                        </div>
                    </div>

                    <!-- SELEZIONE VOCE SPECIFICA -->
                    <div>
                        <span class="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Voce Selezionata:</span>
                        <select id="settingVoiceSelect" onchange="onVoiceDropdownChange()" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500 transition-colors">
                        </select>
                    <!-- REGOLAZIONI VOCE -->
                    <div class="grid grid-cols-2 gap-3 mt-3">
                        <div>
                            <div class="flex justify-between items-center mb-1">
                                <span class="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Velocità Voce:</span>
                                <span id="valRate" class="text-[10px] font-bold text-brand-600 dark:text-brand-400">1.00x</span>
                            </div>
                            <input type="range" id="settingVoiceRate" min="0.5" max="1.5" step="0.05" value="1.0" oninput="document.getElementById('valRate').innerText = parseFloat(this.value).toFixed(2) + 'x'" onchange="testVoiceSynthesis()" class="w-full h-1.5 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-brand-500">
                        </div>
                        <div>
                            <div class="flex justify-between items-center mb-1">
                                <span class="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Tonalità (Pitch):</span>
                                <span id="valPitch" class="text-[10px] font-bold text-brand-600 dark:text-brand-400">1.00</span>
                            </div>
                            <input type="range" id="settingVoicePitch" min="0.5" max="1.5" step="0.05" value="1.0" oninput="document.getElementById('valPitch').innerText = parseFloat(this.value).toFixed(2)" onchange="testVoiceSynthesis()" class="w-full h-1.5 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-brand-500">
                        </div>
                    </div>
                    </div>

                    <!-- SELEZIONE SUONO DI INIZIO (BIP / CHIME / BELL) -->
                    <div>
                        <div class="flex items-center justify-between mb-1">
                            <span class="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">Suono Inizio Avviso:</span>
                            <button type="button" onclick="playChime()" class="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-600 font-bold transition flex items-center gap-1">
                                🔊 Ascolta Suono
                            </button>
                        </div>
                        <select id="settingChimeStyle" onchange="playChime()" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500 transition-colors">
                            <option value="chime" selected>🎵 Campanello Armonico Soft (Default)</option>
                            <option value="bell">🔔 Bell Cristallo (Limpido 880Hz)</option>
                            <option value="beep">🔊 Bip Discreto Classico (523Hz)</option>
                            <option value="none">🔇 Nessun Suono (Solo Voce)</option>
                        </select>
                    </div>
                </div>
                
                <!-- SEZIONE IMPOSTAZIONE PIN DI SICUREZZA -->
                <div class="border-t border-slate-150 dark:border-slate-700 pt-4">
                    <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 font-sans flex items-center gap-1">
                        <i data-lucide="key-round" class="w-3.5 h-3.5 text-brand-500"></i> PIN di Sicurezza Master (4 Cifre)
                    </label>
                    <div class="relative">
                        <input type="password" id="settingMasterPin" maxlength="4" placeholder="Es. 1234 (Vuoto = nessuna protezione)" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-sm tracking-widest text-center font-bold focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors">
                        <button type="button" onclick="toggleSettingsPinVisibility()" class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600">
                            <i id="toggleSettingsPinIcon" data-lucide="eye" class="w-4 h-4"></i>
                        </button>
                    </div>
                    <p class="text-[11px] text-slate-400 mt-1">Se inserito, sarà richiesto per accedere a impostazioni, visualizzare i PIN delle carte, mostrare la logistica o salvare modifiche.</p>
                </div>

                <div class="border-t border-slate-200 dark:border-slate-700 pt-4 flex justify-end">
                    <button onclick="saveSettings()" class="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition w-full shadow-md">
                        Salva Impostazioni
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- MODAL: CONFIGURE PRINT -->
    <div id="printModal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 hidden backdrop-blur-sm">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-md w-full transition-all">
            <div class="px-6 py-4 border-b border-slate-150 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900 rounded-t-2xl">
                <h3 class="text-md font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <i data-lucide="printer" class="w-5 h-5 text-brand-600"></i>
                    <span>Configura Stampa Report</span>
                </h3>
                <button onclick="closePrintModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>
            <div class="p-6 space-y-4">
                <div>
                    <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Risorse da Includere:</label>
                    <select id="printTarget" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-sm">
                        <option value="all">Tutto (Veicoli e Operatori)</option>
                        <option value="vehicles">Solo Flotta Automezzi</option>
                        <option value="operators">Solo Card Tachigrafiche & Card Conducente</option>
                    </select>
                </div>

                <div>
                    <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Filtro Stato Scadenza:</label>
                    <select id="printStatus" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-sm">
                        <option value="all">Tutti (Nessun filtro stato)</option>
                        <option value="expired">Solo Scaduti / Urgenti 🔴</option>
                        <option value="expiring">Solo In scadenza 🟡</option>
                        <option value="problematic">Solo Problemi (Scaduti + In scadenza) ⚠️</option>
                        <option value="ok">Solo In regola 🟢</option>
                    </select>
                </div>

                <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-150 dark:border-slate-700">
                    <div>
                        <p class="text-xs font-bold text-slate-700 dark:text-slate-200">Includi Dati Logistica</p>
                        <p class="text-[10px] text-slate-400">Mostra Telepass, codici carte e PIN</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="printIncludeLogistics" checked class="sr-only peer">
                        <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-brand-600"></div>
                    </label>
                </div>

                <div class="border-t border-slate-200 dark:border-slate-700 pt-4 flex justify-end space-x-2">
                    <button onclick="closePrintModal()" class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                        Annulla
                    </button>
                    <button onclick="generatePrintout()" class="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5">
                        <i data-lucide="printer" class="w-4 h-4"></i> Genera e Stampa
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- MODAL: ADVANCED DIAGNOSTICS REPORT -->
    <div id="diagnosticsModal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 hidden backdrop-blur-sm">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-lg w-full flex flex-col max-h-[85vh] transition-all">
            <div class="px-6 py-4 border-b border-slate-150 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900 rounded-t-2xl">
                <h3 class="text-md font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <i data-lucide="activity" class="w-5 h-5 text-brand-600"></i>
                    <span>Diagnosi & Analisi Flotta</span>
                </h3>
                <button onclick="closeDiagnosticsModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>
            <div class="p-6 overflow-y-auto space-y-4">
                <div class="bg-brand-50 dark:bg-brand-950/40 p-4 rounded-xl border border-brand-200 dark:border-brand-900 text-xs text-brand-800 dark:text-brand-300">
                    <p class="font-bold flex items-center gap-1.5 mb-1 text-sm">
                        <i data-lucide="alert-circle" class="w-4 h-4"></i> Report Diagnostico Istantaneo
                    </p>
                    Questo pannello analizza la flotta di VI.CLA FUTURE S.R.L. ed elabora un riepilogo in formato testo pronto per l'invio o l'archiviazione interna.
                </div>

                <div class="relative">
                    <textarea id="diagnosticsTextArea" readonly class="w-full h-64 p-3 font-mono text-[11px] bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none"></textarea>
                </div>

                <div class="flex gap-2">
                    <button onclick="copyDiagnosticsToClipboard()" class="flex-1 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-1.5 shadow-md">
                        <i data-lucide="copy" class="w-4 h-4"></i> Copia Testo
                    </button>
                    <button onclick="speakDiagnosticsReport()" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-1.5 shadow-md">
                        <i data-lucide="megaphone" class="w-4 h-4"></i> Ascolta Diagnosi
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- MODAL: CONFIRM ACTION -->
    <div id="confirmModal" class="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 hidden backdrop-blur-sm">
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 max-w-sm w-full p-6 text-center transition-colors duration-200">
            <div class="mx-auto w-12 h-12 bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center rounded-full mb-4">
                <i data-lucide="alert-triangle" class="w-6 h-6"></i>
            </div>
            <h4 id="confirmTitle" class="text-lg font-bold text-slate-900 dark:text-white">Sei sicuro?</h4>
            <p id="confirmMessage" class="text-sm text-slate-500 dark:text-slate-400 mt-2 whitespace-pre-line">Questa azione non può essere annullata.</p>
            <div class="mt-6 flex justify-center gap-3">
                <button onclick="closeConfirmModal(false)" class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                    Annulla
                </button>
                <button id="confirmYesBtn" onclick="closeConfirmModal(true)" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold shadow transition">
                    Conferma
                </button>
            </div>
        </div>
    </div>

    <!-- MODAL: QUICK RENEWAL SYSTEM -->
    <div id="quickRenewModal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 hidden backdrop-blur-sm">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-md w-full transition-all">
            <div class="px-6 py-4 border-b border-slate-150 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900 rounded-t-2xl">
                <h3 class="text-md font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <i data-lucide="zap" class="w-5 h-5 text-amber-500"></i>
                    <span>Rinnovi Veloci Contestuali</span>
                </h3>
                <button onclick="closeQuickRenewModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>
            <div class="p-6 space-y-4">
                <div class="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-750">
                    <p class="text-xs text-slate-400 font-bold uppercase">Veicolo Selezionato</p>
                    <h4 id="quickRenewPlate" class="text-xl font-extrabold text-slate-800 dark:text-white tracking-wide mt-0.5">--</h4>
                    <p id="quickRenewModel" class="text-xs text-slate-500 dark:text-slate-400">--</p>
                </div>

                <div class="space-y-2.5">
                    <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Seleziona Scadenza da Rinnovare Oggi:</p>
                    
                    <button onclick="performQuickRenew('scaricoTachigrafo', 90)" class="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-755 transition flex items-center justify-between group">
                        <div>
                            <p class="text-xs font-bold text-slate-700 dark:text-slate-300">Scarico Dati Tachigrafo</p>
                            <p class="text-[11px] text-slate-400">Registra scarico odierno (+3 Mesi)</p>
                        </div>
                        <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform"></i>
                    </button>

                    <button onclick="performQuickRenew('tachimetro', 730)" class="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-755 transition flex items-center justify-between group">
                        <div>
                            <p class="text-xs font-bold text-slate-700 dark:text-slate-300">Revisione Biennale Tachigrafo</p>
                            <p class="text-[11px] text-slate-400">Posticipa di 2 Anni da oggi</p>
                        </div>
                        <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform"></i>
                    </button>

                    <button onclick="performQuickRenew('assicurazione', 365)" class="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-755 transition flex items-center justify-between group">
                        <div>
                            <p class="text-xs font-bold text-slate-700 dark:text-slate-300">Assicurazione RC Auto</p>
                            <p class="text-[11px] text-slate-400">Paga premio annuale (+1 Anno)</p>
                        </div>
                        <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform"></i>
                    </button>

                    <button onclick="performQuickRenew('tassaPossesso', 365)" class="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-755 transition flex items-center justify-between group">
                        <div>
                            <p class="text-xs font-bold text-slate-700 dark:text-slate-300">Tassa di Possesso (Bollo)</p>
                            <p class="text-[11px] text-slate-400">Paga tassa annuale (+1 Anno)</p>
                        </div>
                        <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform"></i>
                    </button>

                    <button onclick="performQuickRenew('revision', 365)" class="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-755 transition flex items-center justify-between group">
                        <div>
                            <p class="text-xs font-bold text-slate-700 dark:text-slate-300">Revisione Motorizzazione</p>
                            <p class="text-[11px] text-slate-400">Aggiorna esito annuale (+1 Anno)</p>
                        </div>
                        <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- MODAL: PIN VERIFICATION (KEYPAD SYSTEM) -->
    <div id="pinVerifyModal" class="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 hidden backdrop-blur-sm">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-xs w-full p-6 text-center transition-all duration-300">
            <div class="mx-auto w-12 h-12 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center rounded-2xl mb-3 shadow-md">
                <i data-lucide="lock" class="w-6 h-6"></i>
            </div>
            <h4 class="text-sm font-bold text-slate-900 dark:text-white">Codice PIN Richiesto</h4>
            <p class="text-xs text-slate-400 mt-1 mb-4">Sblocca per procedere all'operazione</p>
            
            <!-- Display delle Cifre Inserite -->
            <div class="flex justify-center space-x-3.5 mb-4">
                <div id="dot-0" class="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center font-bold text-xs"></div>
                <div id="dot-1" class="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center font-bold text-xs"></div>
                <div id="dot-2" class="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center font-bold text-xs"></div>
                <div id="dot-3" class="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center font-bold text-xs"></div>
            </div>

            <div id="pinErrorText" class="text-xs text-red-500 font-bold mb-3 invisible">PIN Errato! Riprova</div>

            <!-- Tastierino Numerico Premium -->
            <div class="grid grid-cols-3 gap-2 max-w-[210px] mx-auto mb-4">
                <button onclick="pressPinKey('1')" class="py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-2xl text-base font-extrabold transition active:scale-95 shadow-sm">1</button>
                <button onclick="pressPinKey('2')" class="py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-2xl text-base font-extrabold transition active:scale-95 shadow-sm">2</button>
                <button onclick="pressPinKey('3')" class="py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-2xl text-base font-extrabold transition active:scale-95 shadow-sm">3</button>
                <button onclick="pressPinKey('4')" class="py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-2xl text-base font-extrabold transition active:scale-95 shadow-sm">4</button>
                <button onclick="pressPinKey('5')" class="py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-2xl text-base font-extrabold transition active:scale-95 shadow-sm">5</button>
                <button onclick="pressPinKey('6')" class="py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-2xl text-base font-extrabold transition active:scale-95 shadow-sm">6</button>
                <button onclick="pressPinKey('7')" class="py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-2xl text-base font-extrabold transition active:scale-95 shadow-sm">7</button>
                <button onclick="pressPinKey('8')" class="py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-2xl text-base font-extrabold transition active:scale-95 shadow-sm">8</button>
                <button onclick="pressPinKey('9')" class="py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-2xl text-base font-extrabold transition active:scale-95 shadow-sm">9</button>
                <button onclick="clearPin()" class="py-3 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-2xl text-xs font-bold transition active:scale-95 shadow-sm">C</button>
                <button onclick="pressPinKey('0')" class="py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-2xl text-base font-extrabold transition active:scale-95 shadow-sm">0</button>
                <button onclick="backspacePin()" class="py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-2xl text-base transition flex items-center justify-center active:scale-95 shadow-sm">
                    <i data-lucide="delete" class="w-4 h-4"></i>
                </button>
            </div>

            <div class="flex gap-2">
                <button onclick="cancelPinVerification()" class="flex-1 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-755 transition">Annulla</button>
            </div>
        </div>
    </div>

    
    <!-- DAY MODAL (Dettagli Scadenze del Giorno) -->
    <div id="dayModal" class="fixed inset-0 z-50 hidden flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-sm" onclick="closeDayModal()"></div>
        <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 w-full max-w-md relative z-10 shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] flex flex-col">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <i data-lucide="calendar" class="w-5 h-5 text-brand-500"></i>
                    <span id="dayModalDateTitle">Dettaglio Data</span>
                </h3>
                <button onclick="closeDayModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                    <i data-lucide="x" class="w-6 h-6"></i>
                </button>
            </div>
            
            <div id="dayModalContent" class="overflow-y-auto space-y-3 pb-2 flex-1">
                <!-- Voci del giorno generate da JS -->
            </div>
            
            <div class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                <button onclick="closeDayModal()" class="px-5 py-2.5 rounded-xl text-sm font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition">Chiudi</button>
            </div>
        </div>
    </div>

    <!-- DIARIO DI BORDO MODAL -->
    <div id="diaryModal" class="fixed inset-0 z-50 hidden flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onclick="closeDiaryModal()"></div>
        <div class="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-2xl relative z-10 shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]">
            
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center">
                        <i data-lucide="book-open" class="w-5 h-5 text-teal-600 dark:text-teal-400"></i>
                    </div>
                    <div>
                        <h3 class="text-lg font-extrabold text-slate-900 dark:text-white" id="diaryModalTitle">Diario di Bordo</h3>
                        <p class="text-xs text-slate-500 dark:text-slate-400" id="diaryModalSubtitle">Storico manutenzioni e interventi</p>
                    </div>
                </div>
                <button onclick="closeDiaryModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>

            <!-- Stats bar -->
            <div id="diaryStatsBar" class="flex items-center gap-4 px-6 py-3 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex-shrink-0 text-xs text-slate-600 dark:text-slate-400">
                <span class="flex items-center gap-1.5"><i data-lucide="file-text" class="w-3.5 h-3.5 text-teal-500"></i><span id="diaryStatCount">0 interventi</span></span>
                <span class="text-slate-300 dark:text-slate-600">|</span>
                <span class="flex items-center gap-1.5"><i data-lucide="euro" class="w-3.5 h-3.5 text-emerald-500"></i><span id="diaryStatCost">€ 0,00 totale</span></span>
                <span class="text-slate-300 dark:text-slate-600">|</span>
                <span class="flex items-center gap-1.5"><i data-lucide="calendar" class="w-3.5 h-3.5 text-brand-500"></i><span id="diaryStatLast">Nessun intervento</span></span>
            </div>

            <!-- Add new entry form -->
            <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-teal-50/50 dark:bg-teal-950/20 flex-shrink-0">
                <p class="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                    <i data-lucide="plus-circle" class="w-3.5 h-3.5"></i> Aggiungi intervento
                </p>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                    <div>
                        <label class="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Data</label>
                        <input type="date" id="diaryNewDate" class="w-full mt-1 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-xs focus:ring-2 focus:ring-teal-400 outline-none">
                    </div>
                    <div>
                        <label class="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Categoria</label>
                        <select id="diaryNewCategory" class="w-full mt-1 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-xs focus:ring-2 focus:ring-teal-400 outline-none">
                            <option value="manutenzione">🔧 Manutenzione</option>
                            <option value="riparazione">🔨 Riparazione</option>
                            <option value="pneumatici">🔄 Pneumatici</option>
                            <option value="revisione">✅ Revisione/Collaudo</option>
                            <option value="nota">📋 Nota generica</option>
                            <option value="costo">💰 Costo straordinario</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Km veicolo</label>
                        <input type="number" id="diaryNewKm" placeholder="es. 150000" class="w-full mt-1 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-xs focus:ring-2 focus:ring-teal-400 outline-none">
                    </div>
                    <div>
                        <label class="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Costo €</label>
                        <input type="number" id="diaryNewCost" placeholder="es. 450" step="0.01" class="w-full mt-1 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-xs focus:ring-2 focus:ring-teal-400 outline-none">
                    </div>
                </div>
                <div class="flex gap-2">
                    <textarea id="diaryNewDescription" rows="2" placeholder="Descrizione intervento (es. Cambio cinghia distribuzione, Sostituzione freni anteriori...)" class="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-xs focus:ring-2 focus:ring-teal-400 outline-none resize-none"></textarea>
                    <button onclick="addDiaryEntry()" class="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 self-end">
                        <i data-lucide="plus" class="w-3.5 h-3.5"></i> Aggiungi
                    </button>
                </div>
            </div>

            <!-- Diary entries list -->
            <div id="diaryEntriesList" class="overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-700">
                <!-- entries rendered by JS -->
            </div>

            <!-- Empty state -->
            <div id="diaryEmptyState" class="hidden flex-1 flex flex-col items-center justify-center py-12 text-center px-6">
                <div class="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center mb-4">
                    <i data-lucide="book-open" class="w-8 h-8 text-teal-400"></i>
                </div>
                <p class="text-slate-500 dark:text-slate-400 text-sm font-medium">Nessun intervento registrato</p>
                <p class="text-slate-400 dark:text-slate-500 text-xs mt-1">Aggiungi il primo intervento usando il form sopra</p>
            </div>

            <!-- Footer -->
            <div class="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end flex-shrink-0">
                <button onclick="closeDiaryModal()" class="px-5 py-2.5 rounded-xl text-sm font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition">Chiudi</button>
            </div>
        </div>
    </div>

    <!-- EMAIL DIREZIONE MODAL -->
    <div id="emailModal" class="fixed inset-0 z-50 hidden flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onclick="closeEmailModal()"></div>
        <div class="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-2xl relative z-10 shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center">
                        <i data-lucide="mail" class="w-5 h-5 text-indigo-600 dark:text-indigo-400"></i>
                    </div>
                    <div>
                        <h3 class="text-lg font-extrabold text-slate-900 dark:text-white">Email per la Direzione</h3>
                        <p class="text-xs text-slate-500 dark:text-slate-400">Report scadenze critiche flotta</p>
                    </div>
                </div>
                <button onclick="closeEmailModal()" class="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>
            <!-- Subject -->
            <div class="px-6 py-3 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                <p class="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wide mb-1">Oggetto</p>
                <p id="emailModalSubject" class="text-sm font-bold text-slate-800 dark:text-white"></p>
            </div>
            <!-- Body -->
            <div class="flex-1 overflow-y-auto p-6">
                <p class="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wide mb-2">Testo Email</p>
                <textarea id="emailModalBody" readonly class="w-full h-64 text-xs font-mono bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl p-4 resize-none outline-none focus:ring-2 focus:ring-indigo-400"></textarea>
            </div>
            <!-- Footer -->
            <div class="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 flex-shrink-0">
                <p class="text-xs text-slate-400 dark:text-slate-500">Copia il testo e incollalo nella tua email, oppure apri direttamente in Outlook.</p>
                <div class="flex gap-2 flex-shrink-0">
                    <button onclick="copyEmailToClipboard()" class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                        <i data-lucide="copy" class="w-4 h-4"></i> Copia Testo
                    </button>
                    <button onclick="openEmailInOutlook()" class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition">
                        <i data-lucide="external-link" class="w-4 h-4"></i> Apri in Outlook
                    </button>
                </div>
            </div>
        </div>
    </div>

<!-- TOAST ALERTS SYSTEM -->
    <div id="toast" class="fixed bottom-5 right-5 z-50 bg-slate-900 text-white py-3 px-5 rounded-2xl shadow-xl flex items-center space-x-3 transition-all duration-300 transform translate-y-20 opacity-0 pointer-events-none border border-slate-800">
        <div id="toastIcon">
            <i data-lucide="check-circle" class="w-5 h-5 text-emerald-400"></i>
        </div>
        <p id="toastMessage" class="text-sm font-semibold">Operazione completata con successo!</p>
    </div>

    <!-- AUDIO ELEMENT -->
    <audio id="alertAudio" src="https://assets.mixkit.co/active_storage/sfx/2869/2869-84.wav" preload="auto"></audio>

    <script>
        // --- FIREBASE CONFIGURATION ---
        const firebaseConfig = {
            apiKey: "AIzaSyCWDO3uCkjWF5hCMYImriSFkEYoSArYOgw",
            authDomain: "gestionale-flotta-d6448.firebaseapp.com",
            projectId: "gestionale-flotta-d6448",
            storageBucket: "gestionale-flotta-d6448.firebasestorage.app",
            messagingSenderId: "607207915320",
            appId: "1:607207915320:web:4604bb376b7feca7e14bcd"
        };
        firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();

        // --- BASE DATI INIZIALI DI PROVA ---
        const DEMO_VEHICLES = [
    {
        "id": "v-1",
        "plate": "ESCAV. 12 QT",
        "model": "12 QT - (TELAIO GA00465)",
        "payload": "",
        "telepass": "Nessuno",
        "currentKm": 0,
        "lastServiceKm": 0,
        "serviceInterval": 15000,
        "maintenanceLogs": [],
        "cards": {
            "card1": {
                "name": "DKV",
                "num": "Nessuna",
                "pin": ""
            },
            "card2": {
                "name": "Q8",
                "num": "Nessuna",
                "pin": ""
            },
            "card3": {
                "name": "Tamoil",
                "num": "Nessuna",
                "pin": ""
            }
        },
        "deadlines": {
            "revision": "",
            "tachimetro": "",
            "scaricoTachigrafo": "2026-07-15",
            "assicurazione": "2027-07-15",
            "gru": "",
            "gruStrutturale": "",
            "tassaPossesso": "",
            "altro": "",
            "altroNota": ""
        }
    },
    {
        "id": "v-2",
        "plate": "ESCAV. 18 QT",
        "model": "18 QT - (TELAIO CD00491)",
        "payload": "",
        "telepass": "Nessuno",
        "currentKm": 0,
        "lastServiceKm": 0,
        "serviceInterval": 15000,
        "maintenanceLogs": [],
        "cards": {
            "card1": {
                "name": "DKV",
                "num": "Nessuna",
                "pin": ""
            },
            "card2": {
                "name": "Q8",
                "num": "Nessuna",
                "pin": ""
            },
            "card3": {
                "name": "Tamoil",
                "num": "Nessuna",
                "pin": ""
            }
        },
        "deadlines": {
            "revision": "",
            "tachimetro": "",
            "scaricoTachigrafo": "2026-07-15",
            "assicurazione": "2026-10-13",
            "gru": "",
            "gruStrutturale": "",
            "tassaPossesso": "",
            "altro": "",
            "altroNota": ""
        }
    },
    {
        "id": "v-3",
        "plate": "ESCAV. 25 QT",
        "model": "25 QT - (TELAIO DH00704)",
        "payload": "",
        "telepass": "Nessuno",
        "currentKm": 0,
        "lastServiceKm": 0,
        "serviceInterval": 15000,
        "maintenanceLogs": [],
        "cards": {
            "card1": {
                "name": "DKV",
                "num": "Nessuna",
                "pin": ""
            },
            "card2": {
                "name": "Q8",
                "num": "Nessuna",
                "pin": ""
            },
            "card3": {
                "name": "Tamoil",
                "num": "Nessuna",
                "pin": ""
            }
        },
        "deadlines": {
            "revision": "",
            "tachimetro": "",
            "scaricoTachigrafo": "2026-07-15",
            "assicurazione": "2027-07-15",
            "gru": "",
            "gruStrutturale": "",
            "tassaPossesso": "",
            "altro": "",
            "altroNota": ""
        }
    },
    {
        "id": "v-4",
        "plate": "GG372FC",
        "model": "Citroen C3 (MILANO)",
        "payload": "",
        "telepass": "00973883606",
        "currentKm": 0,
        "lastServiceKm": 0,
        "serviceInterval": 15000,
        "maintenanceLogs": [],
        "cards": {
            "card1": {
                "name": "DKV",
                "num": "84963",
                "pin": "8726"
            },
            "card2": {
                "name": "Q8",
                "num": "46513870",
                "pin": "9929"
            },
            "card3": {
                "name": "Tamoil",
                "num": "7083651393142208",
                "pin": "92435"
            }
        },
        "deadlines": {
            "revision": "2026-09-01",
            "tachimetro": "",
            "scaricoTachigrafo": "2026-07-15",
            "assicurazione": "2026-10-03",
            "gru": "",
            "gruStrutturale": "",
            "tassaPossesso": "2026-08-01",
            "altro": "",
            "altroNota": ""
        }
    },
    {
        "id": "v-5",
        "plate": "DS274LP",
        "model": "Citroen Jumpy",
        "payload": "854",
        "telepass": "VIA CARD 3.675059.43",
        "currentKm": 0,
        "lastServiceKm": 0,
        "serviceInterval": 15000,
        "maintenanceLogs": [],
        "cards": {
            "card1": {
                "name": "DKV",
                "num": "85119",
                "pin": "3490"
            },
            "card2": {
                "name": "Q8",
                "num": "71663380",
                "pin": "8459"
            },
            "card3": {
                "name": "Tamoil",
                "num": "7083651392939414",
                "pin": "54226"
            }
        },
        "deadlines": {
            "revision": "2027-02-01",
            "tachimetro": "",
            "scaricoTachigrafo": "2026-07-15",
            "assicurazione": "2026-12-22",
            "gru": "",
            "gruStrutturale": "",
            "tassaPossesso": "2027-01-01",
            "altro": "",
            "altroNota": ""
        }
    },
    {
        "id": "v-6",
        "plate": "DW576GZ",
        "model": "Fiat Doblò",
        "payload": "605",
        "telepass": "VIA CARD n° 3.386737.31",
        "currentKm": 0,
        "lastServiceKm": 0,
        "serviceInterval": 15000,
        "maintenanceLogs": [],
        "cards": {
            "card1": {
                "name": "DKV",
                "num": "85010",
                "pin": "8721"
            },
            "card2": {
                "name": "Q8",
                "num": "53446822",
                "pin": "7509"
            },
            "card3": {
                "name": "Tamoil",
                "num": "7083651393239004",
                "pin": "37287"
            }
        },
        "deadlines": {
            "revision": "2026-11-01",
            "tachimetro": "",
            "scaricoTachigrafo": "2026-07-15",
            "assicurazione": "2027-05-22",
            "gru": "",
            "gruStrutturale": "",
            "tassaPossesso": "2027-01-01",
            "altro": "",
            "altroNota": ""
        }
    },
    {
        "id": "v-7",
        "plate": "DB987DV",
        "model": "Fiat Ducato",
        "payload": "1525",
        "telepass": "VIA CARD 3.469996.25",
        "currentKm": 0,
        "lastServiceKm": 0,
        "serviceInterval": 15000,
        "maintenanceLogs": [],
        "cards": {
            "card1": {
                "name": "DKV",
                "num": "85127",
                "pin": "2145"
            },
            "card2": {
                "name": "Q8",
                "num": "91153236",
                "pin": "5586"
            },
            "card3": {
                "name": "Tamoil",
                "num": "7083651392884859",
                "pin": "49462"
            }
        },
        "deadlines": {
            "revision": "2026-11-01",
            "tachimetro": "",
            "scaricoTachigrafo": "2026-07-15",
            "assicurazione": "2026-09-25",
            "gru": "",
            "gruStrutturale": "",
            "tassaPossesso": "2027-01-01",
            "altro": "",
            "altroNota": ""
        }
    },
    {
        "id": "v-8",
        "plate": "DV274KP",
        "model": "Iveco 130",
        "payload": "4750",
        "telepass": "Nessuno",
        "currentKm": 0,
        "lastServiceKm": 0,
        "serviceInterval": 15000,
        "maintenanceLogs": [],
        "cards": {
            "card1": {
                "name": "DKV",
                "num": "85069",
                "pin": "9749"
            },
            "card2": {
                "name": "Q8",
                "num": "85883129",
                "pin": "7553"
            },
            "card3": {
                "name": "Tamoil",
                "num": "7083651393396770",
                "pin": "48877"
            }
        },
        "deadlines": {
            "revision": "2026-10-01",
            "tachimetro": "2027-03-05",
            "scaricoTachigrafo": "2026-07-15",
            "assicurazione": "2026-10-10",
            "gru": "2027-03-10",
            "gruStrutturale": "2028-01-01",
            "tassaPossesso": "2027-01-01",
            "altro": "",
            "altroNota": ""
        }
    },
    {
        "id": "v-9",
        "plate": "BX376ML",
        "model": "Iveco 35",
        "payload": "850",
        "telepass": "VIA CARD N° 3.110574.55",
        "currentKm": 0,
        "lastServiceKm": 0,
        "serviceInterval": 15000,
        "maintenanceLogs": [],
        "cards": {
            "card1": {
                "name": "DKV",
                "num": "85085",
                "pin": "6125"
            },
            "card2": {
                "name": "Q8",
                "num": "31100688",
                "pin": "2203"
            },
            "card3": {
                "name": "Tamoil",
                "num": "7083651392753039",
                "pin": "70174"
            }
        },
        "deadlines": {
            "revision": "2026-11-01",
            "tachimetro": "",
            "scaricoTachigrafo": "2026-07-15",
            "assicurazione": "2027-02-28",
            "gru": "",
            "gruStrutturale": "",
            "tassaPossesso": "2027-01-01",
            "altro": "",
            "altroNota": ""
        }
    },
    {
        "id": "v-10",
        "plate": "FK740DS",
        "model": "Iveco 35 C150 GRU IFG 140/4",
        "payload": "593",
        "telepass": "VIA CARD 3.675059.45",
        "currentKm": 0,
        "lastServiceKm": 0,
        "serviceInterval": 15000,
        "maintenanceLogs": [],
        "cards": {
            "card1": {
                "name": "DKV",
                "num": "12843",
                "pin": "0021"
            },
            "card2": {
                "name": "Q8",
                "num": "26398272",
                "pin": "5994"
            },
            "card3": {
                "name": "Tamoil",
                "num": "7083651393854158",
                "pin": "93084"
            }
        },
        "deadlines": {
            "revision": "2027-07-01",
            "tachimetro": "",
            "scaricoTachigrafo": "2026-07-15",
            "assicurazione": "2027-04-28",
            "gru": "2025-12-01",
            "gruStrutturale": "2035-01-01",
            "tassaPossesso": "2027-01-01",
            "altro": "",
            "altroNota": ""
        }
    },
    {
        "id": "v-11",
        "plate": "FJ600BN",
        "model": "Iveco 35 C120 GRU IFG 130/3",
        "payload": "750",
        "telepass": "VIA CARD 3.675059.46",
        "currentKm": 0,
        "lastServiceKm": 0,
        "serviceInterval": 15000,
        "maintenanceLogs": [],
        "cards": {
            "card1": {
                "name": "DKV",
                "num": "12850",
                "pin": "4900"
            },
            "card2": {
                "name": "Q8",
                "num": "92682143",
                "pin": "1550"
            },
            "card3": {
                "name": "Tamoil",
                "num": "7083651393854133",
                "pin": "31769"
            }
        },
        "deadlines": {
            "revision": "2028-02-16",
            "tachimetro": "",
            "scaricoTachigrafo": "2026-07-15",
            "assicurazione": "2027-05-18",
            "gru": "2025-12-01",
            "gruStrutturale": "2035-01-01",
            "tassaPossesso": "2027-01-01",
            "altro": "",
            "altroNota": ""
        }
    },
    {
        "id": "v-12",
        "plate": "DK373HX",
        "model": "IVECO 35C 18",
        "payload": "1150",
        "telepass": "VIA CARD 3.620658.93 / TELEP. 00956045157",
        "currentKm": 0,
        "lastServiceKm": 0,
        "serviceInterval": 15000,
        "maintenanceLogs": [],
        "cards": {
            "card1": {
                "name": "DKV",
                "num": "85036",
                "pin": "3415"
            },
            "card2": {
                "name": "Q8",
                "num": "38368769",
                "pin": "1497"
            },
            "card3": {
                "name": "Tamoil",
                "num": "7083651393604876",
                "pin": "04042"
            }
        },
        "deadlines": {
            "revision": "2027-01-01",
            "tachimetro": "",
            "scaricoTachigrafo": "2026-07-15",
            "assicurazione": "2026-09-06",
            "gru": "",
            "gruStrutturale": "",
            "tassaPossesso": "2027-01-01",
            "altro": "",
            "altroNota": ""
        }
    },
    {
        "id": "v-13",
        "plate": "DP149KE",
        "model": "Iveco 60",
        "payload": "2840",
        "telepass": "VIA CARD 3.386737.29",
        "currentKm": 0,
        "lastServiceKm": 0,
        "serviceInterval": 15000,
        "maintenanceLogs": [],
        "cards": {
            "card1": {
                "name": "DKV",
                "num": "85077",
                "pin": "7519"
            },
            "card2": {
                "name": "Q8",
                "num": "97461024",
                "pin": "6071"
            },
            "card3": {
                "name": "Tamoil",
                "num": "7083651392756214",
                "pin": "86414"
            }
        },
        "deadlines": {
            "revision": "2026-09-01",
            "tachimetro": "2027-06-25",
            "scaricoTachigrafo": "2026-07-15",
            "assicurazione": "2027-02-04",
            "gru": "",
            "gruStrutturale": "",
            "tassaPossesso": "2027-01-01",
            "altro": "",
            "altroNota": ""
        }
    },
    {
        "id": "v-14",
        "plate": "FE859BC",
        "model": "Iveco 100",
        "payload": "4110",
        "telepass": "VIA CARD  3.864626.23",
        "currentKm": 0,
        "lastServiceKm": 0,
        "serviceInterval": 15000,
        "maintenanceLogs": [],
        "cards": {
            "card1": {
                "name": "DKV",
                "num": "12835",
                "pin": "2029"
            },
            "card2": {
                "name": "Q8",
                "num": "73260817",
                "pin": "9095"
            },
            "card3": {
                "name": "Tamoil",
                "num": "7083651393854125",
                "pin": "08533"
            }
        },
        "deadlines": {
            "revision": "2027-06-01",
            "tachimetro": "2027-04-26",
            "scaricoTachigrafo": "2026-07-15",
            "assicurazione": "2027-04-22",
            "gru": "2026-11-17",
            "gruStrutturale": "2027-03-15",
            "tassaPossesso": "2026-09-01",
            "altro": "",
            "altroNota": ""
        }
    },
    {
        "id": "v-15",
        "plate": "FL895MZ",
        "model": "MAZDA CX5",
        "payload": "",
        "telepass": "01002951885",
        "currentKm": 0,
        "lastServiceKm": 0,
        "serviceInterval": 15000,
        "maintenanceLogs": [],
        "cards": {
            "card1": {
                "name": "DKV",
                "num": "85028",
                "pin": "8443"
            },
            "card2": {
                "name": "Q8",
                "num": "7083651393072272",
                "pin": "75287"
            },
            "card3": {
                "name": "Tamoil",
                "num": "28521699",
                "pin": "9379"
            }
        },
        "deadlines": {
            "revision": "2027-11-01",
            "tachimetro": "",
            "scaricoTachigrafo": "2026-07-15",
            "assicurazione": "2026-09-16",
            "gru": "",
            "gruStrutturale": "",
            "tassaPossesso": "2026-08-01",
            "altro": "",
            "altroNota": ""
        }
    },
    {
        "id": "v-16",
        "plate": "DB992NM",
        "model": "FIAT GRANDE PUNTO",
        "payload": "",
        "telepass": "Nessuno",
        "currentKm": 0,
        "lastServiceKm": 0,
        "serviceInterval": 15000,
        "maintenanceLogs": [],
        "cards": {
            "card1": {
                "name": "DKV",
                "num": "Nessuna",
                "pin": ""
            },
            "card2": {
                "name": "Q8",
                "num": "Nessuna",
                "pin": ""
            },
            "card3": {
                "name": "Tamoil",
                "num": "Nessuna",
                "pin": ""
            }
        },
        "deadlines": {
            "revision": "2026-09-01",
            "tachimetro": "",
            "scaricoTachigrafo": "2026-07-15",
            "assicurazione": "2026-11-13",
            "gru": "",
            "gruStrutturale": "",
            "tassaPossesso": "",
            "altro": "",
            "altroNota": ""
        }
    },
    {
        "id": "v-17",
        "plate": "FB723AG",
        "model": "PEGOUT 208",
        "payload": "",
        "telepass": "Nessuno",
        "currentKm": 0,
        "lastServiceKm": 0,
        "serviceInterval": 15000,
        "maintenanceLogs": [],
        "cards": {
            "card1": {
                "name": "DKV",
                "num": "Nessuna",
                "pin": ""
            },
            "card2": {
                "name": "Q8",
                "num": "Nessuna",
                "pin": ""
            },
            "card3": {
                "name": "Tamoil",
                "num": "Nessuna",
                "pin": ""
            }
        },
        "deadlines": {
            "revision": "2028-01-01",
            "tachimetro": "",
            "scaricoTachigrafo": "2026-07-15",
            "assicurazione": "2027-05-18",
            "gru": "",
            "gruStrutturale": "",
            "tassaPossesso": "",
            "altro": "",
            "altroNota": ""
        }
    },
    {
        "id": "v-18",
        "plate": "FK466PN",
        "model": "CITROEN PICASSO (PERSONALE)",
        "payload": "",
        "telepass": "Nessuno",
        "currentKm": 0,
        "lastServiceKm": 0,
        "serviceInterval": 15000,
        "maintenanceLogs": [],
        "cards": {
            "card1": {
                "name": "DKV",
                "num": "Nessuna",
                "pin": ""
            },
            "card2": {
                "name": "Q8",
                "num": "Nessuna",
                "pin": ""
            },
            "card3": {
                "name": "Tamoil",
                "num": "Nessuna",
                "pin": ""
            }
        },
        "deadlines": {
            "revision": "2027-07-10",
            "tachimetro": "",
            "scaricoTachigrafo": "2026-07-15",
            "assicurazione": "2026-09-22",
            "gru": "",
            "gruStrutturale": "",
            "tassaPossesso": "",
            "altro": "",
            "altroNota": ""
        }
    },
    {
        "id": "v-19",
        "plate": "EX052LA",
        "model": "FORD TRANSIT CONNECT",
        "payload": "593",
        "telepass": "Nessuno",
        "currentKm": 0,
        "lastServiceKm": 0,
        "serviceInterval": 15000,
        "maintenanceLogs": [],
        "cards": {
            "card1": {
                "name": "DKV",
                "num": "Nessuna",
                "pin": ""
            },
            "card2": {
                "name": "Q8",
                "num": "Nessuna",
                "pin": ""
            },
            "card3": {
                "name": "Tamoil",
                "num": "Nessuna",
                "pin": ""
            }
        },
        "deadlines": {
            "revision": "2028-05-01",
            "tachimetro": "",
            "scaricoTachigrafo": "2026-07-15",
            "assicurazione": "2027-05-14",
            "gru": "",
            "gruStrutturale": "",
            "tassaPossesso": "2027-05-01",
            "altro": "",
            "altroNota": ""
        }
    },
    {
        "id": "v-20",
        "plate": "CAR. RAILOC IT RFI 152227-1",
        "model": "AUTOGRU FASSI F95A.022 MAT.0908-0679",
        "payload": "",
        "telepass": "Nessuno",
        "currentKm": 0,
        "lastServiceKm": 0,
        "serviceInterval": 15000,
        "maintenanceLogs": [],
        "cards": {
            "card1": {
                "name": "DKV",
                "num": "Nessuna",
                "pin": ""
            },
            "card2": {
                "name": "Q8",
                "num": "Nessuna",
                "pin": ""
            },
            "card3": {
                "name": "Tamoil",
                "num": "Nessuna",
                "pin": ""
            }
        },
        "deadlines": {
            "revision": "",
            "tachimetro": "",
            "scaricoTachigrafo": "2026-07-15",
            "assicurazione": "",
            "gru": "2027-05-29",
            "gruStrutturale": "",
            "tassaPossesso": "",
            "altro": "",
            "altroNota": ""
        }
    },
    {
        "id": "v-21",
        "plate": "CAR. ROBEL IT-RFI 152274- 2",
        "model": "AUTOGRU BONFIGLIOLI MAT.18356",
        "payload": "",
        "telepass": "Nessuno",
        "currentKm": 0,
        "lastServiceKm": 0,
        "serviceInterval": 15000,
        "maintenanceLogs": [],
        "cards": {
            "card1": {
                "name": "DKV",
                "num": "Nessuna",
                "pin": ""
            },
            "card2": {
                "name": "Q8",
                "num": "Nessuna",
                "pin": ""
            },
            "card3": {
                "name": "Tamoil",
                "num": "Nessuna",
                "pin": ""
            }
        },
        "deadlines": {
            "revision": "",
            "tachimetro": "",
            "scaricoTachigrafo": "2026-07-15",
            "assicurazione": "",
            "gru": "2027-04-17",
            "gruStrutturale": "",
            "tassaPossesso": "",
            "altro": "",
            "altroNota": ""
        }
    },
    {
        "id": "v-22",
        "plate": "CAR. RAILOC IT RFI 152205-7",
        "model": "AUTOGRU FASSI F95A.022 MAT.0908-0678",
        "payload": "",
        "telepass": "Nessuno",
        "currentKm": 0,
        "lastServiceKm": 0,
        "serviceInterval": 15000,
        "maintenanceLogs": [],
        "cards": {
            "card1": {
                "name": "DKV",
                "num": "Nessuna",
                "pin": ""
            },
            "card2": {
                "name": "Q8",
                "num": "Nessuna",
                "pin": ""
            },
            "card3": {
                "name": "Tamoil",
                "num": "Nessuna",
                "pin": ""
            }
        },
        "deadlines": {
            "revision": "",
            "tachimetro": "",
            "scaricoTachigrafo": "2026-07-15",
            "assicurazione": "",
            "gru": "2026-11-10",
            "gruStrutturale": "",
            "tassaPossesso": "",
            "altro": "",
            "altroNota": ""
        }
    },
    {
        "id": "v-1784020991107",
        "plate": "ESCAV. H25D",
        "model": "H25D / (TELAIO 351J120400)",
        "payload": "",
        "telepass": "Nessuno",
        "currentKm": 0,
        "lastServiceKm": 0,
        "serviceInterval": 15000,
        "maintenanceLogs": [],
        "cards": {
            "card1": {
                "name": "DKV",
                "num": "Nessuna",
                "pin": ""
            },
            "card2": {
                "name": "Q8",
                "num": "Nessuna",
                "pin": ""
            },
            "card3": {
                "name": "Tamoil",
                "num": "Nessuna",
                "pin": ""
            }
        },
        "deadlines": {
            "revision": "",
            "tachimetro": "",
            "scaricoTachigrafo": "2026-07-15",
            "assicurazione": "2027-07-15",
            "gru": "",
            "gruStrutturale": "",
            "tassaPossesso": "",
            "altro": "",
            "altroNota": ""
        }
    }
];

        const DEMO_OPERATORS = [
    {
        "id": "op-1",
        "type": "driver",
        "name": "Carmine Esposito",
        "cardNum": "I100000057658002",
        "expiration": "2030-11-01",
        "lastDownload": "2026-07-15"
    },
    {
        "id": "op-2",
        "type": "driver",
        "name": "Cavallo Giovanni",
        "cardNum": "I100000751373002",
        "expiration": "2030-02-22",
        "lastDownload": "2026-07-15"
    },
    {
        "id": "op-3",
        "type": "driver",
        "name": "Damiani Giovanni",
        "cardNum": "I100000051499003",
        "expiration": "2031-06-21",
        "lastDownload": "2026-07-15"
    },
    {
        "id": "op-4",
        "type": "driver",
        "name": "Giobbe Gennaro",
        "cardNum": "N/A",
        "expiration": "2030-03-15",
        "lastDownload": "2026-07-15"
    },
    {
        "id": "op-corp-1",
        "type": "company",
        "name": "Vi.Cla. Future S.r.L.",
        "cardNum": "I400000005428002",
        "expiration": "2030-06-05"
    },
    {
        "id": "op-1783004697451",
        "type": "vehicle_company",
        "name": "IVECO 130",
        "cardNum": "I400000005428002",
        "expiration": "2026-09-17"
    },
    {
        "id": "op-1783004716173",
        "type": "vehicle_company",
        "name": "IVECO 100",
        "cardNum": "I400000005428002",
        "expiration": "2026-08-26"
    },
    {
        "id": "op-1783004735820",
        "type": "vehicle_company",
        "name": "IVECO 60",
        "cardNum": "I400000005428002",
        "expiration": "2026-09-17"
    }
];

        
        // --- CALENDAR LOGIC ---
        let currentCalendarDate = new Date();
        let calendarDataMap = {}; 

        function changeMonth(dir) {
            currentCalendarDate.setMonth(currentCalendarDate.getMonth() + dir);
            renderCalendar();
        }

        function getStatus(dateStr) {
            const expDate = new Date(dateStr);
            const today = new Date();
            today.setHours(0,0,0,0);
            
            const diffTime = expDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays <= 0) return 'red'; 
            if (diffDays <= 30) return 'amber'; 
            return 'green'; 
        }

        function populateCalendarDataMap() {
            calendarDataMap = {};
            
            // Mezzi
            vehicles.forEach(v => {
                const addExp = (dateStr, type, name) => {
                    if(!dateStr) return;
                    if(!calendarDataMap[dateStr]) calendarDataMap[dateStr] = [];
                    calendarDataMap[dateStr].push({
                        entity: 'Veicolo: ' + v.targa,
                        type,
                        name,
                        status: getStatus(dateStr)
                    });
                };
                
                addExp(v.scadenzaAssicurazione, 'Assicurazione', v.targa);
                addExp(v.scadenzaBollo, 'Bollo', v.targa);
                addExp(v.scadenzaRevisione, 'Revisione', v.targa);
                addExp(v.scadenzaTachigrafo, 'Tachigrafo', v.targa);
                addExp(v.scadenzaHaccp, 'HACCP (ATP)', v.targa);
                addExp(v.scadenzaTachigrafoDownload, 'Scarico Dati Tachigrafo', v.targa);
                addExp(v.scadenzaTagliando, 'Tagliando Meccanico', v.targa);
                addExp(v.scadenzaEstintore, 'Estintore a Bordo', v.targa);
                addExp(v.scadenzaBombole, 'Scadenza Bombole', v.targa);
            });
            
            // Autisti
            operators.forEach(op => {
                const addExp = (dateStr, type, name) => {
                    if(!dateStr) return;
                    if(!calendarDataMap[dateStr]) calendarDataMap[dateStr] = [];
                    calendarDataMap[dateStr].push({
                        entity: 'Autista/Card: ' + op.name,
                        type,
                        name,
                        status: getStatus(dateStr)
                    });
                };
                
                const typeName = op.type === 'company' ? 'Scadenza Card Aziendale' : 
                               (op.type === 'vehicle_company' ? 'Scadenza Tachigrafo Mezzo' : 'Scadenza Carta Conducente');
                
                addExp(op.expiration, typeName, op.name);
                
                if (op.lastDownload) {
                    let nextDownload = new Date(op.lastDownload);
                    nextDownload.setDate(nextDownload.getDate() + (op.type === 'driver' ? 28 : 90));
                    addExp(nextDownload.toISOString().split('T')[0], 'Scadenza Scarico Dati', op.name);
                }
            });
        }

        function renderCalendar() {
            if(activeTab !== 'calendar') return;
            
            const year = currentCalendarDate.getFullYear();
            const month = currentCalendarDate.getMonth();
            const monthNames = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
                              "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
            
            const calTitle = document.getElementById('calendarMonthYear');
            if(calTitle) calTitle.innerText = monthNames[month] + " " + year;
            
            populateCalendarDataMap();
            
            const grid = document.getElementById('calendarGrid');
            if(!grid) return;
            grid.innerHTML = "";
            
            const firstDayOfMonth = new Date(year, month, 1);
            const lastDayOfMonth = new Date(year, month + 1, 0);
            
            let startingDay = firstDayOfMonth.getDay();
            startingDay = startingDay === 0 ? 6 : startingDay - 1; 
            
            const daysInMonth = lastDayOfMonth.getDate();
            
            // Format today correctly in local time
            const t = new Date();
            const todayStr = t.getFullYear() + "-" + String(t.getMonth() + 1).padStart(2, '0') + "-" + String(t.getDate()).padStart(2, '0');
            
            for (let i = 0; i < startingDay; i++) {
                grid.innerHTML += `<div class="p-2 sm:p-4 rounded-2xl bg-transparent"></div>`;
            }
            
            for (let day = 1; day <= daysInMonth; day++) {
                const dateObj = new Date(year, month, day);
                const yearStr = dateObj.getFullYear();
                const monthStr = String(dateObj.getMonth() + 1).padStart(2, '0');
                const dayStr = String(dateObj.getDate()).padStart(2, '0');
                const dStr = `${yearStr}-${monthStr}-${dayStr}`;
                
                const isToday = dStr === todayStr;
                
                const exps = calendarDataMap[dStr] || [];
                
                let hasRed = false;
                let hasAmber = false;
                
                exps.forEach(e => {
                    if (e.status === 'red') hasRed = true;
                    if (e.status === 'amber') hasAmber = true;
                });
                
                let dotsHtml = "";
                if (hasRed) {
                    dotsHtml = `<div class="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] pulse-alert mx-auto mt-1"></div>`;
                } else if (hasAmber) {
                    dotsHtml = `<div class="w-2.5 h-2.5 rounded-full bg-amber-400 mx-auto mt-1"></div>`;
                } else if (exps.length > 0) {
                    dotsHtml = `<div class="w-2 h-2 rounded-full bg-emerald-400 mx-auto mt-1"></div>`;
                }
                
                const todayClass = isToday ? 'bg-brand-50 dark:bg-brand-900/30 border-brand-300 dark:border-brand-700' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700';
                
                grid.innerHTML += `
                    <div onclick="openDayModal('${dStr}')" class="p-2 sm:p-4 rounded-2xl border cursor-pointer transition-all duration-200 text-center relative ${todayClass}">
                        <span class="text-sm sm:text-base font-bold ${isToday ? 'text-brand-600 dark:text-brand-400' : 'text-slate-700 dark:text-slate-300'}">${day}</span>
                        ${dotsHtml}
                        ${exps.length > 0 ? `<span class="absolute top-1 right-1 text-[9px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 rounded-full w-4 h-4 flex items-center justify-center">${exps.length}</span>` : ''}
                    </div>
                `;
            }
            if (window.lucide) {
                window.lucide.createIcons();
            }
        }

        function closeDayModal() {
            document.getElementById('dayModal').classList.add('hidden');
        }

        function openDayModal(dateStr) {
            const exps = calendarDataMap[dateStr] || [];
            
            const parts = dateStr.split('-');
            document.getElementById('dayModalDateTitle').innerText = parts[2] + "/" + parts[1] + "/" + parts[0];
            
            const content = document.getElementById('dayModalContent');
            if(exps.length === 0) {
                content.innerHTML = '<p class="text-slate-500 dark:text-slate-400 text-sm italic text-center w-full py-4">Nessuna scadenza in questa data.</p>';
            } else {
                let htmlStr = "";
                exps.forEach(e => {
                    let colorClass = 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800';
                    let icon = 'check-circle';
                    
                    if(e.status === 'red') {
                        colorClass = 'border-red-200 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
                        icon = 'alert-triangle';
                    } else if (e.status === 'amber') {
                        colorClass = 'border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800';
                        icon = 'clock';
                    }

                    htmlStr += `
                        <div class="p-3 rounded-xl border ${colorClass} flex items-start gap-3">
                            <i data-lucide="${icon}" class="w-5 h-5 flex-shrink-0 mt-0.5"></i>
                            <div>
                                <p class="text-[10px] sm:text-xs font-bold uppercase tracking-wider opacity-80 mb-0.5">${e.type}</p>
                                <p class="text-xs sm:text-sm font-semibold">${e.entity}</p>
                            </div>
                        </div>
                    `;
                });
                content.innerHTML = htmlStr;
                if (window.lucide) {
                    window.lucide.createIcons();
                }
            }
            
            document.getElementById('dayModal').classList.remove('hidden');
        }

        // --- NOTIFICHE PUSH ---
        let pushNotificationsEnabled = false;
        let lastNotifiedExpiredCount = 0;
        let lastNotifiedExpiringCount = 0;

        // Check if permission was already granted previously
        if ("Notification" in window && Notification.permission === "granted") {
            pushNotificationsEnabled = true;
        }
        // Aggiorna il pulsante dopo che il DOM è pronto (DOMContentLoaded potrebbe già essere scattato)
        setTimeout(updatePushButtonUI, 300);

        function updatePushButtonUI() {
            const btn = document.getElementById('pushStatusBtn');
            if(!btn) return;
            if (pushNotificationsEnabled) {
                btn.className = "hidden sm:flex items-center space-x-1.5 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-400 px-3 py-2 rounded-xl text-xs font-semibold border border-brand-200 dark:border-brand-800 hover:bg-brand-100 dark:hover:bg-brand-900/40 transition";
                btn.innerHTML = `<i data-lucide="bell-ring" class="w-4 h-4"></i><span>Push Attive</span>`;
            } else {
                btn.className = "hidden sm:flex items-center space-x-1.5 bg-slate-50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition";
                btn.innerHTML = `<i data-lucide="bell-off" class="w-4 h-4"></i><span>Push Off</span>`;
            }
            if(window.lucide) lucide.createIcons();
        }

        function togglePushNotifications() {
            if (!("Notification" in window)) {
                if (typeof showToast === 'function') showToast("Notifiche non supportate dal browser", "error");
                return;
            }

            // Se le push sono già attive → disattivale
            if (pushNotificationsEnabled) {
                pushNotificationsEnabled = false;
                updatePushButtonUI();
                if (typeof showToast === 'function') showToast("Notifiche Push disattivate", "info");
                return;
            }

            // Se il permesso è già concesso → riattiva direttamente senza richiedere di nuovo
            if (Notification.permission === "granted") {
                pushNotificationsEnabled = true;
                updatePushButtonUI();
                if (typeof showToast === 'function') showToast("Notifiche Push attivate!", "success");
                return;
            }

            // Permesso non ancora chiesto → chiedi al browser
            if (Notification.permission === "denied") {
                if (typeof showToast === 'function') showToast("Sblocca le notifiche dalle impostazioni di Chrome", "error");
                return;
            }

            Notification.requestPermission().then(function (permission) {
                if (permission === "granted") {
                    pushNotificationsEnabled = true;
                    updatePushButtonUI();
                    if (typeof showToast === 'function') showToast("Notifiche Push attivate!", "success");
                } else {
                    if (typeof showToast === 'function') showToast("Permesso negato dal browser", "error");
                }
            }).catch(function(e) {
                console.error("Push API error", e);
            });
        }

        function sendPushNotification(title, body) {
            if (pushNotificationsEnabled && Notification.permission === "granted") {
                try {
                    new Notification(title, { 
                        body: body, 
                        icon: 'logo-192.png'
                    });
                } catch(e) {
                    console.error("Push Notification error: ", e);
                }
            }
        }

        function testPushNotification() {
            const perm = ("Notification" in window) ? Notification.permission : "unsupported";
            
            // Se il permesso non è ancora stato chiesto, chiedilo e poi invia il test
            if (perm === "default") {
                Notification.requestPermission().then(function(p) {
                    if (p === "granted") {
                        pushNotificationsEnabled = true;
                        updatePushButtonUI();
                        _sendTestNotif();
                    } else {
                        if (typeof showToast === 'function') showToast("Permesso notifiche negato dal browser", "error");
                    }
                });
                return;
            }
            
            if (perm !== "granted") {
                if (typeof showToast === 'function') showToast("Notifiche bloccate. Sblocca dalle impostazioni di Chrome (🔒 accanto all'URL → Notifiche → Consenti)", "error");
                return;
            }
            
            _sendTestNotif();
        }

        function _sendTestNotif() {
            try {
                new Notification("🔔 Test — Gestionale Flotta VI.CLA", {
                    body: "Le notifiche Push funzionano correttamente! ✅",
                    icon: 'logo-192.png'
                });
                if (typeof showToast === 'function') showToast("✅ Notifica di test inviata! Controlla in basso a destra", "success");
            } catch(e) {
                if (typeof showToast === 'function') showToast("Errore: " + e.message, "error");
                console.error("Test Push error:", e);
            }
        }


        // Trigger UI update on load
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(updatePushButtonUI, 500);
            
            // Check time passage every 1 hour to recalculate states
            setInterval(() => {
                console.log("Periodic background check...");
                if(typeof updateStatsPanel === "function") updateStatsPanel();
                if(typeof renderVehicles === "function") renderVehicles();
                if(typeof renderOperators === "function") renderOperators();
            }, 60 * 60 * 1000);
        });

// --- STATO GLOBALIZZATO ---
        let vehicles = [];
        let operators = [];
        let activeTab = 'vehicles';
let isAudioEnabled = true;
        let isBannerDismissed = false;
        let visiblePins = {}; 
        let audioCtx = null;  
        let synthVoice = null; 
        let isDarkMode = false; 
        let showLogistics = true; 
        let warningThresholdDays = 30; 
        let confirmCallback = null;
        let selectedVehicleForRenew = null; 

        // GESTORE PIN DI SICUREZZA
        let masterPin = localStorage.getItem('fleet_master_pin_vicla') || ''; 
        let pinCallback = null; 
        let pinEntered = ''; 

        // STATO PER IL BLOCCO/SBLOCCO MANUALE
        let isPinProtectionActive = localStorage.getItem('fleet_pin_active_vicla') !== 'false';

        window.addEventListener('DOMContentLoaded', () => {
            loadTheme();
            loadSettingsFromStorage();
            loadLogisticsPreference();
            loadFromStorage();
            updateLockUI();
            lucide.createIcons();
            initVoiceSystem();
            renderTimeline();
            checkAndPlayAudioAlertsOnLoad();
            
            document.body.addEventListener('click', () => {
                if (audioCtx && audioCtx.state === 'suspended') {
                    audioCtx.resume();
                }
            }, { once: true });
        });

        function requirePin(callback) {
            if (!masterPin || !isPinProtectionActive) {
                callback();
                return;
            }
            pinCallback = callback;
            pinEntered = '';
            updatePinDots();
            document.getElementById('pinErrorText').classList.add('invisible');
            document.getElementById('pinVerifyModal').classList.remove('hidden');
        }

        function togglePinProtectionVisual() {
            if (!masterPin) {
                showToast("Nessun PIN Master impostato nelle impostazioni!", "warning");
                return;
            }

            if (isPinProtectionActive) {
                pinCallback = () => {
                    isPinProtectionActive = false;
                    localStorage.setItem('fleet_pin_active_vicla', 'false');
                    updateLockUI();
                    showToast("Protezione PIN disattivata. Modifiche libere.", "info");
                };
                pinEntered = '';
                updatePinDots();
                document.getElementById('pinErrorText').classList.add('invisible');
                document.getElementById('pinVerifyModal').classList.remove('hidden');
            } else {
                isPinProtectionActive = true;
                localStorage.setItem('fleet_pin_active_vicla', 'true');
                updateLockUI();
                showToast("Protezione PIN attivata. Modifiche bloccate.", "success");
            }
        }

        function updateLockUI() {
            const icon = document.getElementById('lockIcon');
            const btn = document.getElementById('lockStatusBtn');
            if (!icon || !btn) return;

            if (isPinProtectionActive) {
                icon.setAttribute('data-lucide', 'lock');
                icon.className = "w-4 h-4 text-red-500";
                btn.title = "PIN Attivo: Clicca per sbloccare le modifiche";
            } else {
                icon.setAttribute('data-lucide', 'lock-open');
                icon.className = "w-4 h-4 text-emerald-500";
                btn.title = "PIN Disattivato: Clicca per bloccare le modifiche";
            }
            if (typeof lucide !== 'undefined' && lucide.createIcons) {
                lucide.createIcons();
            }
        }

        function updatePinDots() {
            for (let i = 0; i < 4; i++) {
                const dot = document.getElementById(`dot-${i}`);
                if (i < pinEntered.length) {
                    dot.className = "w-5 h-5 rounded-full bg-brand-600 border-2 border-brand-600 flex items-center justify-center text-white";
                    dot.innerText = "•";
                } else {
                    dot.className = "w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center";
                    dot.innerText = "";
                }
            }
        }

        function pressPinKey(digit) {
            if (pinEntered.length < 4) {
                pinEntered += digit;
                updatePinDots();
                playBeep();
                
                if (pinEntered.length === 4) {
                    setTimeout(verifyPin, 180);
                }
            }
        }

        function verifyPin() {
            if (pinEntered === masterPin) {
                document.getElementById('pinVerifyModal').classList.add('hidden');
                showToast("Identità confermata. Operazione sbloccata!", "success");
                if (pinCallback) {
                    pinCallback();
                }
                pinCallback = null;
            } else {
                document.getElementById('pinErrorText').classList.remove('invisible');
                pinEntered = '';
                updatePinDots();
                playErrorBeep();
            }
        }

        function playErrorBeep() {
            try {
                if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                if (audioCtx.state === 'suspended') audioCtx.resume();
                
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(150, audioCtx.currentTime);
                gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
                osc.start();
                setTimeout(() => { osc.stop(); }, 250);
            } catch(e) {}
        }

        function clearPin() {
            pinEntered = '';
            updatePinDots();
        }

        function backspacePin() {
            if (pinEntered.length > 0) {
                pinEntered = pinEntered.slice(0, -1);
                updatePinDots();
            }
        }

        function cancelPinVerification() {
            document.getElementById('pinVerifyModal').classList.add('hidden');
            pinCallback = null;
            showToast("Sblocco annullato dall'utente.", "warning");
        }

        function toggleSettingsPinVisibility() {
            const input = document.getElementById('settingMasterPin');
            const icon = document.getElementById('toggleSettingsPinIcon');
            if (input.type === 'password') {
                input.type = 'text';
                icon.setAttribute('data-lucide', 'eye-off');
            } else {
                input.type = 'password';
                icon.setAttribute('data-lucide', 'eye');
            }
            lucide.createIcons();
        }

        function loadSettingsFromStorage() {
            const savedWarning = localStorage.getItem('fleet_warning_days_vicla');
            if (savedWarning) {
                warningThresholdDays = parseInt(savedWarning);
                document.getElementById('settingWarningDays').value = warningThresholdDays;
            }
            masterPin = localStorage.getItem('fleet_master_pin_vicla') || '';
            document.getElementById('settingMasterPin').value = masterPin;

            const savedChime = localStorage.getItem('fleet_chime_style_vicla');
            if (savedChime && document.getElementById('settingChimeStyle')) {
                document.getElementById('settingChimeStyle').value = savedChime;
            }

            activeVoiceGender = localStorage.getItem('fleet_voice_gender_vicla') || 'female';
            setVoiceGenderFilter(activeVoiceGender);

            updateThresholdLabels();

            const savedRate = localStorage.getItem('fleet_voice_rate_vicla');
            const savedPitch = localStorage.getItem('fleet_voice_pitch_vicla');
            if (savedRate && document.getElementById('settingVoiceRate')) {
                document.getElementById('settingVoiceRate').value = savedRate;
                document.getElementById('valRate').innerText = parseFloat(savedRate).toFixed(2) + 'x';
            }
            if (savedPitch && document.getElementById('settingVoicePitch')) {
                document.getElementById('settingVoicePitch').value = savedPitch;
                document.getElementById('valPitch').innerText = parseFloat(savedPitch).toFixed(2);
            }
        }

        function updateThresholdLabels() {
            document.querySelectorAll('.thresholdLabel').forEach(el => {
                el.innerText = warningThresholdDays;
            });
        }

        function openSettingsModal() {
            requirePin(() => {
                loadSettingsFromStorage();
                document.getElementById('settingsModal').classList.remove('hidden');
            });
        }

        function closeSettingsModal() {
            document.getElementById('settingsModal').classList.add('hidden');
        }

        function saveSettings() {
            const val = document.getElementById('settingWarningDays').value;
            warningThresholdDays = parseInt(val);
            localStorage.setItem('fleet_warning_days_vicla', warningThresholdDays);

            const pinVal = document.getElementById('settingMasterPin').value.trim();
            if (pinVal && !/^\d{4}$/.test(pinVal)) {
                showToast("Il PIN deve essere formato esattamente da 4 cifre numeriche!", "error");
                return;
            }

            masterPin = pinVal;
            localStorage.setItem('fleet_master_pin_vicla', masterPin);

            const chimeVal = document.getElementById('settingChimeStyle').value;
            localStorage.setItem('fleet_chime_style_vicla', chimeVal);

            const voiceVal = document.getElementById('settingVoiceSelect').value;
            if (voiceVal) {
                localStorage.setItem('fleet_voice_name_vicla', voiceVal);

            const rEl = document.getElementById('settingVoiceRate');
            const pEl = document.getElementById('settingVoicePitch');
            if (rEl) localStorage.setItem('fleet_voice_rate_vicla', rEl.value);
            if (pEl) localStorage.setItem('fleet_voice_pitch_vicla', pEl.value);

            }

            updateThresholdLabels();
            closeSettingsModal();
            showToast("Impostazioni salvate con successo!", "success");
            renderAll();
        }

        function openLicenseModal() {
            document.getElementById('licenseModal').classList.remove('hidden');
            lucide.createIcons();
        }

        function closeLicenseModal() {
            document.getElementById('licenseModal').classList.add('hidden');
        }

        function showCustomConfirm(title, message, callback) {
            document.getElementById('confirmTitle').innerText = title;
            document.getElementById('confirmMessage').innerText = message;
            confirmCallback = callback;
            document.getElementById('confirmModal').classList.remove('hidden');
        }

        function openPrintModal() {
            document.getElementById('printModal').classList.remove('hidden');
        }

        function closePrintModal() {
            document.getElementById('printModal').classList.add('hidden');
        }

        function closeConfirmModal(result) {
            document.getElementById('confirmModal').classList.add('hidden');
            if (result && confirmCallback) {
                confirmCallback();
            }
            confirmCallback = null;
        }

        function switchTab(tabName) {
            activeTab = tabName;
            const tabVehiclesBtn = document.getElementById('tabVehiclesBtn');
            const tabOperatorsBtn = document.getElementById('tabOperatorsBtn');
            const tabCalendarBtn = document.getElementById('tabCalendarBtn');
            const tabVehiclesContent = document.getElementById('tabVehiclesContent');
            const tabOperatorsContent = document.getElementById('tabOperatorsContent');
            const tabCalendarContent = document.getElementById('tabCalendarContent');
            const mainAddBtnText = document.getElementById('mainAddBtnText');
            
            const activeClasses = "flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition duration-200 bg-brand-600 text-white shadow-md";
            const inactiveClasses = "flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition duration-200 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800";

            if (tabVehiclesBtn) tabVehiclesBtn.className = tabName === 'vehicles' ? activeClasses : inactiveClasses;
            if (tabOperatorsBtn) tabOperatorsBtn.className = tabName === 'operators' ? activeClasses : inactiveClasses;
            if (tabCalendarBtn) tabCalendarBtn.className = tabName === 'calendar' ? activeClasses : inactiveClasses;

            if (tabName === 'vehicles') {
                if (tabVehiclesContent) tabVehiclesContent.classList.remove('hidden');
                if (tabOperatorsContent) tabOperatorsContent.classList.add('hidden');
                if (tabCalendarContent) tabCalendarContent.classList.add('hidden');
                if (mainAddBtnText) mainAddBtnText.innerText = "Nuovo Mezzo";
            } else if (tabName === 'operators') {
                if (tabVehiclesContent) tabVehiclesContent.classList.add('hidden');
                if (tabOperatorsContent) tabOperatorsContent.classList.remove('hidden');
                if (tabCalendarContent) tabCalendarContent.classList.add('hidden');
                if (mainAddBtnText) mainAddBtnText.innerText = "Nuova Card / Conducente";
            } else if (tabName === 'calendar') {
                if (tabVehiclesContent) tabVehiclesContent.classList.add('hidden');
                if (tabOperatorsContent) tabOperatorsContent.classList.add('hidden');
                if (tabCalendarContent) tabCalendarContent.classList.remove('hidden');
                renderCalendar();
            }
            if(tabName !== 'calendar') {
                applyFilters();
            }
        }

        function openAddModal() {
            if (activeTab === 'vehicles') {
                openModal();
            } else {
                openOperatorModal();
            }
        }

        function loadLogisticsPreference() {
            const savedLogistics = localStorage.getItem('fleet_manager_show_logistics_vicla');
            if (savedLogistics !== null) {
                showLogistics = savedLogistics === 'true';
            }
            updateLogisticsUI();
        }

        function toggleLogistics() {
            requirePin(() => {
                showLogistics = !showLogistics;
                localStorage.setItem('fleet_manager_show_logistics_vicla', showLogistics);
                updateLogisticsUI();
                applyFilters();
                showToast(showLogistics ? "Dati logistica visibili" : "Dati logistica nascosti", "info");
            });
        }

        function updateLogisticsUI() {
            const btn = document.getElementById('logisticsToggleBtn');
            const icon = document.getElementById('logisticsIcon');
            const text = document.getElementById('logisticsText');
            if (!btn || !icon || !text) return;

            if (showLogistics) {
                text.innerText = "Logistica Visibile";
                icon.setAttribute('data-lucide', 'eye');
                btn.className = "bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 text-sm px-3 py-2 rounded-xl transition flex items-center space-x-1.5 hover:bg-brand-100 dark:hover:bg-brand-900/40 font-semibold";
            } else {
                text.innerText = "Logistica Nascosta";
                icon.setAttribute('data-lucide', 'eye-off');
                btn.className = "bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm px-3 py-2 rounded-xl transition flex items-center space-x-1.5 font-semibold border dark:border-slate-600";
            }
            lucide.createIcons();
        }

        function loadTheme() {
            const savedTheme = localStorage.getItem('fleet_manager_theme_vicla');
            if (savedTheme === 'dark') {
                isDarkMode = true;
                document.documentElement.classList.add('dark');
                updateThemeUI();
            }
        }

        function toggleTheme() {
            isDarkMode = !isDarkMode;
            const htmlEl = document.documentElement;
            if (isDarkMode) {
                htmlEl.classList.add('dark');
                localStorage.setItem('fleet_manager_theme_vicla', 'dark');
                showToast("Visione notturna attiva 🌙", "info");
            } else {
                htmlEl.classList.remove('dark');
                localStorage.setItem('fleet_manager_theme_vicla', 'light');
                showToast("Visione diurna attiva ☀️", "info");
            }
            updateThemeUI();
            applyFilters();
        }

        function updateThemeUI() {
            const themeBtn = document.getElementById('themeToggleBtn');
            const themeIcon = document.getElementById('themeIcon');
            if (!themeBtn || !themeIcon) return;

            if (isDarkMode) {
                themeBtn.title = "Attiva Visione Diurna";
                themeIcon.setAttribute('data-lucide', 'sun');
            } else {
                themeBtn.title = "Attiva Visione Notturna";
                themeIcon.setAttribute('data-lucide', 'moon');
            }
            lucide.createIcons();
        }


        let activeVoiceGender = localStorage.getItem('fleet_voice_gender_vicla') || 'female';

        function setVoiceGenderFilter(gender) {
            activeVoiceGender = gender;
            localStorage.setItem('fleet_voice_gender_vicla', gender);

            const btnF = document.getElementById('btnVoiceFemale');
            const btnM = document.getElementById('btnVoiceMale');
            const btnA = document.getElementById('btnVoiceAll');

            const activeClass = "py-1 px-2 text-[11px] font-bold rounded-lg transition bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-300 shadow-sm";
            const inactiveClass = "py-1 px-2 text-[11px] font-bold rounded-lg transition text-slate-600 dark:text-slate-300 hover:text-slate-900";

            if (btnF) btnF.className = gender === 'female' ? activeClass : inactiveClass;
            if (btnM) btnM.className = gender === 'male' ? activeClass : inactiveClass;
            if (btnA) btnA.className = gender === 'all' ? activeClass : inactiveClass;

            initVoiceSystem();
        }

        function getActiveChimeStyle() {
            const selectEl = document.getElementById('settingChimeStyle');
            const settingsModal = document.getElementById('settingsModal');
            // If settings modal is open, use the live select choice!
            if (selectEl && selectEl.value && settingsModal && !settingsModal.classList.contains('hidden')) {
                return selectEl.value;
            }
            const saved = localStorage.getItem('fleet_chime_style_vicla');
            if (saved) return saved;
            if (selectEl && selectEl.value) return selectEl.value;
            return 'chime';
        }

        function playChime(callback, requestedStyle) {
            let doneCb = typeof callback === 'function' ? callback : null;
            let style = typeof requestedStyle === 'string' ? requestedStyle : (typeof callback === 'string' ? callback : null);

            try {
                const chimeStyle = style || getActiveChimeStyle();

                if (chimeStyle === 'none') {
                    if (doneCb) doneCb();
                    return;
                }

                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (!AudioCtx) {
                    if (doneCb) doneCb();
                    return;
                }
                const ctx = new AudioCtx();
                if (ctx.state === 'suspended') {
                    ctx.resume();
                }

                const now = ctx.currentTime;

                if (chimeStyle === 'beep') {
                    // Crisp Loud 880Hz Beep at High Volume!
                    const duration = 0.16;
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(880, now);
                    gain.gain.setValueAtTime(0.85, now);
                    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(now);
                    osc.stop(now + duration);

                    setTimeout(() => {
                        try { ctx.close(); } catch(e) {}
                        if (doneCb) doneCb();
                    }, 180);

                } else if (chimeStyle === 'bell') {
                    // High Crystal Double Bell (1200Hz -> 1800Hz) at High Volume!
                    const duration = 0.35;
                    const osc1 = ctx.createOscillator();
                    const osc2 = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc1.type = 'sine';
                    osc2.type = 'sine';
                    osc1.frequency.setValueAtTime(1200, now);
                    osc2.frequency.setValueAtTime(1800, now + 0.12);
                    gain.gain.setValueAtTime(0.85, now);
                    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
                    osc1.connect(gain);
                    osc2.connect(gain);
                    gain.connect(ctx.destination);
                    osc1.start(now);
                    osc2.start(now + 0.12);
                    osc1.stop(now + duration);
                    osc2.stop(now + duration);

                    setTimeout(() => {
                        try { ctx.close(); } catch(e) {}
                        if (doneCb) doneCb();
                    }, 380);

                } else {
                    // Soft Harmonic Chime Chord (523Hz -> 659Hz -> 784Hz) at High Volume!
                    const duration = 0.40;
                    const freqs = [523.25, 659.25, 783.99];
                    const masterGain = ctx.createGain();
                    masterGain.gain.setValueAtTime(0.80, now);
                    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
                    masterGain.connect(ctx.destination);

                    freqs.forEach((freq, idx) => {
                        const osc = ctx.createOscillator();
                        osc.type = 'sine';
                        osc.frequency.setValueAtTime(freq, now + (idx * 0.05));
                        osc.connect(masterGain);
                        osc.start(now + (idx * 0.05));
                        osc.stop(now + duration);
                    });

                    setTimeout(() => {
                        try { ctx.close(); } catch(e) {}
                        if (doneCb) doneCb();
                    }, 430);
                }

            } catch (e) {
                if (doneCb) doneCb();
            }
        }

        const MALE_VOICE_KEYWORDS = ['diego', 'cosimo', 'giorgio', 'adriano', 'calogero', 'mario', 'giuseppe', 'vittorio', 'luca'];

        function isVoiceMale(voice) {
            if (!voice || !voice.name) return false;
            const n = voice.name.toLowerCase();
            return MALE_VOICE_KEYWORDS.some(m => n.includes(m));
        }

        
        function getActiveVoiceParams() {
            let rate = 1.0;
            let pitch = 1.0;
            const isMale = synthVoice ? isVoiceMale(synthVoice) : false;
            
            // Impostiamo default ottimali per le voci maschili standard di Windows
            let defaultRate = isMale ? 1.05 : 1.0;
            let defaultPitch = isMale ? 0.90 : 1.0;

            const modal = document.getElementById('settingsModal');
            if (modal && !modal.classList.contains('hidden')) {
                const r = document.getElementById('settingVoiceRate');
                const p = document.getElementById('settingVoicePitch');
                if (r) rate = parseFloat(r.value);
                if (p) pitch = parseFloat(p.value);
            } else {
                const savedRate = localStorage.getItem('fleet_voice_rate_vicla');
                const savedPitch = localStorage.getItem('fleet_voice_pitch_vicla');
                rate = savedRate ? parseFloat(savedRate) : defaultRate;
                pitch = savedPitch ? parseFloat(savedPitch) : defaultPitch;
            }
            return { rate, pitch };
        }

        function initVoiceSystem() {
            if (!('speechSynthesis' in window)) return;
            const loadVoices = () => {
                const voices = window.speechSynthesis.getVoices();
                const italianVoices = voices.filter(v => v.lang.startsWith('it'));

                let filteredVoices = [];
                if (activeVoiceGender === 'female') {
                    filteredVoices = italianVoices.filter(v => !isVoiceMale(v));
                    if (filteredVoices.length === 0) filteredVoices = italianVoices;
                } else if (activeVoiceGender === 'male') {
                    filteredVoices = italianVoices.filter(v => isVoiceMale(v));
                    if (filteredVoices.length === 0) filteredVoices = italianVoices;
                } else {
                    filteredVoices = italianVoices;
                }

                // Sort: Neural / Natural HD voices first!
                filteredVoices.sort((a, b) => {
                    const aNat = a.name.includes('Natural') || a.name.includes('Neural') || a.name.includes('Online');
                    const bNat = b.name.includes('Natural') || b.name.includes('Neural') || b.name.includes('Online');
                    if (aNat && !bNat) return -1;
                    if (!aNat && bNat) return 1;
                    return a.name.localeCompare(b.name);
                });

                // Update section title dynamically
                const labelEl = document.getElementById('lblVoiceSectionTitle');
                if (labelEl) {
                    if (activeVoiceGender === 'male') {
                        labelEl.innerHTML = `<i data-lucide="volume-2" class="w-3.5 h-3.5 text-brand-500"></i> Voci Maschili Disponibili`;
                    } else if (activeVoiceGender === 'female') {
                        labelEl.innerHTML = `<i data-lucide="volume-2" class="w-3.5 h-3.5 text-brand-500"></i> Voci Femminili Disponibili`;
                    } else {
                        labelEl.innerHTML = `<i data-lucide="volume-2" class="w-3.5 h-3.5 text-brand-500"></i> Tutte le Voci dell'Assistente`;
                    }
                    if (typeof lucide !== 'undefined') lucide.createIcons();
                }

                const selectEl = document.getElementById('settingVoiceSelect');
                if (selectEl) {
                    selectEl.innerHTML = '';
                    filteredVoices.forEach((v) => {
                        const opt = document.createElement('option');
                        opt.value = v.name;
                        const isMale = isVoiceMale(v);
                        const isNatural = v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Online');
                        
                        let tag = isMale ? '👨 Maschile' : '👩 Femminile';
                        if (isNatural) tag += ' ⭐ HD Natural';
                        
                        opt.textContent = `${v.name} (${tag})`;
                        selectEl.appendChild(opt);
                    });

                    const savedVoiceName = localStorage.getItem('fleet_voice_name_vicla');
                    if (savedVoiceName && filteredVoices.some(v => v.name === savedVoiceName)) {
                        selectEl.value = savedVoiceName;
                    }
                }

                const savedVoiceName = localStorage.getItem('fleet_voice_name_vicla');
                if (savedVoiceName && filteredVoices.some(v => v.name === savedVoiceName)) {
                    synthVoice = filteredVoices.find(v => v.name === savedVoiceName);
                } else {
                    synthVoice = filteredVoices.find(v => v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Online')) || filteredVoices[0] || null;
                }
            };

            if (window.speechSynthesis.onvoiceschanged !== undefined) {
                window.speechSynthesis.onvoiceschanged = loadVoices;
            }
            loadVoices();
        }

        function speakText(text) {
            if (!isAudioEnabled || !('speechSynthesis' in window)) return;
            window.speechSynthesis.cancel();
            
            playChime(() => {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'it-IT';
                if (synthVoice) {
                    utterance.voice = synthVoice;
                }
                const params = getActiveVoiceParams();
                utterance.rate = params.rate;
                utterance.pitch = params.pitch;
                window.speechSynthesis.speak(utterance);
            });
        }

                function onVoiceDropdownChange() {
            const selectEl = document.getElementById('settingVoiceSelect');
            if (selectEl && selectEl.value) {
                const voices = window.speechSynthesis.getVoices();
                synthVoice = voices.find(v => v.name === selectEl.value) || synthVoice;
                
                const isMale = isVoiceMale(synthVoice);
                const rEl = document.getElementById('settingVoiceRate');
                const pEl = document.getElementById('settingVoicePitch');
                if (rEl && pEl) {
                    if (isMale) {
                        rEl.value = 1.05; document.getElementById('valRate').innerText = "1.05x";
                        pEl.value = 0.90; document.getElementById('valPitch').innerText = "0.90";
                    } else {
                        rEl.value = 1.00; document.getElementById('valRate').innerText = "1.00x";
                        pEl.value = 1.00; document.getElementById('valPitch').innerText = "1.00";
                    }
                }
            }
            testVoiceSynthesis();
        }

        function testVoiceSynthesis() {
            const selectEl = document.getElementById('settingVoiceSelect');
            if (selectEl && selectEl.value) {
                const voices = window.speechSynthesis.getVoices();
                synthVoice = voices.find(v => v.name === selectEl.value) || synthVoice;
                localStorage.setItem('fleet_voice_name_vicla', selectEl.value);
            }
            
            const isMale = isVoiceMale(synthVoice);
            const msg = isMale ? 
                "Ciao! Questa è la voce maschile selezionata per l'assistente vocale di GC CodeLab Fleet Control." : 
                "Ciao! Questa è la voce femminile selezionata per l'assistente vocale di GC CodeLab Fleet Control.";
                
            speakText(msg);
        }

        function speakDeadlines() {
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
                return;
            }
            let expiredVehicles = [];
            let expiringVehicles = [];
            vehicles.forEach(v => {
                for (let k in v.deadlines) {
                    if (k !== 'altroNota' && v.deadlines[k]) {
                        const state = checkDeadlineState(v.deadlines[k]);
                        const friendlyName = getDeadlineFriendlyName(k);
                        if (state === 'red') expiredVehicles.push(`il mezzo ${v.plate} ha la scadenza di ${friendlyName} già scaduta`);
                        else if (state === 'amber') expiringVehicles.push(`il mezzo ${v.plate} ha la scadenza di ${friendlyName} in arrivo`);
                    }
                }
            });
            operators.forEach(op => {
                if (op.type === 'driver') {
                    if (op.expiration) {
                        const state = checkDeadlineState(op.expiration);
                        if (state === 'red') expiredVehicles.push(`la card del conducente ${op.name} è scaduta`);
                        else if (state === 'amber') expiringVehicles.push(`la card del conducente ${op.name} è in scadenza`);
                    }
                    if (op.lastDownload) {
                        const nextDl = calculateNextDownloadDate(op.lastDownload);
                        const state = checkDeadlineState(nextDl);
                        if (state === 'red') expiredVehicles.push(`lo scarico dati per ${op.name} è scaduto`);
                        else if (state === 'amber') expiringVehicles.push(`lo scarico dati per ${op.name} è in scadenza`);
                    }
                }
            });
            if (expiredVehicles.length === 0 && expiringVehicles.length === 0) {
                speakText("Tutte le scadenze ed i mezzi della flotta sono perfettamente in regola.");
                return;
            }
            let msg = `Attenzione, riepilogo scadenze flotta. `;
            if (expiredVehicles.length > 0) {
                msg += `Ci sono ${expiredVehicles.length} scadenze già superate. ` + expiredVehicles.slice(0, 3).join(', ') + '. ';
            }
            if (expiringVehicles.length > 0) {
                msg += `Inoltre ci sono ${expiringVehicles.length} scadenze imminenti. ` + expiringVehicles.slice(0, 3).join(', ') + '.';
            }
            speakText(msg);
        }

        function toggleAudioSystem() {
            isAudioEnabled = !isAudioEnabled;
            const btn = document.getElementById('audioStatusBtn');
            if (btn) {
                if (isAudioEnabled) {
                    btn.innerHTML = `<i data-lucide="volume-2" class="w-4 h-4"></i><span>Audio Attivo</span>`;
                    btn.className = "hidden sm:flex items-center space-x-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-3 py-2 rounded-xl text-xs font-semibold border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition";
                    showToast("Audio assistente attivato", "info");
                } else {
                    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                    btn.innerHTML = `<i data-lucide="volume-x" class="w-4 h-4"></i><span>Audio Disattivato</span>`;
                    btn.className = "hidden sm:flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-600 transition";
                    showToast("Audio assistente disattivato", "info");
                }
                lucide.createIcons();
            }
        }

        let isFirebaseLoaded = false;
        function loadFromStorage() {
            // First load from local storage to show UI quickly without blank screen
            if (!isFirebaseLoaded) {
                const storedVehicles = localStorage.getItem('fleet_manager_data_vicla');
                const storedOperators = localStorage.getItem('fleet_manager_operators_vicla');

                let parsedV = null;
                let parsedOp = null;

                try { if (storedVehicles) parsedV = JSON.parse(storedVehicles); } catch(e) {}
                try { if (storedOperators) parsedOp = JSON.parse(storedOperators); } catch(e) {}

                if (Array.isArray(parsedV) && parsedV.length > 0) {
                    vehicles = parsedV;
                } else {
                    vehicles = JSON.parse(JSON.stringify(DEMO_VEHICLES));
                }

                if (Array.isArray(parsedOp) && parsedOp.length > 0) {
                    operators = parsedOp;
                } else {
                    operators = JSON.parse(JSON.stringify(DEMO_OPERATORS));
                }

                document.getElementById('badgeVehiclesCount').innerText = vehicles.length;
                document.getElementById('badgeOperatorsCount').innerText = operators.length;
                applyFilters();
            }

            // Setup Firebase listeners
            if (!window.firebaseInitialized) {
                window.firebaseInitialized = true;
                
                db.collection('vicla_data').doc('vehicles').onSnapshot(doc => {
                    if (doc.exists && doc.data().data) {
                        vehicles = doc.data().data;
                        isFirebaseLoaded = true;
                        localStorage.setItem('fleet_manager_data_vicla', JSON.stringify(vehicles));
                        document.getElementById('badgeVehiclesCount').innerText = vehicles.length;
                        applyFilters();
                    } else if (!doc.exists) {
                        saveToStorage(); // Seed database if it's empty
                    }
                }, error => console.error("Firebase listen error:", error));

                db.collection('vicla_data').doc('operators').onSnapshot(doc => {
                    if (doc.exists && doc.data().data) {
                        operators = doc.data().data;
                        isFirebaseLoaded = true;
                        localStorage.setItem('fleet_manager_operators_vicla', JSON.stringify(operators));
                        document.getElementById('badgeOperatorsCount').innerText = operators.length;
                        applyFilters();
                    } else if (!doc.exists) {
                        saveToStorage();
                    }
                }, error => console.error("Firebase listen error:", error));
            }
        }

        function generatePrintout() {
            const printTarget = document.getElementById('printTarget').value;
            const printStatus = document.getElementById('printStatus').value;
            const includeLogistics = document.getElementById('printIncludeLogistics').checked;

            let selectedVehicles = [];
            let selectedOperators = [];

            if (printTarget === 'all' || printTarget === 'vehicles') {
                selectedVehicles = vehicles.filter(v => {
                    const status = getVehicleOverallStatus(v);
                    if (printStatus === 'expired') return status === 'red';
                    if (printStatus === 'expiring') return status === 'amber';
                    if (printStatus === 'problematic') return (status === 'red' || status === 'amber');
                    if (printStatus === 'ok') return status === 'emerald';
                    return true;
                });
            }

            if (printTarget === 'all' || printTarget === 'operators') {
                selectedOperators = operators.filter(op => {
                    const opState = getOperatorOverallStatus(op);
                    if (printStatus === 'expired') return opState === 'red';
                    if (printStatus === 'expiring') return opState === 'amber';
                    if (printStatus === 'problematic') return (opState === 'red' || opState === 'amber');
                    if (printStatus === 'ok') return opState === 'emerald';
                    return true;
                });
            }

            if (selectedVehicles.length === 0 && selectedOperators.length === 0) {
                showToast("Nessuna risorsa corrisponde ai filtri di stampa scelti!", "warning");
                return;
            }

            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                showToast("Sblocca i pop-up del browser per stampare", "error");
                return;
            }

            const currentLocalDate = new Date().toLocaleDateString('it-IT', {
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });

            let htmlContent = `
            <!DOCTYPE html>
            <html lang="it">
            <head>
                <meta charset="UTF-8">
                <title>Report Flotta - VI.CLA FUTURE S.R.L.</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                        color: #1e293b;
                        line-height: 1.4;
                        margin: 20px;
                        font-size: 12px;
                    }
                    .header {
                        border-bottom: 2px solid #2563eb;
                        padding-bottom: 12px;
                        margin-bottom: 20px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .header h1 {
                        font-size: 20px;
                        color: #1e3a8a;
                        margin: 0;
                        font-weight: 800;
                    }
                    .header p {
                        margin: 4px 0 0 0;
                        color: #475569;
                        font-size: 11px;
                        font-weight: 600;
                    }
                    .company-details {
                        font-size: 10px;
                        color: #64748b;
                        margin-top: 2px;
                        line-height: 1.3;
                    }
                    .section-title {
                        font-size: 14px;
                        font-weight: bold;
                        color: #1e3a8a;
                        border-bottom: 1px solid #e2e8f0;
                        padding-bottom: 6px;
                        margin-top: 25px;
                        margin-bottom: 10px;
                        text-transform: uppercase;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                    }
                    tr {
                        page-break-inside: avoid;
                    }
                    th {
                        background-color: #f8fafc;
                        border: 1px solid #cbd5e1;
                        padding: 8px;
                        text-align: left;
                        font-weight: bold;
                        font-size: 10px;
                        text-transform: uppercase;
                        color: #475569;
                    }
                    td {
                        border: 1px solid #e2e8f0;
                        padding: 8px;
                        vertical-align: top;
                    }
                    .badge {
                        display: inline-block;
                        padding: 2px 6px;
                        border-radius: 4px;
                        font-size: 9px;
                        font-weight: bold;
                    }
                    .badge-red { background-color: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
                    .badge-amber { background-color: #fef3c7; color: #92400e; border: 1px solid #fcd34d; }
                    .badge-emerald { background-color: #d1fae5; color: #065f46; border: 1px solid #6ee7b7; }
                    .plate-box {
                        font-family: monospace;
                        font-weight: bold;
                        background: #f1f5f9;
                        padding: 2px 4px;
                        border: 1px solid #cbd5e1;
                        border-radius: 4px;
                    }
                    .grid-mini {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 6px;
                    }
                    .deadline-item {
                        margin-bottom: 3px;
                        font-size: 11px;
                    }
                    .text-right { text-align: right; }
                    .text-muted { color: #64748b; font-size: 10px; }
                    .footer {
                        margin-top: 40px;
                        border-top: 1px solid #e2e8f0;
                        padding-top: 10px;
                        text-align: center;
                        font-size: 10px;
                        color: #94a3b8;
                    }
                    @media print {
                        body { margin: 10px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>
                        <h1>VI.CLA FUTURE S.R.L.</h1>
                        <p>Report Scadenziario di Conformità Parco Mezzi d'Opera & Conducenti</p>
                        <div class="company-details">
                            <strong>Sede Legale:</strong> Viale Michelangelo n. 33 - 80129 Napoli (NA)<br>
                            <strong>Sede Operativa:</strong> Strada Consortile, s.n.c. Condominio Sviluppo - 81032 Carinaro (CE)
                        </div>
                    </div>
                    <div class="text-right">
                        <strong>Generato il:</strong> ${currentLocalDate}<br>
                        <span class="text-muted">Filtro Stato: ${printStatus.toUpperCase()}</span>
                    </div>
                </div>
            `;

            if (selectedVehicles.length > 0) {
                htmlContent += `<div class="section-title">Flotta Automezzi d'Opera (${selectedVehicles.length})</div>`;
                htmlContent += `
                <table>
                    <thead>
                        <tr>
                            <th style="width: 15%">Targa e Modello</th>
                            ${includeLogistics ? '<th style="width: 25%">Dati Logistici e Servizi</th>' : ''}
                            <th style="width: 60%">Scadenziario Tecnico e Fiscale</th>
                        </tr>
                    </thead>
                    <tbody>
                `;

                selectedVehicles.forEach(v => {
                    const status = getVehicleOverallStatus(v);
                    let badgeClass = "badge-emerald";
                    let badgeLabel = "IN REGOLA";
                    if (status === 'red') { badgeClass = "badge-red"; badgeLabel = "CRITICO / SCADUTO"; }
                    else if (status === 'amber') { badgeClass = "badge-amber"; badgeLabel = "ATTENZIONE"; }

                    let logisticsHTML = '';
                    if (includeLogistics) {
                        logisticsHTML = `
                            <td>
                                <div><strong>Telepass:</strong> ${v.telepass || 'Nessuno'}</div>
                                <div style="margin-top: 6px; font-size: 10px;">
                                    <strong>Carte Carburante:</strong><br>
                                    ${v.cards?.card1?.num && v.cards.card1.num !== 'Nessuna' ? `• DKV: ${v.cards.card1.num} (PIN: ${v.cards.card1.pin || 'Nessuno'})<br>` : ''}
                                    ${v.cards?.card2?.num && v.cards.card2.num !== 'Nessuna' ? `• Q8: ${v.cards.card2.num} (PIN: ${v.cards.card2.pin || 'Nessuno'})<br>` : ''}
                                    ${v.cards?.card3?.num && v.cards.card3.num !== 'Nessuna' ? `• Tamoil: ${v.cards.card3.num} (PIN: ${v.cards.card3.pin || 'Nessuno'})` : ''}
                                </div>
                            </td>
                        `;
                    }

                    let deadlinesHTML = '<div class="grid-mini">';
                    const dlKeys = [
                        { key: 'revision', label: 'Revisione' },
                        { key: 'tachimetro', label: 'Rev. Tachigrafo' },
                        { key: 'scaricoTachigrafo', label: 'Scarico Dati' },
                        { key: 'assicurazione', label: 'Assicurazione' },
                        { key: 'gru', label: 'Revisione Gru' },
                        { key: 'gruStrutturale', label: 'Ventennale Gru' },
                        { key: 'tassaPossesso', label: 'Bollo' },
                        { key: 'altro', label: v.deadlines.altroNota || 'Altro' }
                    ];

                    dlKeys.forEach(dl => {
                        const dateVal = v.deadlines[dl.key];
                        if (dateVal) {
                            const state = checkDeadlineState(dateVal);
                            let stateBadge = "badge-emerald";
                            if (state === 'red') stateBadge = "badge-red";
                            else if (state === 'amber') stateBadge = "badge-amber";

                            deadlinesHTML += `
                                <div class="deadline-item">
                                    <strong>${dl.label}:</strong> 
                                    <span class="badge ${stateBadge}">${formatDateString(dateVal)}</span>
                                </div>
                            `;
                        }
                    });
                    deadlinesHTML += '</div>';

                    htmlContent += `
                        <tr>
                            <td>
                                <span class="plate-box">${v.plate}</span>
                                <div style="margin-top:6px; font-weight:bold;">${v.model}</div>
                                <div style="font-size:10px; color:#64748b; margin-top:2px;">Portata: ${v.payload ? v.payload + ' Kg' : 'N/D'}</div>
                                <div style="margin-top:6px;"><span class="badge ${badgeClass}">${badgeLabel}</span></div>
                            </td>
                            ${logisticsHTML}
                            <td>${deadlinesHTML}</td>
                        </tr>
                    `;
                });

                htmlContent += `</tbody></table>`;
            }

            if (selectedOperators.length > 0) {
                htmlContent += `<div class="section-title">Card Tachigrafiche & Conducenti Connessi (${selectedOperators.length})</div>`;
                htmlContent += `
                <table>
                    <thead>
                        <tr>
                            <th style="width: 25%">Nominativo Risorsa</th>
                            <th style="width: 20%">Tipo Tessera</th>
                            <th style="width: 20%">Numero Card</th>
                            <th style="width: 35%">Scadenze di Conformità</th>
                        </tr>
                    </thead>
                    <tbody>
                `;

                selectedOperators.forEach(op => {
                    const opState = getOperatorOverallStatus(op);
                    let badgeClass = "badge-emerald";
                    if (opState === 'red') badgeClass = "badge-red";
                    else if (opState === 'amber') badgeClass = "badge-amber";

                    const tipoCard = op.type === 'company' ? 'Card Aziendale' : (op.type === 'vehicle_company' ? 'Scarico Dati Mezzi' : 'Carta del Conducente');

                    let scadenzeHTML = "";
                    if (op.type === 'driver') {
                        const expState = checkDeadlineState(op.expiration);
                        const dlState = checkDownloadDeadlineState(op.lastDownload);
                        
                        let expBadge = expState === 'red' ? 'badge-red' : (expState === 'amber' ? 'badge-amber' : 'badge-emerald');
                        let dlBadge = dlState === 'red' ? 'badge-red' : (dlState === 'amber' ? 'badge-amber' : 'badge-emerald');

                        scadenzeHTML = `
                            <div>Validità Card (5 Anni): <span class="badge ${expBadge}">${formatDateString(op.expiration)}</span></div>
                            <div style="margin-top: 4px;">Scarico Dati (28gg): <span class="badge ${dlBadge}">${formatDateString(calculateNextDownloadDate(op.lastDownload))}</span></div>
                        `;
                    } else {
                        scadenzeHTML = `<div>Scarico Obbligatorio: <span class="badge ${badgeClass}">${formatDateString(op.expiration)}</span></div>`;
                    }

                    htmlContent += `
                        <tr>
                            <td><strong>${op.name}</strong></td>
                            <td>${tipoCard}</td>
                            <td style="font-family:monospace; font-weight:bold;">${op.cardNum}</td>
                            <td>${scadenzeHTML}</td>
                        </tr>
                    `;
                });

                htmlContent += `</tbody></table>`;
            }

            htmlContent += `
                <div class="footer">
                    Documento interno di conformità generato per uso organizzativo di VI.CLA FUTURE S.R.L.
                </div>
                <script>
                    window.onload = function() {
                        window.print();
                        setTimeout(function() { window.close(); }, 500);
                    }
                '</' + 'script>'
            </body>
            </html>
            `;

            printWindow.document.write(htmlContent);
            printWindow.document.close();
            closePrintModal();
            showToast("Report di stampa inviato con successo!", "success");
        }

        function saveToStorage() {
            localStorage.setItem('fleet_manager_data_vicla', JSON.stringify(vehicles));
            localStorage.setItem('fleet_manager_operators_vicla', JSON.stringify(operators));
            
            try {
                db.collection('vicla_data').doc('vehicles').set({ data: vehicles }).catch(console.error);
                db.collection('vicla_data').doc('operators').set({ data: operators }).catch(console.error);
            } catch(e) {
                console.error("Firebase write error:", e);
            }

            document.getElementById('badgeVehiclesCount').innerText = vehicles.length;
            document.getElementById('badgeOperatorsCount').innerText = operators.length;
        }

        function checkDeadlineState(dateString) {
            if (!dateString) return 'none';
            const today = new Date();
            today.setHours(0,0,0,0);
            const deadlineDate = new Date(dateString);
            deadlineDate.setHours(0,0,0,0);
            
            const diffTime = deadlineDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays < 0) return 'red'; 
            else if (diffDays <= warningThresholdDays) return 'amber'; 
            else return 'emerald'; 
        }

        function calculateNextDownloadDate(lastDownloadStr) {
            if (!lastDownloadStr) return '';
            const lastDownload = new Date(lastDownloadStr);
            lastDownload.setDate(lastDownload.getDate() + 28);
            return lastDownload.toISOString().split('T')[0];
        }

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

        function getVehicleOverallStatus(vehicle) {
            let statuses = [];
            for (let d in vehicle.deadlines) {
                if (d !== 'altroNota' && vehicle.deadlines[d]) {
                    statuses.push(checkDeadlineState(vehicle.deadlines[d]));
                }
            }
            if (statuses.includes('red')) return 'red';
            if (statuses.includes('amber')) return 'amber';
            if (statuses.length === 0) return 'none';
            return 'emerald';
        }

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

        function filterByStatusStat(status) {
            const statusFilter = document.getElementById('statusFilter');
            if (statusFilter) {
                statusFilter.value = status;
                applyFilters();
                showToast(`Filtrato per stato: ${status === 'expired' ? 'Scaduti' : (status === 'expiring' ? 'In Scadenza' : 'In Regola')}`, 'info');
            }
        }

        function applyFilters() {
            if (activeTab === 'vehicles') {
                renderVehicles();
            } else {
                renderOperators();
            }
            renderTimeline();
            updateStatsPanel();
        }

        function renderVehicles() {
            const container = document.getElementById('vehiclesContainer');
            const emptyState = document.getElementById('emptyState');
            
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const statusFilter = document.getElementById('statusFilter').value;
            const sortFilter = document.getElementById('sortFilter').value;

            let filtered = vehicles.filter(v => {
                const textMatch = 
                    v.plate.toLowerCase().includes(searchTerm) || 
                    v.model.toLowerCase().includes(searchTerm) || 
                    (v.telepass && v.telepass.toLowerCase().includes(searchTerm)) ||
                    (v.cards?.card1?.num && v.cards.card1.num.toLowerCase().includes(searchTerm));

                let statusMatch = true;
                if (statusFilter !== 'all') {
                    let hasRed = false;
                    let hasAmber = false;
                    let hasAnyDeadline = false;

                    for (let key in v.deadlines) {
                        if (key !== 'altroNota' && v.deadlines[key]) {
                            hasAnyDeadline = true;
                            const state = checkDeadlineState(v.deadlines[key]);
                            if (state === 'red') hasRed = true;
                            if (state === 'amber') hasAmber = true;
                        }
                    }

                    if (statusFilter === 'expired') {
                        statusMatch = hasRed; 
                    } else if (statusFilter === 'expiring') {
                        statusMatch = hasAmber; 
                    } else if (statusFilter === 'ok') {
                        statusMatch = (!hasRed && !hasAmber && hasAnyDeadline); 
                    }
                }
                
                return textMatch && statusMatch;
            });

            if (sortFilter === 'name') {
                filtered.sort((a, b) => a.plate.localeCompare(b.plate));
            } else if (sortFilter === 'severity') {
                const getWeight = (v) => {
                    const status = getVehicleOverallStatus(v);
                    if (status === 'red') return 3;
                    if (status === 'amber') return 2;
                    if (status === 'emerald') return 1;
                    return 0;
                };
                filtered.sort((a, b) => getWeight(b) - getWeight(a));
            }

            if (filtered.length === 0) {
                container.innerHTML = '';
                emptyState.classList.remove('hidden');
                return;
            }

            emptyState.classList.add('hidden');

            container.innerHTML = filtered.map((v, index) => {
                const overallStatus = getVehicleOverallStatus(v);
                let borderClass = "border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-500";
                if (overallStatus === 'red') {
                    borderClass = "border-red-400 dark:border-red-800/80 bg-red-50/10 dark:bg-red-950/10 hover:border-red-500 shadow-sm shadow-red-500/5 glow-red";
                } else if (overallStatus === 'amber') {
                    borderClass = "border-amber-300 dark:border-amber-700/80 bg-amber-50/10 dark:bg-amber-950/10 hover:border-amber-400 glow-amber";
                }

                const payloadHTML = showLogistics ? `
                    <span class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1 font-semibold">
                        <i data-lucide="scale" class="w-3.5 h-3.5 text-slate-400"></i> Portata utile: <strong class="text-slate-700 dark:text-slate-300">${v.payload ? v.payload + ' Kg' : 'Non specificata'}</strong>
                    </span>
                ` : '';

                let colSpanLogistics = showLogistics ? 'lg:col-span-4' : 'hidden';
                let colSpanDeadlines = showLogistics ? 'lg:col-span-8' : 'lg:col-span-12';
                let gridColsDeadlines = showLogistics ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

                return `
                    <div class="bg-white dark:bg-slate-800 rounded-2xl border-2 ${borderClass} p-5 shadow-sm transition duration-150 relative">
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
                            <div class="flex items-center space-x-3">
                                <div class="text-sm font-black text-slate-300 dark:text-slate-600">#${index + 1}</div>
                                <div class="bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-extrabold px-3 py-1.5 rounded-lg text-lg tracking-wider border border-brand-200/40 dark:border-brand-800/60 shadow-sm uppercase">
                                    ${v.plate}
                                </div>
                                <div>
                                    <h4 class="font-bold text-slate-900 dark:text-white text-base">${v.model}</h4>
                                    ${payloadHTML}
                                </div>
                            </div>

                            <div class="flex items-center space-x-1.5 w-full sm:w-auto justify-end">
                                <button onclick="quickRenewDialog('${v.id}')" class="text-xs bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 px-2.5 py-2 rounded-xl font-bold flex items-center gap-1 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition shadow-sm" title="Aggiorna Scadenze Rapide">
                                    <i data-lucide="zap" class="w-3.5 h-3.5 text-amber-500"></i> Rinnovi Veloci
                                </button>
                                <button onclick="openDiaryModal('${v.id}')" class="text-xs bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800 px-2.5 py-2 rounded-xl font-bold flex items-center gap-1 hover:bg-teal-100 dark:hover:bg-teal-900/40 transition shadow-sm" title="Diario di Bordo">
                                    <i data-lucide="book-open" class="w-3.5 h-3.5 text-teal-500"></i> Diario ${(v.diary && v.diary.length > 0) ? `<span class="bg-teal-500 text-white text-[9px] font-extrabold rounded-full px-1.5 py-0">${v.diary.length}</span>` : ''}
                                </button>
                                <button onclick="editVehicle('${v.id}')" class="text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950 p-2 rounded-xl transition border border-transparent hover:border-brand-200 dark:hover:border-brand-800" title="Modifica completa">
                                    <i data-lucide="edit-3" class="w-4 h-4"></i>
                                </button>
                                <button onclick="confirmDeleteVehicle('${v.id}')" class="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 p-2 rounded-xl transition border border-transparent hover:border-red-200 dark:hover:border-red-800" title="Elimina mezzo">
                                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                                </button>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
                            <div class="${colSpanLogistics} space-y-3 bg-slate-50/50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                                <h5 class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                                    <i data-lucide="credit-card" class="w-3.5 h-3.5 text-slate-500"></i> Servizi Autostradali & Carte
                                </h5>

                                <div class="flex items-center justify-between text-xs bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-150 dark:border-slate-700">
                                    <span class="text-slate-600 dark:text-slate-400 font-medium">Telepass:</span>
                                    <span class="font-mono text-xs bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-800 dark:text-white font-bold">${v.telepass || 'Nessuno'}</span>
                                </div>

                                <div class="space-y-1.5">
                                    ${renderCardRow(v.id, 'card1', v.cards?.card1)}
                                    ${renderCardRow(v.id, 'card2', v.cards?.card2)}
                                    ${renderCardRow(v.id, 'card3', v.cards?.card3)}
                                </div>
                            </div>

                            <div class="${colSpanDeadlines} grid ${gridColsDeadlines} gap-3">
                                ${renderDeadlineBox("Revisione", v.deadlines?.revision)}
                                ${renderDeadlineBox("Rev. Tachigrafo", v.deadlines?.tachimetro)}
                                ${renderDeadlineBox("Scarico Tachigrafo", v.deadlines?.scaricoTachigrafo)}
                                ${renderDeadlineBox("Assicurazione", v.deadlines?.assicurazione)}
                                ${v.deadlines?.gru ? renderDeadlineBox("Revisione Gru", v.deadlines?.gru) : ''}
                                ${v.deadlines?.gruStrutturale ? renderDeadlineBox("Verifica Strutturale Gru", v.deadlines?.gruStrutturale) : ''}
                                ${v.deadlines?.tassaPossesso ? renderDeadlineBox("Bollo", v.deadlines?.tassaPossesso) : ''}
                                ${v.deadlines?.altro ? renderDeadlineBox(v.deadlines?.altroNota || "Altra Scadenza", v.deadlines?.altro) : ''}
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            lucide.createIcons();
        }

        