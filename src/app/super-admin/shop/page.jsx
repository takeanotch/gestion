

// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { useForm } from 'react-hook-form';
// import { supabase } from '@/lib/supabase';
// import Image from 'next/image';
// import { 
//   Store, 
//   Image as ImageIcon, 
//   MessageSquare, 
//   Printer, 
//   Clock, 
//   Globe, 
//   Settings, 
//   Save,
//   Upload,
//   X,
//   Check,
//   AlertCircle
// } from 'lucide-react';

// export default function ShopConfigPage() {
//   const [activeTab, setActiveTab] = useState('general');
//   const [config, setConfig] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [uploading, setUploading] = useState({});
//   const [previewImages, setPreviewImages] = useState({});
//   const [indicatorStyle, setIndicatorStyle] = useState({});
//   const tabRefs = useRef({});

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     watch,
//     setValue,
//   } = useForm();

//   const tabs = [
//     { id: 'general', label: 'Général', icon: <Store size={18} /> },
//     { id: 'images', label: 'Images', icon: <ImageIcon size={18} /> },
//     { id: 'messages', label: 'Messages', icon: <MessageSquare size={18} /> },
//     { id: 'printing', label: 'Impression', icon: <Printer size={18} /> },
//     { id: 'schedule', label: 'Horaires', icon: <Clock size={18} /> },
//     { id: 'online', label: 'En ligne', icon: <Globe size={18} /> },
//   ];

//   // Mettre à jour la position de l'indicateur quand l'onglet change
//   useEffect(() => {
//     if (tabRefs.current[activeTab]) {
//       const activeElement = tabRefs.current[activeTab];
//       const { offsetLeft, offsetWidth } = activeElement;
      
//       setIndicatorStyle({
//         left: `${offsetLeft}px`,
//         width: `${offsetWidth}px`,
//         opacity: 1
//       });
//     }
//   }, [activeTab]);

//   // Charger la configuration
//   useEffect(() => {
//     loadConfig();
//   }, []);

//   const loadConfig = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('shop_config')
//         .select('*')
//         .single();

//       if (error && error.code !== 'PGRST116') throw error;

//       if (data) {
//         // Convertir business_hours JSON pour les champs
//         if (data.business_hours) {
//           data.opening_time = data.business_hours.opening_time || '08:00';
//           data.closing_time = data.business_hours.closing_time || '18:00';
//           data.working_days = data.business_hours.working_days?.join(',') || '1,2,3,4,5,6';
//         }
        
//         setConfig(data);
//         reset(data);
        
//         // Précharger les prévisualisations d'images
//         const previews = {};
//         ['shop_icon', 'shop_banner', 'shop_small_icon'].forEach(field => {
//           if (data[field]) {
//             previews[field] = data[field];
//           }
//         });
//         setPreviewImages(previews);
//       } else {
//         // Créer configuration par défaut
//         await createDefaultConfig();
//       }
//     } catch (error) {
//       console.error('Error loading config:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createDefaultConfig = async () => {
//     try {
//       const defaultConfig = {
//         shop_name: 'Mon Shop',
//         phone: '+243000000000',
//         invoice_message: 'Merci pour votre achat !',
//         receipt_message: 'Veuillez conserver ce reçu.',
//         thermal_printer_width: 80,
//         currency: 'USD',
//         is_active: true,
//         business_hours: {
//           opening_time: '08:00',
//           closing_time: '18:00',
//           working_days: [1,2,3,4,5,6]
//         }
//       };

//       const { data, error } = await supabase
//         .from('shop_config')
//         .insert([defaultConfig])
//         .select()
//         .single();

//       if (error) throw error;
      
//       setConfig(data);
//       reset(data);
//     } catch (error) {
//       console.error('Error creating default config:', error);
//     }
//   };

//   const handleImageUpload = async (file, fieldName) => {
//     setUploading(prev => ({ ...prev, [fieldName]: true }));
    
//     try {
//       const fileExt = file.name.split('.').pop();
//       const fileName = `${fieldName}_${Date.now()}.${fileExt}`;

//       // Upload vers Supabase Storage
//       const { error: uploadError, data: uploadData } = await supabase.storage
//         .from('config_shop')
//         .upload(fileName, file, {
//           cacheControl: '3600',
//           upsert: false
//         });

//       if (uploadError) throw uploadError;

//       // Récupérer l'URL publique
//       const { data: urlData } = supabase.storage
//         .from('config_shop')
//         .getPublicUrl(fileName);

//       // Mettre à jour le prévisual et le formulaire
//       setPreviewImages(prev => ({
//         ...prev,
//         [fieldName]: urlData.publicUrl
//       }));

