// 'use client';

// import { useState, useEffect } from 'react';
// import { supabase } from '@/lib/supabase';
// import Link from 'next/link';
// import { useSearchParams } from 'next/navigation';
// import { ArrowLeft } from 'lucide-react';

// export default function DepensesDetailsPage() {
//   const [depenses, setDepenses] = useState([]);
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

//   const fetchDepenses = async () => {
//     try {
//       setLoading(true);
      
//       const userId = searchParams.get('userId');
//       const dateRange = searchParams.get('dateRange');
//       const startDateParam = searchParams.get('startDate');
//       const endDateParam = searchParams.get('endDate');

//       let query = supabase
//         .from('cash_outflow')
//         .select(`
//           *,
//           user:user_id(*)
//         `)
//         .eq('status', 'completed')
//         .order('date', { ascending: false });

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
//           const startDateStr = startDate.toISOString().split('T')[0];
//           const endDateStr = endDate.toISOString().split('T')[0];
//           query = query
//             .gte('date', startDateStr)
//             .lte('date', endDateStr);
//         }
//       } else if (startDateParam && endDateParam) {
//         // Dates personnalisées
//         query = query
//           .gte('date', startDateParam)
//           .lte('date', endDateParam);
//       }

//       const { data, error } = await query;
//       if (error) throw error;

//       setDepenses(data || []);
//     } catch (error) {
//       console.error('Erreur:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDepenses();
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
//       year: 'numeric'
//     });
//   };

//   const getCategoryColor = (category) => {
//     const colors = {
//       'fourniture': 'bg-blue-100 text-blue-800',
//       'transport': 'bg-green-100 text-green-800',
//       'nourriture': 'bg-yellow-100 text-yellow-800',
//       'divers': 'bg-purple-100 text-purple-800',
//       'default': 'bg-gray-100 text-gray-800'
//     };
    
//     return colors[category] || colors.default;
//   };

//   // Calcul des totaux
//   const totalCDF = depenses
//     .filter(d => d.currency === 'CDF')
//     .reduce((sum, d) => sum + (d.amount || 0), 0);
  
//   const totalUSD = depenses
//     .filter(d => d.currency === 'USD')
//     .reduce((sum, d) => sum + (d.amount || 0), 0);

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-xl font-semibold text-gray-900">
//             Dépenses {userName ? `- ${userName}` : ''}
//           </h1>
//           <p className="text-sm text-gray-500 mt-1">
//             {loading ? 'Chargement...' : `${depenses.length} dépense(s)`}
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
//           <p className="text-lg font-semibold text-red-600 mt-1">
//             {formatCurrency(totalCDF, 'CDF')}
//           </p>
//         </div>
//         <div className="bg-white p-4 rounded-lg border border-gray-200">
//           <p className="text-sm text-gray-500">Total USD</p>
//           <p className="text-lg font-semibold text-orange-600 mt-1">
//             {formatCurrency(totalUSD, 'USD')}
//           </p>
//         </div>
//       </div>

//       {/* Liste des dépenses */}
//       {loading ? (
//         <div className="flex justify-center py-12">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//         </div>
//       ) : depenses.length === 0 ? (
//         <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
//           <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//           <p className="mt-2 text-sm text-gray-500">Aucune dépense trouvée</p>
//         </div>
//       ) : (
//         <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N°</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Raison</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {depenses.map((depense) => (
//                   <tr key={depense.id} className="hover:bg-gray-50">
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       <div className="text-sm font-medium text-gray-900">{depense.outflow_number}</div>
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">{formatDate(depense.date)}</div>
//                     </td>
//                     <td className="px-4 py-3">
//                       <div className="text-sm text-gray-900 max-w-xs">
//                         {depense.reason}
//                       </div>
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       <div className="text-sm font-medium text-red-600">
//                         {formatCurrency(depense.amount, depense.currency)}
//                       </div>
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(depense.category)}`}>
//                         {depense.category || 'Non spécifié'}
//                       </span>
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

export default function DepensesDetailsPage() {
  const [depenses, setDepenses] = useState([]);
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

  const fetchDepenses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userId = searchParams.get('userId');
      const dateRange = searchParams.get('dateRange');
      const startDateParam = searchParams.get('startDate');
      const endDateParam = searchParams.get('endDate');

      // Construire la requête de base - CORRIGÉ: pas de jointure automatique
      let query = supabase
        .from('cash_outflow')
        .select('*')
        .eq('status', 'completed')
        .order('date', { ascending: false });

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
          const startDateStr = startDate.toISOString().split('T')[0];
          const endDateStr = endDate.toISOString().split('T')[0];
          query = query
            .gte('date', startDateStr)
            .lte('date', endDateStr);
        }
      } else if (startDateParam && endDateParam && startDateParam !== 'null' && endDateParam !== 'null') {
        // Dates personnalisées
        query = query
          .gte('date', startDateParam)
          .lte('date', endDateParam);
      }

      const { data: depensesData, error: queryError } = await query;

      if (queryError) {
        throw new Error(`Supabase error: ${queryError.message || JSON.stringify(queryError)}`);
      }

      // Maintenant, récupérer les informations des utilisateurs séparément
      const depensesAvecDetails = await Promise.all(
        (depensesData || []).map(async (depense) => {
          // Récupérer les informations de l'utilisateur
          let userInfo = null;
          if (depense.user_id) {
            const { data: userData } = await supabase
              .from('users')
              .select('full_name')
              .eq('id', depense.user_id)
              .single();
            userInfo = userData;
          }

          return {
            ...depense,
            user: userInfo
          };
        })
      );

      setDepenses(depensesAvecDetails);
      
    } catch (error) {
      console.error('Erreur détaillée:', {
        message: error.message,
        stack: error.stack,
        fullError: error
      });
      setError(error.message || 'Erreur lors du chargement des dépenses');
      setDepenses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepenses();
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
      year: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'fourniture': 'bg-blue-100 text-blue-800',
      'transport': 'bg-green-100 text-green-800',
      'nourriture': 'bg-yellow-100 text-yellow-800',
      'divers': 'bg-purple-100 text-purple-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    
    return colors[category] || colors.default;
  };

  // Calcul des totaux
  const totalCDF = depenses
    .filter(d => d.currency === 'CDF')
    .reduce((sum, d) => sum + (d.amount || 0), 0);
  
  const totalUSD = depenses
    .filter(d => d.currency === 'USD')
    .reduce((sum, d) => sum + (d.amount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Dépenses {userName ? `- ${userName}` : ''}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? 'Chargement...' : `${depenses.length} dépense(s)`}
          </p>
        </div>
        <Link
          href="/super-admin/dashboard/"
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
          <p className="text-lg font-semibold text-red-600 mt-1">
            {formatCurrency(totalCDF, 'CDF')}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">Total USD</p>
          <p className="text-lg font-semibold text-orange-600 mt-1">
            {formatCurrency(totalUSD, 'USD')}
          </p>
        </div>
      </div>

      {/* Liste des dépenses */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
          <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="mt-2 text-sm text-gray-500">Impossible de charger les dépenses</p>
          <button
            onClick={fetchDepenses}
            className="mt-4 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      ) : depenses.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
          <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-2 text-sm text-gray-500">Aucune dépense trouvée</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N°</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Raison</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {depenses.map((depense) => (
                  <tr key={depense.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{depense.outflow_number}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(depense.date)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900 max-w-xs">
                        {depense.reason}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-red-600">
                        {formatCurrency(depense.amount, depense.currency)}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(depense.category)}`}>
                        {depense.category || 'Non spécifié'}
                      </span>
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