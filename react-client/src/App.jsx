// import React, { useState } from 'react';
// import CustomersListPage from './routes/CustomersListPage';
// import CustomerDetailPage from './routes/CustomerDetailPage';
//
// export default function App() {
//   const [activeRoute, setActiveRoute] = useState('list');
//   const [selectedCustomerId, setSelectedCustomerId] = useState(null);
//
//   const handleRouteToDetail = (customerId) => {
//     setSelectedCustomerId(customerId);
//     setActiveRoute('detail');
//   };
//
//   const handleRouteToList = () => {
//     setSelectedCustomerId(null);
//     setActiveRoute('list');
//   };
//
//   return (
//     <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900 flex flex-col">
//       <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
//         <div className="flex items-center space-x-3 max-w-6xl mx-auto w-full">
//           <div className="h-2.5 w-2.5 bg-blue-600 rounded-full animate-pulse" />
//           <h1 className="text-md font-bold tracking-tight text-slate-800">Retention Management Workspace</h1>
//         </div>
//       </header>
//
//       <main className="flex-1 max-w-6xl mx-auto w-full p-6">
//         {activeRoute === 'list' ? (
//           <CustomersListPage onNavigate={handleRouteToDetail} />
//         ) : (
//           <CustomerDetailPage customerId={selectedCustomerId} onBack={handleRouteToList} />
//         )}
//       </main>
//     </div>
//   );
// }



import React, { useState } from 'react';
import CustomersListPage from './routes/CustomersListPage';
import CustomerDetailPage from './routes/CustomerDetailPage';
import ModelInfoPage from './routes/ModelInfoPage'; // 🚀 Import your newly created documentation view page

export default function App() {
  const [activeRoute, setActiveRoute] = useState('list'); // 'list' | 'detail' | 'model-info'
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  // 📋 HOOK 1: Handles normal table clicks to single out a specific profile ID
  const handleRouteToDetail = (customerId) => {
    // If the navigate string matches our metadata button token, route to the rules page instead
    if (customerId === 'model-info') {
      setSelectedCustomerId(null);
      setActiveRoute('model-info');
    } else {
      setSelectedCustomerId(customerId);
      setActiveRoute('detail');
    }
  };

  // 📋 HOOK 2: Forces an immediate exit point back to your main row table directory
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
        {/* 🚀 EXPANDED ROUTING ENGINE: Explicitly segregates layout modules safely */}
        {activeRoute === 'list' && (
          <CustomersListPage onNavigate={handleRouteToDetail} />
        )}

        {activeRoute === 'detail' && (
          <CustomerDetailPage customerId={selectedCustomerId} onBack={handleRouteToList} />
        )}

        {activeRoute === 'model-info' && (
          <ModelInfoPage onBack={handleRouteToList} />
        )}
      </main>
    </div>
  );
}

