// // 'use client';

// // import { useState, useEffect } from 'react';
// // import { supabase } from '@/lib/supabase';

// // export default function EditProductForm({ product, onClose, onUpdate }) {
// //   const [categories, setCategories] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [imageFile, setImageFile] = useState(null);
// //   const [imagePreview, setImagePreview] = useState(null);
// //   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
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

// //   // Initialiser les données du formulaire avec le produit
// //   useEffect(() => {
// //     if (product) {
// //       setFormData({
// //         name: product.name || '',
// //         description: product.description || '',
// //         category_id: product.category_id || '',
// //         retail_price: product.retail_price?.toString() || '',
// //         wholesale_price: product.wholesale_price?.toString() || '',
// //         currency: product.currency || 'EUR',
// //         quantity: product.stock?.[0]?.quantity?.toString() || '0',
// //         minimum_threshold: product.stock?.[0]?.minimum_threshold?.toString() || '10'
// //       });
      
// //       // Prévisualiser l'image existante
// //       if (product.image_url) {
// //         setImagePreview(product.image_url);
// //       }
// //     }
// //   }, [product]);

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

// //     const { error: uploadError } = await supabase.storage
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

// //   const deleteOldImage = async () => {
// //     if (product.image_path) {
// //       try {
// //         await supabase.storage
// //           .from('product-images')
// //           .remove([product.image_path]);
// //       } catch (error) {
// //         console.error('Erreur suppression ancienne image:', error);
// //       }
// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);

// //     try {
// //       // 1. Uploader la nouvelle image si elle existe
// //       let imageData = null;
// //       if (imageFile && formData.category_id) {
// //         // Supprimer l'ancienne image
// //         await deleteOldImage();
        
// //         const category = categories.find(c => c.id === formData.category_id);
// //         imageData = await uploadProductImage(product.id, category?.name);
// //       }

// //       // 2. Mettre à jour le produit
// //       const productUpdateData = {
// //         name: formData.name,
// //         description: formData.description,
// //         category_id: formData.category_id || null,
// //         retail_price: parseFloat(formData.retail_price),
// //         wholesale_price: parseFloat(formData.wholesale_price),
// //         currency: formData.currency,
// //         updated_at: new Date().toISOString()
// //       };

// //       if (imageData) {
// //         productUpdateData.image_url = imageData.url;
// //         productUpdateData.image_path = imageData.path;
// //       }

// //       const { error: productError } = await supabase
// //         .from('products')
// //         .update(productUpdateData)
// //         .eq('id', product.id);

// //       if (productError) throw productError;

// //       // 3. Mettre à jour le stock
// //       const { error: stockError } = await supabase
// //         .from('stock')
// //         .update({
// //           quantity: parseInt(formData.quantity),
// //           minimum_threshold: parseInt(formData.minimum_threshold)
// //         })
// //         .eq('product_id', product.id);

// //       if (stockError) throw stockError;

// //       // 4. Appeler le callback de mise à jour
// //       onUpdate && onUpdate();
      
// //       alert('Produit modifié avec succès!');
// //       onClose && onClose();

// //     } catch (error) {
// //       console.error('Erreur:', error);
// //       alert(`Erreur: ${error.message}`);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleDeleteProduct = async () => {
// //     if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.')) {
// //       return;
// //     }

// //     setLoading(true);
// //     try {
// //       // Supprimer l'image du stockage
// //       if (product.image_path) {
// //         await supabase.storage
// //           .from('product-images')
// //           .remove([product.image_path]);
// //       }

// //       // Supprimer le produit (le stock sera supprimé via cascade)
// //       const { error } = await supabase
// //         .from('products')
// //         .delete()
// //         .eq('id', product.id);

// //       if (error) throw error;

