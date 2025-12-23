// 'use client'

// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { getCurrentLanguage, setCurrentLanguage, t } from '@/lib/i18n';

// const LanguageContext = createContext();

// export function LanguageProvider({ children }) {
//   const [language, setLanguageState] = useState('fr');
//   const [isInitialized, setIsInitialized] = useState(false);

//   useEffect(() => {
//     // Initialiser la langue au chargement
//     const savedLanguage = getCurrentLanguage();
//     setLanguageState(savedLanguage);
//     setIsInitialized(true);
//   }, []);

//   const changeLanguage = (lang) => {
//     setCurrentLanguage(lang);
//     setLanguageState(lang);
//     // Forcer le re-render de tous les composants
//     window.dispatchEvent(new Event('languageChanged'));
//   };

//   const translate = (key) => t(key, language);

//   if (!isInitialized) {
//     return null;
//   }

//   return (
//     <LanguageContext.Provider value={{ language, changeLanguage, t: translate }}>
//       {children}
//     </LanguageContext.Provider>
//   );
// }

// export function useLanguage() {
//   const context = useContext(LanguageContext);
//   if (!context) {
//     throw new Error('useLanguage must be used within a LanguageProvider');
//   }
//   return context;
// }

//contexts/languagecontext.js
'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentLanguage, setCurrentLanguage, t } from '@/lib/locales'; // Changez l'import ici

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState('fr');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialiser la langue au chargement
    const savedLanguage = getCurrentLanguage();
    setLanguageState(savedLanguage);
    setIsInitialized(true);
  }, []);

  const changeLanguage = (lang) => {
    setCurrentLanguage(lang);
    setLanguageState(lang);
    // Forcer le re-render de tous les composants
    window.dispatchEvent(new Event('languageChanged'));
  };

  const translate = (key) => t(key, language);

  if (!isInitialized) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t: translate }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}