//       setValue(fieldName, urlData.publicUrl);
//       return urlData.publicUrl;

//     } catch (error) {
//       console.error('Upload error:', error);
//       return null;
//     } finally {
//       setUploading(prev => ({ ...prev, [fieldName]: false }));
//     }
//   };

//   const removeImage = (fieldName) => {
//     setPreviewImages(prev => {
//       const newPreviews = { ...prev };
//       delete newPreviews[fieldName];
//       return newPreviews;
//     });
//     setValue(fieldName, '');
//   };

//   const onSubmit = async (data) => {
//     setSaving(true);
    
//     try {
//       // Préparer les données pour la mise à jour
//       const updateData = { ...data };
      
//       // Convertir les jours de travail en tableau
//       if (updateData.working_days) {
//         updateData.business_hours = {
//           opening_time: updateData.opening_time || '08:00',
//           closing_time: updateData.closing_time || '18:00',
//           working_days: updateData.working_days.split(',').map(Number).filter(d => d >= 1 && d <= 7)
//         };
//         delete updateData.opening_time;
//         delete updateData.closing_time;
//         delete updateData.working_days;
//       }

//       // Mettre à jour la configuration
//       const { error } = await supabase
//         .from('shop_config')
//         .update(updateData)
//         .eq('id', config.id);

//       if (error) throw error;

//       // Recharger les données
//       await loadConfig();
      
//       // Afficher succès
//       showToast('Configuration sauvegardée avec succès', 'success');
      
//     } catch (error) {
//       console.error('Error saving config:', error);
//       showToast('Erreur lors de la sauvegarde', 'error');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const showToast = (message, type = 'info') => {
//     // Implémentez votre système de toast ici
//     alert(`${type === 'success' ? '✅' : '❌'} ${message}`);
//   };

//   const handleImageChange = (field, event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     // Vérifications
//     if (file.size > 5 * 1024 * 1024) {
//       showToast('Fichier trop volumineux (max 5MB)', 'error');
//       return;
//     }

//     const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
//     if (!allowedTypes.includes(file.type)) {
//       showToast('Type de fichier non supporté', 'error');
//       return;
//     }

//     // Upload
//     handleImageUpload(file, field);
//   };

//   const workingDays = watch('working_days')?.split(',').map(Number) || [1,2,3,4,5,6];
  
//   const toggleWorkingDay = (day) => {
//     let newDays = [...workingDays];
//     if (newDays.includes(day)) {
//       newDays = newDays.filter(d => d !== day);
//     } else {
//       newDays.push(day);
//       newDays.sort((a, b) => a - b);
//     }
//     setValue('working_days', newDays.join(','));
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600">Chargement de la configuration...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto p-4 md:p-6">
//         {/* Header */}
//         <div className="mb-6">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Configuration du Shop</h1>
//               <p className="text-gray-600 mt-1">
//                 Gérez les paramètres de votre boutique
//               </p>
//             </div>
//             <div className="flex items-center space-x-3">
//               <div className={`px-3 py-1 rounded-full text-sm font-medium ${watch('is_active') ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
//                 {watch('is_active') ? 'Actif' : 'Inactif'}
//               </div>
//               <button
//                 onClick={handleSubmit(onSubmit)}
//                 disabled={saving}
//                 className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center space-x-2"
//               >
//                 {saving ? (
//                   <>
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     <span>Sauvegarde...</span>
//                   </>
//                 ) : (
//                   <>
//                     <Save size={18} />
//                     <span>Sauvegarder</span>
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Tabs personnalisés avec indicateur animé */}
//         <div className="w-full mb-8">
//           <div className="relative border-b border-gray-200">
//             <div className="flex space-x-8 overflow-x-auto pb-1">
//               {tabs.map((tab) => (
//                 <button
//                   key={tab.id}
//                   ref={el => tabRefs.current[tab.id] = el}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`
//                     flex items-center space-x-2 px-1 py-4 text-base font-medium transition-all duration-300
//                     focus:outline-none whitespace-nowrap relative z-10
//                     ${activeTab === tab.id 
//                       ? 'text-blue-600 font-semibold' 
//                       : 'text-gray-500 hover:text-gray-700'
//                     }
//                   `}
//                 >
//                   {tab.icon}
//                   <span>{tab.label}</span>
//                 </button>
//               ))}
//             </div>
            
//             {/* Indicateur animé */}
//             <div 
//               className="absolute bottom-0 h-0.5 outline-none bg-blue-600 transition-all duration-300 ease-out rounded-t-full"
//               style={indicatorStyle}
//             />
//           </div>

