// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
//
// function App() {
//   const [customers, setCustomers] = useState([]);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [searchId, setSearchId] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//
//   // 1. Fetch the general customer directory list on component mount
//   useEffect(() => {
//   setLoading(true);
//   // Uses a clean, hardcoded absolute string path for the initial collection list layout payload
//   axios.get('http://127.0.0.1:8000/api/customers/')
//     .then(response => {
//       setCustomers(response.data.slice(0, 20));
//       setLoading(false);
//     })
//     .catch(err => {
//       setError('Failed to fetch customer directory records from the Django backend server.');
//       setLoading(false);
//     });
// }, []);
//
//
//     // 2. Fetch or lookup a specific record by ID via the search field
//   const handleSearchLookup = (e) => {
//     e.preventDefault();
//     const cleanId = searchId.trim();
//     if (!cleanId) return;
//
//     setLoading(true);
//     setError('');
//
//     // 🚀 THE FIX: Standard string addition prevents your browser from breaking the IP address!
//     axios.get('http://127.0.0.1:8000/api/customers/' + cleanId + '/')
//       .then(response => {
//         setSelectedCustomer(response.data);
//         setLoading(false);
//       })
//       .catch(err => {
//         setError(`Customer ID '${cleanId}' not found or could not be loaded.`);
//         setLoading(false);
//       });
//   };
//
//
//
//   const getRiskBadgeColor = (tier) => {
//     if (tier === 'High Risk') return '#ffcccc'; // Soft red
//     if (tier === 'Medium Risk') return '#fff0cc'; // Soft orange
//     if (tier === 'Churned') return '#e0e0e0'; // Muted grey
//     return '#ccffcc'; // Soft green
//   };
//
//   return (
//     <div style={{ padding: '24px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
//       <header style={{ borderBottom: '2px solid #eaeaea', paddingBottom: '12px', marginBottom: '24px' }}>
//         <h1 style={{ margin: 0, color: '#1a1a1a' }}>📊 Telco Churn Risk Intelligence Dashboard</h1>
//       </header>
//
//       {/* SEARCH INTERFACE BAR */}
//       <form onSubmit={handleSearchLookup} style={{ marginBottom: '24px', display: 'flex', gap: '8px' }}>
//         <input
//           type="text"
//           placeholder="Lookup Customer ID (e.g., 7590-VHVEG)..."
//           value={searchId}
//           onChange={(e) => setSearchId(e.target.value)}
//           style={{ padding: '8px 12px', width: '320px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff', color: '#000' }}
//         />
//         <button type="submit" style={{ padding: '8px 16px', background: '#0066cc', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
//           Query Record
//         </button>
//       </form>
//
//       {error && <div style={{ padding: '12px', background: '#ffe6e6', color: '#cc0000', borderRadius: '4px', marginBottom: '16px' }}>{error}</div>}
//       {loading && <div style={{ color: '#666', marginBottom: '16px' }}>🔄 Accessing memory storage arrays...</div>}
//
//       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
//
//         {/* SUMMARY SYSTEM LISTING PANEL */}
//         <div>
//           <h2 style={{ fontSize: '18px', marginBottom: '12px', fontWeight: 'bold' }}>📁 Customer Sample Directory (First 20 Records)</h2>
//           <div style={{ maxHeight: '500px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#fff' }}>
//             <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
//               <thead>
//                 <tr style={{ background: '#f5f5f5', borderBottom: '1px solid #ddd', color: '#333' }}>
//                   <th style={{ padding: '8px' }}>ID</th>
//                   <th style={{ padding: '8px' }}>Contract</th>
//                   <th style={{ padding: '8px' }}>Risk Tier</th>
//                 </tr>
//               </thead>
//                 <tbody style={{color: '#000'}}>
//                 {customers.map(c => (
//                     <tr
//                         key={c.customerID}
//                         // 🚀 THE COMPLETE REPLACEMENT FOR YOUR CLICK HANDLER:
//                         onClick={() => {
//                             setLoading(true);
//                             setError('');
//                             axios.get('http://127.0.0' + c.customerID + '/')
//                                 .then(response => {
//                                     setSelectedCustomer(response.data);
//                                     setLoading(false);
//                                 })
//                                 .catch(err => {
//                                     setError(`Could not fetch details for Customer ID ${c.customerID}`);
//                                     setLoading(false);
//                                 });
//                         }}
//                         style={{
//                             borderBottom: '1px solid #eee',
//                             cursor: 'pointer',
//                             background: selectedCustomer?.customerID === c.customerID ? '#e6f2ff' : 'transparent'
//                         }}
//                     >
//                         <td style={{padding: '8px', color: '#0066cc', fontWeight: 'bold'}}>{c.customerID}</td>
//                         <td style={{padding: '8px'}}>{c.Contract}</td>
//                         <td style={{padding: '8px'}}>
//                       <span style={{
//                           padding: '2px 6px',
//                           borderRadius: '4px',
//                           fontSize: '12px',
//                           background: getRiskBadgeColor(c.Churn_Risk_Tier),
//                           color: '#000',
//                           fontWeight: '500'
//                       }}>
//                         {c.Churn_Risk_Tier}
//                       </span>
//                         </td>
//                     </tr>
//                 ))}
//                 </tbody>
//
//             </table>
//           </div>
//         </div>
//
//           {/* DETAILED INSIGHTS CARD */}
//           <div>
//               <h2 style={{fontSize: '18px', marginBottom: '12px', fontWeight: 'bold'}}>🔍 Targeted Profile Analytics</h2>
//               {selectedCustomer ? (
//                   <div style={{
//                       border: '1px solid #ddd',
//                       borderRadius: '8px',
//                       padding: '16px',
//                       background: '#fafafa',
//                       color: '#000'
//                   }}>
//                       <h3 style={{
//                           margin: '0 0 16px 0',
//                           borderBottom: '1px solid #ddd',
//                           paddingBottom: '8px',
//                           color: '#333'
//                       }}>
//                           Account: <span
//                           style={{color: '#0066cc', fontFamily: 'monospace'}}>{selectedCustomer.customerID}</span>
//                       </h3>
//
//                       <div style={{
//                           display: 'grid',
//                           gridTemplateColumns: '1fr 1fr',
//                           gap: '12px',
//                           fontSize: '14px',
//                           marginBottom: '16px'
//                       }}>
//                           <div><strong>Gender:</strong> {selectedCustomer.gender}</div>
//                           <div><strong>Senior Citizen
//                               Status:</strong> {selectedCustomer.SeniorCitizen === 1 ? 'Yes' : 'No'}</div>
//                           <div><strong>Tenure Months:</strong> {selectedCustomer.tenure}</div>
//                           <div><strong>Internet Type:</strong> {selectedCustomer.InternetService}</div>
//                           <div><strong>Billing Structure:</strong> {selectedCustomer.Contract}</div>
//                           <div><strong>Payment Path:</strong> {selectedCustomer.PaymentMethod}</div>
//                           <div><strong>Monthly Charges:</strong> \${selectedCustomer.MonthlyCharges}</div>
//                           <div><strong>Total Historical Charges:</strong> \${selectedCustomer.TotalCharges}</div>
//                       </div>
//
//                       <div style={{ display: 'flex', gap: '12px', marginTop: '16px', borderTop: '1px solid #ddd', paddingTop: '16px' }}>
//                 <div style={{ padding: '8px 12px', borderRadius: '4px', background: getRiskBadgeColor(selectedCustomer.Churn_Risk_Tier), flex: 1, textAlign: 'center' }}>
//                   <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#555', fontWeight: 'bold' }}>Risk Evaluation</div>
//                   <strong style={{ fontSize: '16px', color: '#000' }}>{selectedCustomer.Churn_Risk_Tier}</strong>
//                 </div>
//                 <div style={{ padding: '8px 12px', borderRadius: '4px', background: selectedCustomer.is_high_value_customer ? '#d1e7dd' : '#f8d7da', flex: 1, textAlign: 'center' }}>
//                   <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#555', fontWeight: 'bold' }}>Value Category</div>
//                   <strong style={{ fontSize: '16px', color: selectedCustomer.is_high_value_customer ? '#0f5132' : '#842029' }}>
//                     {selectedCustomer.is_high_value_customer ? 'Premium Tier' : 'Standard Tier'}
//                   </strong>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div style={{ padding: '40px', textAlign: 'center', color: '#666', border: '2px dashed #ccc', borderRadius: '8px', backgroundColor: '#fafafa' }}>
//               Select an option from the index list panel on the left or type a customer ID above to evaluate predictive scoring live.
//             </div>
//           )}
//         </div>
//
//       </div>
//     </div>
//   );
// }
//
// export default App;

import React, { useState } from 'react';
import CustomersListPage from './routes/CustomersListPage';
import CustomerDetailPage from './routes/CustomerDetailPage';

export default function App() {
  const [activeRoute, setActiveRoute] = useState('list');
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  const handleRouteToDetail = (customerId) => {
    setSelectedCustomerId(customerId);
    setActiveRoute('detail');
  };

  const handleRouteToList = () => {
    setSelectedCustomerId(null);
    setActiveRoute('list');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center space-x-3 max-w-6xl mx-auto w-full">
          <div className="h-2.5 w-2.5 bg-blue-600 rounded-full animate-pulse" />
          <h1 className="text-md font-bold tracking-tight text-slate-800">Retention Management Workspace</h1>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-6">
        {activeRoute === 'list' ? (
          <CustomersListPage onNavigate={handleRouteToDetail} />
        ) : (
          <CustomerDetailPage customerId={selectedCustomerId} onBack={handleRouteToList} />
        )}
      </main>
    </div>
  );
}

