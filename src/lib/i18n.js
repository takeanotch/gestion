// // Stockage des traductions
// const translations = {
//   en: {
//     // TopBar
//     dashboard: "Dashboard",
//     search: "Search...",
//     help: "Help",
//     notifications: "Notifications",
//     allRead: "Mark all as read",
//     clearAll: "Clear all",
//     unread: "unread",
//     noNotifications: "No notifications at the moment",
//     viewProducts: "View products",
//     lowStock: "product(s) low in stock",
//     attentionRequired: "product(s) require attention",
//     stockDetected: "Low stock detected",
//     seeProducts: "View products",
//     seeAllNotifications: "See all notifications",
//     navigation: "Navigation",
//     language: "Language",
//     application: "Application",
//     settings: "Settings",
//     helpSupport: "Help & Support",
//     logout: "Logout",
//     profile: "My Profile",
//     languageSelection: "Language / Langue",
//     category: "Category",
//     supplier: "Supplier",
//     delete: "Delete",
//     markRead: "Mark as read",
//     lowStockAlert: "products low in stock",
    
//     // Rôles
//     'super-admin': 'Super Admin',
//     'admin': 'Administrator',
//     'vendor': 'Seller',
    
//     // Pages
//     'dashboard': 'Dashboard',
//     'profile': 'My Profile',
//     'users': 'Users',
//     'products': 'Products',
//     'orders': 'Orders',
//     'inventory': 'Inventory',
//     'reports': 'Reports',
//     'vendors': 'Sellers',
//     'stats': 'Statistics',
//     'scanner': 'Scanner',
//     'settings': 'Settings',
//     'help': 'Help & Support'
//   },
//   fr: {
//     // TopBar
//     dashboard: "Tableau de bord",
//     search: "Rechercher...",
//     help: "Aide",
//     notifications: "Notifications",
//     allRead: "Tout marquer comme lu",
//     clearAll: "Tout effacer",
//     unread: "non lu",
//     noNotifications: "Aucune notification pour le moment",
//     viewProducts: "Voir les produits",
//     lowStock: "produit(s) en stock faible",
//     attentionRequired: "produit(s) nécessite(nt) attention",
//     stockDetected: "Stock faible détecté",
//     seeProducts: "Voir les produits",
//     seeAllNotifications: "Voir toutes les notifications",
//     navigation: "Navigation",
//     language: "Langue",
//     application: "Application",
//     settings: "Paramètres",
//     helpSupport: "Aide & Support",
//     logout: "Déconnexion",
//     profile: "Mon Profil",
//     languageSelection: "Langue / Language",
//     category: "Catégorie",
//     supplier: "Fournisseur",
//     delete: "Supprimer",
//     markRead: "Marquer comme lu",
//     lowStockAlert: "produits en stock faible",
    
//     // Rôles
//     'super-admin': 'Super Admin',
//     'admin': 'Administrateur',
//     'vendor': 'Vendeur',
    
//     // Pages
//     'dashboard': 'Tableau de bord',
//     'profile': 'Mon Profil',
//     'users': 'Utilisateurs',
//     'products': 'Produits',
//     'orders': 'Commandes',
//     'inventory': 'Inventaire',
//     'reports': 'Rapports',
//     'vendors': 'Vendeurs',
//     'stats': 'Statistiques',
//     'scanner': 'Scanner',
//     'settings': 'Paramètres',
//     'help': 'Aide & Support'
//   }
// };

// // Fonction pour obtenir la langue courante
// export function getCurrentLanguage() {
//   if (typeof window !== 'undefined') {
//     return localStorage.getItem('language') || 'fr';
//   }
//   return 'fr';
// }

// // Fonction pour définir la langue
// export function setCurrentLanguage(lang) {
//   if (typeof window !== 'undefined') {
//     localStorage.setItem('language', lang);
//   }
// }

