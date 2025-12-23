
// // 'use client';

// // import { useEffect, useState, useRef } from 'react';

// // export default function PrintManagerProvider({ children }) {
// //   const [isConnected, setIsConnected] = useState(false);
// //   const jspmRef = useRef(null);

// //   useEffect(() => {
// //     let isMounted = true;

// //     const init = async () => {
// //       try {
// //         const module = await import('jsprintmanager');
// //         jspmRef.current = module;
// //         const { JSPrintManager, WSStatus } = module;
        
// //         JSPrintManager.auto_reconnect = true;
// //         JSPrintManager.start();

// //         JSPrintManager.WS.onStatusChanged = () => {
// //           if (!isMounted) return;
// //           const connected = JSPrintManager.websocket_status === WSStatus.Open;
// //           setIsConnected(connected);
// //           console.log('Printer service:', connected ? 'Connected' : 'Disconnected');
// //         };
// //       } catch (error) {
// //         console.error('JSPrintManager error:', error);
// //       }
// //     };

// //     init();

// //     return () => {
// //       isMounted = false;
// //       if (jspmRef.current?.JSPrintManager?.stop) {
// //         jspmRef.current.JSPrintManager.stop();
// //       }
// //     };
// //   }, []);

// //   return (
// //     <>
// //       {/* Affiche uniquement en mode développement */}
// //       {process.env.NODE_ENV === 'development' && (
// //         <div style={{ 
// //           position: 'fixed', 
// //           bottom: '10px', 
// //           right: '10px', 
// //           padding: '5px 10px',
// //           background: isConnected ? '#4CAF50' : '#f44336',
// //           color: 'white',
// //           borderRadius: '3px',
// //           fontSize: '12px',
// //           zIndex: 9999,
// //           opacity: 0.8
// //         }}>
// //           🖨️ {isConnected ? 'Connected' : 'Disconnected'}
// //         </div>
// //       )}
// //       {children}
// //     </>
// //   );
// // }


// 'use client';

// import { useEffect, useState } from 'react';
// import { jsPrintManager } from '@/lib/jsprintmanager-singleton';

// export default function PrintManagerProvider({ children }) {
//   const [isConnected, setIsConnected] = useState(false);

//   useEffect(() => {
//     // Initialiser le singleton
//     jsPrintManager.initialize().catch(console.error);
    
//     // S'abonner aux changements de statut
//     const removeListener = jsPrintManager.addStatusListener((connected) => {
//       setIsConnected(connected);
//     });

//     // Cleanup
//     return () => {
//       removeListener();
//       // NE PAS arrêter JSPrintManager ici - la connexion reste active
//     };
//   }, []);

//   return (
//     <>
//       {/* Affiche uniquement en mode développement */}
//       {process.env.NODE_ENV === 'development' && (
//         <div style={{ 
//           position: 'fixed', 
//           bottom: '10px', 
//           right: '10px', 
//           padding: '5px 10px',
//           background: isConnected ? '#4CAF50' : '#f44336',
//           color: 'white',
//           borderRadius: '3px',
//           fontSize: '12px',
//           zIndex: 9999,
//           opacity: 0.8
//         }}>
//           🖨️ {isConnected ? 'Connected' : 'Disconnected'}
//         </div>
//       )}
//       {children}
//     </>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import { jsPrintManager } from '@/lib/jsprintmanager-singleton';

export default function PrintManagerProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // Pour permettre de cacher le statut

  useEffect(() => {
    // Initialiser le singleton
    jsPrintManager.initialize().catch(console.error);
    
    // S'abonner aux changements de statut
    const removeListener = jsPrintManager.addStatusListener((connected) => {
      setIsConnected(connected);
    });

    // Cleanup
    return () => {
      removeListener();
    };
  }, []);

  // Fonction pour basculer la visibilité
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      {children}
      
      {/* Affiche le statut en production aussi, avec option de cacher */}
      <div 
        className="print-manager-status"
        style={{ 
          position: 'fixed', 
          bottom: '10px', 
          right: '10px', 
          padding: '5px 10px',
          background: isConnected ? '#4CAF50' : '#f44336',
          color: 'white',
          borderRadius: '5px',
          fontSize: '12px',
          zIndex: 9999,
          opacity: isVisible ? 0.8 : 0,
          transition: 'opacity 0.3s ease',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          maxWidth: isVisible ? '200px' : '40px',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        }}
        onClick={toggleVisibility}
        title={isVisible ? "Cliquer pour cacher" : "Cliquer pour afficher"}
      >
        {/* Icône d'imprimante avec animation */}
        <div style={{
          animation: isConnected ? 'pulse 2s infinite' : 'none'
        }}>
          🖨️
        </div>
        
        {/* Texte du statut */}
        {isVisible && (
          <span style={{
            whiteSpace: 'nowrap',
            fontWeight: 'bold'
          }}>
            {isConnected ? 'connectée' : 'déconnectée'}
          </span>
        )}
        
        {/* Icône d'info seulement quand réduit */}
        {!isVisible && (
          <span style={{
            fontSize: '10px',
            opacity: 0.7
          }}>
            i
          </span>
        )}
      </div>

      {/* Style pour l'animation de pulse */}
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }
        
        /* Sur mobile, afficher plus petit */
        @media (max-width: 768px) {
          .print-manager-status {
            font-size: 10px;
            padding: 3px 6px;
            bottom: 5px;
            right: 5px;
          }
        }
      `}</style>
    </>
  );
}