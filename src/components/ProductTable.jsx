// // // 'use client';
// // // import EditProductForm from '@/components/EditProductForm'
// // // import { useState } from 'react';

// // // export default function ProductTable({ products, onDelete, onUpdateStock }) {
// // //   const [editingStock, setEditingStock] = useState(null);
// // //   const [stockValue, setStockValue] = useState('');
// // //   const [editingProduct, setEditingProduct] = useState(null);
// // //   const formatCurrency = (amount, currency) => {
// // //     const symbols = {
// // //       'EUR': '€',
// // //       'USD': '$',
// // //       'CDF': 'FC',
// // //       'GBP': '£'
// // //     };
// // //     return `${parseFloat(amount).toFixed(2)} ${symbols[currency] || currency}`;
// // //   };

// // //   const handleStockEdit = (productId, currentQuantity) => {
// // //     setEditingStock(productId);
// // //     setStockValue(currentQuantity.toString());
// // //   };

// // //   const saveStock = (productId) => {
// // //     const quantity = parseInt(stockValue);
// // //     if (!isNaN(quantity) && quantity >= 0) {
// // //       onUpdateStock(productId, quantity);
// // //     }
// // //     setEditingStock(null);
// // //   };

// // //   return (
// // //     <div className="overflow-x-auto bg-white rounded-lg shadow">
// // //       <table className="min-w-full divide-y divide-gray-200">
// // //         <thead className="bg-gray-50">
// // //           <tr>
// // //             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
// // //               Produit
// // //             </th>
// // //             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
// // //               Catégorie
// // //             </th>
// // //             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
// // //               Prix
// // //             </th>
// // //             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
// // //               Stock
// // //             </th>
// // //             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
// // //               Actions
// // //             </th>
// // //           </tr>
// // //         </thead>
// // //         <tbody className="divide-y divide-gray-200">
// // //           {products.map((product) => (
// // //             <tr key={product.id} className="hover:bg-gray-50">
// // //               {/* Colonne Produit avec image */}
// // //               <td className="px-6 py-4">
// // //                 <div className="flex items-center">
// // //                   {product.image_url ? (
// // //                     <div className="h-10 w-10 flex-shrink-0 mr-3">
// // //                       <img
// // //                         className="h-10 w-10 rounded object-cover"
// // //                         src={product.image_url}
// // //                         alt={product.name}
// // //                       />
// // //                     </div>
// // //                   ) : (
// // //                     <div className="h-10 w-10 flex-shrink-0 mr-3 bg-gray-200 rounded flex items-center justify-center">
// // //                       <span className="text-gray-500 text-xs">No image</span>
// // //                     </div>
// // //                   )}
// // //                   <div>
// // //                     <div className="font-medium text-gray-900">{product.name}</div>
// // //                     <div className="text-sm text-gray-500 truncate max-w-xs">
// // //                       {product.description}
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               </td>

// // //               {/* Catégorie */}
// // //               <td className="px-6 py-4">
// // //                 <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
// // //                   {product.category?.name || 'Non catégorisé'}
// // //                 </span>
// // //               </td>

// // //               {/* Prix */}
// // //               <td className="px-6 py-4">
// // //                 <div className="space-y-1">
// // //                   <div className="text-sm">
// // //                     <span className="text-gray-600">Détail: </span>
// // //                     <span className="font-medium">
// // //                       {formatCurrency(product.retail_price, product.currency)}
// // //                     </span>
// // //                   </div>
// // //                   <div className="text-sm">
// // //                     <span className="text-gray-600">Gros: </span>
// // //                     <span className="font-medium">
// // //                       {formatCurrency(product.wholesale_price, product.currency)}
// // //                     </span>
// // //                   </div>
// // //                 </div>
// // //               </td>

