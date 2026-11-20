
'use client';

import { useState, useMemo, useEffect } from 'react';
import Navbar from '../Navbar/page';

import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserRoundIcon,
  ClipboardDocumentListIcon,
  FunnelIcon,
  XMarkIcon,
  ArrowPathIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

import { motion, AnimatePresence } from 'framer-motion';

import { db } from '../../lib/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from 'firebase/firestore';

const BOOKINGS_PER_PAGE = 5;

const statusStyles = {
  Confirmed: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    label: 'Confirmed',
  },
  Pending: {
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
    label: 'Pending',
  },
  Cancelled: {
    badge: 'bg-red-50 text-red-700 border-red-200',
    dot: 'bg-red-500',
    label: 'Cancelled',
  },
};

function getStatusStyle(status) {
  return statusStyles[status] || {
    badge: 'bg-gray-100 text-gray-600 border-gray-200',
    dot: 'bg-gray-400',
    label: status || 'Unknown',
  };
}

function formatDate(date) {
  if (!date) return 'Date unavailable';

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function MyBookings() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);

  const [filterName, setFilterName] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');

  // Firebase authentication
  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch bookings
  useEffect(() => {
    if (loading) return;

    if (!user) {
      setBookings([]);
      return;
    }

    let active = true;

    const fetchBookings = async () => {
      setFetching(true);
      setError('');

      try {
        const bookingsQuery = query(
          collection(db, 'bookings'),
          where('userId', '==', user.uid),
          orderBy('date', 'desc')
        );

        const snapshot = await getDocs(bookingsQuery);

        if (!active) return;

        const fetched = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setBookings(fetched);
      } catch (err) {
        console.error('Error fetching bookings:', err);

        if (active) {
          setError(
            'Unable to load your bookings. Please try again.'
          );
        }
      } finally {
        if (active) setFetching(false);
      }
    };

    fetchBookings();

    return () => {
      active = false;
    };
  }, [user, loading]);

  // Filter bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const therapist = (booking.therapist || '').toLowerCase();

      const matchesName = therapist.includes(
        filterName.toLowerCase().trim()
      );

      const matchesDate = filterDate
        ? booking.date === filterDate
        : true;

      return matchesName && matchesDate;
    });
  }, [bookings, filterName, filterDate]);

  // Booking statistics
  const confirmedCount = bookings.filter(
    (b) => b.status === 'Confirmed'
  ).length;

  const pendingCount = bookings.filter(
    (b) => b.status === 'Pending'
  ).length;

  // Pagination
  const totalPages = Math.ceil(
    filteredBookings.length / BOOKINGS_PER_PAGE
  );

  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * BOOKINGS_PER_PAGE,
    currentPage * BOOKINGS_PER_PAGE
  );

  // Group bookings by date
  const groupedByDate = useMemo(() => {
    return paginatedBookings.reduce((acc, booking) => {
      const date = booking.date || 'Date unavailable';

      if (!acc[date]) acc[date] = [];

      acc[date].push(booking);

      return acc;
    }, {});
  }, [paginatedBookings]);

  const clearFilters = () => {
    setFilterName('');
    setFilterDate('');
    setCurrentPage(1);
  };

  const hasFilters = filterName || filterDate;

  const handleRefresh = () => {
    if (!user) return;

    setUser({ ...user });
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 pt-24 sm:pt-28 pb-12">

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* PAGE HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mb-3">
                  <SparklesIcon className="w-4 h-4" />
                  YOUR PERSONAL DASHBOARD
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                  My Bookings
                </h1>

                <p className="text-slate-500 mt-2 text-sm sm:text-base">
                  Manage and keep track of your therapy appointments.
                </p>
              </div>

              {user && (
                <button
                  onClick={handleRefresh}
                  disabled={fetching}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium text-sm shadow-sm hover:bg-slate-50 transition disabled:opacity-50"
                >
                  <ArrowPathIcon
                    className={`w-4 h-4 ${fetching ? 'animate-spin' : ''}`}
                  />
                  Refresh bookings
                </button>
              )}

            </div>
          </motion.div>

          {/* LOADING */}
          {loading && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-28 rounded-2xl bg-white animate-pulse"
                  />
                ))}
              </div>

              <div className="h-24 rounded-2xl bg-white animate-pulse" />
              <div className="h-40 rounded-2xl bg-white animate-pulse" />
            </div>
          )}

          {/* NOT LOGGED IN */}
          {!loading && !user && (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-14 text-center shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-5">
                <UserRoundIcon className="w-8 h-8" />
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                Login required
              </h2>

              <p className="text-slate-500 mt-2 text-sm">
                Please log in to access and manage your therapy bookings.
              </p>
            </div>
          )}

          {/* DASHBOARD */}
          {!loading && user && (
            <>

              {/* STATISTICS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-slate-500 font-medium">
                        Total Bookings
                      </p>

                      <h3 className="text-3xl font-bold text-slate-900 mt-2">
                        {bookings.length}
                      </h3>
                    </div>

                    <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                      <ClipboardDocumentListIcon className="w-6 h-6" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-3">
                    All your appointments
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-slate-500 font-medium">
                        Confirmed
                      </p>

                      <h3 className="text-3xl font-bold text-emerald-600 mt-2">
                        {confirmedCount}
                      </h3>
                    </div>

                    <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <CalendarDaysIcon className="w-6 h-6" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-3">
                    Approved appointments
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-slate-500 font-medium">
                        Pending
                      </p>

                      <h3 className="text-3xl font-bold text-amber-600 mt-2">
                        {pendingCount}
                      </h3>
                    </div>

                    <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                      <ClockIcon className="w-6 h-6" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-3">
                    Awaiting confirmation
                  </p>
                </motion.div>

              </div>

              {/* SEARCH AND FILTERS */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm mb-7">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">

                  <div>
                    <h2 className="font-bold text-slate-900 text-lg">
                      Your Appointments
                    </h2>

                    <p className="text-xs text-slate-500 mt-1">
                      Search and filter your therapy sessions.
                    </p>
                  </div>

                  {hasFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-sm font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1"
                    >
                      <XMarkIcon className="w-4 h-4" />
                      Clear filters
                    </button>
                  )}

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  <div className="relative">
                    <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                    <input
                      type="text"
                      placeholder="Search therapist name..."
                      value={filterName}
                      onChange={(e) => {
                        setFilterName(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    />
                  </div>

                  <div className="relative">
                    <CalendarDaysIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />

                    <input
                      type="date"
                      value={filterDate}
                      onChange={(e) => {
                        setFilterDate(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    />
                  </div>

                </div>
              </div>

              {/* ERROR */}
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                  {error}
                  <button
                    onClick={handleRefresh}
                    className="ml-2 font-bold underline"
                  >
                    Try again
                  </button>
                </div>
              )}

              {/* BOOKING LIST */}
              {fetching && bookings.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center animate-pulse text-slate-400">
                  Loading your appointments...
                </div>
              ) : filteredBookings.length === 0 ? (

                <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-14 text-center shadow-sm">

                  <div className="w-16 h-16 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <CalendarDaysIcon className="w-8 h-8" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">
                    {bookings.length === 0
                      ? 'No bookings yet'
                      : 'No matching appointments'}
                  </h3>

                  <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
                    {bookings.length === 0
                      ? 'Your therapy appointments will appear here once you make a booking.'
                      : 'Try changing your search or date filters to find your bookings.'}
                  </p>

                  {hasFilters && (
                    <button
                      onClick={clearFilters}
                      className="mt-5 px-5 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition"
                    >
                      Clear filters
                    </button>
                  )}

                </div>

              ) : (

                <div className="space-y-7">

                  <AnimatePresence mode="wait">

                    {Object.entries(groupedByDate).map(([date, dateBookings]) => (

                      <motion.section
                        key={date}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >

                        {/* DATE HEADING */}
                        <div className="flex items-center gap-3 mb-4">

                          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                            <CalendarDaysIcon className="w-5 h-5" />
                          </div>

                          <div>
                            <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                              {formatDate(date)}
                            </h3>

                            <p className="text-xs text-slate-400">
                              {dateBookings.length} appointment
                              {dateBookings.length !== 1 ? 's' : ''}
                            </p>
                          </div>

                        </div>

                        {/* APPOINTMENT CARDS */}
                        <div className="space-y-3">

                          {dateBookings.map((booking, index) => {

                            const status = getStatusStyle(booking.status);

                            return (

                              <motion.div
                                key={booking.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-purple-200 transition-all duration-300"
                              >

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                  {/* THERAPIST */}
                                  <div className="flex items-start gap-4 min-w-0">

                                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                      <UserRoundIcon className="w-6 h-6" />
                                    </div>

                                    <div className="min-w-0">

                                      <p className="text-xs text-slate-400 font-medium mb-1">
                                        THERAPIST
                                      </p>

                                      <h4 className="font-bold text-slate-900 text-base sm:text-lg break-words">
                                        {booking.therapist || 'Therapist not specified'}
                                      </h4>

                                      <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
                                        <ClockIcon className="w-4 h-4 shrink-0" />
                                        <span>
                                          {booking.time || 'Time not specified'}
                                        </span>
                                      </div>

                                    </div>

                                  </div>

                                  {/* STATUS */}
                                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">

                                    <span className="text-xs text-slate-400 font-medium sm:hidden">
                                      BOOKING STATUS
                                    </span>

                                    <span className={`inline-flex items-center gap-2 px-3 py-2 border rounded-full text-xs font-bold ${status.badge}`}>
                                      <span className={`w-2 h-2 rounded-full ${status.dot}`} />
                                      {status.label}
                                    </span>

                                  </div>

                                </div>

                              </motion.div>

                            );
                          })}

                        </div>

                      </motion.section>

                    ))}

                  </AnimatePresence>

                </div>

              )}

              {/* PAGINATION */}
              {totalPages > 1 && (

                <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">

                  <p className="text-sm text-slate-500">
                    Showing{' '}
                    <span className="font-bold text-slate-800">
                      {(currentPage - 1) * BOOKINGS_PER_PAGE + 1}
                    </span>
                    {' '}to{' '}
                    <span className="font-bold text-slate-800">
                      {Math.min(
                        currentPage * BOOKINGS_PER_PAGE,
                        filteredBookings.length
                      )}
                    </span>
                    {' '}of{' '}
                    <span className="font-bold text-slate-800">
                      {filteredBookings.length}
                    </span>
                    {' '}appointments
                  </p>

                  <div className="flex items-center gap-3">

                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      aria-label="Previous page"
                      className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-purple-50 hover:text-purple-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeftIcon className="w-5 h-5" />
                    </button>

                    <span className="text-sm font-semibold text-slate-700">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      aria-label="Next page"
                      className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-purple-50 hover:text-purple-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>

                  </div>

                </div>

              )}

              {/* FOOTER NOTE */}
              <div className="mt-8 text-center">
                <p className="text-xs text-slate-400">
                  <SparklesIcon className="w-3.5 h-3.5 inline mr-1 text-purple-400" />
                  Your wellness journey matters. Thank you for choosing us.
                </p>
              </div>

            </>
          )}

        </div>
      </main>
    </>
  );
}
