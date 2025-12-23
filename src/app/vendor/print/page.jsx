// // 'use client';

// // import { useState, useEffect, useRef } from 'react';
// // import { jsPrintManager } from '@/lib/jsprintmanager-singleton';

// // export default function TestPrintPage() {
// //   const [isConnected, setIsConnected] = useState(false);
// //   const [printers, setPrinters] = useState([]);
// //   const [selectedPrinter, setSelectedPrinter] = useState('');
// //   const [textToPrint, setTextToPrint] = useState('Hello, this is a test print from JSPrintManager!\nSecond line...\nThird line...');
// //   const [status, setStatus] = useState('Initializing...');
// //   const [isPrinting, setIsPrinting] = useState(false);
// //   const [copies, setCopies] = useState(1);
  
// //   // Référence pour stocker le module
// //   const jsPrintManagerRef = useRef(null);

// //   useEffect(() => {
// //     let isMounted = true;
// //     let removeListener;

// //     const init = async () => {
// //       try {
// //         // S'abonner au statut du singleton
// //         removeListener = jsPrintManager.addStatusListener((connected) => {
// //           if (!isMounted) return;
// //           setIsConnected(connected);
          
// //           if (connected) {
// //             setStatus('Connected - Fetching printers...');
// //             fetchPrinters();
// //           } else {
// //             setStatus('Disconnected - Install JSPrintManager desktop app');
// //           }
// //         });

// //         // Obtenir l'instance du singleton
// //         const instance = await jsPrintManager.initialize();
// //         if (!isMounted) return;
        
// //         jsPrintManagerRef.current = instance;
        
// //         // Obtenir le statut actuel
// //         setIsConnected(jsPrintManager.isConnected());

// //       } catch (error) {
// //         console.error('Initialization error:', error);
// //         setStatus('Failed to initialize');
// //       }
// //     };

// //     init();

// //     return () => {
// //       isMounted = false;
// //       if (removeListener) removeListener();
// //     };
// //   }, []);

// //   // Fonction pour récupérer les imprimantes
// //   const fetchPrinters = async () => {
// //     if (!jsPrintManagerRef.current) {
// //       setStatus('JSPrintManager not loaded yet');
// //       return;
// //     }

// //     setStatus('Fetching printers...');
// //     try {
// //       const { JSPrintManager } = jsPrintManagerRef.current;
// //       const printersList = await JSPrintManager.getPrinters();
      
// //       setPrinters(printersList || []);
// //       if (printersList && printersList.length > 0) {
// //         setSelectedPrinter(printersList[0]);
// //         setStatus(`Found ${printersList.length} printer(s)`);
// //       } else {
// //         setStatus('No printers found');
// //       }
// //     } catch (error) {
// //       console.error('Failed to get printers:', error);
// //       setStatus('Error fetching printers');
// //     }
// //   };

// //   // Fonction pour imprimer du texte
// //   const handlePrintText = async () => {
// //     if (!isConnected || !selectedPrinter || !textToPrint.trim()) {
// //       alert('Please select a printer and enter text to print');
// //       return;
// //     }

// //     setIsPrinting(true);
// //     setStatus(`Printing to ${selectedPrinter}...`);

// //     try {
// //       if (!jsPrintManagerRef.current) {
// //         throw new Error('JSPrintManager not loaded');
// //       }

// //       const { ClientPrintJob, InstalledPrinter, PrintFileTXT, FileSourceType } = jsPrintManagerRef.current;
      
// //       const cpj = new ClientPrintJob();
// //       cpj.clientPrinter = new InstalledPrinter(selectedPrinter);

// //       // Créer un fichier texte temporaire
// //       const textBlob = new Blob([textToPrint], { type: 'text/plain' });
// //       const textUrl = URL.createObjectURL(textBlob);
      
// //       const printFile = new PrintFileTXT(
// //         textUrl, 
// //         'test_print.txt', 
// //         copies, 
// //         FileSourceType.URL
// //       );
      
// //       cpj.files.push(printFile);

// //       cpj.onFinished = (data) => {
// //         console.log('Print job finished:', data);
// //         setIsPrinting(false);
// //         setStatus(`Print sent to ${selectedPrinter}`);
// //         URL.revokeObjectURL(textUrl);
// //       };

// //       cpj.onError = (error) => {
// //         console.error('Print job error:', error);
// //         setIsPrinting(false);
// //         setStatus(`Print error: ${error.message}`);
// //         URL.revokeObjectURL(textUrl);
// //       };

// //       cpj.sendToClient();

// //     } catch (error) {
// //       console.error('Print error:', error);
// //       setIsPrinting(false);
// //       setStatus(`Print failed: ${error.message}`);
// //     }
// //   };

// //   // Fonction pour rafraîchir
// //   const refreshPrinters = () => {
// //     if (!isConnected) {
// //       setStatus('Not connected to printer service');
// //       return;
// //     }
// //     fetchPrinters();
// //   };

// //   return (
// //     <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
// //       <h1>🖨️ Test Print Page</h1>
      
// //       {/* Statut */}
// //       <div style={{ 
// //         padding: '1rem', 
// //         marginBottom: '2rem',
// //         backgroundColor: isConnected ? '#e8f5e9' : '#ffebee',
// //         border: `2px solid ${isConnected ? '#4caf50' : '#f44336'}`,
// //         borderRadius: '8px'
// //       }}>
// //         <h3 style={{ margin: '0 0 0.5rem 0' }}>
// //           Connection Status: {isConnected ? '✅ Connected' : '❌ Disconnected'}
// //         </h3>
// //         <p style={{ margin: 0 }}>{status}</p>
// //         <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', fontStyle: 'italic' }}>
// //           Using global JSPrintManager instance
// //         </p>
// //       </div>

// //       {/* Reste du code inchangé... */}
// //       <div style={{ marginBottom: '2rem' }}>
// //         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
// //           <h2 style={{ margin: 0 }}>Available Printers</h2>
// //           <button onClick={refreshPrinters} disabled={!isConnected || isPrinting}>
// //             🔄 Refresh
// //           </button>
// //         </div>
        
// //         {printers.length === 0 ? (
// //           <div style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
// //             {isConnected ? 'No printers found. Click Refresh.' : 'Connect to see printers.'}
// //           </div>
// //         ) : (
// //           <div style={{ backgroundColor: '#f9f9f9', borderRadius: '8px', padding: '1rem' }}>
// //             {printers.map((printer, index) => (
// //               <div 
// //                 key={index}
// //                 style={{
// //                   padding: '0.75rem',
// //                   marginBottom: '0.5rem',
// //                   backgroundColor: selectedPrinter === printer ? '#e3f2fd' : 'white',
// //                   border: `1px solid ${selectedPrinter === printer ? '#2196f3' : '#ddd'}`,
// //                   borderRadius: '4px',
// //                   cursor: 'pointer'
// //                 }}
// //                 onClick={() => setSelectedPrinter(printer)}
// //               >
// //                 <strong>{printer}</strong>
// //                 {index === 0 && <span style={{ marginLeft: '0.5rem', color: '#666' }}>(Default)</span>}
// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </div>

// //       {/* Zone de texte */}
// //       <div style={{ marginBottom: '2rem' }}>
// //         <h2 style={{ marginBottom: '1rem' }}>Test Text Printing</h2>
        
// //         <div style={{ marginBottom: '1rem' }}>
// //           <label style={{ display: 'block', marginBottom: '0.5rem' }}>
// //             Text to print:
// //           </label>
// //           <textarea
// //             value={textToPrint}
// //             onChange={(e) => setTextToPrint(e.target.value)}
// //             style={{
// //               width: '100%',
// //               minHeight: '120px',
// //               padding: '0.75rem',
// //               border: '1px solid #ddd',
// //               borderRadius: '4px',
// //               fontFamily: 'monospace'
// //             }}
// //           />
// //         </div>
        
