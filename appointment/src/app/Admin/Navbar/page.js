'use client';

import { useState } from 'react';
import {
  HomeIcon,
  CalendarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase'; // Adjust the path as needed

const navItems = [
  { name: 'Dashboard', href: '/Admin/', icon: HomeIcon },
  { name: 'Appointments', href: '/Admin/Appointments', icon: CalendarIcon },
  { name: 'Therapists', href: '/Admin/Therapists', icon: UserGroupIcon },
  { name: 'Clients', href: '/Admin/Customers', icon: UserGroupIcon },
  { name: 'Reports', href: '/Admin/Reports', icon: DocumentTextIcon },
  { name: 'Settings', href: '/Admin/Settings', icon: Cog6ToothIcon },
  { name: 'Notifications', href: '/Admin/Notifications', icon: BellIcon },
];

const notificationCount = 5;

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/'); 
    } catch (error) {
      console.error('Logout error:', error);
      // You can add a toast notification here if you want
      alert('Logout failed. Please try again.');
    }
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-purple-600 text-white">
        <h1 className="text-lg font-bold">Therapy Admin</h1>
        <button
          aria-label="Open menu"
          onClick={() => setIsOpen(true)}
          className="focus:outline-none"
        >
          <Bars3Icon className="w-7 h-7" />
        </button>
      </header>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-label="Close menu overlay"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 w-64 h-screen bg-gray-50 border-r border-gray-200 p-6 flex flex-col transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        aria-label="Sidebar navigation"
      >
        {/* Close button (mobile) */}
        <div className="lg:hidden flex justify-end mb-4">
          <button 
            aria-label="Close menu" 
            onClick={() => setIsOpen(false)} 
            className="focus:outline-none"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <h1 className="text-purple-600 text-2xl font-bold mb-4 tracking-tight hidden lg:block">
          Therapy Admin
        </h1>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto pr-2 space-y-2">
          {navItems.map(({ name, href, icon: Icon }) => (
            <Link
              key={name}
              href={href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition-all group"
            >
              <div className="p-2 bg-purple-50 rounded-md group-hover:bg-purple-200 transition-all relative min-w-[28px] flex justify-center">
                <Icon className="w-5 h-5 stroke-[1.8]" />
                {name === 'Notifications' && notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                    {notificationCount}
                  </span>
                )}
              </div>
              <span className="font-medium text-sm tracking-wide whitespace-nowrap">{name}</span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-6 flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-red-100 hover:text-red-600 transition-all group focus:outline-none"
        >
          <div className="p-2 bg-red-50 rounded-md group-hover:bg-red-200 transition-all">
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
          </div>
          <span className="font-medium text-sm tracking-wide whitespace-nowrap">Logout</span>
        </button>

        <footer className="pt-6 border-t border-gray-200 text-sm text-gray-500">
          <p>Developed by Pilhi Technologies</p>
        </footer>
      </aside>
    </>
  );
}