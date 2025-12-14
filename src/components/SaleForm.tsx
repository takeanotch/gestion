import React, { useState, useEffect } from 'react';
import { 
  X, Search, Plus, Trash2, Percent, 
  ShoppingCart, User, CreditCard, Calculator,
  Package, Hash, Building, Tag
} from 'lucide-react';
import { Sale, SaleItem, generateSaleNumber } from '@/lib/sales';
import { Product, getAllProducts } from '@/lib/products';

interface SaleFormProps {
  onSubmit: (sale: Sale) => void;
  onClose: () => void;
}

const SaleForm: React.FC<SaleFormProps> = ({ onSubmit, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'check' | 'transfer' | 'mobile'>('cash');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [taxPercent, setTaxPercent] = useState(20); // 20% TVA par défaut
  const [notes, setNotes] = useState('');
  const [promotionCode, setPromotionCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [showProductList, setShowProductList] = useState(false);

  // Calculer les totaux
  const subtotal = saleItems.reduce((sum, item) => sum + item.subtotal, 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * (taxPercent / 100);
  const total = taxableAmount + taxAmount;

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false
      );
      setFilteredProducts(filtered.slice(0, 10));
    } else {
      setFilteredProducts([]);
    }
  }, [searchTerm, products]);

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const productsData = await getAllProducts();
      setProducts(productsData);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const addProductToSale = (product: Product) => {
    const existingItemIndex = saleItems.findIndex(item => item.product_id === product.id);
    
    if (existingItemIndex >= 0) {
      // Incrémenter la quantité
      const updatedItems = [...saleItems];
      const item = updatedItems[existingItemIndex];
      const newQuantity = item.quantity + 1;
      const newSubtotal = newQuantity * item.unit_price;
      
      updatedItems[existingItemIndex] = {
        ...item,
        quantity: newQuantity,
        subtotal: newSubtotal,
        total: newSubtotal
      };
      setSaleItems(updatedItems);
    } else {
      // Ajouter un nouvel item
      const newItem: SaleItem = {
        product_id: product.id!,
        sku: product.sku,
        product_name: product.name,
        quantity: 1,
        unit_price: product.price,
        subtotal: product.price,
        total: product.price
      };
      setSaleItems([...saleItems, newItem]);
    }
    
    setSearchTerm('');
    setShowProductList(false);
  };

  const removeSaleItem = (index: number) => {
    const updatedItems = [...saleItems];
    updatedItems.splice(index, 1);
    setSaleItems(updatedItems);
  };

  const updateSaleItemQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return;
    
    const updatedItems = [...saleItems];
    const item = updatedItems[index];
    const product = products.find(p => p.id === item.product_id);
    
    if (product && quantity > product.quantity) {
      alert(`Stock insuffisant. Quantité disponible: ${product.quantity}`);
      return;
    }
    
    const newSubtotal = quantity * item.unit_price;
    
    updatedItems[index] = {
      ...item,
      quantity,
      subtotal: newSubtotal,
      total: newSubtotal
    };
    
    setSaleItems(updatedItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (saleItems.length === 0) {
      alert('Veuillez ajouter au moins un article à la vente');
      return;
    }

    setIsSubmitting(true);

    const sale: Sale = {
      sale_number: generateSaleNumber(),
      sale_date: new Date().toISOString(),
      total_amount: total,
      subtotal_amount: subtotal,
      discount_amount: discountAmount,
      tax_amount: taxAmount,
      payment_method: paymentMethod,
      customer_name: customerName || undefined,
      customer_phone: customerPhone || undefined,
      customer_email: customerEmail || undefined,
      notes: notes || undefined,
      promotion_code: promotionCode || undefined,
      status: 'completed',
      items: saleItems
    };

    try {
      await onSubmit(sale);
    } catch (error) {
      console.error('Erreur création vente:', error);
      alert('Erreur lors de la création de la vente');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
            <ShoppingCart className="w-7 h-7 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Nouvelle vente</h2>
            <p className="text-sm text-gray-500">Enregistrez une nouvelle vente</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Recherche et ajout de produits */}
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Package className="w-5 h-5 mr-2 text-gray-500" />
              Ajouter des produits
            </h3>
            <div className="text-sm text-gray-500">
              {saleItems.length} article{saleItems.length !== 1 ? 's' : ''} dans le panier
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un produit par nom, SKU ou code-barres..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowProductList(true);
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Liste des produits suggérés */}
          {showProductList && filteredProducts.length > 0 && (
            <div className="mt-2 border rounded-lg bg-white shadow-lg max-h-60 overflow-auto">
              {filteredProducts.map(product => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => addProductToSale(product)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b last:border-b-0 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500 flex items-center space-x-2">
                      <span className="flex items-center">
                        <Hash className="w-3 h-3 mr-1" />
                        {product.sku}
                      </span>
                      <span className="flex items-center">
                        <Building className="w-3 h-3 mr-1" />
                        {product.supplier || 'Non spécifié'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(product.price)}</div>
                    <div className={`text-xs ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      Stock: {product.quantity}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Liste des articles ajoutés */}
        {saleItems.length > 0 && (
          <div className="bg-white rounded-xl border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produit
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix unitaire
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantité
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sous-total
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {saleItems.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-900">{item.product_name}</div>
                      <div className="text-xs text-gray-500">SKU: {item.sku}</div>
                    </td>
                    <td className="px-5 py-4">
                      {formatCurrency(item.unit_price)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => updateSaleItemQuantity(index, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateSaleItemQuantity(index, parseInt(e.target.value) || 1)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                        />
                        <button
                          type="button"
                          onClick={() => updateSaleItemQuantity(index, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {formatCurrency(item.subtotal)}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => removeSaleItem(index)}
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Informations client et paiement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informations client */}
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-gray-500" />
              Informations client
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du client (optionnel)
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Jean Dupont"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone (optionnel)
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: 0612345678"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (optionnel)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: client@email.com"
                />
              </div>
            </div>
          </div>

          {/* Informations paiement et récapitulatif */}
          <div className="space-y-6">
            {/* Mode de paiement */}
            <div className="bg-white rounded-xl border p-5">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-gray-500" />
                Paiement
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {(['cash', 'card', 'check', 'transfer', 'mobile'] as const).map(method => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`p-3 border rounded-lg transition-colors flex flex-col items-center justify-center ${
                      paymentMethod === method
                        ? 'bg-green-50 border-green-500 text-green-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mb-1" />
                    <span className="text-xs">
                      {method === 'cash' ? 'Espèces' :
                       method === 'card' ? 'Carte' :
                       method === 'check' ? 'Chèque' :
                       method === 'transfer' ? 'Virement' : 'Mobile'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="bg-white rounded-xl border p-5">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-gray-500" />
                Options
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Percent className="w-4 h-4 inline mr-1" />
                    Remise (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Tag className="w-4 h-4 inline mr-1" />
                    Code promotion
                  </label>
                  <input
                    type="text"
                    value={promotionCode}
                    onChange={(e) => setPromotionCode(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Ex: SUMMER20"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl border p-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (optionnel)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ajoutez des notes ou des commentaires..."
          />
        </div>

        {/* Récapitulatif et actions */}
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Récapitulatif financier */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Récapitulatif</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                
                {discountPercent > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Remise ({discountPercent}%)</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-gray-600">
                  <span>TVA ({taxPercent}%)</span>
                  <span>{formatCurrency(taxAmount)}</span>
                </div>
                
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col justify-end space-y-3">
              <div className="text-sm text-gray-500 text-center">
                {saleItems.length} article{saleItems.length !== 1 ? 's' : ''} • {formatCurrency(total)}
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  disabled={isSubmitting}
                >
                  Annuler
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting || saleItems.length === 0}
                  className="flex-1 px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium shadow-md hover:shadow-lg transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Traitement...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      <span>Enregistrer la vente</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SaleForm;