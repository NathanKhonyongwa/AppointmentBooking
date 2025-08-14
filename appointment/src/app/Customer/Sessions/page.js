'use client';

import { useState, useMemo, useEffect } from 'react';
import Navbar from '../Navbar/page';
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { db } from '../../lib/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

const BOOKINGS_PER_PAGE = 5;

export default function MyBookings() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Listen for Firebase auth state
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch bookings from Firestore
  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      try {
        const q = query(
          collection(db, 'bookings'),
          where('userId', '==', user.uid),
          orderBy('date', 'desc')
        );
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookings(fetched);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, [user]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesName = b.therapist?.toLowerCase().includes(filterName.toLowerCase());
      const matchesDate = filterDate ? b.date === filterDate : true;
      return matchesName && matchesDate;
    });
  }, [bookings, filterName, filterDate]);

  const totalPages = Math.ceil(filteredBookings.length / BOOKINGS_PER_PAGE);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * BOOKINGS_PER_PAGE,
    currentPage * BOOKINGS_PER_PAGE
  );

  const groupedByDate = useMemo(() => {
    return paginatedBookings.reduce((acc, booking) => {
      (acc[booking.date] = acc[booking.date] || []).push(booking);
      return acc;
    }, {});
  }, [paginatedBookings]);

  const handlePrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  return (
    <>
      <Navbar />

      <main className="pt-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-purple-700 mb-10 text-center"
        >
        My Therapy Bookings
        </motion.h1>

        {loading ? (
          <p className="text-center text-gray-500 mt-20">Loading...</p>
        ) : !user ? (
          <p className="text-center text-gray-600 text-lg mt-20">
            Please log in to view your bookings.
          </p>
        ) : (
          <>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search therapist name"
                  value={filterName}
                  onChange={(e) => {
                    setFilterName(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full border border-purple-300 bg-white shadow-sm rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <MagnifyingGlassIcon className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>

              <input
                type="date"
                value={filterDate}
                onChange={(e) => {
                  setFilterDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-purple-300 bg-white shadow-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {filteredBookings.length === 0 ? (
              <p className="text-gray-500 text-center text-lg mt-20">No bookings match your filters.</p>
            ) : (
              Object.entries(groupedByDate).map(([date, bookings]) => (
                <section key={date} className="mb-10">
                  <h2 className="text-xl font-semibold text-purple-800 mb-4 border-b border-purple-300 pb-1">
                    {new Date(date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </h2>

                  <ul className="grid gap-4">
                    {bookings.map(({ id, therapist, time, status }) => (
                      <motion.li
                        key={id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex justify-between items-center bg-white shadow-lg rounded-2xl px-6 py-4 border-l-4 border-purple-200 hover:border-purple-500"
                      >
                        <div>
                          <p className="text-lg font-medium text-gray-900">{therapist}</p>
                          <p className="text-sm text-gray-500">Time: {time}</p>
                        </div>

                        <motion.span
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          className={`px-4 py-1 rounded-full font-semibold text-sm shadow-sm ${
                            status === 'Confirmed'
                              ? 'bg-green-100 text-green-700'
                              : status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {status}
                        </motion.span>
                      </motion.li>
                    ))}
                  </ul>
                </section>
              ))
            )}

            {/* Pagination */}
            {filteredBookings.length > BOOKINGS_PER_PAGE && (
              <div className="flex justify-center items-center space-x-6 mt-8">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl bg-white border border-purple-400 text-purple-600 hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeftIcon className="w-6 h-6" />
                </button>

                <span className="text-gray-600 text-base font-medium">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl bg-white border border-purple-400 text-purple-600 hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRightIcon className="w-6 h-6" />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
