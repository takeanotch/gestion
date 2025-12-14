import React from 'react';
import Link from 'next/link';
import { Package, Edit, Trash2, Hash, Barcode, Building } from 'lucide-react';
import { Product } from '@/lib/products';

interface ProductListProps {
  products: Product[];
  onDelete: (id: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onDelete }) => {
  const getCategoryColor = (category?: string) => {
    const colors: Record<string, string> = {
      'Électronique': 'bg-blue-100 text-blue-800',
      'Vêtements': 'bg-purple-100 text-purple-800',
      'Alimentation': 'bg-green-100 text-green-800',
      'Maison': 'bg-amber-100 text-amber-800',
      'Sport': 'bg-red-100 text-red-800',
      'Beauté': 'bg-pink-100 text-pink-800',
      'Jardin': 'bg-emerald-100 text-emerald-800',
      'Automobile': 'bg-cyan-100 text-cyan-800',
      'Bureau': 'bg-indigo-100 text-indigo-800',
      'Autre': 'bg-slate-100 text-slate-800'
    };
    return colors[category || ''] || 'bg-slate-100 text-slate-800';
  };

  const getStockStatus = (quantity: number = 0) => {
    if (quantity <= 0) return { text: 'Rupture', bg: 'bg-red-100', textColor: 'text-red-800' };
    if (quantity < 5) return { text: 'Très bas', bg: 'bg-red-50', textColor: 'text-red-600' };
    if (quantity < 10) return { text: 'Bas', bg: 'bg-amber-100', textColor: 'text-amber-800' };
    return { text: 'Disponible', bg: 'bg-green-100', textColor: 'text-green-800' };
  };

  return (
    <div className="overflow  rounded-lg border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Produit
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Prix
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Fournisseur
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Référence
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Catégorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map(product => {
              const stockStatus = getStockStatus(product.quantity);
              
              return (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-10 w-10 object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        {product.barcode && (
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <Barcode className="w-3 h-3 mr-1" />
                            {product.barcode}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}€
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`text-sm font-medium ${product.quantity <= 0 ? 'text-red-600' : product.quantity < 10 ? 'text-amber-600' : 'text-gray-900'}`}>
                        {product.quantity || 0}
                      </div>
                      <div className="ml-2">
                        <span className={`inline-flex px-2 py-0.5 text-xs rounded-full font-medium ${stockStatus.bg} ${stockStatus.textColor}`}>
                          {stockStatus.text}
                        </span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.supplier ? (
                      <div className="flex items-center text-sm text-gray-700">
                        <Building className="w-3 h-3 mr-1 text-gray-400" />
                        <span>{product.supplier}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-700">
                      <Hash className="w-3 h-3 mr-1 text-gray-400" />
                      {product.sku}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.category ? (
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}>
                        {product.category}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/products/edit/${product.id}`}
                        className="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-md transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Modifier
                      </Link>
                      <button
                        onClick={() => product.id && onDelete(product.id)}
                        className="inline-flex items-center px-3 py-1.5 text-sm text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {products.length === 0 && (
          <div className="py-8 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucun produit trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;