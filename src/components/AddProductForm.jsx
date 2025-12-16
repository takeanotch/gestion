// // 'use client';

// // import { useState, useEffect } from 'react';
// // import { supabase } from '@/lib/supabase';

// // export default function AddProductForm() {
// //   const [categories, setCategories] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [imageFile, setImageFile] = useState(null);
// //   const [imagePreview, setImagePreview] = useState(null);
  
// //   const [formData, setFormData] = useState({
// //     name: '',
// //     description: '',
// //     category_id: '',
// //     retail_price: '',
// //     wholesale_price: '',
// //     currency: 'EUR',
// //     quantity: '0',
// //     minimum_threshold: '10'
// //   });

// //   // Charger les catégories
// //   useEffect(() => {
// //     loadCategories();
// //   }, []);

// //   const loadCategories = async () => {
// //     const { data, error } = await supabase
// //       .from('categories')
// //       .select('id, name')
// //       .order('name');
    
// //     if (!error && data) {
// //       setCategories(data);
// //     }
// //   };

// //   const handleImageChange = (e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       setImageFile(file);
// //       setImagePreview(URL.createObjectURL(file));
// //     }
// //   };

// //   const uploadProductImage = async (productId, categoryName) => {
// //     if (!imageFile || !categoryName) return null;

// //     const fileExt = imageFile.name.split('.').pop();
// //     const fileName = `${productId}_${Date.now()}.${fileExt}`;
// //     const filePath = `${categoryName}/${new Date().toISOString().slice(0, 7)}/${fileName}`;

// //     const { error: uploadError, data } = await supabase.storage
// //       .from('product-images')
// //       .upload(filePath, imageFile);

// //     if (uploadError) {
// //       console.error('Erreur upload image:', uploadError);
// //       return null;
// //     }

// //     // Obtenir l'URL publique
// //     const { data: { publicUrl } } = supabase.storage
// //       .from('product-images')
// //       .getPublicUrl(filePath);

// //     return { path: filePath, url: publicUrl };
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);

// //     try {
// //       // 1. Créer le produit
// //       const { data: product, error: productError } = await supabase
// //         .from('products')
// //         .insert([{
// //           name: formData.name,
// //           description: formData.description,
// //           category_id: formData.category_id || null,
// //           retail_price: parseFloat(formData.retail_price),
// //           wholesale_price: parseFloat(formData.wholesale_price),
// //           currency: formData.currency
// //         }])
// //         .select()
// //         .single();

// //       if (productError) throw productError;

// //       // 2. Uploader l'image si elle existe
// //       let imageData = null;
// //       if (imageFile && product.category_id) {
// //         const category = categories.find(c => c.id === product.category_id);
// //         imageData = await uploadProductImage(product.id, category?.name);
        
// //         if (imageData) {
// //           // Mettre à jour le produit avec l'URL de l'image
// //           await supabase
// //             .from('products')
// //             .update({
// //               image_url: imageData.url,
// //               image_path: imageData.path
// //             })
// //             .eq('id', product.id);
// //         }
// //       }

// //       // 3. Créer l'entrée de stock
// //       const { error: stockError } = await supabase
// //         .from('stock')
// //         .insert([{
// //           product_id: product.id,
// //           quantity: parseInt(formData.quantity),
// //           minimum_threshold: parseInt(formData.minimum_threshold)
// //         }]);

// //       if (stockError) throw stockError;

// //       alert('Produit créé avec succès!');
      
// //       // Réinitialiser le formulaire
// //       setFormData({
// //         name: '',
// //         description: '',
// //         category_id: '',
// //         retail_price: '',
// //         wholesale_price: '',
// //         currency: 'EUR',
// //         quantity: '0',
// //         minimum_threshold: '10'
// //       });
// //       setImageFile(null);
// //       setImagePreview(null);

// //     } catch (error) {
// //       console.error('Erreur:', error);
// //       alert(`Erreur: ${error.message}`);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
// //       <h2 className="text-2xl font-bold mb-6">Ajouter un nouveau produit</h2>
      
// //       <form onSubmit={handleSubmit} className="space-y-4">
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //           {/* Nom du produit */}
// //           <div>
// //             <label className="block text-sm font-medium mb-1">Nom du produit *</label>
// //             <input
// //               type="text"
// //               required
// //               value={formData.name}
// //               onChange={(e) => setFormData({...formData, name: e.target.value})}
// //               className="w-full p-2 border rounded"
// //               placeholder="Ex: T-Shirt Cotton"
// //             />
// //           </div>