// // //               {/* Stock */}
// // //               <td className="px-6 py-4">
// // //                 {editingStock === product.id ? (
// // //                   <div className="flex items-center space-x-2">
// // //                     <input
// // //                       type="number"
// // //                       value={stockValue}
// // //                       onChange={(e) => setStockValue(e.target.value)}
// // //                       className="w-20 p-1 border rounded text-sm"
// // //                       min="0"
// // //                     />
// // //                     <button
// // //                       onClick={() => saveStock(product.id)}
// // //                       className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
// // //                     >
// // //                       ✓
// // //                     </button>
// // //                     <button
// // //                       onClick={() => setEditingStock(null)}
// // //                       className="px-2 py-1 text-xs bg-gray-400 text-white rounded hover:bg-gray-500"
// // //                     >
// // //                       ✗
// // //                     </button>
// // //                   </div>
// // //                 ) : (
// // //                   <div className="flex items-center space-x-2">
// // //                     <span className={`font-medium ${
// // //                       product.stock?.[0]?.quantity <= product.stock?.[0]?.minimum_threshold
// // //                         ? 'text-red-600'
// // //                         : 'text-gray-900'
// // //                     }`}>
// // //                       {product.stock?.[0]?.quantity || 0} unités
// // //                     </span>
// // //                     <button
// // //                       onClick={() => handleStockEdit(
// // //                         product.id, 
// // //                         product.stock?.[0]?.quantity || 0
// // //                       )}
// // //                       className="text-xs text-blue-600 hover:text-blue-800"
// // //                     >
// // //                       Modifier
// // //                     </button>
// // //                   </div>
// // //                 )}
// // //                 {product.stock?.[0]?.minimum_threshold && (
// // //                   <div className="text-xs text-gray-500 mt-1">
// // //                     Seuil: {product.stock[0].minimum_threshold}
// // //                   </div>
// // //                 )}
// // //               </td>

// // //               {/* Actions */}
// // //               <td className="px-6 py-4 text-sm space-x-2">
// // //                 <button
// // //                 onClick={() => setEditingProduct(product)}
// // //                 className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"                >
// // //                   Éditer
// // //                 </button>
// // //                 <button
// // //                   onClick={() => onDelete(product.id, product.image_path)}
// // //                   className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
// // //                 >
// // //                   Supprimer
// // //                 </button>
// // //               </td>
// // //             </tr>
// // //           ))}
// // //         </tbody>
// // //       </table>

// // //       {products.length === 0 && (
// // //         <div className="text-center py-12 text-gray-500">
// // //           Aucun produit trouvé. Commencez par ajouter un produit.
// // //         </div>
// // //       )}
// // //   {editingProduct && (
// // //     <EditProductForm
// // //       product={editingProduct}
// // //       onClose={() => setEditingProduct(null)}
// // //       onUpdate={() => {
// // //         // Recharger les produits ou mettre à jour localement
// // //         window.location.reload(); // ou une fonction de refresh
// // //       }}
// // //     />
// // //   )}
// // //     </div>
// // //   );
// // // }


// // 'use client';
// // import EditProductForm from '@/components/EditProductForm'
// // import { useState } from 'react';

// // export default function ProductTable({ products, onDelete, onUpdateStock }) {
// //   const [editingStock, setEditingStock] = useState(null);
// //   const [stockValue, setStockValue] = useState('');
// //   const [editingProduct, setEditingProduct] = useState(null);
  
// //   const formatCurrency = (amount, currency) => {
// //     const symbols = {
// //       'EUR': '€',
// //       'USD': '$',
// //       'CDF': 'FC',
// //       'GBP': '£'
// //     };
// //     return `${parseFloat(amount).toFixed(2)} ${symbols[currency] || currency}`;
// //   };

// //   const handleStockEdit = (productId, currentQuantity) => {
// //     setEditingStock(productId);
// //     setStockValue(currentQuantity.toString());
// //   };

// //   const saveStock = (productId) => {
// //     const quantity = parseInt(stockValue);
// //     if (!isNaN(quantity) && quantity >= 0) {
// //       onUpdateStock(productId, quantity);
// //     }
// //     setEditingStock(null);
// //   };

// //   return (
// //     <div className="overflow-x-auto bg-white rounded-lg shadow">
// //       <table className="min-w-full divide-y divide-gray-200">
// //         <thead className="bg-gray-50">
// //           <tr>
// //             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
// //               Produit
// //             </th>
// //             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
// //               SKU
// //             </th>
// //             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
// //               Catégorie
// //             </th>
// //             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
// //               Prix
// //             </th>
// //             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
// //               Stock
// //             </th>
// //             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
// //               Actions
// //             </th>
// //           </tr>
// //         </thead>
// //         <tbody className="divide-y divide-gray-200">
// //           {products.map((product) => (
// //             <tr key={product.id} className="hover:bg-gray-50">
// //               {/* Colonne Produit avec image */}
// //               <td className="px-6 py-4">
// //                 <div className="flex items-center">
// //                   {product.image_url ? (
// //                     <div className="h-10 w-10 flex-shrink-0 mr-3">
// //                       <img
// //                         className="h-10 w-10 rounded object-cover"
// //                         src={product.image_url}
// //                         alt={product.name}
// //                       />
// //                     </div>
// //                   ) : (
// //                     <div className="h-10 w-10 flex-shrink-0 mr-3 bg-gray-200 rounded flex items-center justify-center">
// //                       <span className="text-gray-500 text-xs">No image</span>
// //                     </div>
// //                   )}
// //                   <div>
// //                     <div className="font-medium text-gray-900">{product.name}</div>
// //                     <div className="text-sm text-gray-500">
// //                       {product.unit_type === 'PIECE' ? 'Pièce' :
// //                        product.unit_type === 'KG' ? 'Kilogramme' :
// //                        product.unit_type === 'LITRE' ? 'Litre' :
// //                        product.unit_type === 'METRE' ? 'Mètre' :
// //                        product.unit_type === 'BOUTEILLE' ? 'Bouteille' :
// //                        product.unit_type === 'SACHET' ? 'Sachet' :
// //                        product.unit_type === 'CARTON' ? 'Carton' : product.unit_type}
// //                     </div>
// //                     <div className="text-xs text-gray-400 truncate max-w-xs">
// //                       {product.description}
// //                     </div>
// //                   </div>
// //                 </div>
// //               </td>

