
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
  RefreshCw,
  Mail,
  AlertCircle
} from 'lucide-react';

import { db } from '../../lib/firebase';

import {
  collection,
  onSnapshot,
  doc,
  updateDoc
} from 'firebase/firestore';

const ITEMS_PER_PAGE = 5;

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // ==================================
  // REAL-TIME FIREBASE LISTENERS
  // ==================================

  useEffect(() => {
    let bookingsLoaded = false;
    let usersLoaded = false;
    let active = true;

    const checkLoading = () => {
      if (active && bookingsLoaded && usersLoaded) {
        setLoading(false);
      }
    };

    // Listen to bookings collection
    const unsubscribeBookings = onSnapshot(
      collection(db, 'bookings'),

      (snapshot) => {
        const bookings = snapshot.docs.map((bookingDoc) => ({
          id: bookingDoc.id,
          ...bookingDoc.data()
        }));

        setAppointments(bookings);

        bookingsLoaded = true;
        checkLoading();
      },

      (err) => {
        console.error('Bookings listener error:', err);

        if (active) {
          setError('Unable to load bookings. Check your Firebase permissions.');
          setLoading(false);
        }
      }
    );

    // Listen to users collection
    const unsubscribeUsers = onSnapshot(
      collection(db, 'users'),

      (snapshot) => {
        const usersData = {};

        snapshot.docs.forEach((userDoc) => {
          usersData[userDoc.id] = {
            id: userDoc.id,
            ...userDoc.data()
          };
        });

        setUsers(usersData);

        usersLoaded = true;
        checkLoading();
      },

      (err) => {
        console.error('Users listener error:', err);

        if (active) {
          setError('Unable to load client information. Check Firebase permissions.');
          setLoading(false);
        }
      }
    );

    return () => {
      active = false;
      unsubscribeBookings();
      unsubscribeUsers();
    };
  }, []);

  // ==================================
  // MERGE BOOKING AND CLIENT DATA
  // ==================================

  const mergedAppointments = appointments.map((booking) => {
    const user = users[booking.userId] || {};

    return {
      ...booking,

      email: user.email || booking.email || 'No email',

      therapyReason:
        user.therapyReason ||
        booking.therapyReason ||
        'Not specified',

      therapist: booking.therapist || 'No therapist',

      date: booking.date || 'No date',

      time: booking.time || 'No time',

      status: booking.status || 'Pending'
    };
  });

  // ==================================
  // PAGINATION
  // ==================================

  const totalPages = Math.ceil(
    mergedAppointments.length / ITEMS_PER_PAGE
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const currentAppointments = mergedAppointments.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // ==================================
  // UPDATE APPOINTMENT STATUS
  // ==================================

  const handleStatusChange = async (id, newStatus) => {
    try {
      setUpdatingId(id);

      await updateDoc(doc(db, 'bookings', id), {
        status: newStatus
      });

      // No manual setAppointments required.
      // Firebase onSnapshot automatically updates the interface.

    } catch (err) {
      console.error('Status update failed:', err);

      alert('Failed to update appointment status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  // ==================================
  // STATUS STYLING
  // ==================================

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';

      case 'cancelled':
        return 'bg-red-100 text-red-700';

      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  // ==================================
  // DASHBOARD
  // ==================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-50">

      <Navbar />

      <main className="min-w-0 w-full p-4 sm:p-6 lg:ml-60 lg:w-[calc(100%-15rem)]">

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >

          {/* HEADER */}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

            <div>
              <p className="text-sm font-semibold text-purple-600 uppercase tracking-wider">
                Management
              </p>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">
                Appointments
              </h1>

              <p className="text-sm text-gray-500 mt-2">
                Manage and monitor all client appointments.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl w-fit">

              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>

              <span className="text-sm font-semibold">
                Live Firebase Sync
              </span>

            </div>

          </div>

          {/* STATISTICS */}

          {!loading && !error && (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

              <StatCard
                title="Total Bookings"
                value={appointments.length}
                icon={ClipboardList}
                color="bg-purple-100 text-purple-600"
              />

              <StatCard
                title="Pending"
                value={appointments.filter(
                  (a) => a.status?.toLowerCase() === 'pending'
                ).length}
                icon={Clock}
                color="bg-yellow-100 text-yellow-600"
              />

              <StatCard
                title="Confirmed"
                value={appointments.filter(
                  (a) => a.status?.toLowerCase() === 'confirmed'
                ).length}
                icon={CheckCircle}
                color="bg-green-100 text-green-600"
              />

              <StatCard
                title="Cancelled"
                value={appointments.filter(
                  (a) => a.status?.toLowerCase() === 'cancelled'
                ).length}
                icon={AlertCircle}
                color="bg-red-100 text-red-600"
              />

            </section>
          )}

          {/* LOADING */}

          {loading && (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm">

              <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto" />

              <p className="text-gray-500 mt-4">
                Connecting to Firebase...
              </p>

            </div>
          )}

          {/* ERROR */}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5 mb-6">
              {error}
            </div>
          )}

          {/* EMPTY STATE */}

          {!loading && !error && appointments.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">

              <CalendarDays className="w-12 h-12 text-purple-300 mx-auto" />

              <h3 className="font-bold text-gray-800 mt-4">
                No appointments yet
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                New bookings will automatically appear here.
              </p>

            </div>
          )}

          {/* APPOINTMENTS */}

          {!loading && !error && appointments.length > 0 && (
            <section className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">

              <div className="p-5 sm:p-6 border-b border-gray-100">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                  <div>
                    <h2 className="text-lg font-bold text-gray-800">
                      All Appointments
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      {appointments.length} booking records
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-green-600">
                    <RefreshCw className="w-4 h-4" />
                    Automatically updating
                  </div>

                </div>

              </div>

              {/* DESKTOP TABLE */}

              <div className="hidden md:block overflow-x-auto">

                <table className="w-full text-sm text-left">

                  <thead className="bg-purple-50 text-purple-800">

                    <tr>
                      <TableHeader label="#" />
                      <TableHeader label="Client Email" />
                      <TableHeader label="Therapist" />
                      <TableHeader label="Therapy Reason" />
                      <TableHeader label="Date" />
                      <TableHeader label="Time" />
                      <TableHeader label="Status" />
                    </tr>

                  </thead>

                  <tbody className="divide-y divide-gray-100 text-gray-700">

                    {currentAppointments.map((appt, index) => (

                      <tr
                        key={appt.id}
                        className="hover:bg-purple-50/50 transition"
                      >

                        <td className="px-4 py-4 text-center font-medium">
                          {startIndex + index + 1}
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                            <span className="break-all">{appt.email}</span>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          {appt.therapist}
                        </td>

                        <td className="px-4 py-4 max-w-xs">
                          <span className="line-clamp-2">
                            {appt.therapyReason}
                          </span>
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap">
                          {appt.date}
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap">
                          {appt.time}
                        </td>

                        <td className="px-4 py-4">

                          <select
                            value={appt.status}
                            disabled={updatingId === appt.id}
                            onChange={(e) =>
                              handleStatusChange(appt.id, e.target.value)
                            }
                            className={`px-3 py-2 rounded-full text-xs font-semibold outline-none cursor-pointer disabled:opacity-50 ${getStatusStyle(appt.status)}`}
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

              {/* MOBILE APPOINTMENT CARDS */}

              <div className="md:hidden divide-y divide-gray-100">

                {currentAppointments.map((appt, index) => (

                  <motion.div
                    key={appt.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 sm:p-5"
                  >

                    <div className="flex justify-between items-start gap-3 mb-4">

                      <div className="min-w-0">

                        <p className="text-xs text-purple-600 font-semibold">
                          BOOKING #{startIndex + index + 1}
                        </p>

                        <p className="font-semibold text-gray-800 mt-1 break-all">
                          {appt.email}
                        </p>

                      </div>

                      <span className={`text-xs px-3 py-1 rounded-full font-semibold shrink-0 ${getStatusStyle(appt.status)}`}>
                        {appt.status}
                      </span>

                    </div>

                    <div className="space-y-3 text-sm">

                      <div className="flex items-start gap-3">
                        <User className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-gray-400 text-xs">Therapist</p>
                          <p className="text-gray-700">{appt.therapist}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <ClipboardList className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-gray-400 text-xs">Therapy Reason</p>
                          <p className="text-gray-700 break-words">
                            {appt.therapyReason}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <CalendarDays className="w-4 h-4 text-purple-500 shrink-0" />
                        <div>
                          <p className="text-gray-400 text-xs">Date</p>
                          <p className="text-gray-700">{appt.date}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-purple-500 shrink-0" />
                        <div>
                          <p className="text-gray-400 text-xs">Time</p>
                          <p className="text-gray-700">{appt.time}</p>
                        </div>
                      </div>

                    </div>

                    <div className="mt-5">

                      <label className="text-xs font-semibold text-gray-500 block mb-2">
                        Update Appointment Status
                      </label>

                      <select
                        value={appt.status}
                        disabled={updatingId === appt.id}
                        onChange={(e) =>
                          handleStatusChange(appt.id, e.target.value)
                        }
                        className={`w-full rounded-xl px-4 py-3 text-sm font-semibold outline-none border-0 disabled:opacity-50 ${getStatusStyle(appt.status)}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>

                    </div>

                  </motion.div>

                ))}

              </div>

              {/* PAGINATION */}

              {totalPages > 1 && (

                <div className="flex flex-wrap justify-center sm:justify-between items-center gap-4 p-5 border-t border-gray-100">

                  <p className="text-xs sm:text-sm text-gray-500">
                    Showing {startIndex + 1}–
                    {Math.min(startIndex + ITEMS_PER_PAGE, appointments.length)}
                    {' '}of {appointments.length}
                  </p>

                  <div className="flex items-center gap-4">

                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 text-purple-700 hover:text-purple-900 disabled:opacity-40"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Prev
                    </button>

                    <span className="text-sm text-gray-600">
                      Page <strong>{currentPage}</strong> of {totalPages}
                    </span>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 text-purple-700 hover:text-purple-900 disabled:opacity-40"
                    >
                      Next
                      <ChevronRight className="w-5 h-5" />
                    </button>

                  </div>

                </div>

              )}

            </section>
          )}

        </motion.div>

      </main>

    </div>
  );
}

// ==================================
// STATISTICS CARD
// ==================================

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm"
    >

      <div className="flex justify-between items-center">

        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800 mt-2">
            {value}
          </h3>
        </div>

        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6" />
        </div>

      </div>

    </motion.div>
  );
}

// ==================================
// TABLE HEADER
// ==================================

function TableHeader({ label }) {
  return (
    <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide whitespace-nowrap">
      {label}
    </th>
  );
}