//           {/* Contenu avec transition */}
//           <div className="mt-8">
//             <div 
//               key={activeTab}
//               className="animate-fade-in"
//               style={{ animationDuration: '0.3s' }}
//             >
//               <form onSubmit={handleSubmit(onSubmit)}>
//                 {/* Onglet Général */}
//                 {activeTab === 'general' && (
//                   <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       {/* Colonne gauche */}
//                       <div className="space-y-6">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Nom du shop *
//                           </label>
//                           <input
//                             type="text"
//                             {...register('shop_name', { required: 'Nom requis' })}
//                             className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:bg-white transition"
//                             placeholder="Mon Shop"
//                           />
//                           {errors.shop_name && (
//                             <p className="text-red-500 text-sm mt-2">{errors.shop_name.message}</p>
//                           )}
//                         </div>

//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Téléphone *
//                           </label>
//                           <input
//                             type="text"
//                             {...register('phone', { required: 'Téléphone requis' })}
//                             className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:bg-white transition"
//                             placeholder="+243 XXX XXX XXX"
//                           />
//                         </div>

//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Email
//                           </label>
//                           <input
//                             type="email"
//                             {...register('shop_email')}
//                             className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:bg-white transition"
//                             placeholder="contact@shop.com"
//                           />
//                         </div>
//                       </div>

//                       {/* Colonne droite */}
//                       <div className="space-y-6">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             RCCM
//                           </label>
//                           <input
//                             type="text"
//                             {...register('rccm')}
//                             className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:bg-white transition"
//                             placeholder="RC/XXXX/XXXX"
//                           />
//                         </div>

//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Devise
//                           </label>
//                           <select
//                             {...register('currency')}
//                             className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:bg-white transition appearance-none"
//                           >
//                             <option value="USD">USD ($)</option>
//                             <option value="EUR">EUR (€)</option>
//                             <option value="CDF">CDF (FC)</option>
//                             <option value="XAF">XAF (FCFA)</option>
//                           </select>
//                         </div>

//                         <div className="flex items-center justify-between pt-4">
//                           <div>
//                             <label className="block text-sm font-medium text-gray-700">
//                               Shop actif
//                             </label>
//                             <p className="text-sm text-gray-500">Le shop est visible par les clients</p>
//                           </div>
//                           <label className="relative inline-flex items-center cursor-pointer">
//                             <input
//                               type="checkbox"
//                               {...register('is_active')}
//                               className="sr-only peer"
//                             />
//                             <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
//                           </label>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Adresse (pleine largeur) */}
//                     <div className="mt-6">
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Adresse du shop
//                       </label>
//                       <textarea
//                         {...register('shop_address')}
//                         rows={3}
//                         className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:bg-white transition resize-none"
//                         placeholder="Adresse complète..."
//                       />
//                     </div>
//                   </div>
//                 )}

//                 {/* Onglet Images */}
//                 {activeTab === 'images' && (
//                   <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                       {[
//                         {
//                           field: 'shop_icon',
//                           label: 'Icône principale',
//                           description: 'Logo du shop, carré, min. 512×512px',
//                           aspect: 'aspect-square'
//                         },
//                         {
//                           field: 'shop_banner',
//                           label: 'Bannière',
//                           description: 'En-tête du shop, large, min. 1200×400px',
//                           aspect: 'aspect-[3/1]'
//                         },
//                         {
//                           field: 'shop_small_icon',
//                           label: 'Favicon',
//                           description: 'Petite icône, carré, 32×32px recommandé',
//                           aspect: 'aspect-square'
//                         }
//                       ].map(({ field, label, description, aspect }) => (
//                         <div key={field} className="border border-gray-200 rounded-lg p-4">
//                           <div className="mb-4">
//                             <h3 className="font-medium text-gray-900">{label}</h3>
//                             <p className="text-sm text-gray-500 mt-1">{description}</p>
//                           </div>

//                           {/* Zone d'upload */}
//                           <div className={`${aspect} mb-4 relative rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-gray-400 transition`}>
//                             {previewImages[field] ? (
//                               <>
//                                 <Image
//                                   src={previewImages[field]}
//                                   alt={label}
//                                   fill
//                                   className="object-cover"
//                                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                                 />
//                                 <button
//                                   type="button"
//                                   onClick={() => removeImage(field)}
//                                   className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
//                                 >
//                                   <X size={16} />
//                                 </button>
//                               </>
//                             ) : (
//                               <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
//                                 <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
//                                 <p className="text-sm text-gray-500 text-center">Cliquez pour uploader</p>
//                                 <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP</p>
//                               </div>
//                             )}
                            
//                             <input
//                               type="file"
//                               accept="image/jpeg,image/png,image/webp"
//                               onChange={(e) => handleImageChange(field, e)}
//                               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                             />
//                           </div>