// //         <div style={{ marginBottom: '1.5rem' }}>
// //           <label style={{ display: 'block', marginBottom: '0.5rem' }}>
// //             Number of copies:
// //           </label>
// //           <input
// //             type="number"
// //             min="1"
// //             max="10"
// //             value={copies}
// //             onChange={(e) => setCopies(Math.max(1, parseInt(e.target.value) || 1))}
// //             style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
// //           />
// //         </div>
        
// //         <button
// //           onClick={handlePrintText}
// //           disabled={!isConnected || !selectedPrinter || !textToPrint.trim() || isPrinting}
// //           style={{
// //             padding: '0.75rem 1.5rem',
// //             backgroundColor: !isConnected || !selectedPrinter || !textToPrint.trim() ? '#ccc' : '#4caf50',
// //             color: 'white',
// //             border: 'none',
// //             borderRadius: '4px',
// //             cursor: !isConnected || !selectedPrinter || !textToPrint.trim() || isPrinting ? 'not-allowed' : 'pointer'
// //           }}
// //         >
// //           {isPrinting ? '🖨️ Printing...' : '🖨️ Print Text'}
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }
// 'use client';

// import { useState, useEffect, useCallback, useRef } from 'react';
// import { jsPrintManager } from '@/lib/jsprintmanager-singleton';

// const PRINTER_STORAGE_KEY = 'selected-printer';

// export default function PrinterSelector() {
//   const [isConnected, setIsConnected] = useState(false);
//   const [printers, setPrinters] = useState([]);
//   const [selectedPrinter, setSelectedPrinter] = useState('');
//   const [status, setStatus] = useState('idle');
//   const [isLoading, setIsLoading] = useState(false);
//   const [testPrintStatus, setTestPrintStatus] = useState('');
//   const hasInitializedRef = useRef(false);