// //               {/* SKU */}
// //               <td className="px-6 py-4">
// //                 <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded inline-block">
// //                   {product.sku}
// //                 </div>
// //               </td>

// //               {/* Catégorie */}
// //               <td className="px-6 py-4">
// //                 <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
// //                   {product.category?.name || 'Non catégorisé'}
// //                 </span>
// //               </td>

// //               {/* Prix */}
// //               <td className="px-6 py-4">
// //                 <div className="space-y-1">
// //                   <div className="text-sm">
// //                     <span className="text-gray-600">Détail: </span>
// //                     <span className="font-medium">
// //                       {formatCurrency(product.retail_price, product.currency)}
// //                     </span>
// //                   </div>
// //                   <div className="text-sm">
// //                     <span className="text-gray-600">Gros: </span>
// //                     <span className="font-medium">
// //                       {formatCurrency(product.wholesale_price, product.currency)}
// //                     </span>
// //                   </div>
// //                 </div>
// //               </td>

// //               {/* Stock */}
// //               <td className="px-6 py-4">
// //                 {editingStock === product.id ? (
// //                   <div className="flex items-center space-x-2">
// //                     <input
// //                       type="number"
// //                       value={stockValue}
// //                       onChange={(e) => setStockValue(e.target.value)}
// //                       className="w-20 p-1 border rounded text-sm"
// //                       min="0"
// //                     />
// //                     <button
// //                       onClick={() => saveStock(product.id)}
// //                       className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
// //                     >
// //                       ✓
// //                     </button>
// //                     <button
// //                       onClick={() => setEditingStock(null)}
// //                       className="px-2 py-1 text-xs bg-gray-400 text-white rounded hover:bg-gray-500"
// //                     >
// //                       ✗
// //                     </button>
// //                   </div>
// //                 ) : (
// //                   <div className="flex items-center space-x-2">
// //                     <span className={`font-medium ${
// //                       product.stock?.[0]?.quantity <= product.stock?.[0]?.minimum_threshold
// //                         ? 'text-red-600'
// //                         : 'text-gray-900'
// //                     }`}>
// //                       {product.stock?.[0]?.quantity || 0} unités
// //                     </span>
// //                     <button
// //                       onClick={() => handleStockEdit(
// //                         product.id, 
// //                         product.stock?.[0]?.quantity || 0
// //                       )}
// //                       className="text-xs text-blue-600 hover:text-blue-800"
// //                     >
// //                       Modifier
// //                     </button>
// //                   </div>
// //                 )}
// //                 {product.stock?.[0]?.minimum_threshold && (
// //                   <div className="text-xs text-gray-500 mt-1">
// //                     Seuil: {product.stock[0].minimum_threshold}
// //                   </div>
// //                 )}
// //               </td>

// //               {/* Actions */}
// //               <td className="px-6 py-4 text-sm space-x-2">
// //                 <button
// //                   onClick={() => setEditingProduct(product)}
// //                   className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"                >
// //                   Éditer
// //                 </button>
// //                 <button
// //                   onClick={() => onDelete(product.id, product.image_path)}
// //                   className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
// //                 >
// //                   Supprimer
// //                 </button>
// //               </td>
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>

// //       {products.length === 0 && (
// //         <div className="text-center py-12 text-gray-500">
// //           Aucun produit trouvé. Commencez par ajouter un produit.
// //         </div>
// //       )}
      