//                           {/* Status upload */}
//                           <div className="flex items-center justify-between">
//                             <div className="text-sm">
//                               {uploading[field] ? (
//                                 <div className="flex items-center text-blue-600">
//                                   <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
//                                   Upload...
//                                 </div>
//                               ) : previewImages[field] ? (
//                                 <div className="flex items-center text-green-600">
//                                   <Check size={14} className="mr-1" />
//                                   Image chargée
//                                 </div>
//                               ) : (
//                                 <span className="text-gray-500">Aucune image</span>
//                               )}
//                             </div>
                            
//                             <input
//                               type="hidden"
//                               {...register(field)}
//                             />
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Onglet Messages */}
//                 {activeTab === 'messages' && (
//                   <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                     <div className="space-y-6">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Message sur facture
//                         </label>
//                         <textarea
//                           {...register('invoice_message')}
//                           rows={4}
//                           className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:bg-white transition resize-none"
//                           placeholder="Ce message apparaîtra sur toutes les factures..."
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Message sur reçu
//                         </label>
//                         <textarea
//                           {...register('receipt_message')}
//                           rows={4}
//                           className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:bg-white transition resize-none"
//                           placeholder="Ce message apparaîtra sur tous les reçus..."
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Onglet Impression */}
//                 {activeTab === 'printing' && (
//                   <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                     <div className="space-y-6">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           En-tête d'impression
//                         </label>
//                         <textarea
//                           {...register('print_header')}
//                           rows={3}
//                           className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:bg-white transition resize-none"
//                           placeholder="Texte affiché en haut de chaque impression..."
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Pied de page
//                         </label>
//                         <textarea
//                           {...register('print_footer')}
//                           rows={3}
//                           className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:bg-white transition resize-none"
//                           placeholder="Texte affiché en bas de chaque impression..."
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Largeur de l'imprimante thermique
//                         </label>
//                         <div className="flex items-center space-x-4">
//                           <input
//                             type="range"
//                             min="40"
//                             max="120"
//                             step="4"
//                             {...register('thermal_printer_width')}
//                             className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//                           />
//                           <div className="w-16 text-center">
//                             <span className="text-lg font-bold text-gray-900">
//                               {watch('thermal_printer_width') || 80}
//                             </span>
//                             <span className="text-sm text-gray-500 ml-1">car.</span>
//                           </div>
//                         </div>
//                         <p className="text-sm text-gray-500 mt-2">
//                           Nombre de caractères par ligne (standard: 80)
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Onglet Horaires */}
//                 {activeTab === 'schedule' && (
//                   <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       {/* Horaires */}
//                       <div className="space-y-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Heure d'ouverture
//                           </label>
//                           <input
//                             type="time"
//                             {...register('opening_time')}
//                             className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:bg-white transition"
//                           />
//                         </div>

//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Heure de fermeture
//                           </label>
//                           <input
//                             type="time"
//                             {...register('closing_time')}
//                             className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:bg-white transition"
//                           />
//                         </div>
//                       </div>

//                       {/* Jours de travail */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Jours de travail
//                         </label>
//                         <div className="grid grid-cols-7 gap-2">
//                           {[
//                             { day: 1, label: 'L' },
//                             { day: 2, label: 'M' },
//                             { day: 3, label: 'M' },
//                             { day: 4, label: 'J' },
//                             { day: 5, label: 'V' },
//                             { day: 6, label: 'S' },
//                             { day: 7, label: 'D' },
//                           ].map(({ day, label }) => (
//                             <button
//                               key={day}
//                               type="button"
//                               onClick={() => toggleWorkingDay(day)}
//                               className={`aspect-square rounded-lg flex items-center justify-center font-medium transition ${
//                                 workingDays.includes(day)
//                                   ? 'bg-gray-900 text-white'
//                                   : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                               }`}
//                             >
//                               {label}
//                             </button>
//                           ))}
//                         </div>
//                         <p className="text-sm text-gray-500 mt-3">
//                           {workingDays.length} jour{workingDays.length > 1 ? 's' : ''} par semaine
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Onglet En ligne */}
//                 {activeTab === 'online' && (
//                   <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                     <div className="space-y-6">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           URL du site web
//                         </label>
//                         <input
//                           type="url"
//                           {...register('website_url')}
//                           className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:bg-white transition"
//                           placeholder="https://example.com"
//                         />
//                       </div>

