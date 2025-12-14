'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, Plus, Trash2, ArrowDownRight, Package, 
  AlertCircle, CheckCircle, User, CreditCard,
  Calendar, Hash, RefreshCw, ShoppingCart
} from 'lucide-react';
import { Sale, SaleItem } from '@/lib/sales';
import { getSaleById } from '@/lib/sales';

interface ReturnItem {
  sale_item_id: string;
  product_id: string;
  product_name: string;
  unit_price: number;
  max_quantity: number;
  quantity: number;
  reason: string;
}

interface ReturnData {
  sale_id: string;
  items: {
    sale_item_id: string;
    quantity: number;
    reason: string;
  }[];
  reason?: string;
  processed_by?: string;
}

interface ReturnFormProps {
  sale: Sale;
  onSubmit: (returnData: ReturnData) => Promise<void>;
  onClose: () => void;
}

interface SaleItemWithReturns extends SaleItem {
  returned_quantity?: number;
  max_returnable: number;
}

const ReturnForm: React.FC<ReturnFormProps> = ({ sale, onSubmit, onClose }) => {
  const [returnItems, setReturnItems] = useState<SaleItemWithReturns[]>([]);
  const [selectedReturnItems, setSelectedReturnItems] = useState<ReturnItem[]>([]);
  const [reason, setReason] = useState('');
  const [processedBy, setProcessedBy] = useState('');
  const [loading, setLoading] = useState(false);
  const [saleDetails, setSaleDetails] = useState<Sale | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(true);

  useEffect(() => {
    loadSaleDetails();
  }, []);

  const loadSaleDetails = async () => {
    setLoadingDetails(true);
    try {
      if (sale.id) {
        const details = await getSaleById(sale.id);
        if (details) {
          setSaleDetails(details);
          
          // Initialiser les items disponibles pour retour
          if (details.items) {
            const availableItems: SaleItemWithReturns[] = details.items.map(item => ({
              ...item,
              max_returnable: item.quantity - (item.returned_quantity || 0),
              returned_quantity: item.returned_quantity || 0
            })).filter(item => item.max_returnable > 0);
            
            setReturnItems(availableItems);
          }
        }
      }
    } catch (error) {
      console.error('Erreur chargement détails vente:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSelectItem = (saleItemId: string) => {
    const item = returnItems.find(item => item.id === saleItemId);
    if (!item) return;

    const existingIndex = selectedReturnItems.findIndex(i => i.sale_item_id === saleItemId);
    
    if (existingIndex >= 0) {
      // Retirer de la sélection
      const updated = [...selectedReturnItems];
      updated.splice(existingIndex, 1);
      setSelectedReturnItems(updated);
    } else {
      // Ajouter à la sélection
      setSelectedReturnItems([
        ...selectedReturnItems,
        {
          sale_item_id: item.id!,
          product_id: item.product_id,
          product_name: item.product_name,
          unit_price: item.unit_price,
          max_quantity: item.max_returnable,
          quantity: 1,
          reason: ''
        }
      ]);
    }
  };

  const updateReturnQuantity = (saleItemId: string, quantity: number) => {
    const updatedItems = [...selectedReturnItems];
    const itemIndex = updatedItems.findIndex(item => item.sale_item_id === saleItemId);
    
    if (itemIndex >= 0) {
      // Limiter la quantité au maximum retournable
      const maxQuantity = updatedItems[itemIndex].max_quantity;
      const newQuantity = Math.max(1, Math.min(quantity, maxQuantity));
      
      updatedItems[itemIndex].quantity = newQuantity;
      setSelectedReturnItems(updatedItems);
    }
  };

  const updateReturnReason = (saleItemId: string, reason: string) => {
    const updatedItems = [...selectedReturnItems];
    const itemIndex = updatedItems.findIndex(item => item.sale_item_id === saleItemId);
    
    if (itemIndex >= 0) {
      updatedItems[itemIndex].reason = reason;
      setSelectedReturnItems(updatedItems);
    }
  };

  const calculateTotalReturn = () => {
    return selectedReturnItems.reduce((total, item) => {
      return total + (item.quantity * item.unit_price);
    }, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedReturnItems.length === 0) {
      alert('Veuillez sélectionner au moins un article à retourner');
      return;
    }

    // Vérifier les quantités
    for (const item of selectedReturnItems) {
      if (item.quantity <= 0) {
        alert(`Quantité invalide pour ${item.product_name}`);
        return;
      }
      
      if (item.quantity > item.max_quantity) {
        alert(`Quantité trop élevée pour ${item.product_name}. Maximum: ${item.max_quantity}`);
        return;
      }
    }

    const returnData: ReturnData = {
      sale_id: sale.id!,
      items: selectedReturnItems.map(item => ({
        sale_item_id: item.sale_item_id,
        quantity: item.quantity,
        reason: item.reason
      })),
      reason: reason || undefined,
      processed_by: processedBy || undefined
    };

    setLoading(true);
    try {
      await onSubmit(returnData);
    } catch (error) {
      console.error('Erreur création retour:', error);
      alert('Erreur lors de la création du retour: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      cash: 'Espèces',
      card: 'Carte bancaire',
      check: 'Chèque',
      transfer: 'Virement',
      mobile: 'Paiement mobile'
    };
    return labels[method] || method;
  };

  if (loadingDetails) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement des détails de la vente...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl">
            <ArrowDownRight className="w-7 h-7 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Retour marchandise</h2>
            <p className="text-sm text-gray-500">
              Pour la vente <span className="font-semibold">{sale.sale_number}</span>
            </p>
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
        {/* Informations vente */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2 text-blue-600" />
            Informations sur la vente originale
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-lg border">
              <div className="text-sm text-gray-500">Client</div>
              <div className="font-medium">{sale.customer_name || 'Non spécifié'}</div>
              {sale.customer_phone && (
                <div className="text-sm text-gray-600">{sale.customer_phone}</div>
              )}
            </div>
            
            <div className="bg-white p-3 rounded-lg border">
              <div className="text-sm text-gray-500">Paiement</div>
              <div className="font-medium">{getPaymentMethodLabel(sale.payment_method)}</div>
              <div className="text-sm text-gray-600">
                {new Date(sale.sale_date).toLocaleDateString('fr-FR')}
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-lg border">
              <div className="text-sm text-gray-500">Total vente</div>
              <div className="font-bold text-green-600">{formatCurrency(sale.total_amount)}</div>
            </div>
            
            <div className="bg-white p-3 rounded-lg border">
              <div className="text-sm text-gray-500">Date</div>
              <div className="font-medium">
                {new Date(sale.sale_date).toLocaleString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Sélection des articles à retourner */}
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Package className="w-5 h-5 mr-2 text-gray-500" />
              Articles disponibles pour retour
            </h3>
            <div className="text-sm text-gray-500">
              {selectedReturnItems.length} article{selectedReturnItems.length !== 1 ? 's' : ''} sélectionné{selectedReturnItems.length !== 1 ? 's' : ''}
            </div>
          </div>
          
          {returnItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-300" />
              <p>Tous les articles de cette vente ont déjà été retournés</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sélection
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produit
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acheté
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Déjà retourné
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Disponible
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix unitaire
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {returnItems.map((item) => {
                    const isSelected = selectedReturnItems.some(i => i.sale_item_id === item.id);
                    const selectedItem = selectedReturnItems.find(i => i.sale_item_id === item.id);
                    
                    return (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectItem(item.id!)}
                            className="h-4 w-4 text-purple-600 rounded focus:ring-purple-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{item.product_name}</div>
                          {item.sku && (
                            <div className="text-xs text-gray-500">Réf: {item.sku}</div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium">{item.quantity}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-gray-500">{item.returned_quantity || 0}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className={`font-semibold ${item.max_returnable > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {item.max_returnable}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {formatCurrency(item.unit_price)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Détails des retours sélectionnés */}
        {selectedReturnItems.length > 0 && (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl border border-purple-200">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <ArrowDownRight className="w-5 h-5 mr-2 text-purple-600" />
              Détails du retour
            </h3>
            
            <div className="space-y-4">
              {selectedReturnItems.map((item, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-purple-100">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-medium text-gray-900">{item.product_name}</div>
                      <div className="text-sm text-gray-500">
                        Prix unitaire: {formatCurrency(item.unit_price)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectItem(item.sale_item_id)}
                      className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantité à retourner (max: {item.max_quantity})
                      </label>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => updateReturnQuantity(item.sale_item_id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          max={item.max_quantity}
                          value={item.quantity}
                          onChange={(e) => updateReturnQuantity(item.sale_item_id, parseInt(e.target.value) || 1)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                        />
                        <button
                          type="button"
                          onClick={() => updateReturnQuantity(item.sale_item_id, item.quantity + 1)}
                          disabled={item.quantity >= item.max_quantity}
                          className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Raison du retour (optionnel)
                      </label>
                      <input
                        type="text"
                        value={item.reason}
                        onChange={(e) => updateReturnReason(item.sale_item_id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Ex: Défaut, Taille incorrecte..."
                      />
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t text-right">
                    <span className="text-sm text-gray-500">Sous-total retour: </span>
                    <span className="font-bold text-purple-600">
                      {formatCurrency(item.quantity * item.unit_price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Informations du retour */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-xl border">
            <h3 className="font-semibold text-gray-900 mb-4">Informations du retour</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Raison générale du retour (optionnel)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Décrivez la raison générale du retour..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Traité par (optionnel)
                </label>
                <input
                  type="text"
                  value={processedBy}
                  onChange={(e) => setProcessedBy(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Nom de l'employé"
                />
              </div>
            </div>
          </div>

          {/* Récapitulatif */}
          <div className="bg-white p-5 rounded-xl border">
            <h3 className="font-semibold text-gray-900 mb-4">Récapitulatif</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total des articles retournés</span>
                <span className="font-medium">{selectedReturnItems.length}</span>
              </div>
              
              <div className="border-t pt-4">
                <div className="space-y-2">
                  {selectedReturnItems.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-500">{item.product_name} x{item.quantity}</span>
                      <span>{formatCurrency(item.quantity * item.unit_price)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Montant total du retour</span>
                    <span className="text-2xl font-bold text-purple-600">
                      {formatCurrency(calculateTotalReturn())}
                    </span>
                  </div>
                  
                  <div className="mt-3 text-sm text-gray-500">
                    <AlertCircle className="w-4 h-4 inline mr-1" />
                    Ce montant sera remboursé au client
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500">Vente originale</div>
              <div className="font-medium">{sale.sale_number}</div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                disabled={loading}
              >
                Annuler
              </button>
              
              <button
                type="submit"
                disabled={loading || selectedReturnItems.length === 0}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-medium shadow-md hover:shadow-lg transition-all"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Traitement...</span>
                  </>
                ) : (
                  <>
                    <ArrowDownRight className="w-5 h-5" />
                    <span>Enregistrer le retour</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReturnForm;