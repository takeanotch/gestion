//  'use client';

// import { useState, useEffect } from 'react';
// import { supabase } from '@/lib/supabase';
// import Link from 'next/link';
// import { useSearchParams } from 'next/navigation';
// import { ArrowLeft } from 'lucide-react';

// export default function VentesDetailsPage() {
//   const [ventes, setVentes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [userName, setUserName] = useState('');
//   const searchParams = useSearchParams();

//   // Fonction pour convertir la période en dates
//   const getDateRangeFromPeriod = (period) => {
//     const now = new Date();
//     let startDate = null;
//     let endDate = null;
    
//     switch (period) {
//       case 'today':
//         startDate = new Date(now.setHours(0, 0, 0, 0));
//         endDate = new Date(now.setHours(23, 59, 59, 999));
//         break;
//       case 'yesterday':
//         const yesterday = new Date(now);
//         yesterday.setDate(yesterday.getDate() - 1);
//         yesterday.setHours(0, 0, 0, 0);
//         startDate = new Date(yesterday);
//         endDate = new Date(yesterday);
//         endDate.setHours(23, 59, 59, 999);
//         break;
//       case 'week':
//         startDate = new Date(now.setDate(now.getDate() - 7));
//         startDate.setHours(0, 0, 0, 0);
//         endDate = new Date();
//         endDate.setHours(23, 59, 59, 999);
//         break;
//       case 'month':
//         startDate = new Date(now.setMonth(now.getMonth() - 1));
//         startDate.setHours(0, 0, 0, 0);
//         endDate = new Date();
//         endDate.setHours(23, 59, 59, 999);
//         break;
//       default:
//         startDate = null;
//         endDate = null;
//     }
    
//     return { startDate, endDate };
//   };

//   const fetchVentes = async () => {
//     try {
//       setLoading(true);
      
//       const userId = searchParams.get('userId');
//       const dateRange = searchParams.get('dateRange');
//       const startDateParam = searchParams.get('startDate');
//       const endDateParam = searchParams.get('endDate');

//       let query = supabase
//         .from('sale')
//         .select(`
//           *,
//           client:client_id(*),
//           user:user_id(*)
//         `)
//         .eq('status', 'completed')
//         .order('created_at', { ascending: false });

//       // Filtre par utilisateur
//       if (userId) {
//         query = query.eq('user_id', userId);
        
//         // Récupérer le nom de l'utilisateur
//         const { data: userData } = await supabase
//           .from('users')
//           .select('full_name')
//           .eq('id', userId)
//           .single();
        
//         if (userData) {
//           setUserName(userData.full_name);
//         }
//       }

//       // Filtre par période
//       if (dateRange !== 'all') {
//         const { startDate, endDate } = getDateRangeFromPeriod(dateRange);
//         if (startDate && endDate) {
//           query = query
//             .gte('created_at', startDate.toISOString())
//             .lte('created_at', endDate.toISOString());
//         }
//       } else if (startDateParam && endDateParam) {
//         // Dates personnalisées
//         const startDate = new Date(startDateParam);
//         startDate.setHours(0, 0, 0, 0);
//         const endDate = new Date(endDateParam);
//         endDate.setHours(23, 59, 59, 999);
//         query = query
//           .gte('created_at', startDate.toISOString())
//           .lte('created_at', endDate.toISOString());
//       }

//       const { data, error } = await query;
//       if (error) throw error;

//       setVentes(data || []);
//     } catch (error) {
//       console.error('Erreur:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchVentes();
//   }, [searchParams]);

//   const formatCurrency = (amount, currency = 'CDF') => {
//     if (currency === 'USD') {
//       return new Intl.NumberFormat('en-US', {
//         style: 'currency',
//         currency: 'USD',
//         minimumFractionDigits: 0,
//         maximumFractionDigits: 0
//       }).format(amount);
//     }
//     return new Intl.NumberFormat('fr-FR', {
//       style: 'currency',
//       currency: 'CDF',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0
//     }).format(amount).replace('CDF', 'FC');
//   };