//                       <div className="border-t border-gray-200 pt-6">
//                         <h3 className="text-sm font-medium text-gray-700 mb-4">Intégrations</h3>
//                         <div className="space-y-4">
//                           <div className="flex items-center justify-between">
//                             <div>
//                               <p className="font-medium text-gray-900">Google Analytics</p>
//                               <p className="text-sm text-gray-500">Suivi des visiteurs</p>
//                             </div>
//                             <label className="relative inline-flex items-center cursor-pointer">
//                               <input type="checkbox" className="sr-only peer" />
//                               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
//                             </label>
//                           </div>

//                           <div className="flex items-center justify-between">
//                             <div>
//                               <p className="font-medium text-gray-900">Facebook Pixel</p>
//                               <p className="text-sm text-gray-500">Suivi des conversions</p>
//                             </div>
//                             <label className="relative inline-flex items-center cursor-pointer">
//                               <input type="checkbox" className="sr-only peer" />
//                               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
//                             </label>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </form>
//             </div>
//           </div>
//         </div>

//         {/* Footer avec bouton de sauvegarde */}
//         <div className="mt-8 pt-6 border-t border-gray-200">
//           <div className="flex justify-end">
//             <button
//               onClick={handleSubmit(onSubmit)}
//               disabled={saving}
//               className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center space-x-2 shadow-sm"
//             >
//               {saving ? (
//                 <>
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   <span>Sauvegarde en cours...</span>
//                 </>
//               ) : (
//                 <>
//                   <Save size={18} />
//                   <span>Enregistrer les modifications</span>
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { 
  Store, 
  Image as ImageIcon, 
  MessageSquare, 
  Printer, 
  Clock, 
  Globe, 
  Settings,
  Layers,
  Save,
  Upload,
  X,
  Check,
  AlertCircle
} from 'lucide-react';

