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
} from "@heroicons/react/24/outline";

const navItems = [
  { name: "Home", href: "/Customer", icon: HomeIcon },
  { name: "Book Appointment", href: "/Customer/MyBookings", icon: CalendarDaysIcon },
  { name: "My Sessions", href: "/client/sessions", icon: ClipboardDocumentListIcon },
  { name: "Profile", href: "/client/profile", icon: UserCircleIcon },
  { name: "Settings", href: "/client/settings", icon: Cog6ToothIcon },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="text-purple-700 font-bold text-xl">Therapy Client</div>

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

          {/* Logout button */}
          <Link
            href="/logout"
            className="hidden md:flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-100 transition"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
}
