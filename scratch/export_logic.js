        function formatDateForExport(dateStr) {
            if (!dateStr) return '';
            const parts = dateStr.split('-');
            if (parts.length !== 3) return dateStr;
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }

        function getStatusText(statusColor) {
            if (statusColor === 'red') return 'SCADUTO';
            if (statusColor === 'amber') return 'IN SCADENZA';
            if (statusColor === 'emerald') return 'IN REGOLA';
            return '-';
        }

        function exportToExcel() {
            // Preparazione dati Mezzi
            const vehiclesData = vehicles.map(v => {
                const statusColor = getVehicleOverallStatus(v);
                return {
                    'Targa': v.plate || '',
                    'Modello': v.model || '',
                    'Assicurazione RCA': formatDateForExport(v.deadlines?.insurance),
                    'Revisione': formatDateForExport(v.deadlines?.revision),
                    'Tachigrafo': formatDateForExport(v.deadlines?.tachograph),
                    'Bollo': formatDateForExport(v.deadlines?.stamp),
                    'Licenza Conto Terzi': formatDateForExport(v.deadlines?.adr),
                    'ATP': formatDateForExport(v.deadlines?.atp),
                    'Estintore': formatDateForExport(v.deadlines?.fireExtinguisher),
                    'Gru / PLE': formatDateForExport(v.deadlines?.crane),
                    'Altro': formatDateForExport(v.deadlines?.otherNote),
                    'Telepass': v.telepass || '',
                    'Carte Carburante': v.cards || '',
                    'Stato Generale': getStatusText(statusColor)
                };
            });

            // Preparazione dati Autisti
            const operatorsData = operators.map(o => {
                const statusColor = getOperatorOverallStatus(o);
                let tipo = '';
                if(o.type === 'driver') tipo = 'Autista';
                else if(o.type === 'company') tipo = 'Azienda';
                else tipo = 'Azienda (Mezzi)';
                
                let scaricoDesc = '';
                if(o.type === 'driver') scaricoDesc = formatDateForExport(calculateNextDownloadDate(o.lastDownload));
                else scaricoDesc = formatDateForExport(calculateNextCompanyDownloadDate(o.lastDownload));

                return {
                    'Nome e Cognome': o.name || '',
                    'Tipologia': tipo,
                    'Numero Carta': o.cardNum || '',
                    'Scadenza Carta': formatDateForExport(o.expiration),
                    'Data Ultimo Scarico': formatDateForExport(o.lastDownload),
                    'Prossima Scadenza Scarico': scaricoDesc,
                    'Stato Generale': getStatusText(statusColor)
                };
            });

            // Creazione Workbook
            const wb = XLSX.utils.book_new();
            
            // Foglio Mezzi
            const wsVehicles = XLSX.utils.json_to_sheet(vehiclesData);
            XLSX.utils.book_append_sheet(wb, wsVehicles, "Mezzi");
            
            // Foglio Autisti
            const wsOperators = XLSX.utils.json_to_sheet(operatorsData);
            XLSX.utils.book_append_sheet(wb, wsOperators, "Conducenti e Card");

            // Salvataggio
            XLSX.writeFile(wb, "Report_Scadenziario_Flotta.xlsx");
            showToast("Report Excel generato con successo!", "success");
        }

        function exportToPDF() {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('landscape');

            doc.setFontSize(18);
            doc.text("Report Scadenziario Flotta - VI.CLA FUTURE S.R.L.", 14, 20);
            
            const today = new Date();
            doc.setFontSize(10);
            doc.text(`Generato il: ${today.toLocaleDateString('it-IT')}`, 14, 28);

            // Tabella Mezzi
            doc.setFontSize(14);
            doc.text("Riepilogo Mezzi", 14, 40);
            
            const vehiclesRows = vehicles.map(v => {
                const statusColor = getVehicleOverallStatus(v);
                
                // Trova la prima scadenza
                let nextDate = null;
                for (let d in v.deadlines) {
                    if (d !== 'altroNota' && v.deadlines[d]) {
                        if (!nextDate || new Date(v.deadlines[d]) < new Date(nextDate)) {
                            nextDate = v.deadlines[d];
                        }
                    }
                }

                return [
                    v.plate || '-',
                    v.model || '-',
                    nextDate ? formatDateForExport(nextDate) : '-',
                    getStatusText(statusColor)
                ];
            });

            doc.autoTable({
                startY: 45,
                head: [['Targa', 'Modello', 'Prossima Scadenza', 'Stato']],
                body: vehiclesRows,
                theme: 'grid',
                headStyles: { fillColor: [37, 99, 235] }, // brand-600
                didParseCell: function(data) {
                    if(data.section === 'body' && data.column.index === 3) {
                        if(data.cell.raw === 'SCADUTO') {
                            data.cell.styles.textColor = [220, 38, 38];
                            data.cell.styles.fontStyle = 'bold';
                        } else if(data.cell.raw === 'IN SCADENZA') {
                            data.cell.styles.textColor = [217, 119, 6];
                            data.cell.styles.fontStyle = 'bold';
                        } else if(data.cell.raw === 'IN REGOLA') {
                            data.cell.styles.textColor = [5, 150, 105];
                        }
                    }
                }
            });

            // Tabella Autisti
            const finalY = doc.lastAutoTable.finalY || 45;
            
            doc.setFontSize(14);
            doc.text("Riepilogo Conducenti e Carte Tachigrafiche", 14, finalY + 15);

            const operatorsRows = operators.map(o => {
                const statusColor = getOperatorOverallStatus(o);
                let tipo = '';
                if(o.type === 'driver') tipo = 'Autista';
                else if(o.type === 'company') tipo = 'Azienda';
                else tipo = 'Azienda (Mezzi)';

                let scaricoDesc = '';
                if(o.type === 'driver') scaricoDesc = formatDateForExport(calculateNextDownloadDate(o.lastDownload));
                else scaricoDesc = formatDateForExport(calculateNextCompanyDownloadDate(o.lastDownload));

                return [
                    o.name || '-',
                    tipo,
                    o.cardNum || '-',
                    formatDateForExport(o.expiration) || '-',
                    scaricoDesc || '-',
                    getStatusText(statusColor)
                ];
            });

            doc.autoTable({
                startY: finalY + 20,
                head: [['Nome e Cognome', 'Tipologia', 'Numero Carta', 'Scadenza Carta', 'Prossimo Scarico', 'Stato']],
                body: operatorsRows,
                theme: 'grid',
                headStyles: { fillColor: [37, 99, 235] },
                didParseCell: function(data) {
                    if(data.section === 'body' && data.column.index === 5) {
                        if(data.cell.raw === 'SCADUTO') {
                            data.cell.styles.textColor = [220, 38, 38];
                            data.cell.styles.fontStyle = 'bold';
                        } else if(data.cell.raw === 'IN SCADENZA') {
                            data.cell.styles.textColor = [217, 119, 6];
                            data.cell.styles.fontStyle = 'bold';
                        } else if(data.cell.raw === 'IN REGOLA') {
                            data.cell.styles.textColor = [5, 150, 105];
                        }
                    }
                }
            });

            doc.save("Report_Scadenziario_Flotta.pdf");
            showToast("Report PDF generato con successo!", "success");
        }
