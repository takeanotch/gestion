
// 'use client';

// import { useEffect, useState, useRef } from 'react';

// export default function PrintManagerProvider({ children }) {
//   const [isConnected, setIsConnected] = useState(false);
//   const jspmRef = useRef(null);

//   useEffect(() => {
//     let isMounted = true;

//     const init = async () => {
//       try {
//         const module = await import('jsprintmanager');
//         jspmRef.current = module;
//         const { JSPrintManager, WSStatus } = module;
        
//         JSPrintManager.auto_reconnect = true;
//         JSPrintManager.start();

//         JSPrintManager.WS.onStatusChanged = () => {
//           if (!isMounted) return;
//           const connected = JSPrintManager.websocket_status === WSStatus.Open;
//           setIsConnected(connected);
//           console.log('Printer service:', connected ? 'Connected' : 'Disconnected');
//         };
//       } catch (error) {
//         console.error('JSPrintManager error:', error);
//       }
//     };

//     init();

//     return () => {
//       isMounted = false;
//       if (jspmRef.current?.JSPrintManager?.stop) {
//         jspmRef.current.JSPrintManager.stop();
//       }
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
      // NE PAS arrêter JSPrintManager ici - la connexion reste active
    };
  }, []);

  return (
    <>
      {/* Affiche uniquement en mode développement */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ 
          position: 'fixed', 
          bottom: '10px', 
          right: '10px', 
          padding: '5px 10px',
          background: isConnected ? '#4CAF50' : '#f44336',
          color: 'white',
          borderRadius: '3px',
          fontSize: '12px',
          zIndex: 9999,
          opacity: 0.8
        }}>
          🖨️ {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      )}
      {children}
    </>
  );
}