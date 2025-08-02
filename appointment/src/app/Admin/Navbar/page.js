'use client';

import {
  HomeIcon,
  CalendarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

const navItems = [
  { name: 'Dashboard', href: '/Admin/', icon: HomeIcon },
  { name: 'Appointments', href: '/Admin/Appointments', icon: CalendarIcon },
  { name: 'Therapists', href: '/Admin/Therapists', icon: UserGroupIcon },
  { name: 'Clients', href: '/Admin/Customers', icon: UserGroupIcon },
  { name: 'Reports', href: '/Admin/Reports', icon: DocumentTextIcon },
  { name: 'Settings', href: '/Admin/Settings', icon: Cog6ToothIcon },
];

export default function AdminSidebar() {
  const handleLogout = () => {
    // TODO: Replace with your actual logout logic
    console.log('Logging out...');
    // Example: clear token and redirect
    // localStorage.removeItem('token');
    // window.location.href = '/login';
  };

  return (
    <aside className="fixed top-0 left-0 z-50 w-64 h-screen bg-gray-50 border-r border-gray-200 p-6 flex flex-col">
      <h1 className="text-purple-600 text-2xl font-bold mb-8 tracking-tight">Therapy Admin</h1>

      <nav className="flex flex-col space-y-2">
        {navItems.map(({ name, href, icon: Icon }) => (
          <Link
            key={name}
            href={href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition-all group"
          >
            <div className="p-2 bg-purple-50 rounded-md group-hover:bg-purple-200 transition-all">
              <Icon className="w-5 h-5 stroke-[1.8]" />
            </div>
            <span className="font-medium text-sm tracking-wide">{name}</span>
          </Link>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-6 flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-red-100 hover:text-red-600 transition-all group"
      >
        <div className="p-2 bg-red-50 rounded-md group-hover:bg-red-200 transition-all">
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
        </div>
        <span className="font-medium text-sm tracking-wide">Logout</span>
      </button>

      <div className="mt-auto pt-6 border-t border-gray-200 text-sm text-gray-500">
        <p>© 2025 Therapy System</p>
      </div>
    </aside>
  );
}
