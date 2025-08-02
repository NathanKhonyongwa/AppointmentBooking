'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../Navbar/page';
import {
  CalendarDays,
  Clock,
  User,
  ClipboardList,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const appointmentsMock = [
  {
    id: 1,
    user: 'Jane Doe',
    email: 'jane@example.com',
    therapist: 'Dr. Chikondi M.',
    reason: 'Stress Management',
    date: '2025-08-05',
    time: '14:00',
    status: 'Confirmed',
    bookedAt: '2025-08-01T09:30:00',
  },
  {
    id: 2,
    user: 'John Banda',
    email: 'john@example.com',
    therapist: 'Dr. Rose Z.',
    reason: 'Anxiety & Depression',
    date: '2025-08-06',
    time: '10:30',
    status: 'Pending',
    bookedAt: '2025-08-02T15:12:00',
  },
  // Add more mock items here if needed
];

const ITEMS_PER_PAGE = 5;

export default function AdminAppointments() {
  const [appointments] = useState(appointmentsMock); // replace with backend fetch later
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(appointments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentAppointments = appointments.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Remove TypeScript annotation ': number'
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-white to-purple-50 p-8 ml-60">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">
            Admin - All Appointments
          </h2>

          {appointments.length === 0 ? (
            <p className="text-center text-gray-500">No appointments found.</p>
          ) : (
            <>
              <div className="overflow-x-auto bg-white shadow-lg rounded-2xl">
                <table className="min-w-full divide-y divide-purple-200">
                  <thead className="bg-purple-100 text-purple-800">
                    <tr>
                      <TableHeader label="User" icon={<User className="inline-block w-4 h-4 mr-1" />} />
                      <TableHeader label="Email" />
                      <TableHeader label="Therapist" />
                      <TableHeader label="Reason" icon={<ClipboardList className="inline-block w-4 h-4 mr-1" />} />
                      <TableHeader label="Date" icon={<CalendarDays className="inline-block w-4 h-4 mr-1" />} />
                      <TableHeader label="Time" icon={<Clock className="inline-block w-4 h-4 mr-1" />} />
                      <TableHeader label="Status" icon={<CheckCircle className="inline-block w-4 h-4 mr-1" />} />
                      <TableHeader label="Booked At" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-gray-700">
                    {currentAppointments.map((appt) => (
                      <tr key={appt.id} className="hover:bg-purple-50 transition">
                        <td className="px-4 py-3 font-medium">{appt.user}</td>
                        <td className="px-4 py-3 text-sm">{appt.email}</td>
                        <td className="px-4 py-3">{appt.therapist}</td>
                        <td className="px-4 py-3">{appt.reason}</td>
                        <td className="px-4 py-3">{appt.date}</td>
                        <td className="px-4 py-3">{appt.time}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              appt.status === 'Confirmed'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {appt.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(appt.bookedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-end items-center gap-4 mt-6">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 text-purple-700 hover:text-purple-900 disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Prev
                </button>
                <span className="text-gray-600">
                  Page <strong>{currentPage}</strong> of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 text-purple-700 hover:text-purple-900 disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
        </motion.div>
      </main>
    </>
  );
}

function TableHeader({ label, icon = null }) {
  return (
    <th className="px-4 py-3 text-left text-sm font-semibold tracking-wide">
      {icon} {label}
    </th>
  );
}
