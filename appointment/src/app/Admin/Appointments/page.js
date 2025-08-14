'use client';

import { useState, useEffect } from 'react';
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
import { db } from '../../lib/firebase';
import { collection, query, getDocs, doc, updateDoc, where } from 'firebase/firestore';

const ITEMS_PER_PAGE = 5;

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching appointments...');
        
        // 1. Fetch all bookings
        const bookingsQuery = query(collection(db, 'bookings'));
        const bookingsSnapshot = await getDocs(bookingsQuery);
        
        const bookingsData = bookingsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          userId: doc.data().userId // Ensure we have userId
        }));

        console.log('Bookings data:', bookingsData);

        // 2. Get all unique user IDs from bookings
        const userIds = [...new Set(bookingsData.map(booking => booking.userId))];
        console.log('User IDs from bookings:', userIds);

        // 3. Fetch only the users that are referenced in bookings
        const usersQuery = query(
          collection(db, 'users'),
          where('__name__', 'in', userIds)
        );
        const usersSnapshot = await getDocs(usersQuery);
        
        const usersData = {};
        usersSnapshot.forEach(userDoc => {
          console.log(`User ${userDoc.id} data:`, userDoc.data());
          usersData[userDoc.id] = {
            email: userDoc.data().email,
            therapyReason: userDoc.data().therapyReason
          };
        });

        console.log('Users data:', usersData);

        // 4. Merge data with proper error handling
        const mergedData = bookingsData.map(booking => {
          const user = usersData[booking.userId] || {};
          console.log(`Merging booking ${booking.id} with user ${booking.userId}:`, user);
          
          return {
            ...booking,
            email: user.email || 'No email',
            therapyReason: user.therapyReason || 'Not specified',
            therapist: booking.therapist || 'No therapist',
            date: booking.date || 'No date',
            time: booking.time || 'No time',
            status: booking.status || 'Pending'
          };
        });

        console.log('Merged appointments data:', mergedData);
        setAppointments(mergedData);
      } catch (err) {
        console.error('Failed to fetch appointments:', err);
        setError('Failed to load appointments. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // ... rest of your component code remains the same ...

  const totalPages = Math.ceil(appointments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentAppointments = appointments.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const apptRef = doc(db, 'bookings', id);
      await updateDoc(apptRef, { status: newStatus });

      setAppointments(prev =>
        prev.map(appt =>
          appt.id === id ? { ...appt, status: newStatus } : appt
        )
      );
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update appointment status');
    }
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
            Appointments
          </h2>

          {error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
              {error}
            </div>
          ) : loading ? (
            <p className="text-center text-gray-500">Loading appointments...</p>
          ) : appointments.length === 0 ? (
            <p className="text-center text-gray-500">No appointments found.</p>
          ) : (
            <>
              <div className="overflow-x-auto bg-white shadow-lg rounded-2xl">
                <table className="min-w-full divide-y divide-purple-200">
                  <thead className="bg-purple-100 text-purple-800">
                    <tr>
                      <TableHeader label="#" />
                      <TableHeader label="Email" />
                      <TableHeader label="Therapist" />
                      <TableHeader label="Reason" />
                      <TableHeader label="Date" icon={<CalendarDays className="inline-block w-4 h-4 mr-1" />} />
                      <TableHeader label="Time" icon={<Clock className="inline-block w-4 h-4 mr-1" />} />
                      <TableHeader label="Status" icon={<CheckCircle className="inline-block w-4 h-4 mr-1" />} />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-gray-700">
                    {currentAppointments.map((appt, index) => (
                      <tr key={appt.id} className="hover:bg-purple-50 transition">
                        <td className="px-4 py-3 font-medium text-center">{startIndex + index + 1}</td>
                        <td className="px-4 py-3 text-sm break-words max-w-xs">
                          {appt.email}
                        </td>
                        <td className="px-4 py-3">{appt.therapist}</td>
                        <td className="px-4 py-3 break-words max-w-xs">
                          {appt.therapyReason}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">{appt.date}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{appt.time}</td>
                        <td className="px-4 py-3">
                          <select
                            value={appt.status}
                            onChange={(e) => handleStatusChange(appt.id, e.target.value)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              appt.status === 'Confirmed'
                                ? 'bg-green-100 text-green-700'
                                : appt.status === 'Cancelled'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
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
              )}
            </>
          )}
        </motion.div>
      </main>
    </>
  );
}

function TableHeader({ label, icon = null }) {
  return (
    <th className="px-4 py-3 text-left text-sm font-semibold tracking-wide whitespace-nowrap">
      {icon} {label}
    </th>
  );
}