//   // Charger l'imprimante sauvegardée depuis le localStorage au démarrage
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       try {
//         const savedPrinter = localStorage.getItem(PRINTER_STORAGE_KEY);
//         if (savedPrinter) {
//           console.log('Imprimante chargée depuis localStorage:', savedPrinter);
//           setSelectedPrinter(savedPrinter);
//         }
//       } catch (error) {
//         console.error('Erreur lors du chargement depuis localStorage:', error);
//       }
//     }
//   }, []);

//   // Sauvegarder l'imprimante sélectionnée dans le localStorage
//   const saveSelectedPrinter = useCallback((printer) => {
//     if (typeof window !== 'undefined' && printer) {
//       try {
//         localStorage.setItem(PRINTER_STORAGE_KEY, printer);
//         console.log('Imprimante sauvegardée dans localStorage:', printer);
//       } catch (error) {
//         console.error('Erreur lors de la sauvegarde dans localStorage:', error);
//       }
//     }
//   }, []);

//   // Mettre à jour localStorage quand selectedPrinter change
//   useEffect(() => {
//     if (selectedPrinter && selectedPrinter !== localStorage.getItem(PRINTER_STORAGE_KEY)) {
//       saveSelectedPrinter(selectedPrinter);
//     }
//   }, [selectedPrinter, saveSelectedPrinter]);

//   // Initialisation de JSPrintManager via le singleton
//   useEffect(() => {
//     let isMounted = true;
//     let cleanupListener = null;

//     const initializePrintManager = async () => {
//       if (hasInitializedRef.current) return;
      
//       try {
//         setStatus('loading');
//         setIsLoading(true);
        
//         // Initialiser le singleton
//         await jsPrintManager.initialize();
        
//         // Ajouter un écouteur pour les changements de statut
//         cleanupListener = jsPrintManager.addStatusListener((connected) => {
//           if (!isMounted) return;
          
//           setIsConnected(connected);
          
//           if (connected) {
//             setStatus('connected');
//             // Récupérer les imprimantes une fois connecté
//             fetchPrinters();
//           } else {
//             setStatus('disconnected');
//           }
//         });
        
//         // Vérifier le statut actuel
//         const connected = jsPrintManager.isConnected();
//         setIsConnected(connected);
        
//         if (connected) {
//           setStatus('connected');
//           fetchPrinters();
//         } else {
//           setStatus('disconnected');
//         }
        
//         hasInitializedRef.current = true;
        
//       } catch (error) {
//         console.error('Print manager initialization error:', error);
//         if (isMounted) {
//           setStatus('error');
//         }
//       } finally {
//         if (isMounted) {
//           setIsLoading(false);
//         }
//       }
//     };

//     initializePrintManager();

//     return () => {
//       isMounted = false;
//       if (cleanupListener) {
//         cleanupListener();
//       }
//     };
//   }, []);

//   // Récupérer la liste des imprimantes
//   const fetchPrinters = useCallback(async () => {
//     if (!jsPrintManager.isConnected()) return;

//     try {
//       setIsLoading(true);
//       const instance = jsPrintManager.getInstance();
//       const printersList = await instance.JSPrintManager.getPrinters();
//       const printersArray = Array.isArray(printersList) ? printersList : [];
      
//       setPrinters(printersArray);
      
//       console.log('Imprimantes récupérées:', printersArray);
//       console.log('Imprimante actuellement sélectionnée:', selectedPrinter);
      
//       // Vérifier si l'imprimante sauvegardée est dans la liste
//       const savedPrinter = localStorage.getItem(PRINTER_STORAGE_KEY);
      
//       if (savedPrinter && printersArray.includes(savedPrinter)) {
//         // L'imprimante sauvegardée existe, on la garde sélectionnée
//         if (selectedPrinter !== savedPrinter) {
//           setSelectedPrinter(savedPrinter);
//         }
//         console.log('Imprimante sauvegardée trouvée:', savedPrinter);
//       } else if (printersArray.length > 0) {
//         // Aucune imprimante sauvegardée valide, prendre la première
//         const newSelectedPrinter = printersArray[0];
//         if (selectedPrinter !== newSelectedPrinter) {
//           setSelectedPrinter(newSelectedPrinter);
//           saveSelectedPrinter(newSelectedPrinter);
//         }
//         console.log('Nouvelle imprimante sélectionnée:', newSelectedPrinter);
//       } else {
//         // Aucune imprimante disponible
//         if (selectedPrinter) {
//           setSelectedPrinter('');
//         }
//       }
//     } catch (error) {
//       console.error('Failed to fetch printers:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [selectedPrinter, saveSelectedPrinter]);

//   // Gestionnaire de sélection d'imprimante
//   const handleSelectPrinter = useCallback((printer) => {
//     console.log('Imprimante sélectionnée:', printer);
//     setSelectedPrinter(printer);
//     saveSelectedPrinter(printer);
//     setTestPrintStatus('');
//   }, [saveSelectedPrinter]);

//   // Rafraîchir la liste des imprimantes
//   const refreshPrinters = useCallback(async () => {
//     if (!isConnected) {
//       alert('Veuillez vous connecter d\'abord');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       await fetchPrinters();
//     } catch (error) {
//       console.error('Erreur lors du rafraîchissement:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [isConnected, fetchPrinters]);

//   // Tester l'imprimante sélectionnée
//   const testPrinter = useCallback(async () => {
//     if (!isConnected || !selectedPrinter) {
//       alert('Veuillez vous connecter et sélectionner une imprimante');
//       return;
//     }

//     setTestPrintStatus('printing');
//     try {
//       const instance = jsPrintManager.getInstance();
//       const { ClientPrintJob, InstalledPrinter, PrintFileTXT, JSPrintManager: JSPM } = instance;
      
//       const cpj = new ClientPrintJob();
//       cpj.clientPrinter = new InstalledPrinter(selectedPrinter);

//       const testText = `Test d'imprimante - ${new Date().toLocaleString()}\nImprimante: ${selectedPrinter}\n\nCette page confirme que votre imprimante est configurée correctement.`;
//       const textBlob = new Blob([testText], { type: 'text/plain' });
//       const textUrl = URL.createObjectURL(textBlob);
      
//       const printFile = new PrintFileTXT(
//         textUrl, 
//         'test_imprimante.txt', 
//         1, 
//         JSPM.FileSourceType.URL
//       );
      
//       cpj.files.push(printFile);

//       await new Promise((resolve, reject) => {
//         cpj.onFinished = () => {
//           URL.revokeObjectURL(textUrl);
//           resolve();
//         };

//         cpj.onError = (error) => {
//           URL.revokeObjectURL(textUrl);
//           reject(error);
//         };

//         cpj.sendToClient();
//       });

//       setTestPrintStatus('success');
//       setTimeout(() => setTestPrintStatus(''), 3000);
      
//     } catch (error) {
//       console.error('Test print error:', error);
//       setTestPrintStatus('error');
//       setTimeout(() => setTestPrintStatus(''), 5000);
//       throw error;
//     }
//   }, [isConnected, selectedPrinter]);

//   // Obtenir le statut de connexion
//   const getConnectionStatus = () => {
//     switch (status) {
//       case 'loading':
//         return { text: 'Connexion en cours...', color: 'bg-blue-100 text-blue-800', borderColor: 'border-blue-300' };
//       case 'connected':
//         return { text: 'Connecté au service d\'impression', color: 'bg-green-100 text-green-800', borderColor: 'border-green-300' };
//       case 'error':
//         return { text: 'Erreur de connexion', color: 'bg-red-100 text-red-800', borderColor: 'border-red-300' };
//       default:
//         return { text: 'Déconnecté', color: 'bg-gray-100 text-gray-800', borderColor: 'border-gray-300' };
//     }
//   };

//   const connectionStatus = getConnectionStatus();

//   // Réinitialiser complètement les préférences
//   const resetPreferences = useCallback(() => {
//     if (window.confirm('Êtes-vous sûr de vouloir réinitialiser les préférences d\'imprimante ?')) {
//       localStorage.removeItem(PRINTER_STORAGE_KEY);
//       setSelectedPrinter('');
//       setTestPrintStatus('');
//       alert('Préférences d\'imprimante réinitialisées avec succès !');
      
//       // Si connecté, sélectionner la première imprimante
//       if (isConnected && printers.length > 0) {
//         setTimeout(() => {
//           const firstPrinter = printers[0];
//           setSelectedPrinter(firstPrinter);
//           saveSelectedPrinter(firstPrinter);
//         }, 100);
//       }
//     }
//   }, [isConnected, printers, saveSelectedPrinter]);

//   return (
//     <div style={{ 
//       maxWidth: '800px', 
//       margin: '0 auto', 
//       padding: '2rem',
//       fontFamily: 'system-ui, -apple-system, sans-serif'
//     }}>
//       {/* En-tête */}
//       <div style={{ marginBottom: '2rem' }}>
//         <h1 style={{ 
//           fontSize: '1.875rem', 
//           fontWeight: 'bold', 
//           color: '#111827',
//           marginBottom: '0.5rem'
//         }}>
//           🖨️ Sélection d'imprimante
//         </h1>
//         <p style={{ color: '#6b7280' }}>
//           Choisissez et enregistrez votre imprimante par défaut pour l'utiliser dans toute l'application.
//         </p>
//       </div>

//       {/* Statut de connexion */}
//       <div style={{ 
//         padding: '1rem', 
//         marginBottom: '1.5rem',
//         backgroundColor: connectionStatus.color.split(' ')[0],
//         color: connectionStatus.color.split(' ')[1],
//         border: `1px solid ${connectionStatus.borderColor}`,
//         borderRadius: '0.5rem'
//       }}>
//         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//           <div>
//             <h3 style={{ 
//               margin: '0 0 0.25rem 0', 
//               fontWeight: '500',
//               fontSize: '1rem'
//             }}>
//               {isConnected ? '✅ Connecté' : '🔌 Déconnecté'}
//             </h3>
//             <p style={{ margin: 0, fontSize: '0.875rem' }}>{connectionStatus.text}</p>
//           </div>
          
//           {!isConnected && (
//             <div style={{ fontSize: '0.875rem', textAlign: 'right' }}>
//               <p style={{ marginBottom: '0.25rem', fontWeight: '500' }}>Pour vous connecter :</p>
//               <ol style={{ margin: 0, paddingLeft: '1rem' }}>
//                 <li>
//                   <a 
//                     href="https://neodynamic.com/downloads/jspm" 
//                     target="_blank" 
//                     rel="noopener noreferrer"
//                     style={{ color: '#2563eb', textDecoration: 'none' }}
//                   >
//                     Télécharger JSPrintManager
//                   </a>
//                 </li>
//                 <li>Lancer l'application (icône dans la barre système)</li>
//                 <li>Rafraîchir cette page</li>
//               </ol>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Sélection d'imprimante */}
//       <div style={{ 
//         backgroundColor: 'white',
//         borderRadius: '0.5rem',
//         border: '1px solid #e5e7eb',
//         padding: '1.5rem',
//         marginBottom: '1.5rem'
//       }}>
//         <div style={{ 
//           display: 'flex', 
//           alignItems: 'center',
//           justifyContent: 'space-between',
//           marginBottom: '1rem'
//         }}>
//           <div>
//             <h2 style={{ 
//               margin: 0, 
//               fontSize: '1.125rem',
//               fontWeight: '600',
//               color: '#111827'
//             }}>
//               Imprimantes disponibles
//             </h2>
//             <p style={{ 
//               marginTop: '0.25rem',
//               fontSize: '0.875rem',
//               color: '#6b7280'
//             }}>
//               {printers.length > 0 
//                 ? `${printers.length} imprimante(s) détectée(s)` 
//                 : 'Aucune imprimante détectée'}
//             </p>
//           </div>
          
//           <div style={{ display: 'flex', gap: '0.5rem' }}>
//             <button
//               onClick={refreshPrinters}
//               disabled={!isConnected || isLoading}
//               style={{
//                 padding: '0.5rem 1rem',
//                 backgroundColor: !isConnected || isLoading ? '#f3f4f6' : '#eff6ff',
//                 color: !isConnected || isLoading ? '#9ca3af' : '#1d4ed8',
//                 border: '1px solid',
//                 borderColor: !isConnected || isLoading ? '#e5e7eb' : '#dbeafe',
//                 borderRadius: '0.375rem',
//                 fontWeight: '500',
//                 cursor: !isConnected || isLoading ? 'not-allowed' : 'pointer',
//                 transition: 'all 0.2s',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '0.5rem'
//               }}
//             >
//               {isLoading ? (
//                 <>
//                   <div style={{
//                     width: '1rem',
//                     height: '1rem',
//                     border: '2px solid #1d4ed8',
//                     borderTopColor: 'transparent',
//                     borderRadius: '50%',
//                     animation: 'spin 1s linear infinite'
//                   }}></div>
//                   Chargement...
//                 </>
//               ) : (
//                 <>
//                   <span>🔄</span>
//                   Rafraîchir
//                 </>
//               )}
//             </button>
//           </div>
//         </div>

//         {isLoading && status === 'loading' ? (
//           <div style={{ textAlign: 'center', padding: '2rem' }}>
//             <div style={{
//               display: 'inline-block',
//               width: '2rem',
//               height: '2rem',
//               border: '2px solid #3b82f6',
//               borderTopColor: 'transparent',
//               borderRadius: '50%',
//               animation: 'spin 1s linear infinite'
//             }}></div>
//             <p style={{ marginTop: '0.5rem', color: '#6b7280' }}>Initialisation du service d'impression...</p>
//           </div>
//         ) : printers.length === 0 ? (
//           <div style={{ 
//             textAlign: 'center', 
//             padding: '2rem',
//             border: '2px dashed #e5e7eb',
//             borderRadius: '0.375rem',
//             backgroundColor: '#f9fafb'
//           }}>
//             <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
//               {isConnected 
//                 ? 'Aucune imprimante trouvée. Vérifiez que vos imprimantes sont allumées et connectées.'
//                 : 'Connectez-vous au service d\'impression pour voir les imprimantes disponibles.'
//               }
//             </p>
//             {!isConnected && (
//               <button
//                 onClick={() => window.location.reload()}
//                 style={{
//                   padding: '0.5rem 1rem',
//                   backgroundColor: '#3b82f6',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '0.375rem',
//                   fontWeight: '500',
//                   cursor: 'pointer'
//                 }}
//               >
//                 Rafraîchir la page
//               </button>
//             )}
//           </div>
//         ) : (
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
//             {printers.map((printer, index) => {
//               const isSelected = selectedPrinter === printer;
//               const isSavedPrinter = localStorage.getItem(PRINTER_STORAGE_KEY) === printer;
              
//               return (
//                 <div
//                   key={printer}
//                   style={{
//                     padding: '1rem',
//                     borderRadius: '0.375rem',
//                     border: '2px solid',
//                     borderColor: isSelected ? '#3b82f6' : '#e5e7eb',
//                     backgroundColor: isSelected ? '#eff6ff' : 'white',
//                     cursor: 'pointer',
//                     transition: 'all 0.2s',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'space-between',
//                     position: 'relative',
//                     overflow: 'hidden'
//                   }}
//                   onClick={() => handleSelectPrinter(printer)}
//                 >
//                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
//                     <div style={{
//                       width: '1rem',
//                       height: '1rem',
//                       borderRadius: '50%',
//                       backgroundColor: isSelected ? '#3b82f6' : '#d1d5db',
//                       border: isSelected ? '2px solid #93c5fd' : '2px solid #e5e7eb',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center'
//                     }}>
//                       {isSelected && (
//                         <div style={{
//                           width: '0.5rem',
//                           height: '0.5rem',
//                           borderRadius: '50%',
//                           backgroundColor: 'white'
//                         }}></div>
//                       )}
//                     </div>
//                     <div>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
//                         <span style={{ 
//                           fontWeight: '600',
//                           color: isSelected ? '#1e40af' : '#111827'
//                         }}>
//                           {printer}
//                         </span>
//                         {isSavedPrinter && (
//                           <span style={{ 
//                             padding: '0.125rem 0.5rem',
//                             backgroundColor: '#dcfce7',
//                             color: '#166534',
//                             fontSize: '0.75rem',
//                             borderRadius: '9999px',
//                             fontWeight: '500'
//                           }}>
//                             Sauvegardée
//                           </span>
//                         )}
//                       </div>
//                       <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
//                         {index === 0 && (
//                           <span style={{ 
//                             fontSize: '0.75rem',
//                             color: '#6b7280',
//                             backgroundColor: '#f3f4f6',
//                             padding: '0.125rem 0.5rem',
//                             borderRadius: '0.125rem'
//                           }}>
//                             Par défaut
//                           </span>
//                         )}
//                         {isSelected && (
//                           <span style={{ 
//                             fontSize: '0.75rem',
//                             color: '#1d4ed8',
//                             fontWeight: '500'
//                           }}>
//                             Actuellement sélectionnée
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
//                     {isSelected && (
//                       <span style={{ 
//                         fontSize: '0.875rem',
//                         fontWeight: '600',
//                         color: '#1d4ed8',
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: '0.25rem'
//                       }}>
//                         <span>✓</span>
//                         Sélectionnée
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* Imprimante sélectionnée */}
//         {selectedPrinter && (
//           <div style={{ 
//             marginTop: '1.5rem',
//             padding: '1rem',
//             backgroundColor: '#f0fdf4',
//             border: '2px solid #86efac',
//             borderRadius: '0.375rem',
//             position: 'relative',
//             overflow: 'hidden'
//           }}>
//             <div style={{ 
//               position: 'absolute',
//               top: '0',
//               right: '0',
//               width: '4rem',
//               height: '4rem',
//               backgroundColor: '#86efac',
//               borderRadius: '0 0 0 100%',
//               display: 'flex',
//               alignItems: 'flex-start',
//               justifyContent: 'flex-end',
//               padding: '0.5rem'
//             }}>
//               <span style={{ color: '#166534', fontSize: '1.5rem' }}>🎯</span>
//             </div>
            