// //       {editingProduct && (
// //         <EditProductForm
// //           product={editingProduct}
// //           onClose={() => setEditingProduct(null)}
// //           onUpdate={() => {
// //             // Recharger les produits ou mettre à jour localement
// //             window.location.reload(); // ou une fonction de refresh
// //           }}
// //         />
// //       )}
// //     </div>
// //   );
// // }

// 'use client';
// import { useState } from 'react';
// import { 
//   Edit, 
//   Trash2, 
//   Package, 
//   Tag, 
//   DollarSign, 
//   Box, 
//   MoreVertical,
//   Check,
//   X,
//   Eye,
//   Image as ImageIcon
// } from 'lucide-react';
// import EditProductForm from '@/components/EditProductForm';

// export default function ProductTable({ products, onDelete, onUpdateStock }) {
//   const [editingStock, setEditingStock] = useState(null);
//   const [stockValue, setStockValue] = useState('');
//   const [editingProduct, setEditingProduct] = useState(null);
//   const [mobileActionMenu, setMobileActionMenu] = useState(null);
  
//   const formatCurrency = (amount, currency) => {
//     const symbols = {
//       'EUR': '€',
//       'USD': '$',
//       'CDF': 'FC',
//       'GBP': '£'
//     };
//     return `${parseFloat(amount).toFixed(2)} ${symbols[currency] || currency}`;
//   };

//   const getUnitLabel = (unitType) => {
//     const units = {
//       'PIECE': 'Pièce',
//       'KG': 'Kilogramme',
//       'LITRE': 'Litre',
//       'METRE': 'Mètre',
//       'BOUTEILLE': 'Bouteille',
//       'SACHET': 'Sachet',
//       'CARTON': 'Carton'
//     };
//     return units[unitType] || unitType;
//   };

//   const handleStockEdit = (productId, currentQuantity) => {
//     setEditingStock(productId);
//     setStockValue(currentQuantity.toString());
//   };

//   const saveStock = (productId) => {
//     const quantity = parseInt(stockValue);
//     if (!isNaN(quantity) && quantity >= 0) {
//       onUpdateStock(productId, quantity);
//     }
//     setEditingStock(null);
//   };

//   const truncateText = (text, maxLength) => {
//     if (!text) return '';
//     return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
//   };