export default function ShopConfigPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState({});
  const [previewImages, setPreviewImages] = useState({});
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabRefs = useRef({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm();

  const tabs = [
    { id: 'general', label: 'Général', icon: <Store size={18} /> },
    { id: 'images', label: 'Images', icon: <ImageIcon size={18} /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare size={18} /> },
    { id: 'printing', label: 'Impression', icon: <Printer size={18} /> },
    { id: 'schedule', label: 'Horaires', icon: <Clock size={18} /> },
    { id: 'online', label: 'En ligne', icon: <Globe size={18} /> },
    { id: 'custom', label: 'Personnalisé', icon: <Layers size={18} /> },
  ];

  // Mettre à jour la position de l'indicateur quand l'onglet change
  useEffect(() => {
    if (tabRefs.current[activeTab]) {
      const activeElement = tabRefs.current[activeTab];
      const { offsetLeft, offsetWidth } = activeElement;
      
      setIndicatorStyle({
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`,
        opacity: 1
      });
    }
  }, [activeTab]);

  // Charger la configuration
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('shop_config')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        // Convertir business_hours JSON pour les champs
        if (data.business_hours) {
          data.opening_time = data.business_hours.opening_time || '08:00';
          data.closing_time = data.business_hours.closing_time || '18:00';
          data.working_days = data.business_hours.working_days?.join(',') || '1,2,3,4,5,6';
        }
        
        setConfig(data);
        reset(data);
        
        // Précharger les prévisualisations d'images
        const previews = {};
        ['shop_icon', 'shop_banner', 'shop_small_icon'].forEach(field => {
          if (data[field]) {
            previews[field] = data[field];
          }
        });
        setPreviewImages(previews);
      } else {
        // Créer configuration par défaut
        await createDefaultConfig();
      }
    } catch (error) {
      console.error('Error loading config:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultConfig = async () => {
    try {
      const defaultConfig = {
        shop_name: 'Mon Shop',
        phone: '+243000000000',
        invoice_message: 'Merci pour votre achat !',
        receipt_message: 'Veuillez conserver ce reçu.',
        thermal_printer_width: 80,
        currency: 'USD',
        is_active: true,
        custom_field_1: '',
        custom_field_2: '',
        custom_field_3: '',
        business_hours: {
          opening_time: '08:00',
          closing_time: '18:00',
          working_days: [1,2,3,4,5,6]
        }
      };

      const { data, error } = await supabase
        .from('shop_config')
        .insert([defaultConfig])
        .select()
        .single();

      if (error) throw error;
      
      setConfig(data);
      reset(data);
    } catch (error) {
      console.error('Error creating default config:', error);
    }
  };

  const handleImageUpload = async (file, fieldName) => {
    setUploading(prev => ({ ...prev, [fieldName]: true }));
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${fieldName}_${Date.now()}.${fileExt}`;

      // Upload vers Supabase Storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('config_shop')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Récupérer l'URL publique
      const { data: urlData } = supabase.storage
        .from('config_shop')
        .getPublicUrl(fileName);

      // Mettre à jour le prévisual et le formulaire
      setPreviewImages(prev => ({
        ...prev,
        [fieldName]: urlData.publicUrl
      }));

      setValue(fieldName, urlData.publicUrl);
      return urlData.publicUrl;

    } catch (error) {
      console.error('Upload error:', error);
      return null;
    } finally {
      setUploading(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const removeImage = (fieldName) => {
    setPreviewImages(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[fieldName];
      return newPreviews;
    });
    setValue(fieldName, '');
  };

  const onSubmit = async (data) => {
    setSaving(true);
    
    try {
      // Préparer les données pour la mise à jour
      const updateData = { ...data };
      
      // Convertir les jours de travail en tableau
      if (updateData.working_days) {
        updateData.business_hours = {
          opening_time: updateData.opening_time || '08:00',
          closing_time: updateData.closing_time || '18:00',
          working_days: updateData.working_days.split(',').map(Number).filter(d => d >= 1 && d <= 7)
        };
        delete updateData.opening_time;
        delete updateData.closing_time;
        delete updateData.working_days;
      }

      // Mettre à jour la configuration
      const { error } = await supabase
        .from('shop_config')
        .update(updateData)
        .eq('id', config.id);

      if (error) throw error;

      // Recharger les données
      await loadConfig();
      
      // Afficher succès
      showToast('Configuration sauvegardée avec succès', 'success');
      
    } catch (error) {
      console.error('Error saving config:', error);
      showToast('Erreur lors de la sauvegarde', 'error');
    } finally {
      setSaving(false);
    }
  };

  const showToast = (message, type = 'info') => {
    // Implémentez votre système de toast ici
    alert(`${type === 'success' ? '✅' : '❌'} ${message}`);
  };

  const handleImageChange = (field, event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Vérifications
    if (file.size > 5 * 1024 * 1024) {
      showToast('Fichier trop volumineux (max 5MB)', 'error');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Type de fichier non supporté', 'error');
      return;
    }

    // Upload
    handleImageUpload(file, field);
  };

  const workingDays = watch('working_days')?.split(',').map(Number) || [1,2,3,4,5,6];
  
  const toggleWorkingDay = (day) => {
    let newDays = [...workingDays];
    if (newDays.includes(day)) {
      newDays = newDays.filter(d => d !== day);
    } else {
      newDays.push(day);
      newDays.sort((a, b) => a - b);
    }
    setValue('working_days', newDays.join(','));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Configuration du Shop</h1>
              <p className="text-gray-600 mt-1">
                Gérez les paramètres de votre boutique
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${watch('is_active') ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {watch('is_active') ? 'Actif' : 'Inactif'}
              </div>
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={saving}
                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center space-x-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sauvegarde...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Sauvegarder</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs personnalisés avec indicateur animé */}
        <div className="w-full mb-8">
          <div className="relative border-b border-gray-200">
            <div className="flex space-x-8 overflow-x-auto pb-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  ref={el => tabRefs.current[tab.id] = el}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 px-1 py-4 text-base font-medium transition-all duration-300
                    focus:outline-none whitespace-nowrap relative z-10
                    ${activeTab === tab.id 
                      ? 'text-blue-600 font-semibold' 
                      : 'text-gray-500 hover:text-gray-700'
                    }
                  `}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
            
            {/* Indicateur animé */}
            <div 
              className="absolute bottom-0 h-0.5 outline-none bg-blue-600 transition-all duration-300 ease-out rounded-t-full"
              style={indicatorStyle}
            />
          </div>

          {/* Contenu avec transition */}
          <div className="mt-8">
            <div 
              key={activeTab}
              className="animate-fade-in"
              style={{ animationDuration: '0.3s' }}
            >
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Onglet Général */}
                {activeTab === 'general' && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Colonne gauche */}
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom du shop *
                          </label>
                          <input
                            type="text"
                            {...register('shop_name', { required: 'Nom requis' })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:bg-white transition"
                            placeholder="Mon Shop"
                          />
                          {errors.shop_name && (
                            <p className="text-red-500 text-sm mt-2">{errors.shop_name.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Téléphone *
                          </label>
                          <input
                            type="text"
                            {...register('phone', { required: 'Téléphone requis' })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:bg-white transition"
                            placeholder="+243 XXX XXX XXX"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            {...register('shop_email')}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:bg-white transition"
                            placeholder="contact@shop.com"
                          />
                        </div>
                      </div>

                      {/* Colonne droite */}
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            RCCM
                          </label>
                          <input
                            type="text"
                            {...register('rccm')}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:bg-white transition"
                            placeholder="RC/XXXX/XXXX"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Devise
                          </label>
                          <select
                            {...register('currency')}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:bg-white transition appearance-none"
                          >
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="CDF">CDF (FC)</option>
                            <option value="XAF">XAF (FCFA)</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between pt-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Shop actif
                            </label>
                            <p className="text-sm text-gray-500">Le shop est visible par les clients</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              {...register('is_active')}
                              className="sr-only peer"
                            />
                            <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Adresse (pleine largeur) */}
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adresse du shop
                      </label>
                      <textarea
                        {...register('shop_address')}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:bg-white transition resize-none"
                        placeholder="Adresse complète..."
                      />
                    </div>
                  </div>
                )}

                {/* Onglet Images */}
                {activeTab === 'images' && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[
                        {
                          field: 'shop_icon',
                          label: 'Icône principale',
                          description: 'Logo du shop, carré, min. 512×512px',
                          aspect: 'aspect-square'
                        },
                        {
                          field: 'shop_banner',
                          label: 'Bannière',
                          description: 'En-tête du shop, large, min. 1200×400px',
                          aspect: 'aspect-[3/1]'
                        },
                        {
                          field: 'shop_small_icon',
                          label: 'Favicon',
                          description: 'Petite icône, carré, 32×32px recommandé',
                          aspect: 'aspect-square'
                        }
                      ].map(({ field, label, description, aspect }) => (
                        <div key={field} className="border border-gray-200 rounded-lg p-4">
                          <div className="mb-4">
                            <h3 className="font-medium text-gray-900">{label}</h3>
                            <p className="text-sm text-gray-500 mt-1">{description}</p>
                          </div>

                          {/* Zone d'upload */}
                          <div className={`${aspect} mb-4 relative rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-gray-400 transition`}>
                            {previewImages[field] ? (
                              <>
                                <Image
                                  src={previewImages[field]}
                                  alt={label}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(field)}
                                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                                >
                                  <X size={16} />
                                </button>
                              </>
                            ) : (
                              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                                <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500 text-center">Cliquez pour uploader</p>
                                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP</p>
                              </div>
                            )}
                            
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              onChange={(e) => handleImageChange(field, e)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </div>

                          {/* Status upload */}
                          <div className="flex items-center justify-between">
                            <div className="text-sm">
                              {uploading[field] ? (
                                <div className="flex items-center text-blue-600">
                                  <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                                  Upload...
                                </div>
                              ) : previewImages[field] ? (
                                <div className="flex items-center text-green-600">
                                  <Check size={14} className="mr-1" />
                                  Image chargée
                                </div>
                              ) : (
                                <span className="text-gray-500">Aucune image</span>
                              )}
                            </div>
                            
                            <input
                              type="hidden"
                              {...register(field)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Onglet Messages */}
                {activeTab === 'messages' && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Message sur facture
                        </label>
                        <textarea
                          {...register('invoice_message')}
                          rows={4}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:bg-white transition resize-none"
                          placeholder="Ce message apparaîtra sur toutes les factures..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Message sur reçu
                        </label>
                        <textarea
                          {...register('receipt_message')}
                          rows={4}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:bg-white transition resize-none"
                          placeholder="Ce message apparaîtra sur tous les reçus..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Onglet Impression */}
                {activeTab === 'printing' && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          En-tête d'impression
                        </label>
                        <textarea
                          {...register('print_header')}
                          rows={3}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:bg-white transition resize-none"
                          placeholder="Texte affiché en haut de chaque impression..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pied de page
                        </label>
                        <textarea
                          {...register('print_footer')}
                          rows={3}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:bg-white transition resize-none"
                          placeholder="Texte affiché en bas de chaque impression..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Largeur de l'imprimante thermique
                        </label>
                        <div className="flex items-center space-x-4">
                          <input
                            type="range"
                            min="40"
                            max="120"
                            step="4"
                            {...register('thermal_printer_width')}
                            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="w-16 text-center">
                            <span className="text-lg font-bold text-gray-900">
                              {watch('thermal_printer_width') || 80}
                            </span>
                            <span className="text-sm text-gray-500 ml-1">car.</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          Nombre de caractères par ligne (standard: 80)
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Onglet Horaires */}
                {activeTab === 'schedule' && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Horaires */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Heure d'ouverture
                          </label>
                          <input
                            type="time"
                            {...register('opening_time')}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:bg-white transition"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Heure de fermeture
                          </label>
                          <input
                            type="time"
                            {...register('closing_time')}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:bg-white transition"
                          />
                        </div>
                      </div>

                      {/* Jours de travail */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Jours de travail
                        </label>
                        <div className="grid grid-cols-7 gap-2">
                          {[
                            { day: 1, label: 'L' },
                            { day: 2, label: 'M' },
                            { day: 3, label: 'M' },
                            { day: 4, label: 'J' },
                            { day: 5, label: 'V' },
                            { day: 6, label: 'S' },
                            { day: 7, label: 'D' },
                          ].map(({ day, label }) => (
                            <button
                              key={day}
                              type="button"
                              onClick={() => toggleWorkingDay(day)}
                              className={`aspect-square rounded-lg flex items-center justify-center font-medium transition ${
                                workingDays.includes(day)
                                  ? 'bg-gray-900 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-3">
                          {workingDays.length} jour{workingDays.length > 1 ? 's' : ''} par semaine
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Onglet En ligne */}
                {activeTab === 'online' && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          URL du site web
                        </label>
                        <input
                          type="url"
                          {...register('website_url')}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:bg-white transition"
                          placeholder="https://example.com"
                        />
                      </div>

                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">Intégrations</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">Google Analytics</p>
                              <p className="text-sm text-gray-500">Suivi des visiteurs</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">Facebook Pixel</p>
                              <p className="text-sm text-gray-500">Suivi des conversions</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Onglet Personnalisé - Nouvel onglet */}
                {activeTab === 'custom' && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900">Champs personnalisés</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Configurez des champs supplémentaires selon vos besoins
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Champ personnalisé 1 */}
                      <div className="border border-gray-200 rounded-lg p-5">
                        <div className="mb-4">
                          <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-700">
                              Champ personnalisé 1
                            </label>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              custom_field_1
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Utilisez ce champ pour des configurations spécifiques
                          </p>
                        </div>
                        <textarea
                          {...register('custom_field_1')}
                          rows={3}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:bg-white transition resize-none"
                          placeholder="Entrez votre texte personnalisé ici..."
                        />
                        <div className="mt-3 text-sm text-gray-500">
                          <span className="font-medium">Exemples d'utilisation :</span>
                          <ul className="list-disc list-inside mt-1 space-y-1">
                            <li>Message de bienvenue personnalisé</li>
                            <li>Instructions spéciales pour les clients</li>
                            <li>Configuration de fonctionnalité spécifique</li>
                          </ul>
                        </div>
                      </div>

                      {/* Champ personnalisé 2 */}
                      <div className="border border-gray-200 rounded-lg p-5">
                        <div className="mb-4">
                          <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-700">
                              Champ personnalisé 2
                            </label>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              custom_field_2
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Champ texte libre pour étendre les fonctionnalités
                          </p>
                        </div>
                        <textarea
                          {...register('custom_field_2')}
                          rows={3}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:bg-white transition resize-none"
                          placeholder="Entrez votre texte personnalisé ici..."
                        />
                        <div className="mt-3 text-sm text-gray-500">
                          <span className="font-medium">Exemples d'utilisation :</span>
                          <ul className="list-disc list-inside mt-1 space-y-1">
                            <li>URL d'API externe</li>
                            <li>Clé de configuration</li>
                            <li>Paramètres d'intégration</li>
                          </ul>
                        </div>
                      </div>

                      {/* Champ personnalisé 3 */}
                      <div className="border border-gray-200 rounded-lg p-5">
                        <div className="mb-4">
                          <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-700">
                              Champ personnalisé 3
                            </label>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              custom_field_3
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Dernier champ personnalisable pour vos besoins spécifiques
                          </p>
                        </div>
                        <textarea
                          {...register('custom_field_3')}
                          rows={3}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:bg-white transition resize-none"
                          placeholder="Entrez votre texte personnalisé ici..."
                        />
                        <div className="mt-3 text-sm text-gray-500">
                          <span className="font-medium">Exemples d'utilisation :</span>
                          <ul className="list-disc list-inside mt-1 space-y-1">
                            <li>Notes internes</li>
                            <li>Configuration de rapport</li>
                            <li>Paramètres d'exportation</li>
                          </ul>
                        </div>
                      </div>

                      {/* Note d'information */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex">
                          <AlertCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-medium text-blue-900">Comment utiliser ces champs</h4>
                            <ul className="text-sm text-blue-700 mt-2 space-y-1">
                              <li>• Ces champs sont entièrement personnalisables selon vos besoins</li>
                              <li>• Vous pouvez les utiliser pour stocker toute information textuelle</li>
                              <li>• Ils seront sauvegardés dans la base de données et accessibles via API</li>
                              <li>• Pensez à documenter leur utilisation pour votre équipe</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Footer avec bouton de sauvegarde */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={saving}
              className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center space-x-2 shadow-sm"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sauvegarde en cours...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Enregistrer les modifications</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}