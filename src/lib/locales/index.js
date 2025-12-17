// import { topbarTranslations } from './topbar';
// import { usersTranslations } from './users';

// // Ajoutez d'autres fichiers ici quand vous en créez
// // import { productsTranslations } from './products';
// // import { dashboardTranslations } from './dashboard';

// // Toutes les traductions regroupées
// export const translations = {
//   topbar: topbarTranslations,
//   users: usersTranslations,
//   // Ajoutez ici
//   // products: productsTranslations,
//   // dashboard: dashboardTranslations,
// };

// // Fonction simple pour changer la langue
// export function setLanguage(lang) {
//   if (typeof window !== 'undefined') {
//     localStorage.setItem('language', lang);
//     window.dispatchEvent(new Event('languageChanged'));
//   }
// }

// // Fonction simple pour récupérer la langue
// export function getLanguage() {
//   if (typeof window !== 'undefined') {
//     return localStorage.getItem('language') || 'fr';
//   }
//   return 'fr';
// }

// // Fonction de traduction principale - SIMPLE !
// export function t(key, page = 'common') {
//   const lang = getLanguage();
//   const pageTranslations = translations[page];
  
//   if (!pageTranslations) {
//     console.warn(`Page "${page}" non trouvée dans les traductions`);
//     return key;
//   }
  
//   const translation = pageTranslations[lang]?.[key];
//   return translation || key;
// }

// // Hook React simple
// export function useTranslation(page = 'common') {
//   const [language, setLanguageState] = React.useState(getLanguage());
  
//   React.useEffect(() => {
//     const handleLanguageChange = () => {
//       setLanguageState(getLanguage());
//     };
    
//     window.addEventListener('languageChanged', handleLanguageChange);
//     return () => window.removeEventListener('languageChanged', handleLanguageChange);
//   }, []);
  
//   const changeLanguage = (lang) => {
//     setLanguage(lang);
//     setLanguageState(lang);
//   };
  
//   const translate = (key) => t(key, page);
  
//   return {
//     t: translate,
//     language,
//     changeLanguage
//   };
// }

// // Exportez aussi chaque objet si besoin
// export { topbarTranslations, usersTranslations };
// Importez tous les fichiers de traduction
import { commonTranslations } from './common';
import { topbarTranslations } from './topbar';
import { usersTranslations } from './users';

// Fusionnez TOUTES les traductions dans un seul objet comme avant
const translations = {
  en: {
    // Common
    ...commonTranslations.en,
    // TopBar
    ...topbarTranslations.en,
    // Users
    ...usersTranslations.en,
    // Ajoutez d'autres ici au même niveau
  },
  fr: {
    // Common
    ...commonTranslations.fr,
    // TopBar
    ...topbarTranslations.fr,
    // Users
    ...usersTranslations.fr,
    // Ajoutez d'autres ici au même niveau
  }
};

// LES MÊMES FONCTIONS QU'AVANT
export function getCurrentLanguage() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('language') || 'fr';
  }
  return 'fr';
}

export function setCurrentLanguage(lang) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lang);
  }
}

export function t(key, lang = null) {
  const currentLang = lang || getCurrentLanguage();
  return translations[currentLang]?.[key] || key;
}

// Hook personnalisé pour React (identique)
export function useTranslation() {
  const [language, setLanguage] = React.useState(getCurrentLanguage());

  React.useEffect(() => {
    const handleStorageChange = () => {
      setLanguage(getCurrentLanguage());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const changeLanguage = (lang) => {
    setCurrentLanguage(lang);
    setLanguage(lang);
    window.dispatchEvent(new Event('storage'));
  };

  const translate = (key) => t(key, language);

  return { t: translate, language, changeLanguage };
}

// Exportez aussi les objets individuels si besoin
export { commonTranslations, topbarTranslations, usersTranslations };