// //       alert('Produit supprimé avec succès!');
// //       onUpdate && onUpdate();
// //       onClose && onClose();
// //     } catch (error) {
// //       console.error('Erreur suppression:', error);
// //       alert('Erreur lors de la suppression du produit');
// //     } finally {
// //       setLoading(false);
// //       setShowDeleteConfirm(false);
// //     }
// //   };

// //   if (!product) return null;

// //   return (
// //     <div className="fixed inset-0 bg-black/50  flex items-center justify-center p-4 z-50">
// //       <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
// //         <div className="p-6">
// //           <div className="flex justify-between items-center mb-6">
// //             <h2 className="text-2xl font-bold">Modifier le produit</h2>
// //             <button
// //               onClick={onClose}
// //               className="text-gray-500 hover:text-gray-700 text-2xl"
// //             >
// //               ×
// //             </button>
// //           </div>
          
// //           <form onSubmit={handleSubmit} className="space-y-4">
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //               {/* Nom du produit */}
// //               <div>
// //                 <label className="block text-sm font-medium mb-1">Nom du produit *</label>
// //                 <input
// //                   type="text"
// //                   required
// //                   value={formData.name}
// //                   onChange={(e) => setFormData({...formData, name: e.target.value})}
// //                   className="w-full p-2 border rounded"
// //                   placeholder="Ex: T-Shirt Cotton"
// //                 />
// //               </div>

// //               {/* Catégorie */}
// //               <div>
// //                 <label className="block text-sm font-medium mb-1">Catégorie</label>
// //                 <select
// //                   value={formData.category_id}
// //                   onChange={(e) => setFormData({...formData, category_id: e.target.value})}
// //                   className="w-full p-2 border rounded"
// //                 >
// //                   <option value="">Sélectionner une catégorie</option>
// //                   {categories.map((cat) => (
// //                     <option key={cat.id} value={cat.id}>
// //                       {cat.name}
// //                     </option>
// //                   ))}
// //                 </select>
// //               </div>
// //             </div>

// //             {/* Description */}
// //             <div>
// //               <label className="block text-sm font-medium mb-1">Description</label>
// //               <textarea
// //                 value={formData.description}
// //                 onChange={(e) => setFormData({...formData, description: e.target.value})}
// //                 className="w-full p-2 border rounded"
// //                 rows="3"
// //                 placeholder="Description du produit..."
// //               />
// //             </div>

// //             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //               {/* Prix de détail */}
// //               <div>
// //                 <label className="block text-sm font-medium mb-1">
// //                   Prix de détail (Retail) *
// //                 </label>
// //                 <input
// //                   type="number"
// //                   step="0.01"
// //                   required
// //                   value={formData.retail_price}
// //                   onChange={(e) => setFormData({...formData, retail_price: e.target.value})}
// //                   className="w-full p-2 border rounded"
// //                   min="0"
// //                 />
// //               </div>

// //               {/* Prix de gros */}
// //               <div>
// //                 <label className="block text-sm font-medium mb-1">
// //                   Prix de gros (Wholesale) *
// //                 </label>
// //                 <input
// //                   type="number"
// //                   step="0.01"
// //                   required
// //                   value={formData.wholesale_price}
// //                   onChange={(e) => setFormData({...formData, wholesale_price: e.target.value})}
// //                   className="w-full p-2 border rounded"
// //                   min="0"
// //                 />
// //               </div>

// //               {/* Devise */}
// //               <div>
// //                 <label className="block text-sm font-medium mb-1">Devise</label>
// //                 <select
// //                   value={formData.currency}
// //                   onChange={(e) => setFormData({...formData, currency: e.target.value})}
// //                   className="w-full p-2 border rounded"
// //                 >
// //                   <option value="EUR">Euro (€)</option>
// //                   <option value="USD">Dollar ($)</option>
// //                   <option value="CDF">Franc Congolais (FC)</option>
// //                   <option value="GBP">Livre Sterling (£)</option>
// //                 </select>
// //               </div>
// //             </div>

// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //               {/* Quantité */}
// //               <div>
// //                 <label className="block text-sm font-medium mb-1">Quantité en stock</label>
// //                 <input
// //                   type="number"
// //                   value={formData.quantity}
// //                   onChange={(e) => setFormData({...formData, quantity: e.target.value})}
// //                   className="w-full p-2 border rounded"
// //                   min="0"
// //                 />
// //               </div>

// //               {/* Seuil minimum */}
// //               <div>
// //                 <label className="block text-sm font-medium mb-1">
// //                   Seuil d'alerte stock
// //                 </label>
// //                 <input
// //                   type="number"
// //                   value={formData.minimum_threshold}
// //                   onChange={(e) => setFormData({...formData, minimum_threshold: e.target.value})}
// //                   className="w-full p-2 border rounded"
// //                   min="1"
// //                 />
// //               </div>
// //             </div>

// //             {/* Upload d'image */}
// //             <div>
// //               <label className="block text-sm font-medium mb-1">Image du produit</label>
// //               <div className="flex items-center space-x-4">
// //                 <input
// //                   type="file"
// //                   accept="image/*"
// //                   onChange={handleImageChange}
// //                   className="w-full p-2 border rounded"
// //                 />
// //                 {imagePreview && (
// //                   <div className="w-16 h-16 border rounded overflow-hidden">
// //                     <img
// //                       src={imagePreview}
// //                       alt="Aperçu"
// //                       className="w-full h-full object-cover"
// //                     />
// //                   </div>
// //                 )}
// //               </div>
// //               <p className="text-xs text-gray-500 mt-1">
// //                 Laissez vide pour conserver l'image actuelle
// //               </p>
// //             </div>

// //             {/* Boutons d'action */}
// //             <div className="flex justify-between pt-6">
// //               <div>
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowDeleteConfirm(true)}
// //                   disabled={loading}
// //                   className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
// //                 >
// //                   Supprimer
// //                 </button>
// //               </div>
              
// //               <div className="space-x-3">
// //                 <button
// //                   type="button"
// //                   onClick={onClose}
// //                   disabled={loading}
// //                   className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
// //                 >
// //                   Annuler
// //                 </button>
// //                 <button
// //                   type="submit"
// //                   disabled={loading}
// //                   className={`px-4 py-2 rounded font-medium ${
// //                     loading
// //                       ? 'bg-gray-400 cursor-not-allowed'
// //                       : 'bg-blue-600 hover:bg-blue-700 text-white'
// //                   }`}
// //                 >
// //                   {loading ? 'Mise à jour...' : 'Enregistrer les modifications'}
// //                 </button>
// //               </div>
// //             </div>
// //           </form>
// //         </div>
// //       </div>

// //       {/* Modal de confirmation de suppression */}
// //       {showDeleteConfirm && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
// //           <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
// //             <h3 className="text-lg font-bold mb-2">Confirmer la suppression</h3>
// //             <p className="text-gray-600 mb-6">
// //               Êtes-vous sûr de vouloir supprimer "{product.name}" ? Cette action est irréversible.
// //             </p>
// //             <div className="flex justify-end space-x-3">
// //               <button
// //                 onClick={() => setShowDeleteConfirm(false)}
// //                 className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
// //               >
// //                 Annuler
// //               </button>
// //               <button
// //                 onClick={handleDeleteProduct}
// //                 disabled={loading}
// //                 className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
// //               >
// //                 {loading ? 'Suppression...' : 'Supprimer'}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }
// 'use client';

// import { useState, useEffect } from 'react';
// import { supabase } from '@/lib/supabase';

// export default function EditProductForm({ product, onClose, onUpdate }) {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
//   const [formData, setFormData] = useState({
//     name: '',
//     sku: '',
//     description: '',
//     category_id: '',
//     retail_price: '',
//     wholesale_price: '',
//     currency: 'CDF',
//     unit_type: 'unit',
//     quantity: '0',
//     minimum_threshold: '10',
//     is_active: true
//   });

//   // Initialiser les données du formulaire avec le produit
//   useEffect(() => {
//     if (product) {
//       setFormData({
//         name: product.name || '',
//         sku: product.sku || '',
//         description: product.description || '',
//         category_id: product.category_id || '',
//         retail_price: product.retail_price?.toString() || '',
//         wholesale_price: product.wholesale_price?.toString() || '',
//         currency: product.currency || 'CDF',
//         unit_type: product.unit_type || 'unit',
//         quantity: product.stock?.[0]?.quantity?.toString() || '0',
//         minimum_threshold: product.stock?.[0]?.minimum_threshold?.toString() || '10',
//         is_active: product.is_active !== undefined ? product.is_active : true
//       });
      
//       // Prévisualiser l'image existante
//       if (product.image_url) {
//         setImagePreview(product.image_url);
//       }
//     }
//   }, [product]);

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

//   const generateSku = () => {
//     const category = categories.find(c => c.id === formData.category_id);
//     const categoryCode = category?.name?.slice(0, 3).toUpperCase() || 'GEN';
//     const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
//     const sku = `${categoryCode}-${Date.now().toString().slice(-6)}-${randomNum}`;
    
//     setFormData({...formData, sku});
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

//     const { error: uploadError } = await supabase.storage
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

//   const deleteOldImage = async () => {
//     if (product.image_path) {
//       try {
//         await supabase.storage
//           .from('product-images')
//           .remove([product.image_path]);
//       } catch (error) {
//         console.error('Erreur suppression ancienne image:', error);
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // Validation des données
//       if (!formData.name.trim()) {
//         throw new Error('Le nom du produit est requis');
//       }
      
//       if (!formData.sku.trim()) {
//         throw new Error('Le SKU est requis');
//       }
      
//       if (!formData.retail_price || parseFloat(formData.retail_price) <= 0) {
//         throw new Error('Le prix de détail doit être supérieur à 0');
//       }
      
//       if (!formData.wholesale_price || parseFloat(formData.wholesale_price) <= 0) {
//         throw new Error('Le prix de gros doit être supérieur à 0');
//       }

//       // 1. Uploader la nouvelle image si elle existe
//       let imageData = null;
//       if (imageFile && formData.category_id) {
//         // Supprimer l'ancienne image
//         await deleteOldImage();
        
//         const category = categories.find(c => c.id === formData.category_id);
//         imageData = await uploadProductImage(product.id, category?.name);
//       }

//       // 2. Mettre à jour le produit
//       const productUpdateData = {
//         name: formData.name.trim(),
//         sku: formData.sku.trim(),
//         description: formData.description.trim(),
//         category_id: formData.category_id || null,
//         retail_price: parseFloat(formData.retail_price),
//         wholesale_price: parseFloat(formData.wholesale_price),
//         currency: formData.currency,
//         unit_type: formData.unit_type,
//         is_active: formData.is_active,
//         updated_at: new Date().toISOString()
//       };

//       if (imageData) {
//         productUpdateData.image_url = imageData.url;
//         productUpdateData.image_path = imageData.path;
//       }

//       const { error: productError } = await supabase
//         .from('products')
//         .update(productUpdateData)
//         .eq('id', product.id);

//       if (productError) throw productError;

//       // 3. Mettre à jour le stock
//       const { error: stockError } = await supabase
//         .from('stock')
//         .update({
//           quantity: parseInt(formData.quantity) || 0,
//           minimum_threshold: parseInt(formData.minimum_threshold) || 10,
//           updated_at: new Date().toISOString()
//         })
//         .eq('product_id', product.id);

//       if (stockError) throw stockError;

//       // 4. Appeler le callback de mise à jour
//       onUpdate && onUpdate();
      
//       alert('Produit modifié avec succès!');
//       onClose && onClose();