//   const formatDate = (date) => {
//     return new Date(date).toLocaleDateString('fr-FR', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'paid': return 'bg-green-100 text-green-800';
//       case 'pending': return 'bg-yellow-100 text-yellow-800';
//       case 'partially_paid': return 'bg-blue-100 text-blue-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getPaymentMethodText = (method) => {
//     switch (method) {
//       case 'cash': return 'Cash';
//       case 'card': return 'Carte';
//       case 'mobile': return 'Mobile';
//       default: return method;
//     }
//   };

//   // Calcul des totaux
//   const totalCDF = ventes
//     .filter(v => v.currency === 'CDF')
//     .reduce((sum, v) => sum + (v.total || 0), 0);
  
//   const totalUSD = ventes
//     .filter(v => v.currency === 'USD')
//     .reduce((sum, v) => sum + (v.total || 0), 0);

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-xl font-semibold text-gray-900">
//             Ventes {userName ? `- ${userName}` : ''}
//           </h1>
//           <p className="text-sm text-gray-500 mt-1">
//             {loading ? 'Chargement...' : `${ventes.length} vente(s)`}
//           </p>
//         </div>
//         <Link
//           href="/super-admin/dashboard/users-analytics"
//           className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           <span>Retour</span>
//         </Link>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
//         <div className="bg-white p-4 rounded-lg border border-gray-200">
//           <p className="text-sm text-gray-500">Total CDF</p>
//           <p className="text-lg font-semibold text-blue-600 mt-1">
//             {formatCurrency(totalCDF, 'CDF')}
//           </p>
//         </div>
//         <div className="bg-white p-4 rounded-lg border border-gray-200">
//           <p className="text-sm text-gray-500">Total USD</p>
//           <p className="text-lg font-semibold text-green-600 mt-1">
//             {formatCurrency(totalUSD, 'USD')}
//           </p>
//         </div>
//       </div>

