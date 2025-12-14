'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, Printer, Download, Copy, 
  ShoppingCart, User, CreditCard, 
  Calendar, Package, Hash, Tag,
  AlertCircle, ArrowDownRight,
  CheckCircle, XCircle, RefreshCw
} from 'lucide-react';
import { Sale, getSaleById } from '@/lib/sales';

interface SaleDetailsModalProps {
  sale: Sale;
  onClose: () => void;
  onReturn: () => void;
}

const SaleDetailsModal: React.FC<SaleDetailsModalProps> = ({ sale: initialSale, onClose, onReturn }) => {
  const [sale, setSale] = useState<Sale>(initialSale);
  const [loading, setLoading] = useState(false);

  const loadSaleDetails = async () => {
    setLoading(true);
    try {
      if (sale.id) {
        const details = await getSaleById(sale.id);
        if (details) {
          setSale(details);
        }
      }
    } catch (error) {
      console.error('Erreur chargement détails:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSaleDetails();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusInfo = (status?: string) => {
    switch (status) {
      case 'completed':
        return { 
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle,
          label: 'Complété' 
        };
      case 'cancelled':
        return { 
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: XCircle,
          label: 'Annulé' 
        };
      case 'refunded':
        return { 
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: ArrowDownRight,
          label: 'Remboursé' 
        };
      default:
        return { 
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: AlertCircle,
          label: status || 'Inconnu'
        };
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

  const handleCopyToClipboard = () => {
    const text = `Vente ${sale.sale_number}\nClient: ${sale.customer_name || 'Non spécifié'}\nMontant: ${formatCurrency(sale.total_amount)}`;
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Informations copiées dans le presse-papier');
      })
      .catch(console.error);
  };

  const StatusIcon = getStatusInfo(sale.status).icon;
  const statusInfo = getStatusInfo(sale.status);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement des détails...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
            <ShoppingCart className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Vente {sale.sale_number}
            </h2>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusInfo.color}`}>
                <StatusIcon className="w-3 h-3 inline mr-1" />
                {statusInfo.label}
              </span>
              {sale.promotion_code && (
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full border border-purple-200">
                  <Tag className="w-3 h-3 inline mr-1" />
                  Promotion
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyToClipboard}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Copier les informations"
          >
            <Copy className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne gauche - Informations générales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations client et paiement */}
          <div className="bg-white rounded-xl border p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <User className="w-5 h-5 mr-2 text-gray-500" />
                  Client
                </h3>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm text-gray-500">Nom</div>
                    <div className="font-medium">{sale.customer_name || 'Non spécifié'}</div>
                  </div>
                  {sale.customer_phone && (
                    <div>
                      <div className="text-sm text-gray-500">Téléphone</div>
                      <div className="font-medium">{sale.customer_phone}</div>
                    </div>
                  )}
                  {sale.customer_email && (
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="font-medium">{sale.customer_email}</div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-gray-500" />
                  Paiement
                </h3>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm text-gray-500">Mode de paiement</div>
                    <div className="font-medium">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        sale.payment_method === 'cash' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : sale.payment_method === 'card'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {getPaymentMethodLabel(sale.payment_method)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Date</div>
                    <div className="font-medium">
                      <Calendar className="w-4 h-4 inline mr-1 text-gray-400" />
                      {formatDate(sale.sale_date)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {sale.notes && (
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm text-gray-500">Notes</div>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg text-gray-700">
                  {sale.notes}
                </div>
              </div>
            )}
          </div>

          {/* Articles vendus */}
          <div className="bg-white rounded-xl border overflow-hidden">
            <div className="px-5 py-4 border-b bg-gray-50">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Package className="w-5 h-5 mr-2 text-gray-500" />
                Articles vendus ({sale.items?.length || 0})
              </h3>
            </div>
            
            <div className="overflow-x-auto">
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sale.items && sale.items.length > 0 ? (
                    sale.items.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-5 py-4">
                          <div className="font-medium text-gray-900">{item.product_name}</div>
                          <div className="text-xs text-gray-500">
                            {item.sku && <div>Réf: {item.sku}</div>}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          {formatCurrency(item.unit_price)}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center space-x-2">
                            <span>{item.quantity}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-medium text-gray-900">
                          {formatCurrency(item.subtotal)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-gray-500">
                        <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>Aucun détail darticle disponible</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Colonne droite - Récapitulatif */}
        <div className="space-y-6">
          {/* Récapitulatif financier */}
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Récapitulatif financier</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span>{formatCurrency(sale.subtotal_amount || sale.total_amount)}</span>
              </div>
              
              {sale.discount_amount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Remise</span>
                  <span>-{formatCurrency(sale.discount_amount)}</span>
                </div>
              )}
              
              {sale.promotion_code && (
                <div className="flex justify-between text-purple-600">
                  <span>Code promotion</span>
                  <span className="font-medium">{sale.promotion_code}</span>
                </div>
              )}
              
              <div className="flex justify-between text-gray-600">
                <span>TVA</span>
                <span>{formatCurrency(sale.tax_amount || 0)}</span>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(sale.total_amount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Informations techniques */}
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Informations techniques</h3>
            
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500">Numéro de vente</div>
                <div className="font-mono font-medium">{sale.sale_number}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500">ID interne</div>
                <div className="font-mono">#{sale.id}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500">Créée le</div>
                <div className="font-medium">
                  {new Date(sale.created_at || sale.sale_date).toLocaleString('fr-FR')}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
            
            <div className="space-y-3">
              {sale.status === 'completed' && (
                <button
                  onClick={onReturn}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 flex items-center justify-center space-x-2 transition-colors"
                >
                  <ArrowDownRight className="w-4 h-4" />
                  <span>Créer un retour</span>
                </button>
              )}
              
              <button
                onClick={loadSaleDetails}
                className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Actualiser</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pied de page */}
      <div className="mt-6 pt-6 border-t flex justify-end">
        <button
          onClick={onClose}
          className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

export default SaleDetailsModal;