//     } catch (error) {
//       console.error('Erreur:', error);
//       alert(`Erreur: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteProduct = async () => {
//     if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.')) {
//       return;
//     }

//     setLoading(true);
//     try {
//       // Vérifier si le produit a des ventes associées
//       const { count: salesCount } = await supabase
//         .from('sale_item')
//         .select('*', { count: 'exact', head: true })
//         .eq('product_id', product.id);

//       if (salesCount && salesCount > 0) {
//         throw new Error('Impossible de supprimer ce produit car il a des ventes associées. Désactivez-le à la place.');
//       }

//       // Supprimer l'image du stockage
//       if (product.image_path) {
//         await supabase.storage
//           .from('product-images')
//           .remove([product.image_path]);
//       }

//       // Supprimer le produit (le stock sera supprimé via cascade)
//       const { error } = await supabase
//         .from('products')
//         .delete()
//         .eq('id', product.id);

//       if (error) throw error;

//       alert('Produit supprimé avec succès!');
//       onUpdate && onUpdate();
//       onClose && onClose();
//     } catch (error) {
//       console.error('Erreur suppression:', error);
//       alert(`Erreur: ${error.message}`);
//     } finally {
//       setLoading(false);
//       setShowDeleteConfirm(false);
//     }
//   };

//   if (!product) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold">Modifier le produit</h2>
//             <button
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-700 text-2xl"
//             >
//               ×
//             </button>
//           </div>
          
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Nom du produit */}
//               <div>
//                 <label className="block text-sm font-medium mb-1">Nom du produit *</label>
//                 <input
//                   type="text"
//                   required
//                   value={formData.name}
//                   onChange={(e) => setFormData({...formData, name: e.target.value})}
//                   className="w-full p-2 border rounded"
//                   placeholder="Ex: T-Shirt Cotton"
//                 />
//               </div>

//               {/* SKU */}
//               <div>
//                 <label className="block text-sm font-medium mb-1">SKU *</label>
//                 <div className="flex gap-2">
//                   <input
//                     type="text"
//                     required
//                     value={formData.sku}
//                     onChange={(e) => setFormData({...formData, sku: e.target.value})}
//                     className="flex-1 p-2 border rounded"
//                     placeholder="Ex: TSH-COT-001"
//                   />
//                   <button
//                     type="button"
//                     onClick={generateSku}
//                     className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
//                   >
//                     Générer
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Description */}
//             <div>
//               <label className="block text-sm font-medium mb-1">Description</label>
//               <textarea
//                 value={formData.description}
//                 onChange={(e) => setFormData({...formData, description: e.target.value})}
//                 className="w-full p-2 border rounded"
//                 rows="3"
//                 placeholder="Description du produit..."
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Catégorie */}
//               <div>
//                 <label className="block text-sm font-medium mb-1">Catégorie</label>
//                 <select
//                   value={formData.category_id}
//                   onChange={(e) => setFormData({...formData, category_id: e.target.value})}
//                   className="w-full p-2 border rounded"
//                 >
//                   <option value="">Sélectionner une catégorie</option>
//                   {categories.map((cat) => (
//                     <option key={cat.id} value={cat.id}>
//                       {cat.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Type d'unité */}
//               <div>
//                 <label className="block text-sm font-medium mb-1">Type d'unité</label>
//                 <select
//                   value={formData.unit_type}
//                   onChange={(e) => setFormData({...formData, unit_type: e.target.value})}
//                   className="w-full p-2 border rounded"
//                 >
//                   <option value="unit">Unité</option>
//                   <option value="kg">Kilogramme</option>
//                   <option value="g">Gramme</option>
//                   <option value="l">Litre</option>
//                   <option value="ml">Millilitre</option>
//                   <option value="m">Mètre</option>
//                   <option value="cm">Centimètre</option>
//                   <option value="box">Boîte</option>
//                   <option value="pack">Pack</option>
//                 </select>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {/* Prix de détail */}
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Prix de détail (Retail) *
//                 </label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   required
//                   value={formData.retail_price}
//                   onChange={(e) => setFormData({...formData, retail_price: e.target.value})}
//                   className="w-full p-2 border rounded"
//                   min="0"
//                 />
//               </div>