// // Fonction de traduction
// export function t(key, lang = null) {
//   const currentLang = lang || getCurrentLanguage();
//   return translations[currentLang]?.[key] || key;
// }

// // Hook personnalisé pour React
// export function useTranslation() {
//   const [language, setLanguage] = useState(getCurrentLanguage());

//   useEffect(() => {
//     // Écouter les changements de langue
//     const handleStorageChange = () => {
//       setLanguage(getCurrentLanguage());
//     };

//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, []);

//   const changeLanguage = (lang) => {
//     setCurrentLanguage(lang);
//     setLanguage(lang);
//     window.dispatchEvent(new Event('storage')); // Déclencher le recalcul
//   };

//   const translate = (key) => t(key, language);

//   return { t: translate, language, changeLanguage };
// }
// Stockage des traductions
const translations = {
  en: {
    // TopBar
    dashboard: "Dashboard",
    search: "Search...",
    help: "Help",
    notifications: "Notifications",
    allRead: "Mark all as read",
    clearAll: "Clear all",
    unread: "unread",
    noNotifications: "No notifications at the moment",
    viewProducts: "View products",
    lowStock: "product(s) low in stock",
    attentionRequired: "product(s) require attention",
    stockDetected: "Low stock detected",
    seeProducts: "View products",
    seeAllNotifications: "See all notifications",
    navigation: "Navigation",
    language: "Language",
    application: "Application",
    settings: "Settings",
    helpSupport: "Help & Support",
    logout: "Logout",
    profile: "My Profile",
    languageSelection: "Language / Langue",
    category: "Category",
    supplier: "Supplier",
    delete: "Delete",
    markRead: "Mark as read",
    lowStockAlert: "products low in stock",
    
    // Rôles
    'super-admin': 'Super Admin',
    'admin': 'Administrator',
    'vendor': 'Seller',
    
    // Pages
    'dashboard': 'Dashboard',
    'profile': 'My Profile',
    'users': 'Users',
    'products': 'Products',
    'orders': 'Orders',
    'inventory': 'Inventory',
    'reports': 'Reports',
    'vendors': 'Sellers',
    'stats': 'Statistics',
    'scanner': 'Scanner',
    'settings': 'Settings',
    'help': 'Help & Support',
    
    // Users Management Page
    'usersManagement': 'Users Management',
    'usersFound': 'user(s) found',
    'newUser': 'New User',
    'total': 'Total',
    'active': 'Active',
    'sellers': 'Sellers',
    'allRoles': 'All roles',
    'allStatuses': 'All statuses',
    'activeStatus': 'Active',
    'inactive': 'Inactive',
    'reset': 'Reset',
    'user': 'User',
    'role': 'Role',
    'contact': 'Contact',
    'status': 'Status',
    'registration': 'Registration',
    'actions': 'Actions',
    'noUsersFound': 'No users found',
    'page': 'Page',
    'of': 'of',
    'viewDetails': 'View details',
    'edit': 'Edit',
    'deleteUser': 'Delete user',
    'userDetails': 'User details',
    'personalInformation': 'Personal Information',
    'store': 'Store',
    'dates': 'Dates',
    'signup': 'Sign up',
    'lastLogin': 'Last login',
    'close': 'Close',
    'modify': 'Modify',
    'editUser': 'Edit User',
    'fullName': 'Full name',
    'phone': 'Phone',
    'storeName': 'Store name',
    'changePassword': 'Change password',
    'newPassword': 'New password',
    'confirmPassword': 'Confirm password',
    'passwordPlaceholder': 'Leave blank to not change',
    'confirmPasswordPlaceholder': 'Confirm the password',
    'passwordsNoMatch': 'Passwords do not match',
    'passwordMinLength': 'Password must contain at least 6 characters',
    'passwordChangeError': 'Error changing password',
    'cancel': 'Cancel',
    'save': 'Save',
    'deleteConfirmation': 'Confirm deletion',
    'deleteUserConfirm': 'Delete user',
    'confirmDeleteMessage': 'Delete user',
    'deleting': 'Deleting',
    'loadingUsers': 'Loading users...',
    'vendorPlural': 'Sellers',
    'superAdmin': 'Super Admin',
    'administrator': 'Administrator',
    'seller': 'Seller',
    'shopName': 'Shop name',
    'statusActive': 'Active',
    'statusInactive': 'Inactive',
    'toggleStatus': 'Toggle status',
    'mobileView': 'View',
    'mobileEdit': 'Edit',
    'mobileDelete': 'Delete',
    'passwordStrength': 'Password strength',
    'passwordRequirements': 'At least 6 characters',
    'updateSuccess': 'User updated successfully!',
    'updateError': 'Error updating',
    'deleteSuccess': 'User deleted successfully',
    'deleteError': 'Error deleting',
    'statusChangeError': 'Error changing status',
    'permissionDenied': 'Permission denied',
    'redirecting': 'Redirecting...',
    'areYouSure': 'Are you sure?',
    'thisActionCannotBeUndone': 'This action cannot be undone',
    'yesDelete': 'Yes, delete',
    'noCancel': 'No, cancel',
    'passwordUpdated': 'Password updated',
    'profileImage': 'Profile image',
    'username': 'Username',
    'email': 'Email',
    'address': 'Address',
    'createdAt': 'Created at',
    'updatedAt': 'Updated at',
    'filterBy': 'Filter by',
    'searchUsers': 'Search users...',
    'exportUsers': 'Export users',
    'importUsers': 'Import users',
    'bulkActions': 'Bulk actions',
    'selectAll': 'Select all',
    'deselectAll': 'Deselect all',
    'bulkDelete': 'Bulk delete',
    'bulkActivate': 'Bulk activate',
    'bulkDeactivate': 'Bulk deactivate',
    'selectedCount': 'selected',
    'apply': 'Apply',
    'clearFilters': 'Clear filters',
    'sortBy': 'Sort by',
    'nameAZ': 'Name (A-Z)',
    'nameZA': 'Name (Z-A)',
    'newestFirst': 'Newest first',
    'oldestFirst': 'Oldest first',
    'lastActive': 'Last active',
    'filterResults': 'Filter results',
    'show': 'Show',
    'entries': 'entries',
    'perPage': 'per page',
    'previous': 'Previous',
    'next': 'Next',
    'first': 'First',
    'last': 'Last',
    'jumpToPage': 'Jump to page',
    'showing': 'Showing',
    'to': 'to',
    'view': 'View',
    'moreOptions': 'More options',
    'sendPasswordReset': 'Send password reset',
    'resendInvitation': 'Resend invitation',
    'impersonate': 'Impersonate',
    'loginAsUser': 'Login as user',
    'activityLog': 'Activity log',
    'permissions': 'Permissions',
    'twoFactor': 'Two-factor authentication',
    'apiKeys': 'API keys',
    'sessions': 'Sessions',
    'notes': 'Notes',
    'addNote': 'Add note',
    'saveNote': 'Save note',
    'notesPlaceholder': 'Add a private note about this user...',
    'lastUpdated': 'Last updated',
    'by': 'by'
  },
  fr: {
    // TopBar
    dashboard: "Tableau de bord",
    search: "Rechercher...",
    help: "Aide",
    notifications: "Notifications",
    allRead: "Tout marquer comme lu",
    clearAll: "Tout effacer",
    unread: "non lu",
    noNotifications: "Aucune notification pour le moment",
    viewProducts: "Voir les produits",
    lowStock: "produit(s) en stock faible",
    attentionRequired: "produit(s) nécessite(nt) attention",
    stockDetected: "Stock faible détecté",
    seeProducts: "Voir les produits",
    seeAllNotifications: "Voir toutes les notifications",
    navigation: "Navigation",
    language: "Langue",
    application: "Application",
    settings: "Paramètres",
    helpSupport: "Aide & Support",
    logout: "Déconnexion",
    profile: "Mon Profil",
    languageSelection: "Langue / Language",
    category: "Catégorie",
    supplier: "Fournisseur",
    delete: "Supprimer",
    markRead: "Marquer comme lu",
    lowStockAlert: "produits en stock faible",
    
    // Rôles
    'super-admin': 'Super Admin',
    'admin': 'Administrateur',
    'vendor': 'Vendeur',
    
    // Pages
    'dashboard': 'Tableau de bord',
    'profile': 'Mon Profil',
    'users': 'Utilisateurs',
    'products': 'Produits',
    'orders': 'Commandes',
    'inventory': 'Inventaire',
    'reports': 'Rapports',
    'vendors': 'Vendeurs',
    'stats': 'Statistiques',
    'scanner': 'Scanner',
    'settings': 'Paramètres',
    'help': 'Aide & Support',
    
    // Users Management Page
    'usersManagement': 'Gestion des Utilisateurs',
    'usersFound': 'utilisateur(s) trouvé(s)',
    'newUser': 'Nouvel utilisateur',
    'total': 'Total',
    'active': 'Actifs',
    'sellers': 'Vendeurs',
    'allRoles': 'Tous les rôles',
    'allStatuses': 'Tous les statuts',
    'activeStatus': 'Actif',
    'inactive': 'Inactif',
    'reset': 'Réinitialiser',
    'user': 'Utilisateur',
    'role': 'Rôle',
    'contact': 'Contact',
    'status': 'Statut',
    'registration': 'Inscription',
    'actions': 'Actions',
    'noUsersFound': 'Aucun utilisateur trouvé',
    'page': 'Page',
    'of': 'sur',
    'viewDetails': 'Voir détails',
    'edit': 'Modifier',
    'deleteUser': 'Supprimer',
    'userDetails': 'Détails utilisateur',
    'personalInformation': 'Informations personnelles',
    'store': 'Magasin',
    'dates': 'Dates',
    'signup': 'Inscription',
    'lastLogin': 'Dernière connexion',
    'close': 'Fermer',
    'modify': 'Modifier',
    'editUser': 'Modifier utilisateur',
    'fullName': 'Nom complet',
    'phone': 'Téléphone',
    'storeName': 'Nom du magasin',
    'changePassword': 'Changer le mot de passe',
    'newPassword': 'Nouveau mot de passe',
    'confirmPassword': 'Confirmer le mot de passe',
    'passwordPlaceholder': 'Laissez vide pour ne pas changer',
    'confirmPasswordPlaceholder': 'Confirmez le mot de passe',
    'passwordsNoMatch': 'Les mots de passe ne correspondent pas',
    'passwordMinLength': 'Le mot de passe doit contenir au moins 6 caractères',
    'passwordChangeError': 'Erreur lors du changement de mot de passe',
    'cancel': 'Annuler',
    'save': 'Enregistrer',
    'deleteConfirmation': 'Confirmer la suppression',
    'deleteUserConfirm': 'Supprimer l\'utilisateur',
    'confirmDeleteMessage': 'Supprimer l\'utilisateur',
    'deleting': 'Suppression...',
    'loadingUsers': 'Chargement des utilisateurs...',
    'vendorPlural': 'Vendeurs',
    'superAdmin': 'Super Admin',
    'administrator': 'Administrateur',
    'seller': 'Vendeur',
    'shopName': 'Nom du magasin',
    'statusActive': 'Actif',
    'statusInactive': 'Inactif',
    'toggleStatus': 'Changer le statut',
    'mobileView': 'Voir',
    'mobileEdit': 'Modifier',
    'mobileDelete': 'Supprimer',
    'passwordStrength': 'Force du mot de passe',
    'passwordRequirements': 'Au moins 6 caractères',
    'updateSuccess': 'Utilisateur mis à jour avec succès!',
    'updateError': 'Erreur lors de la mise à jour',
    'deleteSuccess': 'Utilisateur supprimé avec succès',
    'deleteError': 'Erreur lors de la suppression',
    'statusChangeError': 'Erreur lors du changement de statut',
    'permissionDenied': 'Permission refusée',
    'redirecting': 'Redirection...',
    'areYouSure': 'Êtes-vous sûr ?',
    'thisActionCannotBeUndone': 'Cette action ne peut pas être annulée',
    'yesDelete': 'Oui, supprimer',
    'noCancel': 'Non, annuler',
    'passwordUpdated': 'Mot de passe mis à jour',
    'profileImage': 'Image de profil',
    'username': 'Nom d\'utilisateur',
    'email': 'Email',
    'address': 'Adresse',
    'createdAt': 'Créé le',
    'updatedAt': 'Mis à jour le',
    'filterBy': 'Filtrer par',
    'searchUsers': 'Rechercher des utilisateurs...',
    'exportUsers': 'Exporter les utilisateurs',
    'importUsers': 'Importer des utilisateurs',
    'bulkActions': 'Actions groupées',
    'selectAll': 'Tout sélectionner',
    'deselectAll': 'Tout désélectionner',
    'bulkDelete': 'Supprimer en masse',
    'bulkActivate': 'Activer en masse',
    'bulkDeactivate': 'Désactiver en masse',
    'selectedCount': 'sélectionné(s)',
    'apply': 'Appliquer',
    'clearFilters': 'Effacer les filtres',
    'sortBy': 'Trier par',
    'nameAZ': 'Nom (A-Z)',
    'nameZA': 'Nom (Z-A)',
    'newestFirst': 'Plus récent d\'abord',
    'oldestFirst': 'Plus ancien d\'abord',
    'lastActive': 'Dernière activité',
    'filterResults': 'Filtrer les résultats',
    'show': 'Afficher',
    'entries': 'entrées',
    'perPage': 'par page',
    'previous': 'Précédent',
    'next': 'Suivant',
    'first': 'Premier',
    'last': 'Dernier',
    'jumpToPage': 'Aller à la page',
    'showing': 'Affichage de',
    'to': 'à',
    'view': 'Voir',
    'moreOptions': 'Plus d\'options',
    'sendPasswordReset': 'Envoyer réinitialisation mot de passe',
    'resendInvitation': 'Renvoyer l\'invitation',
    'impersonate': 'Impersonnifier',
    'loginAsUser': 'Se connecter en tant qu\'utilisateur',
    'activityLog': 'Journal d\'activité',
    'permissions': 'Permissions',
    'twoFactor': 'Authentification à deux facteurs',
    'apiKeys': 'Clés API',
    'sessions': 'Sessions',
    'notes': 'Notes',
    'addNote': 'Ajouter une note',
    'saveNote': 'Enregistrer la note',
    'notesPlaceholder': 'Ajouter une note privée sur cet utilisateur...',
    'lastUpdated': 'Dernière mise à jour',
    'by': 'par'
  }
};

// Fonction pour obtenir la langue courante
export function getCurrentLanguage() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('language') || 'fr';
  }
  return 'fr';
}

// Fonction pour définir la langue
export function setCurrentLanguage(lang) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lang);
  }
}

// Fonction de traduction
export function t(key, lang = null) {
  const currentLang = lang || getCurrentLanguage();
  return translations[currentLang]?.[key] || key;
}

// Hook personnalisé pour React
export function useTranslation() {
  const [language, setLanguage] = useState(getCurrentLanguage());

  useEffect(() => {
    // Écouter les changements de langue
    const handleStorageChange = () => {
      setLanguage(getCurrentLanguage());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const changeLanguage = (lang) => {
    setCurrentLanguage(lang);
    setLanguage(lang);
    window.dispatchEvent(new Event('storage')); // Déclencher le recalcul
  };

  const translate = (key) => t(key, language);

  return { t: translate, language, changeLanguage };
}