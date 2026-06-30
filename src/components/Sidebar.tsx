"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Inventory Manager', path: '/dashboard/inventory', icon: '💼' },
    { name: 'Employee Tracker', path: '/dashboard/employees', icon: '👥' },
    { name: 'Finance Ledger', path: '/dashboard/finance', icon: '💵' },
    { name: 'Clients & Vendors', path: '/dashboard/partners', icon: '🤝' },
    { name: 'Contact Directory', path: '/dashboard/contacts', icon: '📞' },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-gray-100 flex flex-col h-screen fixed left-0 top-0 border-r border-gray-800">
      {/* Clickable Header that links back to the Home page */}
      <div className="h-16 flex items-center px-6 bg-gray-950 font-bold text-lg tracking-wide border-b border-gray-900">
        <Link 
          href="/" 
          className="flex items-center gap-2 hover:text-indigo-400 active:text-indigo-500 transition-colors cursor-pointer"
        >
          <span>💼</span>
          <span>Admin Portal</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};