//   return (
//     <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
//       {/* Vue desktop */}
//       <div className="hidden md:block">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Produit
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 SKU
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Catégorie
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Prix
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Stock
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {products.map((product) => (
//               <tr key={product.id} className="hover:bg-gray-50 transition">
//                 {/* Produit */}
//                 <td className="px-4 py-3">
//                   <div className="flex items-start space-x-3">
//                     {product.image_url ? (
//                       <div className="h-10 w-10 flex-shrink-0">
//                         <img
//                           className="h-10 w-10 rounded object-cover"
//                           src={product.image_url}
//                           alt={product.name}
//                         />
//                       </div>
//                     ) : (
//                       <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded flex items-center justify-center">
//                         <Package className="w-5 h-5 text-gray-400" />
//                       </div>
//                     )}
//                     <div className="min-w-0 flex-1">
//                       <div className="font-medium text-gray-900 text-sm">
//                         {truncateText(product.name, 30)}
//                       </div>
//                       <div className="text-xs text-gray-500 mt-0.5">
//                         {getUnitLabel(product.unit_type)}
//                       </div>
//                     </div>
//                   </div>
//                 </td>

//                 {/* SKU */}
//                 <td className="px-4 py-3">
//                   <div className="font-mono text-xs bg-gray-100 px-2 py-1 rounded inline-block">
//                     {product.sku}
//                   </div>
//                 </td>

//                 {/* Catégorie */}
//                 <td className="px-4 py-3">
//                   <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
//                     {product.category?.name || 'Non catégorisé'}
//                   </span>
//                 </td>

//                 {/* Prix */}
//                 <td className="px-4 py-3">
//                   <div className="space-y-1">
//                     <div className="text-xs">
//                       <span className="text-gray-600">Détail: </span>
//                       <span className="font-medium">
//                         {formatCurrency(product.retail_price, product.currency)}
//                       </span>
//                     </div>
//                     <div className="text-xs">
//                       <span className="text-gray-600">Gros: </span>
//                       <span className="font-medium">
//                         {formatCurrency(product.wholesale_price, product.currency)}
//                       </span>
//                     </div>
//                   </div>
//                 </td>

//                 {/* Stock */}
//                 <td className="px-4 py-3">
//                   {editingStock === product.id ? (
//                     <div className="flex items-center space-x-1">
//                       <input
//                         type="number"
//                         value={stockValue}
//                         onChange={(e) => setStockValue(e.target.value)}
//                         className="w-16 p-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
//                         min="0"
//                       />
//                       <button
//                         onClick={() => saveStock(product.id)}
//                         className="p-1 text-green-600 hover:text-green-800"
//                         title="Valider"
//                       >
//                         <Check className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => setEditingStock(null)}
//                         className="p-1 text-gray-600 hover:text-gray-800"
//                         title="Annuler"
//                       >
//                         <X className="w-4 h-4" />
//                       </button>
//                     </div>
//                   ) : (
//                     <div className="flex items-center space-x-2">
//                       <span className={`font-medium text-sm ${
//                         product.stock?.[0]?.quantity <= product.stock?.[0]?.minimum_threshold
//                           ? 'text-red-600'
//                           : 'text-gray-900'
//                       }`}>
//                         {product.stock?.[0]?.quantity || 0}
//                       </span>
//                       <button
//                         onClick={() => handleStockEdit(
//                           product.id, 
//                           product.stock?.[0]?.quantity || 0
//                         )}
//                         className="text-xs text-gray-600 hover:text-gray-900"
//                       >
//                         Modifier
//                       </button>
//                     </div>
//                   )}
//                   {product.stock?.[0]?.minimum_threshold && (
//                     <div className="text-xs text-gray-500 mt-0.5">
//                       Seuil: {product.stock[0].minimum_threshold}
//                     </div>
//                   )}
//                 </td>

//                 {/* Actions */}
//                 <td className="px-4 py-3">
//                   <div className="flex items-center space-x-1">
//                     <button
//                       onClick={() => setEditingProduct(product)}
//                       className="p-1.5 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded transition"
//                       title="Éditer"
//                     >
//                       <Edit className="w-4 h-4" />
//                     </button>
//                     <button
//                       onClick={() => onDelete(product.id, product.image_path)}
//                       className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition"
//                       title="Supprimer"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Vue mobile */}
//       <div className="md:hidden">
//         <div className="divide-y divide-gray-200">
//           {products.map((product) => (
//             <div key={product.id} className="p-4 hover:bg-gray-50 transition">
//               <div className="flex items-start justify-between">
//                 {/* Informations produit */}
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-start space-x-3">
//                     {product.image_url ? (
//                       <div className="h-12 w-12 flex-shrink-0">
//                         <img
//                           className="h-12 w-12 rounded object-cover"
//                           src={product.image_url}
//                           alt={product.name}
//                         />
//                       </div>
//                     ) : (
//                       <div className="h-12 w-12 flex-shrink-0 bg-gray-100 rounded flex items-center justify-center">
//                         <Package className="w-6 h-6 text-gray-400" />
//                       </div>
//                     )}
                    
//                     <div className="flex-1 min-w-0">
//                       <h3 className="font-medium text-gray-900 text-sm truncate">
//                         {product.name}
//                       </h3>
//                       <div className="flex items-center space-x-2 mt-1">
//                         <span className="text-xs text-gray-500">
//                           {getUnitLabel(product.unit_type)}
//                         </span>
//                         <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-800 rounded">
//                           {product.category?.name || 'Non catégorisé'}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* SKU */}
//                   <div className="mt-2">
//                     <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
//                       {product.sku}
//                     </span>
//                   </div>

//                   {/* Prix et stock */}
//                   <div className="mt-3 grid grid-cols-2 gap-4">
//                     <div>
//                       <div className="text-xs text-gray-500">Prix détail</div>
//                       <div className="font-medium text-sm">
//                         {formatCurrency(product.retail_price, product.currency)}
//                       </div>
//                     </div>
//                     <div>
//                       <div className="text-xs text-gray-500">Stock</div>
//                       <div className="flex items-center space-x-2">
//                         {editingStock === product.id ? (
//                           <div className="flex items-center space-x-1">
//                             <input
//                               type="number"
//                               value={stockValue}
//                               onChange={(e) => setStockValue(e.target.value)}
//                               className="w-16 p-1 border border-gray-300 rounded text-sm"
//                               min="0"
//                             />
//                             <button
//                               onClick={() => saveStock(product.id)}
//                               className="p-1 text-green-600"
//                             >
//                               <Check className="w-4 h-4" />
//                             </button>
//                           </div>
//                         ) : (
//                           <>
//                             <span className={`font-medium text-sm ${
//                               product.stock?.[0]?.quantity <= product.stock?.[0]?.minimum_threshold
//                                 ? 'text-red-600'
//                                 : 'text-gray-900'
//                             }`}>
//                               {product.stock?.[0]?.quantity || 0}
//                             </span>
//                             <button
//                               onClick={() => handleStockEdit(
//                                 product.id, 
//                                 product.stock?.[0]?.quantity || 0
//                               )}
//                               className="text-xs text-gray-600 hover:text-gray-900"
//                             >
//                               Modifier
//                             </button>
//                           </>
//                         )}
//                       </div>
                     
//                     </div>
//                   </div>

                 
//                 </div>

//                 {/* Actions mobile */}
//                 <div className="relative ml-2">
//                   <button
//                     onClick={() => setMobileActionMenu(mobileActionMenu === product.id ? null : product.id)}
//                     className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition"
//                   >
//                     <MoreVertical className="w-5 h-5" />
//                   </button>
                  
//                   {mobileActionMenu === product.id && (
//                     <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
//                       <button
//                         onClick={() => {
//                           setEditingProduct(product);
//                           setMobileActionMenu(null);
//                         }}
//                         className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                       >
//                         <Edit className="w-3 h-3" />
//                         <span>Éditer</span>
//                       </button>
//                       <button
//                         onClick={() => {
//                           onDelete(product.id, product.image_path);
//                           setMobileActionMenu(null);
//                         }}
//                         className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
//                       >
//                         <Trash2 className="w-3 h-3" />
//                         <span>Supprimer</span>
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Message vide */}
//       {products.length === 0 && (
//         <div className="text-center py-12">
//           <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
//           <div className="text-gray-500">Aucun produit trouvé</div>
//           <div className="text-sm text-gray-400 mt-1">
//             Commencez par ajouter un produit
//           </div>
//         </div>
//       )}
      
//       {/* Modal d'édition */}
//       {editingProduct && (
//         <EditProductForm
//           product={editingProduct}
//           onClose={() => setEditingProduct(null)}
//           onUpdate={() => {
//             window.location.reload();
//           }}
//         />
//       )}
//     </div>
//   );
// }
'use client';
import { useState } from 'react';
import { 
  Edit, 
  Trash2, 
  Package, 
  MoreVertical,
  Check,
  X,
  Eye,
  EyeOff,
  Power,
  PowerOff
} from 'lucide-react';
import EditProductForm from '@/components/EditProductForm';

export default function ProductTable({ products, onDelete, onUpdateStock, onToggleActive }) {
  const [editingStock, setEditingStock] = useState(null);
  const [stockValue, setStockValue] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [mobileActionMenu, setMobileActionMenu] = useState(null);
  
  const formatCurrency = (amount, currency) => {
    const symbols = {
      'EUR': '€',
      'USD': '$',
      'CDF': 'FC',
      'GBP': '£'
    };
    return `${parseFloat(amount).toFixed(2)} ${symbols[currency] || currency}`;
  };

  const getUnitLabel = (unitType) => {
    const units = {
      'PIECE': 'Pièce',
      'KG': 'Kilogramme',
      'LITRE': 'Litre',
      'METRE': 'Mètre',
      'BOUTEILLE': 'Bouteille',
      'SACHET': 'Sachet',
      'CARTON': 'Carton'
    };
    return units[unitType] || unitType;
  };

  const handleStockEdit = (productId, currentQuantity) => {
    setEditingStock(productId);
    setStockValue(currentQuantity.toString());
  };

  const saveStock = (productId) => {
    const quantity = parseInt(stockValue);
    if (!isNaN(quantity) && quantity >= 0) {
      onUpdateStock(productId, quantity);
    }
    setEditingStock(null);
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const handleToggleActive = async (productId, currentStatus) => {
    if (onToggleActive) {
      await onToggleActive(productId, !currentStatus);
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
      {/* Vue desktop */}
      <div className="hidden md:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produit
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Catégorie
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prix
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr 
                key={product.id} 
                className={`hover:bg-gray-50 transition ${!product.is_active ? 'bg-gray-50 opacity-75' : ''}`}
              >
                {/* Produit */}
                <td className="px-4 py-3">
                  <div className="flex items-start space-x-3">
                    {product.image_url ? (
                      <div className="h-10 w-10 flex-shrink-0 relative">
                        <img
                          className={`h-10 w-10 rounded object-cover ${!product.is_active ? 'opacity-60' : ''}`}
                          src={product.image_url}
                          alt={product.name}
                        />
                        {!product.is_active && (
                          <div className="absolute inset-0 bg-gray-900 opacity-20 rounded"></div>
                        )}
                      </div>
                    ) : (
                      <div className={`h-10 w-10 flex-shrink-0 rounded flex items-center justify-center ${!product.is_active ? 'bg-gray-200' : 'bg-gray-100'}`}>
                        <Package className={`w-5 h-5 ${!product.is_active ? 'text-gray-400' : 'text-gray-400'}`} />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className={`font-medium text-sm ${!product.is_active ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                        {truncateText(product.name, 30)}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {getUnitLabel(product.unit_type)}
                      </div>
                    </div>
                  </div>
                </td>

                {/* SKU */}
                <td className="px-4 py-3">
                  <div className={`font-mono text-xs px-2 py-1 rounded inline-block ${!product.is_active ? 'bg-gray-200 text-gray-500' : 'bg-gray-100 text-gray-800'}`}>
                    {product.sku}
                  </div>
                </td>

                {/* Catégorie */}
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${!product.is_active ? 'bg-gray-200 text-gray-500' : 'bg-gray-100 text-gray-800'}`}>
                    {product.category?.name || 'Non catégorisé'}
                  </span>
                </td>

                {/* Prix */}
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    <div className="text-xs">
                      <span className={`${!product.is_active ? 'text-gray-400' : 'text-gray-600'}`}>Détail: </span>
                      <span className={`font-medium ${!product.is_active ? 'text-gray-500' : ''}`}>
                        {formatCurrency(product.retail_price, product.currency)}
                      </span>
                    </div>
                    <div className="text-xs">
                      <span className={`${!product.is_active ? 'text-gray-400' : 'text-gray-600'}`}>Gros: </span>
                      <span className={`font-medium ${!product.is_active ? 'text-gray-500' : ''}`}>
                        {formatCurrency(product.wholesale_price, product.currency)}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Stock */}
                <td className="px-4 py-3">
                  {editingStock === product.id ? (
                    <div className="flex items-center space-x-1">
                      <input
                        type="number"
                        value={stockValue}
                        onChange={(e) => setStockValue(e.target.value)}
                        className="w-16 p-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                        min="0"
                        disabled={!product.is_active}
                      />
                      <button
                        onClick={() => saveStock(product.id)}
                        className="p-1 text-green-600 hover:text-green-800 disabled:opacity-50"
                        title="Valider"
                        disabled={!product.is_active}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingStock(null)}
                        className="p-1 text-gray-600 hover:text-gray-800"
                        title="Annuler"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium text-sm ${
                        product.stock?.[0]?.quantity <= product.stock?.[0]?.minimum_threshold
                          ? 'text-red-600'
                          : !product.is_active ? 'text-gray-500' : 'text-gray-900'
                      }`}>
                        {product.stock?.[0]?.quantity || 0}
                      </span>
                      <button
                        onClick={() => handleStockEdit(
                          product.id, 
                          product.stock?.[0]?.quantity || 0
                        )}
                        className={`text-xs ${!product.is_active ? 'text-gray-400 hover:text-gray-500' : 'text-gray-600 hover:text-gray-900'}`}
                        disabled={!product.is_active}
                      >
                        Modifier
                      </button>
                    </div>
                  )}
                  {product.stock?.[0]?.minimum_threshold && (
                    <div className={`text-xs ${!product.is_active ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>
                      Seuil: {product.stock[0].minimum_threshold}
                    </div>
                  )}
                </td>

                {/* Statut */}
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleActive(product.id, product.is_active)}
                    className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition ${
                      product.is_active
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                    title={product.is_active ? 'Désactiver le produit' : 'Activer le produit'}
                  >
                    {product.is_active ? (
                      <>
                        <Eye className="w-3 h-3" />
                        <span>Actif</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3" />
                        <span>Inactif</span>
                      </>
                    )}
                  </button>
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setEditingProduct(product)}
                      className={`p-1.5 rounded transition ${
                        !product.is_active
                          ? 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'
                          : 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-50'
                      }`}
                      title="Éditer"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(product.id, product.image_path)}
                      className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vue mobile */}
      <div className="md:hidden">
        <div className="divide-y divide-gray-200">
          {products.map((product) => (
            <div 
              key={product.id} 
              className={`p-4 transition ${!product.is_active ? 'bg-gray-50 opacity-75' : 'hover:bg-gray-50'}`}
            >
              <div className="flex items-start justify-between">
                {/* Informations produit */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start space-x-3">
                    {product.image_url ? (
                      <div className="h-12 w-12 flex-shrink-0 relative">
                        <img
                          className={`h-12 w-12 rounded object-cover ${!product.is_active ? 'opacity-60' : ''}`}
                          src={product.image_url}
                          alt={product.name}
                        />
                        {!product.is_active && (
                          <div className="absolute inset-0 bg-gray-900 opacity-20 rounded"></div>
                        )}
                      </div>
                    ) : (
                      <div className={`h-12 w-12 flex-shrink-0 rounded flex items-center justify-center ${!product.is_active ? 'bg-gray-200' : 'bg-gray-100'}`}>
                        <Package className={`w-6 h-6 ${!product.is_active ? 'text-gray-400' : 'text-gray-400'}`} />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-medium text-sm truncate ${!product.is_active ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                          {product.name}
                        </h3>
                        <button
                          onClick={() => handleToggleActive(product.id, product.is_active)}
                          className={`ml-2 p-1 rounded ${
                            product.is_active
                              ? 'text-green-600 hover:text-green-700'
                              : 'text-gray-500 hover:text-gray-600'
                          }`}
                          title={product.is_active ? 'Désactiver' : 'Activer'}
                        >
                          {product.is_active ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {getUnitLabel(product.unit_type)}
                        </span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${!product.is_active ? 'bg-gray-200 text-gray-500' : 'bg-gray-100 text-gray-800'}`}>
                          {product.category?.name || 'Non catégorisé'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* SKU */}
                  <div className="mt-2">
                    <span className={`font-mono text-xs px-2 py-1 rounded ${!product.is_active ? 'bg-gray-200 text-gray-500' : 'bg-gray-100 text-gray-800'}`}>
                      {product.sku}
                    </span>
                  </div>

                  {/* Prix et stock */}
                  <div className="mt-3 grid grid-cols-2 gap-4">
                    <div>
                      <div className={`text-xs ${!product.is_active ? 'text-gray-400' : 'text-gray-500'}`}>Prix détail</div>
                      <div className={`font-medium text-sm ${!product.is_active ? 'text-gray-500' : ''}`}>
                        {formatCurrency(product.retail_price, product.currency)}
                      </div>
                    </div>
                    <div>
                      <div className={`text-xs ${!product.is_active ? 'text-gray-400' : 'text-gray-500'}`}>Stock</div>
                      <div className="flex items-center space-x-2">
                        {editingStock === product.id ? (
                          <div className="flex items-center space-x-1">
                            <input
                              type="number"
                              value={stockValue}
                              onChange={(e) => setStockValue(e.target.value)}
                              className="w-16 p-1 border border-gray-300 rounded text-sm"
                              min="0"
                              disabled={!product.is_active}
                            />
                            <button
                              onClick={() => saveStock(product.id)}
                              className="p-1 text-green-600 disabled:opacity-50"
                              disabled={!product.is_active}
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className={`font-medium text-sm ${
                              product.stock?.[0]?.quantity <= product.stock?.[0]?.minimum_threshold
                                ? 'text-red-600'
                                : !product.is_active ? 'text-gray-500' : 'text-gray-900'
                            }`}>
                              {product.stock?.[0]?.quantity || 0}
                            </span>
                            <button
                              onClick={() => handleStockEdit(
                                product.id, 
                                product.stock?.[0]?.quantity || 0
                              )}
                              className={`text-xs ${!product.is_active ? 'text-gray-400 hover:text-gray-500' : 'text-gray-600 hover:text-gray-900'}`}
                              disabled={!product.is_active}
                            >
                              Modifier
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions mobile */}
                <div className="relative ml-2">
                  <button
                    onClick={() => setMobileActionMenu(mobileActionMenu === product.id ? null : product.id)}
                    className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  
                  {mobileActionMenu === product.id && (
                    <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setMobileActionMenu(null);
                        }}
                        className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Éditer</span>
                      </button>
                      <button
                        onClick={() => {
                          handleToggleActive(product.id, product.is_active);
                          setMobileActionMenu(null);
                        }}
                        className="flex items-center space-x-2 w-full px-3 py-2 text-sm hover:bg-gray-50"
                      >
                        {product.is_active ? (
                          <>
                            <EyeOff className="w-3 h-3 text-gray-600" />
                            <span className="text-gray-700">Désactiver</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3 text-gray-600" />
                            <span className="text-gray-700">Activer</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          onDelete(product.id, product.image_path);
                          setMobileActionMenu(null);
                        }}
                        className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Supprimer</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message vide */}
      {products.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <div className="text-gray-500">Aucun produit trouvé</div>
          <div className="text-sm text-gray-400 mt-1">
            Commencez par ajouter un produit
          </div>
        </div>
      )}
      
      {/* Modal d'édition */}
      {editingProduct && (
        <EditProductForm
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onUpdate={() => {
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}