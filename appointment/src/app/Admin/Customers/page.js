
'use client';

import { useEffect, useMemo, useState } from 'react';
import Navbar from '../Navbar/page';
import { db } from '../../lib/firebase';

import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';

import {
  Users,
  UserRound,
  Search,
  Mail,
  Phone,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  RefreshCw,
  UserPlus,
  Clock,
  X,
} from 'lucide-react';

const ITEMS_PER_PAGE = 8;

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // REAL-TIME FIREBASE DATA
  useEffect(() => {
    const usersQuery = query(
      collection(db, 'users'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      usersQuery,
      (snapshot) => {
        const clientData = snapshot.docs.map((document) => {
          const data = document.data();

          return {
            id: document.id,
            name:
              data.name ||
              data.fullName ||
              data.displayName ||
              data.firstName ||
              'Unnamed Client',

            email: data.email || 'No email provided',

            phone:
              data.phone ||
              data.phoneNumber ||
              data.mobile ||
              'Not provided',

            createdAt:
              data.createdAt ||
              data.joinedAt ||
              data.dateCreated ||
              null,

            role: data.role || 'client',
          };
        });

        // If your users collection also contains admins or therapists,
        // this excludes those records from the client list.
        const onlyClients = clientData.filter((client) => {
          const role = String(client.role).toLowerCase();
          return role === 'client' || role === 'user';
        });

        setClients(onlyClients);
        setLoading(false);
        setError('');
      },
      (err) => {
        console.error('Firebase clients error:', err);
        setError(
          'Unable to load clients. Please check your Firebase connection and security rules.'
        );
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // DATE FORMAT
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Not available';

    const date =
      typeof timestamp.toDate === 'function'
        ? timestamp.toDate()
        : new Date(timestamp);

    if (Number.isNaN(date.getTime())) return 'Not available';

    return date.toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // FILTER CLIENTS
  const filteredClients = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return clients.filter((client) => {
      return (
        client.name.toLowerCase().includes(searchValue) ||
        client.email.toLowerCase().includes(searchValue) ||
        client.phone.toLowerCase().includes(searchValue)
      );
    });
  }, [clients, search]);

  // RESET PAGINATION WHEN SEARCH CHANGES
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.ceil(
    filteredClients.length / ITEMS_PER_PAGE
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const currentClients = filteredClients.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // RECENT REGISTRATIONS
  const recentClients = clients.filter((client) => {
    if (!client.createdAt) return false;

    const date =
      typeof client.createdAt.toDate === 'function'
        ? client.createdAt.toDate()
        : new Date(client.createdAt);

    if (Number.isNaN(date.getTime())) return false;

    const daysAgo =
      (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);

    return daysAgo <= 30 && daysAgo >= 0;
  }).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="min-w-0 w-full px-4 py-6 sm:px-6 lg:ml-60 lg:w-[calc(100%-15rem)] lg:px-8 lg:py-9">
        <div className="mx-auto max-w-7xl space-y-7">

          {/* HEADER */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-purple-600">
                <Users size={17} />
                Client Management
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-emerald-600">
                  Live data
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Clients
              </h1>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                View and monitor clients registered in your system.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <RefreshCw size={16} className="text-emerald-500" />
              <span className="text-sm font-medium text-slate-600">
                Automatically updated
              </span>
            </div>
          </div>

          {/* STATISTICS */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total Clients
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-slate-900">
                    {clients.length}
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Registered client accounts
                  </p>
                </div>

                <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                  <Users size={24} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    New This Month
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-slate-900">
                    {recentClients}
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Registered in the last 30 days
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                  <UserPlus size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* CLIENT LIST */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* SEARCH */}
            <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  All Clients
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage and view registered client information.
                </p>
              </div>

              <div className="relative w-full md:max-w-sm">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, email or phone..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-sm outline-none transition focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
                />

                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    aria-label="Clear search"
                  >
                    <X size={17} />
                  </button>
                )}
              </div>
            </div>

            {/* LOADING */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2
                  size={32}
                  className="animate-spin text-purple-600"
                />
                <p className="mt-3 text-sm text-slate-500">
                  Loading clients from Firebase...
                </p>
              </div>
            )}

            {/* ERROR */}
            {!loading && error && (
              <div className="px-5 py-16 text-center">
                <AlertCircle
                  size={35}
                  className="mx-auto text-red-500"
                />
                <h3 className="mt-3 font-semibold text-slate-800">
                  Something went wrong
                </h3>
                <p className="mt-2 text-sm text-red-500">
                  {error}
                </p>
              </div>
            )}

            {/* EMPTY STATE */}
            {!loading && !error && filteredClients.length === 0 && (
              <div className="px-5 py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <UserRound size={30} />
                </div>

                <h3 className="mt-4 text-lg font-semibold text-slate-800">
                  No clients found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  {search
                    ? 'Try searching with a different name, email or phone number.'
                    : 'Client registrations will appear here.'}
                </p>
              </div>
            )}

            {/* DESKTOP TABLE */}
            {!loading && !error && filteredClients.length > 0 && (
              <>
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                          Client
                        </th>

                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                          Email Address
                        </th>

                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                          Phone Number
                        </th>

                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                          Date Joined
                        </th>

                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {currentClients.map((client) => (
                        <tr
                          key={client.id}
                          className="transition hover:bg-purple-50/40"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700">
                                {client.name.charAt(0).toUpperCase()}
                              </div>

                              <div className="min-w-0">
                                <p className="font-semibold text-slate-800">
                                  {client.name}
                                </p>

                                <p className="text-xs text-slate-400">
                                  Client account
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-600">
                            {client.email}
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-600">
                            {client.phone}
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-600">
                            {formatDate(client.createdAt)}
                          </td>

                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              Registered
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* MOBILE CLIENT CARDS */}
                <div className="grid grid-cols-1 gap-3 p-4 md:hidden">
                  {currentClients.map((client) => (
                    <div
                      key={client.id}
                      className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-purple-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-100 font-bold text-purple-700">
                          {client.name.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="break-words font-bold text-slate-900">
                            {client.name}
                          </h3>

                          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Registered
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                        <div className="flex min-w-0 items-center gap-2 text-sm text-slate-600">
                          <Mail size={16} className="shrink-0 text-slate-400" />
                          <span className="break-all">{client.email}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone size={16} className="shrink-0 text-slate-400" />
                          <span>{client.phone}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <CalendarDays size={16} className="shrink-0 text-slate-400" />
                          <span>Joined {formatDate(client.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* PAGINATION */}
                <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <p className="text-center text-xs text-slate-500 sm:text-left">
                    Showing{' '}
                    <span className="font-semibold text-slate-700">
                      {startIndex + 1}
                    </span>
                    {' - '}
                    <span className="font-semibold text-slate-700">
                      {Math.min(startIndex + ITEMS_PER_PAGE, filteredClients.length)}
                    </span>
                    {' of '}
                    <span className="font-semibold text-slate-700">
                      {filteredClients.length}
                    </span>
                    {' clients'}
                  </p>

                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft size={16} />
                      Previous
                    </button>

                    <span className="text-sm font-medium text-slate-600">
                      {currentPage} / {totalPages}
                    </span>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>

          <p className="text-center text-xs text-slate-400">
            Client Management · Live Firebase Database
          </p>
        </div>
      </main>
    </div>
  );
}
