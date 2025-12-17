// Importez tous les fichiers de traduction
import { commonTranslations } from './common';
import { topbarTranslations } from './topbar';
import { usersTranslations } from './users';
import {salesConfigTranslations} from './sales_config'
import {registerTranslations} from './register'
import { addProductsTranslations} from './add_product'
import { categoriesTranslations} from './categories'
import { productsTranslations} from './products'
import {salesTranslations} from './sales'
import {productsTableTranslations} from './productsTableTranslations'
import {newSaleTranslations} from './new_sale'
import {sidebarTranslations} from './sideBar'
import { clientsTranslations } from './clientsTranslations';
import { reportsTranslations } from './reports';

// Fusionnez TOUTES les traductions dans un seul objet comme avant
const translations = {
  en: {
    // Common
    ...commonTranslations.en,
    // TopBar
    ...topbarTranslations.en,
    // Users
    ...usersTranslations.en,
    ...salesConfigTranslations.en,
    ...registerTranslations.en,
    ...addProductsTranslations.en,
    ...categoriesTranslations.en,
    ...productsTranslations.en,
    ...productsTableTranslations.en,
    ...salesTranslations.en,
    ...newSaleTranslations.en,
    ...sidebarTranslations.en,
    ...clientsTranslations.en,
     ...reportsTranslations.en,
    // Ajoutez d'autres ici au même niveau
  },
  fr: {
    // Common
    ...commonTranslations.fr,
    // TopBar
    ...topbarTranslations.fr,
    // Users
    ...usersTranslations.fr,
    ...salesConfigTranslations.fr,
    ...registerTranslations.fr,
    ...addProductsTranslations.fr,
     ...categoriesTranslations.fr,
     ...productsTranslations.fr,
     ...productsTableTranslations.fr,
     ...salesTranslations.fr,
     ...newSaleTranslations.fr,
     ...sidebarTranslations.fr,
      ...clientsTranslations.fr,
        ...reportsTranslations.fr
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
export {clientsTranslations,reportsTranslations, commonTranslations, addProductsTranslations ,newSaleTranslations,topbarTranslations,productsTranslations, usersTranslations ,salesTranslations,registerTranslations,sidebarTranslations,categoriesTranslations};