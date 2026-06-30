import Link from 'next/link';

export default function Home() {
  const modules = [
    {
      title: 'Inventory Manager',
      desc: 'Monitor real-time stock levels, catalog SKUs, track initial pricing, and log vendor channels.',
      icon: '📦',
      color: 'bg-blue-50 text-blue-700 border-blue-100',
      path: 'inventory', // Maps to /dashboard/inventory
    },
    {
      title: 'Employee Tracker',
      desc: 'Onboard staff, structure department databases, track internal payroll, and manage records.',
      icon: '👥',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-100',
      path: 'employees', // Maps to /dashboard/employees
    },
    {
      title: 'Finance Ledger',
      desc: 'Maintain transparent cash flow records, post active transaction ledger categories, and track balances.',
      icon: '💵',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      path: 'finance', // Maps to /dashboard/finance
    },
    {
      title: 'Clients & Vendors',
      desc: 'Categorize partner relationship profiles, log tax identifiers, and preserve directory contact coordinates.',
      icon: '🤝',
      color: 'bg-purple-50 text-purple-700 border-purple-100',
      path: 'partners', // Maps to /dashboard/partners
    },
    {
      title: 'Contact Directory',
      desc: 'Manage a unified internal directory registry, structure personal data directories, and log notes.',
      icon: '📞',
      color: 'bg-amber-50 text-amber-700 border-amber-100',
      path: 'contacts', // Maps to /dashboard/contacts
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Upper Navigation Bar */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-900 tracking-tight">
            <span className="text-xl">💼</span>
            <span>BUSINESS MANAGEMENT PORTAL</span>
          </div>
          <div>
            <Link
              href="/dashboard/inventory"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-xs font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition shadow-sm"
            >
              Portal Login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 md:py-20 flex flex-col gap-12 md:gap-16">
        <div className="max-w-3xl space-y-6">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
            Enterprise Solutions
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-none">
            Consolidated Business Operations Platform.
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed">
            A secure administrative platform built to integrate inventory tracking, personnel logistics, financial ledgers, and directory partner records into a single workspace.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/dashboard/inventory"
              className="px-6 py-3.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition shadow-lg shadow-indigo-100 flex items-center gap-2"
            >
              <span>Enter Operational Dashboard</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Features Modules Grid */}
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-xl font-bold text-slate-900">Platform Modules</h2>
            <p className="text-xs text-slate-500 mt-1">Explore core systems driving company operations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((mod, index) => (
              <div 
                key={index} 
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between gap-6"
              >
                <div className="space-y-4">
                  <span className={`inline-flex items-center p-3 rounded-xl border text-2xl ${mod.color}`}>
                    {mod.icon}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{mod.title}</h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{mod.desc}</p>
                  </div>
                </div>
                <div>
                  <Link 
                    // Fix: Map directly to mod.path (preserves correct plural paths like /employees and /contacts)
                    href={`/dashboard/${mod.path}`}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 group"
                  >
                    <span>Launch Module</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-150">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Business Management System. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