//               {/* Prix de gros */}
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Prix de gros (Wholesale) *
//                 </label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   required
//                   value={formData.wholesale_price}
//                   onChange={(e) => setFormData({...formData, wholesale_price: e.target.value})}
//                   className="w-full p-2 border rounded"
//                   min="0"
//                 />
//               </div>

//               {/* Devise */}
//               <div>
//                 <label className="block text-sm font-medium mb-1">Devise</label>
//                 <select
//                   value={formData.currency}
//                   onChange={(e) => setFormData({...formData, currency: e.target.value})}
//                   className="w-full p-2 border rounded"
//                 >
//                   <option value="CDF">Franc Congolais (FC)</option>
//                   <option value="USD">Dollar US ($)</option>
//                 </select>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Quantité */}
//               <div>
//                 <label className="block text-sm font-medium mb-1">Quantité en stock</label>
//                 <input
//                   type="number"
//                   value={formData.quantity}
//                   onChange={(e) => setFormData({...formData, quantity: e.target.value})}
//                   className="w-full p-2 border rounded"
//                   min="0"
//                 />
//               </div>

//               {/* Seuil minimum */}
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Seuil d'alerte stock
//                 </label>
//                 <input
//                   type="number"
//                   value={formData.minimum_threshold}
//                   onChange={(e) => setFormData({...formData, minimum_threshold: e.target.value})}
//                   className="w-full p-2 border rounded"
//                   min="1"
//                 />
//               </div>
//             </div>

//             {/* Statut actif */}
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 id="is_active"
//                 checked={formData.is_active}
//                 onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
//                 className="h-4 w-4 text-blue-600 rounded"
//               />
//               <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
//                 Produit actif (visible dans les ventes)
//               </label>
//             </div>

//             {/* Upload d'image */}
//             <div>
//               <label className="block text-sm font-medium mb-1">Image du produit</label>
//               <div className="flex items-center space-x-4">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageChange}
//                   className="w-full p-2 border rounded"
//                 />
//                 {imagePreview && (
//                   <div className="w-16 h-16 border rounded overflow-hidden">
//                     <img
//                       src={imagePreview}
//                       alt="Aperçu"
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                 )}
//               </div>
//               <p className="text-xs text-gray-500 mt-1">
//                 Laissez vide pour conserver l'image actuelle
//               </p>
//             </div>

//             {/* Boutons d'action */}
//             <div className="flex justify-between pt-6 border-t">
//               <div>
//                 <button
//                   type="button"
//                   onClick={() => setShowDeleteConfirm(true)}
//                   disabled={loading}
//                   className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
//                 >
//                   Supprimer
//                 </button>
//               </div>
              
//               <div className="space-x-3">
//                 <button
//                   type="button"
//                   onClick={onClose}
//                   disabled={loading}
//                   className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
//                 >
//                   Annuler
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className={`px-4 py-2 rounded font-medium ${
//                     loading
//                       ? 'bg-gray-400 cursor-not-allowed'
//                       : 'bg-blue-600 hover:bg-blue-700 text-white'
//                   }`}
//                 >
//                   {loading ? 'Mise à jour...' : 'Enregistrer les modifications'}
//                 </button>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>

