'use client';

import { useState, useMemo } from 'react';
import Navbar from '../Navbar/page'; // Adjust path as needed
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const BOOKINGS_PER_PAGE = 5;

const mockBookings = [
    { id: 1, therapist: 'Therapist A', date: '2025-08-05', time: '10:00 AM', status: 'Confirmed' },
    { id: 2, therapist: 'Therapist B', date: '2025-08-06', time: '2:00 PM', status: 'Pending' },
    { id: 3, therapist: 'Therapist C', date: '2025-08-07', time: '11:30 AM', status: 'Cancelled' },
    { id: 4, therapist: 'Therapist A', date: '2025-08-08', time: '9:00 AM', status: 'Confirmed' },
    { id: 5, therapist: 'Therapist B', date: '2025-08-09', time: '1:00 PM', status: 'Confirmed' },
    { id: 6, therapist: 'Therapist C', date: '2025-08-10', time: '3:30 PM', status: 'Pending' },
    { id: 7, therapist: 'Therapist A', date: '2025-08-11', time: '10:15 AM', status: 'Confirmed' },
    { id: 8, therapist: 'Therapist B', date: '2025-08-12', time: '11:00 AM', status: 'Cancelled' },
    { id: 9, therapist: 'Therapist C', date: '2025-08-13', time: '4:00 PM', status: 'Confirmed' },
];

export default function MyBookings() {
    const [filterName, setFilterName] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Filter bookings by therapist name & date
    const filteredBookings = useMemo(() => {
        return mockBookings.filter((b) => {
            const matchesName = b.therapist.toLowerCase().includes(filterName.toLowerCase());
            const matchesDate = filterDate ? b.date === filterDate : true;
            return matchesName && matchesDate;
        });
    }, [filterName, filterDate]);

    // Pagination logic
    const totalPages = Math.ceil(filteredBookings.length / BOOKINGS_PER_PAGE);
    const paginatedBookings = filteredBookings.slice(
        (currentPage - 1) * BOOKINGS_PER_PAGE,
        currentPage * BOOKINGS_PER_PAGE
    );

    // Group bookings by date for display
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

            <main className="pt-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
                <h1 className="text-3xl font-normal text-purple-700 mb-8">My Bookings</h1>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Filter by therapist name"
                            value={filterName}
                            onChange={(e) => {
                                setFilterName(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full border rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-400"
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
                        className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                </div>

                {/* Booking List */}
                {filteredBookings.length === 0 ? (
                    <p className="text-gray-600 text-center mt-20">No bookings found.</p>
                ) : (
                    Object.entries(groupedByDate).map(([date, bookings]) => (
                        <section key={date} className="mb-8">
                            <h2 className="text-xl font-normal text-gray-800 mb-4 border-b border-purple-300 pb-1">
                                {new Date(date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </h2>
                            <ul className="space-y-4">
                                {bookings.map(({ id, therapist, time, status }) => (
                                    <li
                                        key={id}
                                        className="flex justify-between items-center bg-white shadow rounded-lg p-4"
                                    >
                                        <div>
                                            <p className="font-normal text-gray-900">{therapist}</p>
                                            <p className="text-sm text-gray-600">Time: {time}</p>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-full font-normal text-sm ${
                                                status === 'Confirmed'
                                                    ? 'bg-green-100 text-green-800'
                                                    : status === 'Pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {status}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))
                )}

                {/* Pagination Controls */}
                {filteredBookings.length > BOOKINGS_PER_PAGE && (
                    <div className="flex justify-center items-center space-x-6 mt-6">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className="p-2 rounded-md border border-purple-400 text-purple-600 hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Previous page"
                        >
                            <ChevronLeftIcon className="w-6 h-6" />
                        </button>

                        <span className="text-gray-700 font-normal">
                            Page {currentPage} of {totalPages}
                        </span>

                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-md border border-purple-400 text-purple-600 hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Next page"
                        >
                            <ChevronRightIcon className="w-6 h-6" />
                        </button>
                    </div>
                )}
            </main>
        </>
    );
}