//             <div style={{ paddingRight: '4rem' }}>
//               <h3 style={{ 
//                 fontWeight: '600',
//                 color: '#166534',
//                 margin: '0 0 0.5rem 0',
//                 fontSize: '1rem'
//               }}>
//                 Imprimante par défaut enregistrée
//               </h3>
//               <div style={{ 
//                 backgroundColor: 'white',
//                 padding: '0.75rem',
//                 borderRadius: '0.375rem',
//                 border: '1px solid #bbf7d0',
//                 marginBottom: '1rem'
//               }}>
//                 <p style={{ 
//                   color: '#166534',
//                   margin: 0,
//                   fontWeight: '600',
//                   fontSize: '1.125rem',
//                   wordBreak: 'break-word'
//                 }}>
//                   {selectedPrinter}
//                 </p>
//               </div>
//               <p style={{ 
//                 fontSize: '0.875rem',
//                 color: '#15803d',
//                 margin: '0 0 1rem 0',
//                 lineHeight: '1.5'
//               }}>
//                 Cette imprimante est maintenant sauvegardée et sera automatiquement utilisée pour toutes les impressions dans l'application.
//               </p>
              
//               <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
//                 <button
//                   onClick={async () => {
//                     try {
//                       await testPrinter();
//                     } catch (error) {
//                       alert(`Erreur lors du test d'impression : ${error.message || 'Erreur inconnue'}`);
//                     }
//                   }}
//                   disabled={!isConnected || testPrintStatus === 'printing'}
//                   style={{
//                     padding: '0.625rem 1.25rem',
//                     backgroundColor: !isConnected || testPrintStatus === 'printing' ? '#f3f4f6' : '#22c55e',
//                     color: !isConnected || testPrintStatus === 'printing' ? '#9ca3af' : 'white',
//                     border: 'none',
//                     borderRadius: '0.375rem',
//                     fontWeight: '600',
//                     cursor: !isConnected || testPrintStatus === 'printing' ? 'not-allowed' : 'pointer',
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '0.5rem',
//                     transition: 'all 0.2s',
//                     fontSize: '0.875rem'
//                   }}
//                 >
//                   {testPrintStatus === 'printing' && (
//                     <div style={{
//                       width: '1rem',
//                       height: '1rem',
//                       border: '2px solid white',
//                       borderTopColor: 'transparent',
//                       borderRadius: '50%',
//                       animation: 'spin 1s linear infinite'
//                     }}></div>
//                   )}
//                   {testPrintStatus === 'printing' ? 'Impression en cours...' : 
//                    testPrintStatus === 'success' ? '✅ Test réussi' : 
//                    testPrintStatus === 'error' ? '❌ Échec du test' : 
//                    '🖨️ Tester l\'impression'}
//                 </button>
                
