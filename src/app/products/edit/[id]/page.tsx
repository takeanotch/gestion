'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { X, Package, Barcode, Hash, Building, Save } from 'lucide-react';
import { getProductById, updateProduct, Product } from '@/lib/products';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    price: '',
    quantity: '',
    category: '',
    supplier: '',
    barcode: '',
    image: ''
  });

  const categories = [
    'Électronique', 
    'Vêtements', 
    'Alimentation', 
    'Maison', 
    'Sport', 
    'Beauté', 
    'Jardin', 
    'Automobile',
    'Bureau',
    'Autre'
  ];

  const suppliers = [
    'Fournisseur A',
    'Fournisseur B',
    'Fournisseur C',
    'Amazon',
    'Alibaba',
    'Local',
    'Grossiste',
    'Fabricant Direct'
  ];

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const productData = await getProductById(id);
      
      if (!productData) {
        router.push('/products');
        return;
      }
      
      setProduct(productData);
      setFormData({
        sku: productData.sku || '',
        name: productData.name || '',
        price: productData.price?.toString() || '',
        quantity: productData.quantity?.toString() || '',
        category: productData.category || '',
        supplier: productData.supplier || '',
        barcode: productData.barcode || '',
        image: productData.image || ''
      });
    } catch (error) {
      console.error('Erreur lors du chargement du produit:', error);
      alert('❌ Erreur lors du chargement du produit');
      router.push('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting || !product) return;
    
    // Validation des champs requis
    if (!formData.name.trim()) {
      alert('Le nom du produit est requis');
      return;
    }
    
    if (!formData.sku.trim()) {
      alert('La référence (SKU) est requise');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const productData = {
        sku: formData.sku.trim(),
        name: formData.name.trim(),
        price: parseFloat(formData.price) || 0,
        quantity: parseInt(formData.quantity) || 0,
        category: formData.category || undefined,
        supplier: formData.supplier || undefined,
        barcode: formData.barcode || undefined,
        image: formData.image || undefined
      };
      
      const result = await updateProduct(product.id!, productData);
      
      if (result.success) {
        alert('✅ Produit mis à jour avec succès!');
        router.push('/products');
        router.refresh();
      } else {
        alert(`❌ Erreur: ${result.error || 'Échec de la mise à jour'}`);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('❌ Erreur lors de la mise à jour du produit');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
      e.preventDefault();
      handleSubmit(e as React.FormEvent);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-gray-600">Chargement du produit...</p>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Retour"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Modifier le produit</h1>
                <p className="text-sm text-gray-500">SKU: {product.sku}</p>
              </div>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span className='text-sm'>
                {isSubmitting ? 'Mise à jour...' : 'Mettre à jour'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6" onKeyDown={handleKeyDown}>
              {/* Ligne 1: Nom et SKU */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    Référence (SKU) *
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Ex: PROD-001"
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Nom du produit *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Ex: iPhone 15 Pro"
                  />
                </div>
              </div>

              {/* Ligne 2: Prix, Quantité, Catégorie */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Prix (€) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      €
                    </span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      disabled={isSubmitting}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Quantité *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    min="0"
                    disabled={isSubmitting}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Catégorie
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Ligne 3: Code-barres et Fournisseur */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Barcode className="w-3 h-3" />
                    Code-barres
                  </label>
                  <input
                    type="text"
                    name="barcode"
                    value={formData.barcode}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Ex: 123456789012"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Building className="w-3 h-3" />
                    Fournisseur
                  </label>
                  <select
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Sélectionner un fournisseur</option>
                    {suppliers.map(supp => (
                      <option key={supp} value={supp}>{supp}</option>
                    ))}
                    <option value="autre">Autre...</option>
                  </select>
                </div>
              </div>

              {/* Image */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Image du produit
                </label>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isSubmitting}
                    />
                    <label
                      htmlFor="image-upload"
                      className={`flex flex-col items-center justify-center px-4 py-6 border-2 border-dashed border-gray-300 rounded-md transition-all text-center ${
                        isSubmitting 
                          ? 'cursor-not-allowed opacity-50' 
                          : 'cursor-pointer hover:border-blue-500 hover:bg-blue-50'
                      }`}
                    >
                      <div className="text-gray-400 mb-2">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-700">
                        {formData.image ? 'Changer l\'image' : 'Ajouter une image'}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        PNG, JPG, JPEG (max 5MB)
                      </span>
                    </label>
                  </div>

                  {formData.image && (
                    <div className="relative w-24 h-24">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-contain rounded-md border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                        disabled={isSubmitting}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </form>
            
            <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
              <button
                onClick={() => router.back()}
                disabled={isSubmitting}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Annuler
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Mise à jour...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Mettre à jour
                  </>
                )}
              </button>
            </div>
            
            <div className="mt-4 text-xs text-gray-500 text-center">
              Appuyez sur <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded">Enter</kbd> pour valider
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}