// //           {/* Catégorie */}
// //           <div>
// //             <label className="block text-sm font-medium mb-1">Catégorie</label>
// //             <select
// //               value={formData.category_id}
// //               onChange={(e) => setFormData({...formData, category_id: e.target.value})}
// //               className="w-full p-2 border rounded"
// //             >
// //               <option value="">Sélectionner une catégorie</option>
// //               {categories.map((cat) => (
// //                 <option key={cat.id} value={cat.id}>
// //                   {cat.name}
// //                 </option>
// //               ))}
// //             </select>
// //           </div>
// //         </div>

// //         {/* Description */}
// //         <div>
// //           <label className="block text-sm font-medium mb-1">Description</label>
// //           <textarea
// //             value={formData.description}
// //             onChange={(e) => setFormData({...formData, description: e.target.value})}
// //             className="w-full p-2 border rounded"
// //             rows="3"
// //             placeholder="Description du produit..."
// //           />
// //         </div>

// //         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //           {/* Prix de détail */}
// //           <div>
// //             <label className="block text-sm font-medium mb-1">
// //               Prix de détail (Retail) *
// //             </label>
// //             <input
// //               type="number"
// //               step="0.01"
// //               required
// //               value={formData.retail_price}
// //               onChange={(e) => setFormData({...formData, retail_price: e.target.value})}
// //               className="w-full p-2 border rounded"
// //               min="0"
// //             />
// //           </div>

// //           {/* Prix de gros */}
// //           <div>
// //             <label className="block text-sm font-medium mb-1">
// //               Prix de gros (Wholesale) *
// //             </label>
// //             <input
// //               type="number"
// //               step="0.01"
// //               required
// //               value={formData.wholesale_price}
// //               onChange={(e) => setFormData({...formData, wholesale_price: e.target.value})}
// //               className="w-full p-2 border rounded"
// //               min="0"
// //             />
// //           </div>

// //           {/* Devise */}
// //           <div>
// //             <label className="block text-sm font-medium mb-1">Devise</label>
// //             <select
// //               value={formData.currency}
// //               onChange={(e) => setFormData({...formData, currency: e.target.value})}
// //               className="w-full p-2 border rounded"
// //             >
// //               <option value="EUR">Euro (€)</option>
// //               <option value="USD">Dollar ($)</option>
// //               <option value="CDF">Franc Congolais (FC)</option>
// //               <option value="GBP">Livre Sterling (£)</option>
// //             </select>
// //           </div>
// //         </div>

// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //           {/* Quantité */}
// //           <div>
// //             <label className="block text-sm font-medium mb-1">Quantité initiale</label>
// //             <input
// //               type="number"
// //               value={formData.quantity}
// //               onChange={(e) => setFormData({...formData, quantity: e.target.value})}
// //               className="w-full p-2 border rounded"
// //               min="0"
// //             />
// //           </div>

// //           {/* Seuil minimum */}
// //           <div>
// //             <label className="block text-sm font-medium mb-1">
// //               Seuil d'alerte stock
// //             </label>
// //             <input
// //               type="number"
// //               value={formData.minimum_threshold}
// //               onChange={(e) => setFormData({...formData, minimum_threshold: e.target.value})}
// //               className="w-full p-2 border rounded"
// //               min="1"
// //             />
// //           </div>
// //         </div>

// //         {/* Upload d'image */}
// //         <div>
// //           <label className="block text-sm font-medium mb-1">Image du produit</label>
// //           <div className="flex items-center space-x-4">
// //             <input
// //               type="file"
// //               accept="image/*"
// //               onChange={handleImageChange}
// //               className="w-full p-2 border rounded"
// //             />
// //             {imagePreview && (
// //               <div className="w-16 h-16 border rounded overflow-hidden">
// //                 <img
// //                   src={imagePreview}
// //                   alt="Aperçu"
// //                   className="w-full h-full object-cover"
// //                 />
// //               </div>
// //             )}
// //           </div>
// //           <p className="text-xs text-gray-500 mt-1">
// //             Formats acceptés: JPG, PNG, WebP, GIF (max 10MB)
// //           </p>
// //         </div>