//                 <button
//                   onClick={resetPreferences}
//                   style={{
//                     padding: '0.625rem 1.25rem',
//                     backgroundColor: 'transparent',
//                     color: '#dc2626',
//                     border: '1px solid #dc2626',
//                     borderRadius: '0.375rem',
//                     fontWeight: '500',
//                     cursor: 'pointer',
//                     transition: 'all 0.2s',
//                     fontSize: '0.875rem'
//                   }}
//                 >
//                   Changer d'imprimante
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Instructions */}
//       <div style={{ 
//         backgroundColor: '#f0f9ff',
//         border: '1px solid #bae6fd',
//         borderRadius: '0.5rem',
//         padding: '1.5rem'
//       }}>
//         <h3 style={{ 
//           fontWeight: '600',
//           color: '#0369a1',
//           margin: '0 0 1rem 0',
//           fontSize: '1.125rem',
//           display: 'flex',
//           alignItems: 'center',
//           gap: '0.5rem'
//         }}>
//           <span>ℹ️</span>
//           Comment utiliser cette fonctionnalité
//         </h3>
//         <div style={{ 
//           display: 'grid',
//           gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
//           gap: '1rem'
//         }}>
//           <div style={{ 
//             backgroundColor: 'white',
//             padding: '1rem',
//             borderRadius: '0.375rem',
//             border: '1px solid #e0f2fe'
//           }}>
//             <div style={{
//               width: '2rem',
//               height: '2rem',
//               backgroundColor: '#0ea5e9',
//               color: 'white',
//               borderRadius: '50%',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               fontWeight: 'bold',
//               marginBottom: '0.75rem'
//             }}>
//               1
//             </div>
//             <h4 style={{ fontWeight: '600', color: '#0c4a6e', margin: '0 0 0.5rem 0' }}>
//               Installation
//             </h4>
//             <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: '1.5', margin: 0 }}>
//               Téléchargez et lancez JSPrintManager. L'application doit rester ouverte en arrière-plan.
//             </p>
//           </div>
          
//           <div style={{ 
//             backgroundColor: 'white',
//             padding: '1rem',
//             borderRadius: '0.375rem',
//             border: '1px solid #e0f2fe'
//           }}>
//             <div style={{
//               width: '2rem',
//               height: '2rem',
//               backgroundColor: '#0ea5e9',
//               color: 'white',
//               borderRadius: '50%',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               fontWeight: 'bold',
//               marginBottom: '0.75rem'
//             }}>
//               2
//             </div>
//             <h4 style={{ fontWeight: '600', color: '#0c4a6e', margin: '0 0 0.5rem 0' }}>
//               Sélection
//             </h4>
//             <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: '1.5', margin: 0 }}>
//               Cliquez sur une imprimante dans la liste. Elle est automatiquement sauvegardée.
//             </p>
//           </div>
          
//           <div style={{ 
//             backgroundColor: 'white',
//             padding: '1rem',
//             borderRadius: '0.375rem',
//             border: '1px solid #e0f2fe'
//           }}>
//             <div style={{
//               width: '2rem',
//               height: '2rem',
//               backgroundColor: '#0ea5e9',
//               color: 'white',
//               borderRadius: '50%',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               fontWeight: 'bold',
//               marginBottom: '0.75rem'
//             }}>
//               3
//             </div>
//             <h4 style={{ fontWeight: '600', color: '#0c4a6e', margin: '0 0 0.5rem 0' }}>
//               Test
//             </h4>
//             <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: '1.5', margin: 0 }}>
//               Utilisez le bouton "Tester l'impression" pour vérifier que tout fonctionne correctement.
//             </p>
//           </div>
          
//           <div style={{ 
//             backgroundColor: 'white',
//             padding: '1rem',
//             borderRadius: '0.375rem',
//             border: '1px solid #e0f2fe'
//           }}>
//             <div style={{
//               width: '2rem',
//               height: '2rem',
//               backgroundColor: '#0ea5e9',
//               color: 'white',
//               borderRadius: '50%',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               fontWeight: 'bold',
//               marginBottom: '0.75rem'
//             }}>
//               4
//             </div>
//             <h4 style={{ fontWeight: '600', color: '#0c4a6e', margin: '0 0 0.5rem 0' }}>
//               Persistance
//             </h4>
//             <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: '1.5', margin: 0 }}>
//               Votre choix est sauvegardé et sera réutilisé automatiquement lors de vos prochaines visites.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Information de stockage */}
//       <div style={{ 
//         marginTop: '2rem',
//         padding: '1.5rem',
//         backgroundColor: '#f8fafc',
//         border: '1px solid #e2e8f0',
//         borderRadius: '0.5rem',
//         textAlign: 'center'
//       }}>
//         <div style={{ 
//           display: 'inline-flex',
//           alignItems: 'center',
//           gap: '0.5rem',
//           marginBottom: '0.75rem',
//           padding: '0.5rem 1rem',
//           backgroundColor: '#f1f5f9',
//           borderRadius: '9999px'
//         }}>
//           <span style={{ color: '#64748b' }}>💾</span>
//           <span style={{ fontWeight: '500', color: '#475569' }}>
//             Données sauvegardées localement
//           </span>
//         </div>
        
//         <p style={{ 
//           fontSize: '0.875rem',
//           color: '#64748b',
//           margin: '0 0 1rem 0',
//           lineHeight: '1.5'
//         }}>
//           Votre sélection d'imprimante est stockée uniquement dans votre navigateur.<br />
//           Elle ne sera pas perdue si vous fermez l'onglet, mais sera effacée si vous supprimez les données du site.
//         </p>
        
//         <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
//           <button
//             onClick={resetPreferences}
//             style={{
//               padding: '0.5rem 1rem',
//               backgroundColor: 'transparent',
//               color: '#dc2626',
//               border: '1px solid #dc2626',
//               borderRadius: '0.375rem',
//               fontWeight: '500',
//               cursor: 'pointer',
//               fontSize: '0.875rem',
//               transition: 'all 0.2s'
//             }}
//             onMouseOver={(e) => {
//               e.target.style.backgroundColor = '#fee2e2';
//             }}
//             onMouseOut={(e) => {
//               e.target.style.backgroundColor = 'transparent';
//             }}
//           >
//             Réinitialiser les préférences
//           </button>
          
//           <button
//             onClick={() => window.location.reload()}
//             style={{
//               padding: '0.5rem 1rem',
//               backgroundColor: '#3b82f6',
//               color: 'white',
//               border: 'none',
//               borderRadius: '0.375rem',
//               fontWeight: '500',
//               cursor: 'pointer',
//               fontSize: '0.875rem',
//               transition: 'all 0.2s'
//             }}
//             onMouseOver={(e) => {
//               e.target.style.backgroundColor = '#2563eb';
//             }}
//             onMouseOut={(e) => {
//               e.target.style.backgroundColor = '#3b82f6';
//             }}
//           >
//             Rafraîchir la page
//           </button>
//         </div>
//       </div>

//       {/* Style pour l'animation de spin */}
//       <style jsx>{`
//         @keyframes spin {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }
        
//         @media (max-width: 640px) {
//           div {
//             padding: 1rem !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { jsPrintManager } from '@/lib/jsprintmanager-singleton';

const PRINTER_STORAGE_KEY = 'selected-printer';

