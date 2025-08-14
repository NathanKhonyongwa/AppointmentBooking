"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

const navItems = [
  { name: "Home", href: "/Customer", icon: HomeIcon },
  { name: "Book Appointment", href: "/Customer/MyBookings", icon: CalendarDaysIcon },
  { name: "My Sessions", href: "/Customer/Sessions", icon: ClipboardDocumentListIcon },
  { name: "Profile", href: "/Customer/Profile", icon: UserCircleIcon },
  { name: "Settings", href: "/Customer/Settings", icon: Cog6ToothIcon },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <div className="text-purple-700 font-bold text-xl">Therapy Client</div>

          {/* Desktop nav */}
          <ul className="hidden md:flex space-x-8">
            {navItems.map(({ name, href, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <li key={name}>
                  <Link
                    href={href}
                    className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium
                      ${
                        isActive
                          ? "text-purple-700 bg-purple-100"
                          : "text-gray-600 hover:text-purple-700 hover:bg-purple-50"
                      } transition`}
                  >
                    <Icon className="w-5 h-5" />
                    {name}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Logout - Desktop */}
          <Link
  href="/"
  className="hidden md:flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-100 transition"
>
  <ArrowRightOnRectangleIcon className="w-5 h-5" />
  Logout
</Link>


          {/* Mobile Menu Toggle */}
          <button className="md:hidden focus:outline-none" onClick={toggleMenu}>
            {menuOpen ? (
              <XMarkIcon className="w-6 h-6 text-purple-700" />
            ) : (
              <Bars3Icon className="w-6 h-6 text-purple-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pt-4 pb-4 bg-white border-t">
          <ul className="space-y-3">
            {navItems.map(({ name, href, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <li key={name}>
                  <Link
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium
                      ${
                        isActive
                          ? "text-purple-700 bg-purple-100"
                          : "text-gray-700 hover:text-purple-700 hover:bg-purple-50"
                      } transition`}
                  >
                    <Icon className="w-5 h-5" />
                    {name}
                  </Link>
                </li>
              );
            })}
            <li>
  <Link
    href="/"
    onClick={() => setMenuOpen(false)}
    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-100 transition"
  >
    <ArrowRightOnRectangleIcon className="w-5 h-5" />
    Logout
  </Link>
</li>

          </ul>
        </div>
      )}
    </nav>
  );
}