//       {/* Modal de confirmation de suppression */}
//       {showDeleteConfirm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
//           <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
//             <h3 className="text-lg font-bold mb-2">Confirmer la suppression</h3>
//             <p className="text-gray-600 mb-6">
//               Êtes-vous sûr de vouloir supprimer "{product.name}" ? Cette action est irréversible.
//             </p>
//             <div className="flex justify-end space-x-3">
//               <button
//                 onClick={() => setShowDeleteConfirm(false)}
//                 className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
//               >
//                 Annuler
//               </button>
//               <button
//                 onClick={handleDeleteProduct}
//                 disabled={loading}
//                 className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
//               >
//                 {loading ? 'Suppression...' : 'Supprimer'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function EditProductForm({ product, onClose, onUpdate }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    category_id: '',
    retail_price: '',
    wholesale_price: '',
    currency: 'CDF',
    unit_type: 'PIECE',
    quantity: '0',
    minimum_threshold: '10',
    is_active: true
  });

  // Initialiser les données du formulaire avec le produit
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        description: product.description || '',
        category_id: product.category_id || '',
        retail_price: product.retail_price?.toString() || '',
        wholesale_price: product.wholesale_price?.toString() || '',
        currency: product.currency || 'CDF',
        unit_type: product.unit_type || 'PIECE',
        quantity: product.stock?.[0]?.quantity?.toString() || '0',
        minimum_threshold: product.stock?.[0]?.minimum_threshold?.toString() || '10',
        is_active: product.is_active !== undefined ? product.is_active : true
      });
      
      // Prévisualiser l'image existante
      if (product.image_url) {
        setImagePreview(product.image_url);
      }
    }
  }, [product]);

  // Charger les catégories
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name')
      .order('name');
    
    if (!error && data) {
      setCategories(data);
    }
  };

  // Générer le SKU selon le format : CATÉGORIE(3 lettres)-NOM(3 lettres)-UNIT_TYPE-RETAILPRICE(4 chiffres)
  const generateSku = () => {
    try {
      const category = categories.find(c => c.id === formData.category_id);
      
      // CATÉGORIE(3 premières lettres en majuscule)
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
      
      // NOM(3 premières lettres en majuscule)
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
      // Fallback simple
      const timestamp = Date.now().toString().slice(-4);
      return `CAT-PRO-PIECE-${timestamp}`;
    }
  };

  // Afficher le SKU prévisualisé
  const previewSku = (formData.name && formData.category_id && formData.retail_price) ? generateSku() : '';

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadProductImage = async (productId, categoryName) => {
    if (!imageFile || !categoryName) return null;

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${productId}_${Date.now()}.${fileExt}`;
    const filePath = `${categoryName}/${new Date().toISOString().slice(0, 7)}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, imageFile);

    if (uploadError) {
      console.error('Erreur upload image:', uploadError);
      return null;
    }

    // Obtenir l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return { path: filePath, url: publicUrl };
  };

  const deleteOldImage = async () => {
    if (product.image_path) {
      try {
        await supabase.storage
          .from('product-images')
          .remove([product.image_path]);
      } catch (error) {
        console.error('Erreur suppression ancienne image:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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

      // Générer le nouveau SKU
      const newSku = generateSku();
      console.log('Nouveau SKU généré:', newSku);

      // 1. Uploader la nouvelle image si elle existe
      let imageData = null;
      if (imageFile && formData.category_id) {
        // Supprimer l'ancienne image
        await deleteOldImage();
        
        const category = categories.find(c => c.id === formData.category_id);
        imageData = await uploadProductImage(product.id, category?.name);
      }

      // 2. Mettre à jour le produit
      const productUpdateData = {
        name: formData.name.trim(),
        sku: newSku, // Utiliser le nouveau SKU généré
        description: formData.description.trim(),
        category_id: formData.category_id || null,
        retail_price: parseFloat(formData.retail_price),
        wholesale_price: parseFloat(formData.wholesale_price),
        currency: formData.currency,
        unit_type: formData.unit_type,
        is_active: formData.is_active,
        updated_at: new Date().toISOString()
      };

      if (imageData) {
        productUpdateData.image_url = imageData.url;
        productUpdateData.image_path = imageData.path;
      }

      const { error: productError } = await supabase
        .from('products')
        .update(productUpdateData)
        .eq('id', product.id);

      if (productError) throw productError;

      // 3. Mettre à jour le stock
      const { error: stockError } = await supabase
        .from('stock')
        .update({
          quantity: parseInt(formData.quantity) || 0,
          minimum_threshold: parseInt(formData.minimum_threshold) || 10,
          updated_at: new Date().toISOString()
        })
        .eq('product_id', product.id);

      if (stockError) throw stockError;

      // 4. Appeler le callback de mise à jour
      onUpdate && onUpdate();
      
      alert(`Produit modifié avec succès!\nNouveau SKU: ${newSku}`);
      onClose && onClose();

    } catch (error) {
      console.error('Erreur:', error);
      alert(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.')) {
      return;
    }

    setLoading(true);
    try {
      // Vérifier si le produit a des ventes associées
      const { count: salesCount } = await supabase
        .from('sale_item')
        .select('*', { count: 'exact', head: true })
        .eq('product_id', product.id);

      if (salesCount && salesCount > 0) {
        throw new Error('Impossible de supprimer ce produit car il a des ventes associées. Désactivez-le à la place.');
      }

      // Supprimer l'image du stockage
      if (product.image_path) {
        await supabase.storage
          .from('product-images')
          .remove([product.image_path]);
      }

      // Supprimer le produit (le stock sera supprimé via cascade)
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

      if (error) throw error;

      alert('Produit supprimé avec succès!');
      onUpdate && onUpdate();
      onClose && onClose();
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Modifier le produit</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nom du produit */}
              <div>
                <label className="block text-sm font-medium mb-1">Nom du produit *</label>
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
                <label className="block text-sm font-medium mb-1">Catégorie *</label>
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

            {/* SKU actuel et prévisualisation */}
            <div className="bg-blue-50 p-3 rounded border border-blue-200">
              <div className="mb-2">
                <p className="text-sm font-medium text-blue-800">SKU actuel:</p>
                <p className="text-lg font-bold text-blue-700 font-mono">{product.sku}</p>
              </div>
              
              {previewSku && previewSku !== product.sku && (
                <div>
                  <p className="text-sm font-medium text-blue-800">Nouveau SKU généré:</p>
                  <p className="text-lg font-bold text-green-700 font-mono">{previewSku}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Format: CATÉGORIE(3 lettres)-NOM(3 lettres)-UNITÉ-PRIX(4 chiffres)
                  </p>
                </div>
              )}
              
              {!previewSku && (
                <p className="text-xs text-blue-600">
                  Remplissez le nom, la catégorie et le prix pour générer le nouveau SKU
                </p>
              )}
            </div>

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
                />
                <p className="text-xs text-gray-500 mt-1">
                  Détermine les 4 derniers chiffres du SKU
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
                  <option value="USD">Dollar US ($)</option>
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
                  className="w-full p-2 border rounded"
                >
                  <option value="PIECE">Pièce</option>
                  <option value="KG">Kilogramme</option>
                  <option value="LITRE">Litre</option>
                  <option value="METRE">Mètre</option>
                  <option value="BOUTEILLE">Bouteille</option>
                  <option value="SACHET">Sachet</option>
                  <option value="CARTON">Carton</option>
                </select>
              </div>

              {/* Quantité */}
              <div>
                <label className="block text-sm font-medium mb-1">Quantité en stock</label>
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

            {/* Statut actif */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                Produit actif (visible dans les ventes)
              </label>
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
                Laissez vide pour conserver l'image actuelle
              </p>
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-between pt-6 border-t">
              <div>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={loading}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
                >
                  Supprimer
                </button>
              </div>
              
              <div className="space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 rounded font-medium ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {loading ? 'Mise à jour...' : 'Enregistrer les modifications'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-2">Confirmer la suppression</h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer "{product.name}" ? Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteProduct}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}