export default function PrinterSelector() {
  const [isConnected, setIsConnected] = useState(false);
  const [printers, setPrinters] = useState([]);
  const [selectedPrinter, setSelectedPrinter] = useState('');
  const [status, setStatus] = useState('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [testPrintStatus, setTestPrintStatus] = useState('');
  const hasInitializedRef = useRef(false);

  // Charger l'imprimante sauvegardée depuis le localStorage au démarrage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedPrinter = localStorage.getItem(PRINTER_STORAGE_KEY);
        if (savedPrinter) {
          console.log('Imprimante chargée depuis localStorage:', savedPrinter);
          setSelectedPrinter(savedPrinter);
        }
      } catch (error) {
        console.error('Erreur lors du chargement depuis localStorage:', error);
      }
    }
  }, []);

  // Sauvegarder l'imprimante sélectionnée dans le localStorage
  const saveSelectedPrinter = useCallback((printer) => {
    if (typeof window !== 'undefined' && printer) {
      try {
        localStorage.setItem(PRINTER_STORAGE_KEY, printer);
        console.log('Imprimante sauvegardée dans localStorage:', printer);
      } catch (error) {
        console.error('Erreur lors de la sauvegarde dans localStorage:', error);
      }
    }
  }, []);

  // Mettre à jour localStorage quand selectedPrinter change
  useEffect(() => {
    if (selectedPrinter && selectedPrinter !== localStorage.getItem(PRINTER_STORAGE_KEY)) {
      saveSelectedPrinter(selectedPrinter);
    }
  }, [selectedPrinter, saveSelectedPrinter]);

  // Initialisation de JSPrintManager via le singleton
  useEffect(() => {
    let isMounted = true;
    let cleanupListener = null;

    const initializePrintManager = async () => {
      if (hasInitializedRef.current) return;
      
      try {
        setStatus('loading');
        setIsLoading(true);
        
        // Initialiser le singleton
        await jsPrintManager.initialize();
        
        // Ajouter un écouteur pour les changements de statut
        cleanupListener = jsPrintManager.addStatusListener((connected) => {
          if (!isMounted) return;
          
          setIsConnected(connected);
          
          if (connected) {
            setStatus('connected');
            // Récupérer les imprimantes une fois connecté
            fetchPrinters();
          } else {
            setStatus('disconnected');
          }
        });
        
        // Vérifier le statut actuel
        const connected = jsPrintManager.isConnected();
        setIsConnected(connected);
        
        if (connected) {
          setStatus('connected');
          fetchPrinters();
        } else {
          setStatus('disconnected');
        }
        
        hasInitializedRef.current = true;
        
      } catch (error) {
        console.error('Print manager initialization error:', error);
        if (isMounted) {
          setStatus('error');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializePrintManager();

    return () => {
      isMounted = false;
      if (cleanupListener) {
        cleanupListener();
      }
    };
  }, []);

  // Récupérer la liste des imprimantes
  const fetchPrinters = useCallback(async () => {
    if (!jsPrintManager.isConnected()) return;

    try {
      setIsLoading(true);
      const instance = jsPrintManager.getInstance();
      const printersList = await instance.JSPrintManager.getPrinters();
      const printersArray = Array.isArray(printersList) ? printersList : [];
      
      setPrinters(printersArray);
      
      console.log('Imprimantes récupérées:', printersArray);
      console.log('Imprimante actuellement sélectionnée:', selectedPrinter);
      
      // Vérifier si l'imprimante sauvegardée est dans la liste
      const savedPrinter = localStorage.getItem(PRINTER_STORAGE_KEY);
      
      if (savedPrinter && printersArray.includes(savedPrinter)) {
        // L'imprimante sauvegardée existe, on la garde sélectionnée
        if (selectedPrinter !== savedPrinter) {
          setSelectedPrinter(savedPrinter);
        }
        console.log('Imprimante sauvegardée trouvée:', savedPrinter);
      } else if (printersArray.length > 0) {
        // Aucune imprimante sauvegardée valide, prendre la première
        const newSelectedPrinter = printersArray[0];
        if (selectedPrinter !== newSelectedPrinter) {
          setSelectedPrinter(newSelectedPrinter);
          saveSelectedPrinter(newSelectedPrinter);
        }
        console.log('Nouvelle imprimante sélectionnée:', newSelectedPrinter);
      } else {
        // Aucune imprimante disponible
        if (selectedPrinter) {
          setSelectedPrinter('');
        }
      }
    } catch (error) {
      console.error('Failed to fetch printers:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedPrinter, saveSelectedPrinter]);

  // Gestionnaire de sélection d'imprimante
  const handleSelectPrinter = useCallback((printer) => {
    console.log('Imprimante sélectionnée:', printer);
    setSelectedPrinter(printer);
    saveSelectedPrinter(printer);
    setTestPrintStatus('');
  }, [saveSelectedPrinter]);

  // Rafraîchir la liste des imprimantes
  const refreshPrinters = useCallback(async () => {
    if (!isConnected) {
      alert('Veuillez vous connecter d\'abord');
      return;
    }

    setIsLoading(true);
    try {
      await fetchPrinters();
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, fetchPrinters]);

  // Tester l'imprimante sélectionnée
  const testPrinter = useCallback(async () => {
    if (!isConnected || !selectedPrinter) {
      alert('Veuillez vous connecter et sélectionner une imprimante');
      return;
    }

    setTestPrintStatus('printing');
    try {
      const instance = jsPrintManager.getInstance();
      const { ClientPrintJob, InstalledPrinter, PrintFileTXT } = instance;
      
      // Créer un job d'impression
      const cpj = new ClientPrintJob();
      cpj.clientPrinter = new InstalledPrinter(selectedPrinter);

      // Créer le texte de test
      const testText = `TEST D'IMPRIMANTE\n\n` +
        `Date: ${new Date().toLocaleDateString()}\n` +
        `Heure: ${new Date().toLocaleTimeString()}\n` +
        `Imprimante: ${selectedPrinter}\n\n` +
        `Ceci est un test pour vérifier que votre imprimante\n` +
        `est correctement configurée et fonctionne avec\n` +
        `l'application.\n\n` +
        `✅ Si vous voyez ce message, tout fonctionne !\n\n` +
        `------------------------------\n` +
        `Document généré automatiquement`;

      // Créer un blob avec le texte
      const textBlob = new Blob([testText], { type: 'text/plain' });
      const textUrl = URL.createObjectURL(textBlob);
      
      // IMPORTANT: Utiliser l'enum FileSourceType correctement
      // Dans jsprintmanager, c'est JSPrintManager.FileSourceType
      const fileSourceType = instance.JSPrintManager.FileSourceType || 0; // 0 = BLOB, 1 = URL
      
      // Créer le fichier à imprimer
      const printFile = new PrintFileTXT(
        textUrl,           // Contenu
        'test_imprimante.txt', // Nom du fichier
        1,                 // Nombre de copies
        fileSourceType     // Type de source
      );
      
      cpj.files.push(printFile);

      // Gérer la promesse d'impression
      await new Promise((resolve, reject) => {
        cpj.onFinished = () => {
          console.log('Impression terminée avec succès');
          URL.revokeObjectURL(textUrl);
          resolve();
        };

        cpj.onError = (error) => {
          console.error('Erreur d\'impression:', error);
          URL.revokeObjectURL(textUrl);
          reject(new Error(`Échec de l'impression: ${error.message || 'Erreur inconnue'}`));
        };

        cpj.sendToClient();
      });

      setTestPrintStatus('success');
      setTimeout(() => setTestPrintStatus(''), 3000);
      
    } catch (error) {
      console.error('Test print error:', error);
      setTestPrintStatus('error');
      setTimeout(() => setTestPrintStatus(''), 5000);
      throw error;
    }
  }, [isConnected, selectedPrinter]);

  // Obtenir le statut de connexion
  const getConnectionStatus = () => {
    switch (status) {
      case 'loading':
        return { text: 'Connexion en cours...', color: 'bg-blue-100 text-blue-800', borderColor: 'border-blue-300' };
      case 'connected':
        return { text: 'Connecté au service d\'impression', color: 'bg-green-100 text-green-800', borderColor: 'border-green-300' };
      case 'error':
        return { text: 'Erreur de connexion', color: 'bg-red-100 text-red-800', borderColor: 'border-red-300' };
      default:
        return { text: 'Déconnecté', color: 'bg-gray-100 text-gray-800', borderColor: 'border-gray-300' };
    }
  };

  const connectionStatus = getConnectionStatus();

  // Réinitialiser complètement les préférences
  const resetPreferences = useCallback(() => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser les préférences d\'imprimante ?')) {
      localStorage.removeItem(PRINTER_STORAGE_KEY);
      setSelectedPrinter('');
      setTestPrintStatus('');
      alert('Préférences d\'imprimante réinitialisées avec succès !');
      
      // Si connecté, sélectionner la première imprimante
      if (isConnected && printers.length > 0) {
        setTimeout(() => {
          const firstPrinter = printers[0];
          setSelectedPrinter(firstPrinter);
          saveSelectedPrinter(firstPrinter);
        }, 100);
      }
    }
  }, [isConnected, printers, saveSelectedPrinter]);

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* En-tête */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '1.875rem', 
          fontWeight: 'bold', 
          color: '#111827',
          marginBottom: '0.5rem'
        }}>
          🖨️ Sélection d'imprimante
        </h1>
        <p style={{ color: '#6b7280' }}>
          Choisissez et enregistrez votre imprimante par défaut pour l'utiliser dans toute l'application.
        </p>
      </div>

      {/* Statut de connexion */}
      <div style={{ 
        padding: '1rem', 
        marginBottom: '1.5rem',
        backgroundColor: connectionStatus.color.split(' ')[0],
        color: connectionStatus.color.split(' ')[1],
        border: `1px solid ${connectionStatus.borderColor}`,
        borderRadius: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ 
              margin: '0 0 0.25rem 0', 
              fontWeight: '500',
              fontSize: '1rem'
            }}>
              {isConnected ? '✅ Connecté' : '🔌 Déconnecté'}
            </h3>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>{connectionStatus.text}</p>
          </div>
          
          {!isConnected && (
            <div style={{ fontSize: '0.875rem', textAlign: 'right' }}>
              <p style={{ marginBottom: '0.25rem', fontWeight: '500' }}>Pour vous connecter :</p>
              <ol style={{ margin: 0, paddingLeft: '1rem' }}>
                <li>
                  <a 
                    href="https://neodynamic.com/downloads/jspm" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#2563eb', textDecoration: 'none' }}
                  >
                    Télécharger JSPrintManager
                  </a>
                </li>
                <li>Lancer l'application (icône dans la barre système)</li>
                <li>Rafraîchir cette page</li>
              </ol>
            </div>
          )}
        </div>
      </div>

      {/* Sélection d'imprimante */}
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        border: '1px solid #e5e7eb',
        padding: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem'
        }}>
          <div>
            <h2 style={{ 
              margin: 0, 
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#111827'
            }}>
              Imprimantes disponibles
            </h2>
            <p style={{ 
              marginTop: '0.25rem',
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              {printers.length > 0 
                ? `${printers.length} imprimante(s) détectée(s)` 
                : 'Aucune imprimante détectée'}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={refreshPrinters}
              disabled={!isConnected || isLoading}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: !isConnected || isLoading ? '#f3f4f6' : '#eff6ff',
                color: !isConnected || isLoading ? '#9ca3af' : '#1d4ed8',
                border: '1px solid',
                borderColor: !isConnected || isLoading ? '#e5e7eb' : '#dbeafe',
                borderRadius: '0.375rem',
                fontWeight: '500',
                cursor: !isConnected || isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {isLoading ? (
                <>
                  <div style={{
                    width: '1rem',
                    height: '1rem',
                    border: '2px solid #1d4ed8',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Chargement...
                </>
              ) : (
                <>
                  <span>🔄</span>
                  Rafraîchir
                </>
              )}
            </button>
          </div>
        </div>

        {isLoading && status === 'loading' ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{
              display: 'inline-block',
              width: '2rem',
              height: '2rem',
              border: '2px solid #3b82f6',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ marginTop: '0.5rem', color: '#6b7280' }}>Initialisation du service d'impression...</p>
          </div>
        ) : printers.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem',
            border: '2px dashed #e5e7eb',
            borderRadius: '0.375rem',
            backgroundColor: '#f9fafb'
          }}>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
              {isConnected 
                ? 'Aucune imprimante trouvée. Vérifiez que vos imprimantes sont allumées et connectées.'
                : 'Connectez-vous au service d\'impression pour voir les imprimantes disponibles.'
              }
            </p>
            {!isConnected && (
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Rafraîchir la page
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {printers.map((printer, index) => {
              const isSelected = selectedPrinter === printer;
              const isSavedPrinter = localStorage.getItem(PRINTER_STORAGE_KEY) === printer;
              
              return (
                <div
                  key={printer}
                  style={{
                    padding: '1rem',
                    borderRadius: '0.375rem',
                    border: '2px solid',
                    borderColor: isSelected ? '#3b82f6' : '#e5e7eb',
                    backgroundColor: isSelected ? '#eff6ff' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onClick={() => handleSelectPrinter(printer)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '1rem',
                      height: '1rem',
                      borderRadius: '50%',
                      backgroundColor: isSelected ? '#3b82f6' : '#d1d5db',
                      border: isSelected ? '2px solid #93c5fd' : '2px solid #e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {isSelected && (
                        <div style={{
                          width: '0.5rem',
                          height: '0.5rem',
                          borderRadius: '50%',
                          backgroundColor: 'white'
                        }}></div>
                      )}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ 
                          fontWeight: '600',
                          color: isSelected ? '#1e40af' : '#111827'
                        }}>
                          {printer}
                        </span>
                        {isSavedPrinter && (
                          <span style={{ 
                            padding: '0.125rem 0.5rem',
                            backgroundColor: '#dcfce7',
                            color: '#166534',
                            fontSize: '0.75rem',
                            borderRadius: '9999px',
                            fontWeight: '500'
                          }}>
                            Sauvegardée
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                        {index === 0 && (
                          <span style={{ 
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            backgroundColor: '#f3f4f6',
                            padding: '0.125rem 0.5rem',
                            borderRadius: '0.125rem'
                          }}>
                            Par défaut
                          </span>
                        )}
                        {isSelected && (
                          <span style={{ 
                            fontSize: '0.75rem',
                            color: '#1d4ed8',
                            fontWeight: '500'
                          }}>
                            Actuellement sélectionnée
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {isSelected && (
                      <span style={{ 
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#1d4ed8',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        <span>✓</span>
                        Sélectionnée
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Imprimante sélectionnée */}
        {selectedPrinter && (
          <div style={{ 
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: '#f0fdf4',
            border: '2px solid #86efac',
            borderRadius: '0.375rem',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ 
              position: 'absolute',
              top: '0',
              right: '0',
              width: '4rem',
              height: '4rem',
              backgroundColor: '#86efac',
              borderRadius: '0 0 0 100%',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-end',
              padding: '0.5rem'
            }}>
              <span style={{ color: '#166534', fontSize: '1.5rem' }}>🎯</span>
            </div>
            
            <div style={{ paddingRight: '4rem' }}>
              <h3 style={{ 
                fontWeight: '600',
                color: '#166534',
                margin: '0 0 0.5rem 0',
                fontSize: '1rem'
              }}>
                Imprimante par défaut enregistrée
              </h3>
              <div style={{ 
                backgroundColor: 'white',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid #bbf7d0',
                marginBottom: '1rem'
              }}>
                <p style={{ 
                  color: '#166534',
                  margin: 0,
                  fontWeight: '600',
                  fontSize: '1.125rem',
                  wordBreak: 'break-word'
                }}>
                  {selectedPrinter}
                </p>
              </div>
              
              <div style={{ 
                backgroundColor: '#f8fafc',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid #e2e8f0',
                marginBottom: '1rem'
              }}>
                <p style={{ 
                  fontSize: '0.875rem',
                  color: '#475569',
                  margin: '0 0 0.5rem 0',
                  fontWeight: '500'
                }}>
                  Texte qui sera imprimé pour le test :
                </p>
                <div style={{ 
                  backgroundColor: 'white',
                  padding: '0.75rem',
                  borderRadius: '0.25rem',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  maxHeight: '150px',
                  overflowY: 'auto'
                }}>
                  TEST D'IMPRIMANTE

                  Date: {new Date().toLocaleDateString()}
                  Heure: {new Date().toLocaleTimeString()}
                  Imprimante: {selectedPrinter}

                  Ceci est un test pour vérifier que votre imprimante
                  est correctement configurée et fonctionne avec
                  l'application.

                  ✅ Si vous voyez ce message, tout fonctionne !
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  onClick={async () => {
                    try {
                      await testPrinter();
                    } catch (error) {
                      alert(`Erreur lors du test d'impression : ${error.message || 'Erreur inconnue'}`);
                    }
                  }}
                  disabled={!isConnected || testPrintStatus === 'printing'}
                  style={{
                    padding: '0.625rem 1.25rem',
                    backgroundColor: !isConnected || testPrintStatus === 'printing' ? '#f3f4f6' : '#22c55e',
                    color: !isConnected || testPrintStatus === 'printing' ? '#9ca3af' : 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontWeight: '600',
                    cursor: !isConnected || testPrintStatus === 'printing' ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s',
                    fontSize: '0.875rem'
                  }}
                >
                  {testPrintStatus === 'printing' && (
                    <div style={{
                      width: '1rem',
                      height: '1rem',
                      border: '2px solid white',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                  )}
                  {testPrintStatus === 'printing' ? 'Impression en cours...' : 
                   testPrintStatus === 'success' ? '✅ Test réussi' : 
                   testPrintStatus === 'error' ? '❌ Échec du test' : 
                   '🖨️ Tester l\'impression'}
                </button>
                
                <button
                  onClick={resetPreferences}
                  style={{
                    padding: '0.625rem 1.25rem',
                    backgroundColor: 'transparent',
                    color: '#dc2626',
                    border: '1px solid #dc2626',
                    borderRadius: '0.375rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '0.875rem'
                  }}
                >
                  Changer d'imprimante
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div style={{ 
        backgroundColor: '#f0f9ff',
        border: '1px solid #bae6fd',
        borderRadius: '0.5rem',
        padding: '1.5rem'
      }}>
        <h3 style={{ 
          fontWeight: '600',
          color: '#0369a1',
          margin: '0 0 1rem 0',
          fontSize: '1.125rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>ℹ️</span>
          Comment utiliser cette fonctionnalité
        </h3>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{ 
            backgroundColor: 'white',
            padding: '1rem',
            borderRadius: '0.375rem',
            border: '1px solid #e0f2fe'
          }}>
            <div style={{
              width: '2rem',
              height: '2rem',
              backgroundColor: '#0ea5e9',
              color: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              marginBottom: '0.75rem'
            }}>
              1
            </div>
            <h4 style={{ fontWeight: '600', color: '#0c4a6e', margin: '0 0 0.5rem 0' }}>
              Installation
            </h4>
            <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: '1.5', margin: 0 }}>
              Téléchargez et lancez JSPrintManager. L'application doit rester ouverte en arrière-plan.
            </p>
          </div>
          
          <div style={{ 
            backgroundColor: 'white',
            padding: '1rem',
            borderRadius: '0.375rem',
            border: '1px solid #e0f2fe'
          }}>
            <div style={{
              width: '2rem',
              height: '2rem',
              backgroundColor: '#0ea5e9',
              color: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              marginBottom: '0.75rem'
            }}>
              2
            </div>
            <h4 style={{ fontWeight: '600', color: '#0c4a6e', margin: '0 0 0.5rem 0' }}>
              Sélection
            </h4>
            <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: '1.5', margin: 0 }}>
              Cliquez sur une imprimante dans la liste. Elle est automatiquement sauvegardée.
            </p>
          </div>
          
          <div style={{ 
            backgroundColor: 'white',
            padding: '1rem',
            borderRadius: '0.375rem',
            border: '1px solid #e0f2fe'
          }}>
            <div style={{
              width: '2rem',
              height: '2rem',
              backgroundColor: '#0ea5e9',
              color: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              marginBottom: '0.75rem'
            }}>
              3
            </div>
            <h4 style={{ fontWeight: '600', color: '#0c4a6e', margin: '0 0 0.5rem 0' }}>
              Test
            </h4>
            <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: '1.5', margin: 0 }}>
              Utilisez le bouton "Tester l'impression" pour vérifier que tout fonctionne correctement.
            </p>
          </div>
          
          <div style={{ 
            backgroundColor: 'white',
            padding: '1rem',
            borderRadius: '0.375rem',
            border: '1px solid #e0f2fe'
          }}>
            <div style={{
              width: '2rem',
              height: '2rem',
              backgroundColor: '#0ea5e9',
              color: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              marginBottom: '0.75rem'
            }}>
              4
            </div>
            <h4 style={{ fontWeight: '600', color: '#0c4a6e', margin: '0 0 0.5rem 0' }}>
              Persistance
            </h4>
            <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: '1.5', margin: 0 }}>
              Votre choix est sauvegardé et sera réutilisé automatiquement lors de vos prochaines visites.
            </p>
          </div>
        </div>
      </div>

      {/* Information de stockage */}
      <div style={{ 
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '0.5rem',
        textAlign: 'center'
      }}>
        <div style={{ 
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '0.75rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#f1f5f9',
          borderRadius: '9999px'
        }}>
          <span style={{ color: '#64748b' }}>💾</span>
          <span style={{ fontWeight: '500', color: '#475569' }}>
            Données sauvegardées localement
          </span>
        </div>
        
        <p style={{ 
          fontSize: '0.875rem',
          color: '#64748b',
          margin: '0 0 1rem 0',
          lineHeight: '1.5'
        }}>
          Votre sélection d'imprimante est stockée uniquement dans votre navigateur.<br />
          Elle ne sera pas perdue si vous fermez l'onglet, mais sera effacée si vous supprimez les données du site.
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button
            onClick={resetPreferences}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              color: '#dc2626',
              border: '1px solid #dc2626',
              borderRadius: '0.375rem',
              fontWeight: '500',
              cursor: 'pointer',
              fontSize: '0.875rem',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#fee2e2';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            Réinitialiser les préférences
          </button>
          
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontWeight: '500',
              cursor: 'pointer',
              fontSize: '0.875rem',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#2563eb';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#3b82f6';
            }}
          >
            Rafraîchir la page
          </button>
        </div>
      </div>

      {/* Style pour l'animation de spin */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 640px) {
          div {
            padding: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}