// //         {/* Bouton de soumission */}
// //         <div className="pt-4">
// //           <button
// //             type="submit"
// //             disabled={loading}
// //             className={`w-full py-3 px-4 rounded font-medium ${
// //               loading
// //                 ? 'bg-gray-400 cursor-not-allowed'
// //                 : 'bg-blue-600 hover:bg-blue-700 text-white'
// //             }`}
// //           >
// //             {loading ? 'Création en cours...' : 'Ajouter le produit'}
// //           </button>
// //         </div>
// //       </form>
// //     </div>
// //   );
// // }


// 'use client';

// import { useState, useEffect } from 'react';
// import { supabase } from '@/lib/supabase';

// export default function AddProductForm() {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
  
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     category_id: '',
//     retail_price: '',
//     wholesale_price: '',
//     currency: 'CDF',
//     unit_type: 'PIECE',
//     quantity: '0',
//     minimum_threshold: '10'
//   });

//   // Charger les catégories
//   useEffect(() => {
//     loadCategories();
//   }, []);

//   const loadCategories = async () => {
//     const { data, error } = await supabase
//       .from('categories')
//       .select('id, name')
//       .order('name');
    
//     if (!error && data) {
//       setCategories(data);
//     }
//   };

//   // Générer le SKU
//   const generateSku = () => {
//     const category = categories.find(c => c.id === formData.category_id);
//     const categoryCode = category ? category.name.substring(0, 5).toUpperCase() : 'XXX';
//     const nameCode = formData.name ? formData.name.substring(0, 3).toUpperCase() : 'XXX';
//     const unitType = formData.unit_type ? formData.unit_type.substring(0,1).toUpperCase() : 'XXX';
//     const more = formData.retail_price;
    