//       {/* Liste des ventes */}
//       {loading ? (
//         <div className="flex justify-center py-12">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//         </div>
//       ) : ventes.length === 0 ? (
//         <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
//           <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//           </svg>
//           <p className="mt-2 text-sm text-gray-500">Aucune vente trouvée</p>
//         </div>
//       ) : (
//         <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N°</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Méthode</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {ventes.map((vente) => (
//                   <tr key={vente.id} className="hover:bg-gray-50">
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       <div className="text-sm font-medium text-gray-900">{vente.sale_number}</div>
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">{formatDate(vente.created_at)}</div>
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">
//                         {vente.client?.name || 'N/A'}
//                       </div>
//                       {vente.client?.phone && (
//                         <div className="text-xs text-gray-500">{vente.client.phone}</div>
//                       )}
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       <div className="text-sm font-medium text-gray-900">
//                         {formatCurrency(vente.total, vente.currency)}
//                       </div>
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(vente.payment_status)}`}>
//                         {vente.payment_status}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">
//                         {getPaymentMethodText(vente.payment_method)}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function VentesDetailsPage() {
  const [ventes, setVentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();

  // Fonction pour convertir la période en dates
  const getDateRangeFromPeriod = (period) => {
    const now = new Date();
    let startDate = null;
    let endDate = null;
    
    switch (period) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        endDate = new Date(now.setHours(23, 59, 59, 999));
        break;
      case 'yesterday':
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        startDate = new Date(yesterday);
        endDate = new Date(yesterday);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date();
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date();
        endDate.setHours(23, 59, 59, 999);
        break;
      default:
        startDate = null;
        endDate = null;
    }
    
    return { startDate, endDate };
  };

  const fetchVentes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userId = searchParams.get('userId');
      const dateRange = searchParams.get('dateRange');
      const startDateParam = searchParams.get('startDate');
      const endDateParam = searchParams.get('endDate');

      // Construire la requête de base - CORRIGÉ: pas de jointure automatique
      let query = supabase
        .from('sale')
        .select('*')
        .eq('status', 'completed')
        .order('created_at', { ascending: false });

      // Filtre par utilisateur
      if (userId && userId !== 'null') {
        query = query.eq('user_id', userId);
        
        // Récupérer le nom de l'utilisateur depuis la table users
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('full_name')
          .eq('id', userId)
          .single();
        
        if (userError) {
          console.warn('Erreur récupération utilisateur:', userError);
        } else if (userData) {
          setUserName(userData.full_name);
        }
      } else {
        setUserName('');
      }

      // Filtre par période
      if (dateRange && dateRange !== 'all' && dateRange !== 'null') {
        const { startDate, endDate } = getDateRangeFromPeriod(dateRange);
        if (startDate && endDate) {
          query = query
            .gte('created_at', startDate.toISOString())
            .lte('created_at', endDate.toISOString());
        }
      } else if (startDateParam && endDateParam && startDateParam !== 'null' && endDateParam !== 'null') {
        // Dates personnalisées
        const startDate = new Date(startDateParam);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(endDateParam);
        endDate.setHours(23, 59, 59, 999);
        query = query
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString());
      }

      const { data: salesData, error: queryError } = await query;

      if (queryError) {
        throw new Error(`Supabase error: ${queryError.message || JSON.stringify(queryError)}`);
      }

      // Maintenant, récupérer les informations des clients et utilisateurs séparément
      const ventesAvecDetails = await Promise.all(
        (salesData || []).map(async (sale) => {
          // Récupérer les informations du client
          let clientInfo = null;
          if (sale.customer_id) {
            const { data: clientData } = await supabase
              .from('client')
              .select('name, phone')
              .eq('id', sale.customer_id)
              .single();
            clientInfo = clientData;
          }

          // Récupérer les informations de l'utilisateur
          let userInfo = null;
          if (sale.user_id) {
            const { data: userData } = await supabase
              .from('users')
              .select('full_name')
              .eq('id', sale.user_id)
              .single();
            userInfo = userData;
          }

          return {
            ...sale,
            client: clientInfo,
            user: userInfo
          };
        })
      );

      setVentes(ventesAvecDetails);
      
    } catch (error) {
      console.error('Erreur détaillée:', {
        message: error.message,
        stack: error.stack,
        fullError: error
      });
      setError(error.message || 'Erreur lors du chargement des ventes');
      setVentes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVentes();
  }, [searchParams]);

  const formatCurrency = (amount, currency = 'CDF') => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    }
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'CDF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('CDF', 'FC');
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'partially_paid': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodText = (method) => {
    switch (method) {
      case 'cash': return 'Cash';
      case 'card': return 'Carte';
      case 'mobile': return 'Mobile';
      default: return method;
    }
  };

  // Calcul des totaux
  const totalCDF = ventes
    .filter(v => v.currency === 'CDF')
    .reduce((sum, v) => sum + (v.total || 0), 0);
  
  const totalUSD = ventes
    .filter(v => v.currency === 'USD')
    .reduce((sum, v) => sum + (v.total || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Ventes {userName ? `- ${userName}` : ''}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? 'Chargement...' : `${ventes.length} vente(s)`}
          </p>
        </div>
        <Link
          href="/super-admin/dashboard"
          className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour</span>
        </Link>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700">Erreur: {error}</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">Total CDF</p>
          <p className="text-lg font-semibold text-blue-600 mt-1">
            {formatCurrency(totalCDF, 'CDF')}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">Total USD</p>
          <p className="text-lg font-semibold text-green-600 mt-1">
            {formatCurrency(totalUSD, 'USD')}
          </p>
        </div>
      </div>

      {/* Liste des ventes */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
          <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="mt-2 text-sm text-gray-500">Impossible de charger les ventes</p>
          <button
            onClick={fetchVentes}
            className="mt-4 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      ) : ventes.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
          <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="mt-2 text-sm text-gray-500">Aucune vente trouvée</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N°</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Méthode</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ventes.map((vente) => (
                  <tr key={vente.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{vente.sale_number}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(vente.created_at)}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {vente.client?.name || 'N/A'}
                      </div>
                      {vente.client?.phone && (
                        <div className="text-xs text-gray-500">{vente.client.phone}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(vente.total, vente.currency)}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(vente.payment_status)}`}>
                        {vente.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getPaymentMethodText(vente.payment_method)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}