//     return `${categoryCode}-${nameCode}-${unitType}${more}`;
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImageFile(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const uploadProductImage = async (productId, categoryName) => {
//     if (!imageFile || !categoryName) return null;

//     const fileExt = imageFile.name.split('.').pop();
//     const fileName = `${productId}_${Date.now()}.${fileExt}`;
//     const filePath = `${categoryName}/${new Date().toISOString().slice(0, 7)}/${fileName}`;

//     const { error: uploadError, data } = await supabase.storage
//       .from('product-images')
//       .upload(filePath, imageFile);

//     if (uploadError) {
//       console.error('Erreur upload image:', uploadError);
//       return null;
//     }

//     // Obtenir l'URL publique
//     const { data: { publicUrl } } = supabase.storage
//       .from('product-images')
//       .getPublicUrl(filePath);

//     return { path: filePath, url: publicUrl };
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // Générer le SKU
//       const sku = generateSku();
      
//       // 1. Créer le produit
//       const { data: product, error: productError } = await supabase
//         .from('products')
//         .insert([{
//           sku: sku,
//           name: formData.name,
//           description: formData.description,
//           category_id: formData.category_id || null,
//           retail_price: parseFloat(formData.retail_price),
//           wholesale_price: parseFloat(formData.wholesale_price),
//           currency: formData.currency,
//           unit_type: formData.unit_type
//         }])
//         .select()
//         .single();

//       if (productError) throw productError;

//       // 2. Uploader l'image si elle existe
//       let imageData = null;
//       if (imageFile && product.category_id) {
//         const category = categories.find(c => c.id === product.category_id);
//         imageData = await uploadProductImage(product.id, category?.name);
        
//         if (imageData) {
//           // Mettre à jour le produit avec l'URL de l'image
//           await supabase
//             .from('products')
//             .update({
//               image_url: imageData.url,
//               image_path: imageData.path
//             })
//             .eq('id', product.id);
//         }
//       }

//       // 3. Créer l'entrée de stock
//       const { error: stockError } = await supabase
//         .from('stock')
//         .insert([{
//           product_id: product.id,
//           quantity: parseInt(formData.quantity),
//           minimum_threshold: parseInt(formData.minimum_threshold)
//         }]);

//       if (stockError) throw stockError;

//       alert(`Produit créé avec succès! SKU: ${sku}`);
      
//       // Réinitialiser le formulaire
//       setFormData({
//         name: '',
//         description: '',
//         category_id: '',
//         retail_price: '',
//         wholesale_price: '',
//         currency: 'CDF',
//         unit_type: 'PIECE',
//         quantity: '0',
//         minimum_threshold: '10'
//       });
//       setImageFile(null);
//       setImagePreview(null);

//     } catch (error) {
//       console.error('Erreur:', error);
//       alert(`Erreur: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Afficher le SKU prévisualisé
//   const previewSku = formData.name && formData.category_id ? generateSku() : '';

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-6">Ajouter un nouveau produit</h2>
      
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {/* Nom du produit */}
//           <div>
//             <label className="block text-sm font-medium mb-1">Nom du produit *</label>
//             <input
//               type="text"
//               required
//               value={formData.name}
//               onChange={(e) => setFormData({...formData, name: e.target.value})}
//               className="w-full p-2 border rounded"
//               placeholder="Ex: T-Shirt Cotton"
//             />
//           </div>

//           {/* Catégorie */}
//           <div>
//             <label className="block text-sm font-medium mb-1">Catégorie</label>
//             <select
//               value={formData.category_id}
//               onChange={(e) => setFormData({...formData, category_id: e.target.value})}
//               className="w-full p-2 border rounded"
//             >
//               <option value="">Sélectionner une catégorie</option>
//               {categories.map((cat) => (
//                 <option key={cat.id} value={cat.id}>
//                   {cat.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* SKU prévisualisé */}
//         {previewSku && (
//           <div className="bg-gray-50 p-3 rounded border">
//             <p className="text-sm font-medium">SKU généré:</p>
//             <p className="text-lg font-bold text-blue-600">{previewSku}</p>
//             <p className="text-xs text-gray-500 mt-1">
//               Format: CATÉGORIE(3 lettres) - NOM(3 lettres) - TYPE_UNITÉ
//             </p>
//           </div>
//         )}

//         {/* Description */}
//         <div>
//           <label className="block text-sm font-medium mb-1">Description</label>
//           <textarea
//             value={formData.description}
//             onChange={(e) => setFormData({...formData, description: e.target.value})}
//             className="w-full p-2 border rounded"
//             rows="3"
//             placeholder="Description du produit..."
//           />
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {/* Prix de détail */}
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Prix de détail (Retail) *
//             </label>
//             <input
//               type="number"
//               step="0.01"
//               required
//               value={formData.retail_price}
//               onChange={(e) => setFormData({...formData, retail_price: e.target.value})}
//               className="w-full p-2 border rounded"
//               min="0"
//             />
//           </div>

//           {/* Prix de gros */}
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Prix de gros (Wholesale) *
//             </label>
//             <input
//               type="number"
//               step="0.01"
//               required
//               value={formData.wholesale_price}
//               onChange={(e) => setFormData({...formData, wholesale_price: e.target.value})}
//               className="w-full p-2 border rounded"
//               min="0"
//             />
//           </div>

//           {/* Devise */}
//           <div>
//             <label className="block text-sm font-medium mb-1">Devise</label>
//             <select
//               value={formData.currency}
//               onChange={(e) => setFormData({...formData, currency: e.target.value})}
//               className="w-full p-2 border rounded"
//             >
//               <option value="CDF">Franc Congolais (FC)</option>
//               <option value="EUR">Euro (€)</option>
//               <option value="USD">Dollar ($)</option>
//             </select>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {/* Unité de mesure */}
//           <div>
//             <label className="block text-sm font-medium mb-1">Unité de mesure</label>
//             <select
//               value={formData.unit_type}
//               onChange={(e) => setFormData({...formData, unit_type: e.target.value})}
//               className="w-full p-2 border rounded capitalize"
//             >
//               <option value="PIECE">Pièce</option>
//               <option value="KG">KG</option>
//               <option value="LITRE">Litre</option>
//               <option value="METRE">Mètre</option>
//               <option value="BOUTEILLE">Bouteille</option>
//               <option value="SACHET">Sachet</option>
//               <option value="CARTON">Carton</option>
//               <option value="AUTRE">Autre</option>
//             </select>
//           </div>

//           {/* Quantité */}
//           <div>
//             <label className="block text-sm font-medium mb-1">Quantité initiale</label>
//             <input
//               type="number"
//               value={formData.quantity}
//               onChange={(e) => setFormData({...formData, quantity: e.target.value})}
//               className="w-full p-2 border rounded"
//               min="0"
//             />
//           </div>
//         </div>

//         {/* Seuil minimum */}
//         <div>
//           <label className="block text-sm font-medium mb-1">
//             Seuil d'alerte stock
//           </label>
//           <input
//             type="number"
//             value={formData.minimum_threshold}
//             onChange={(e) => setFormData({...formData, minimum_threshold: e.target.value})}
//             className="w-full p-2 border rounded"
//             min="1"
//           />
//         </div>

//         {/* Upload d'image */}
//         <div>
//           <label className="block text-sm font-medium mb-1">Image du produit</label>
//           <div className="flex items-center space-x-4">
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange}
//               className="w-full p-2 border rounded"
//             />
//             {imagePreview && (
//               <div className="w-16 h-16 border rounded overflow-hidden">
//                 <img
//                   src={imagePreview}
//                   alt="Aperçu"
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             )}
//           </div>
//           <p className="text-xs text-gray-500 mt-1">
//             Formats acceptés: JPG, PNG, WebP, GIF (max 10MB)
//           </p>
//         </div>

//         {/* Bouton de soumission */}
//         <div className="pt-4">
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-3 px-4 rounded font-medium ${
//               loading
//                 ? 'bg-gray-400 cursor-not-allowed'
//                 : 'bg-blue-600 hover:bg-blue-700 text-white'
//             }`}
//           >
//             {loading ? 'Création en cours...' : 'Ajouter le produit'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AddProductForm() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    retail_price: '',
    wholesale_price: '',
    currency: 'CDF',
    unit_type: 'PIECE',
    quantity: '0',
    minimum_threshold: '10'
  });

  // Charger les catégories
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      console.log('📥 Chargement des catégories...');
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');
      
      if (error) {
        console.error('❌ Erreur chargement catégories:', error);
        setErrorMessage(`Erreur chargement catégories: ${error.message}`);
        return;
      }
      
      console.log(`✅ ${data?.length || 0} catégories chargées`);
      setCategories(data || []);
    } catch (error) {
      console.error('🚨 Exception chargement catégories:', error);
      setErrorMessage(`Exception: ${error.message}`);
    }
  };

  // Générer le SKU selon votre format : CATEGORIE(3 premier lettre en majuscule)-NOM(3 premier letter en majuscule)-UNIT_TYPE-RETAILPRICE(4 premiers chiffres)
  const generateSku = () => {
    try {
      const category = categories.find(c => c.id === formData.category_id);
      
      // CATEGORIE(3 premier lettre en majuscule)
      let categoryCode = 'CAT';
      if (category && category.name) {
        // Prendre les 3 premières lettres, supprimer les accents et espaces
        categoryCode = category.name
          .normalize("NFD").replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
          .replace(/[^a-zA-Z]/g, '') // Garder seulement les lettres
          .substring(0, 3)
          .toUpperCase();
        
        // Si moins de 3 lettres, compléter avec X
        while (categoryCode.length < 3) {
          categoryCode += 'X';
        }
      }
      
      // NOM(3 premier letter en majuscule)
      let nameCode = 'PRO';
      if (formData.name && formData.name.trim()) {
        nameCode = formData.name
          .normalize("NFD").replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-zA-Z]/g, '')
          .substring(0, 3)
          .toUpperCase();
        
        while (nameCode.length < 3) {
          nameCode += 'X';
        }
      }
      
      // UNIT_TYPE (tel quel en majuscule)
      const unitType = formData.unit_type || 'PIECE';
      
      // RETAILPRICE (4 premiers chiffres sans virgule)
      let retailPriceCode = '0000';
      if (formData.retail_price) {
        // Convertir en chaîne, enlever les points/virgules décimaux
        const priceStr = formData.retail_price.toString();
        
        // Garder seulement les chiffres
        const digitsOnly = priceStr.replace(/[^0-9]/g, '');
        
        // Prendre les 4 premiers chiffres
        retailPriceCode = digitsOnly.substring(0, 4);
        
        // Compléter avec des zéros si moins de 4 chiffres
        while (retailPriceCode.length < 4) {
          retailPriceCode += '0';
        }
      }
      
      return `${categoryCode}-${nameCode}-${unitType}-${retailPriceCode}`;
    } catch (error) {
      console.error('Erreur génération SKU:', error);
      // Fallback simple avec timestamp
      const timestamp = Date.now().toString().slice(-4);
      return `CAT-PRO-PIECE-${timestamp}`;
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier la taille du fichier (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert('Le fichier est trop grand (max 10MB)');
        return;
      }
      
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadProductImage = async (productId, categoryName) => {
    if (!imageFile || !categoryName) return null;

    try {
      const fileExt = imageFile.name.split('.').pop().toLowerCase();
      const fileName = `${productId}_${Date.now()}.${fileExt}`;
      
      // Nettoyer le nom de catégorie pour le chemin
      const cleanCategoryName = categoryName
        .normalize("NFD").replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]/g, '_');
      
      const filePath = `${cleanCategoryName}/${new Date().toISOString().slice(0, 7)}/${fileName}`;

      console.log('🖼️ Upload image:', { filePath, fileSize: imageFile.size });
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('❌ Erreur upload image:', uploadError);
        return null;
      }

      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      console.log('✅ Image uploadée:', publicUrl);
      return { path: filePath, url: publicUrl };
    } catch (error) {
      console.error('🚨 Exception upload image:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      // Validation des données
      if (!formData.name.trim()) {
        throw new Error('Le nom du produit est requis');
      }
      
      if (!formData.retail_price || parseFloat(formData.retail_price) <= 0) {
        throw new Error('Le prix de détail doit être supérieur à 0');
      }
      
      if (!formData.wholesale_price || parseFloat(formData.wholesale_price) <= 0) {
        throw new Error('Le prix de gros doit être supérieur à 0');
      }
      
      if (parseFloat(formData.wholesale_price) > parseFloat(formData.retail_price)) {
        throw new Error('Le prix de gros ne peut pas être supérieur au prix de détail');
      }

      // Générer le SKU
      const sku = generateSku();
      console.log('🔤 SKU généré:', sku);
      console.log('💰 Prix de détail original:', formData.retail_price);
      
      // 1. Créer le produit
      const productData = {
        sku: sku,
        name: formData.name.trim(),
        description: formData.description.trim(),
        category_id: formData.category_id || null,
        retail_price: parseFloat(formData.retail_price),
        wholesale_price: parseFloat(formData.wholesale_price),
        currency: formData.currency,
        unit_type: formData.unit_type
      };
      
      console.log('📦 Données produit:', productData);
      
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (productError) {
        console.error('❌ Erreur création produit:', productError);
        throw new Error(`Erreur création produit: ${productError.message}`);
      }

      console.log('✅ Produit créé:', product);

      // 2. Uploader l'image si elle existe
      let imageData = null;
      if (imageFile && product.category_id) {
        const category = categories.find(c => c.id === product.category_id);
        if (category) {
          console.log('🖼️ Début upload image pour catégorie:', category.name);
          imageData = await uploadProductImage(product.id, category.name);
          
          if (imageData) {
            console.log('🖼️ Mise à jour produit avec image');
            const { error: updateError } = await supabase
              .from('products')
              .update({
                image_url: imageData.url,
                image_path: imageData.path,
                updated_at: new Date().toISOString()
              })
              .eq('id', product.id);
              
            if (updateError) {
              console.error('⚠️ Erreur mise à jour image:', updateError);
              // On continue même si l'image échoue
            }
          }
        }
      }

      // 3. Créer l'entrée de stock
      const stockData = {
        product_id: product.id,
        quantity: parseInt(formData.quantity) || 0,
        minimum_threshold: parseInt(formData.minimum_threshold) || 10
      };
      
      console.log('📊 Données stock:', stockData);
      
      const { error: stockError } = await supabase
        .from('stock')
        .insert([stockData]);

      if (stockError) {
        console.error('❌ Erreur création stock:', stockError);
        // On essaie de supprimer le produit si le stock échoue
        await supabase.from('products').delete().eq('id', product.id);
        throw new Error(`Erreur création stock: ${stockError.message}`);
      }

      console.log('🎉 Produit créé avec succès!');
      alert(`✅ Produit créé avec succès!\nSKU: ${sku}\nNom: ${product.name}\nPrix: ${product.retail_price} ${product.currency}`);

      // Réinitialiser le formulaire
      setFormData({
        name: '',
        description: '',
        category_id: '',
        retail_price: '',
        wholesale_price: '',
        currency: 'CDF',
        unit_type: 'PIECE',
        quantity: '0',
        minimum_threshold: '10'
      });
      setImageFile(null);
      setImagePreview(null);
      setErrorMessage('');

    } catch (error) {
      console.error('🚨 Erreur complète:', error);
      setErrorMessage(error.message);
      alert(`❌ Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Afficher le SKU prévisualisé
  const previewSku = (formData.name && formData.category_id && formData.retail_price) ? generateSku() : '';

  // Exemples de SKU générés
  const getSkuExamples = () => {
    if (!formData.retail_price) return null;
    
    const priceStr = formData.retail_price.toString();
    const digitsOnly = priceStr.replace(/[^0-9]/g, '');
    const retailPriceCode = digitsOnly.substring(0, 4).padEnd(4, '0');
    
    return (
      <div className="text-xs text-gray-600 mt-1">
        <p>Le prix "{formData.retail_price}" donnera: <span className="font-mono">{retailPriceCode}</span></p>
        <p className="mt-1">Exemples: 12.99 → 1299, 150.50 → 1505, 999 → 9990</p>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Ajouter un nouveau produit</h2>
      
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-red-700 text-sm">{errorMessage}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nom du produit */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Nom du produit *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="Ex: T-Shirt Cotton"
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Catégorie *
            </label>
            <select
              required
              value={formData.category_id}
              onChange={(e) => setFormData({...formData, category_id: e.target.value})}
              className="w-full p-2 border rounded"
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* SKU prévisualisé */}
        {previewSku && (
          <div className="bg-blue-50 p-3 rounded border border-blue-200">
            <p className="text-sm font-medium text-blue-800">SKU généré:</p>
            <p className="text-lg font-bold text-blue-700 font-mono">{previewSku}</p>
            <p className="text-xs text-blue-600 mt-1">
              Format: CATÉGORIE(3 lettres) - NOM(3 lettres) - TYPE_UNITÉ - PRIX(4 chiffres)
            </p>
            {getSkuExamples()}
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-2 border rounded"
            rows="3"
            placeholder="Description du produit..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Prix de détail */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Prix de détail (Retail) *
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.retail_price}
              onChange={(e) => setFormData({...formData, retail_price: e.target.value})}
              className="w-full p-2 border rounded"
              min="0.01"
              placeholder="12.99"
            />
            <p className="text-xs text-gray-500 mt-1">
              Ce prix déterminera les 4 derniers chiffres du SKU
            </p>
          </div>

          {/* Prix de gros */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Prix de gros (Wholesale) *
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.wholesale_price}
              onChange={(e) => setFormData({...formData, wholesale_price: e.target.value})}
              className="w-full p-2 border rounded"
              min="0.01"
            />
          </div>

          {/* Devise */}
          <div>
            <label className="block text-sm font-medium mb-1">Devise *</label>
            <select
              required
              value={formData.currency}
              onChange={(e) => setFormData({...formData, currency: e.target.value})}
              className="w-full p-2 border rounded"
            >
              <option value="CDF">Franc Congolais (FC)</option>
              <option value="EUR">Euro (€)</option>
              <option value="USD">Dollar ($)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Unité de mesure */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Unité de mesure *
            </label>
            <select
              required
              value={formData.unit_type}
              onChange={(e) => setFormData({...formData, unit_type: e.target.value})}
              className="w-full p-2 border rounded capitalize"
            >
              <option value="PIECE">Pièce</option>
              <option value="KG">Kilogramme (KG)</option>
              <option value="LITRE">Litre (LITRE)</option>
              <option value="METRE">Mètre (METRE)</option>
              <option value="BOUTEILLE">Bouteille (BOUTEILLE)</option>
              <option value="SACHET">Sachet (SACHET)</option>
              <option value="CARTON">Carton (CARTON)</option>
            </select>
          </div>

          {/* Quantité */}
          <div>
            <label className="block text-sm font-medium mb-1">Quantité initiale</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              className="w-full p-2 border rounded"
              min="0"
            />
          </div>
        </div>

        {/* Seuil minimum */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Seuil d'alerte stock
          </label>
          <input
            type="number"
            value={formData.minimum_threshold}
            onChange={(e) => setFormData({...formData, minimum_threshold: e.target.value})}
            className="w-full p-2 border rounded"
            min="1"
          />
        </div>

        {/* Upload d'image */}
        <div>
          <label className="block text-sm font-medium mb-1">Image du produit</label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border rounded"
              disabled={loading}
            />
            {imagePreview && (
              <div className="w-16 h-16 border rounded overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Aperçu"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Formats acceptés: JPG, PNG, WebP, GIF (max 10MB)
          </p>
        </div>

        {/* Bouton de soumission */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded font-medium ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? 'Création en cours...' : 'Ajouter le produit'}
          </button>
        </div>
      </form>
    </div>
  );
}