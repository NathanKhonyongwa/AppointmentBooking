
'use client';

import { useEffect, useMemo, useState } from 'react';
import Navbar from '../Navbar/page';
import { db } from '../../lib/firebase';

import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  serverTimestamp,
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
  X,
  CheckCircle,
  UserCheck,
  Stethoscope,
  AlertTriangle,
} from 'lucide-react';

const ITEMS_PER_PAGE = 8;

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [therapists, setTherapists] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [assigning, setAssigning] = useState({});

  // ------------------------------------------
  // LOAD CLIENTS AND THERAPISTS FROM FIREBASE
  // ------------------------------------------

useEffect(() => {
  let usersLoaded = false;
  let therapistsLoaded = false;

  const checkLoading = () => {
    if (usersLoaded && therapistsLoaded) {
      setLoading(false);
    }
  };

  // LOAD CLIENTS FROM USERS COLLECTION
  const usersQuery = query(
    collection(db, 'users'),
    orderBy('createdAt', 'desc')
  );

  const unsubscribeUsers = onSnapshot(
    usersQuery,
    (snapshot) => {
      const clientData = snapshot.docs
        .map((document) => {
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

            role: String(data.role || 'client').toLowerCase(),

            therapistId: data.therapistId || '',
            therapistName: data.therapistName || '',
          };
        })
        .filter(
          (client) =>
            client.role === 'client' ||
            client.role === 'user'
        );

      setClients(clientData);

      usersLoaded = true;
      checkLoading();
    },
    (err) => {
      console.error('Clients loading error:', err);

      setError('Unable to load clients from Firebase.');
      usersLoaded = true;
      checkLoading();
    }
  );

  // LOAD THERAPISTS FROM THERAPISTS COLLECTION
  const therapistsQuery = query(
    collection(db, 'therapists'),
    orderBy('createdAt', 'desc')
  );

  const unsubscribeTherapists = onSnapshot(
    therapistsQuery,
    (snapshot) => {
      const therapistData = snapshot.docs.map((document) => {
        const data = document.data();

        return {
          id: document.id,

          name:
            data.name ||
            data.fullName ||
            data.displayName ||
            'Unnamed Therapist',

          specialty: data.specialty || 'General Therapist',

          contact:
            data.contact ||
            data.phone ||
            data.phoneNumber ||
            'Not provided',

          createdAt: data.createdAt || null,
        };
      });

      setTherapists(therapistData);

      console.log('Therapists loaded:', therapistData);

      therapistsLoaded = true;
      checkLoading();
    },
    (err) => {
      console.error('Therapists loading error:', err);

      setError('Unable to load therapists from Firebase.');
      therapistsLoaded = true;
      checkLoading();
    }
  );

  return () => {
    unsubscribeUsers();
    unsubscribeTherapists();
  };
}, []);

  // ------------------------------------------
  // DATE FORMAT
  // ------------------------------------------

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Not available';

    const date =
      typeof timestamp.toDate === 'function'
        ? timestamp.toDate()
        : new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
      return 'Not available';
    }

    return date.toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // ------------------------------------------
  // ASSIGN THERAPIST TO CLIENT
  // ------------------------------------------

  const assignTherapist = async (client, therapistId) => {
    if (!therapistId) return;

    const therapist = therapists.find(
      (item) => item.id === therapistId
    );

    if (!therapist) {
      setError('Selected therapist could not be found.');
      return;
    }

    try {
      setError('');
      setSuccessMessage('');

      setAssigning((previous) => ({
        ...previous,
        [client.id]: true,
      }));

      await updateDoc(doc(db, 'users', client.id), {
        therapistId: therapist.id,
        therapistName: therapist.name,
        therapistAssignedAt: serverTimestamp(),
      });

      setSuccessMessage(
        `${therapist.name} has been assigned to ${client.name}.`
      );

      setTimeout(() => {
        setSuccessMessage('');
      }, 4000);
    } catch (err) {
      console.error('Therapist assignment error:', err);

      setError(
        'Unable to assign therapist. Check your Firestore permissions and try again.'
      );
    } finally {
      setAssigning((previous) => ({
        ...previous,
        [client.id]: false,
      }));
    }
  };

  // ------------------------------------------
  // FILTER CLIENTS
  // ------------------------------------------

  const filteredClients = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return clients.filter((client) => {
      return (
        client.name.toLowerCase().includes(searchValue) ||
        client.email.toLowerCase().includes(searchValue) ||
        client.phone.toLowerCase().includes(searchValue) ||
        client.therapistName.toLowerCase().includes(searchValue)
      );
    });
  }, [clients, search]);

  // ------------------------------------------
  // RESET PAGINATION
  // ------------------------------------------

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

  // ------------------------------------------
  // RECENT REGISTRATIONS
  // ------------------------------------------

  const recentClients = clients.filter((client) => {
    if (!client.createdAt) return false;

    const date =
      typeof client.createdAt.toDate === 'function'
        ? client.createdAt.toDate()
        : new Date(client.createdAt);

    if (Number.isNaN(date.getTime())) return false;

    const daysAgo =
      (Date.now() - date.getTime()) /
      (1000 * 60 * 60 * 24);

    return daysAgo <= 30 && daysAgo >= 0;
  }).length;

  // ------------------------------------------
  // ASSIGNED CLIENTS
  // ------------------------------------------

  const assignedClients = clients.filter(
    (client) => client.therapistId
  ).length;

  // ------------------------------------------
  // CLIENT AVATAR
  // ------------------------------------------

  const ClientAvatar = ({ name, size = 'h-10 w-10' }) => (
    <div
      className={`${size} flex shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700`}
    >
      {name?.charAt(0)?.toUpperCase() || 'C'}
    </div>
  );

  // ------------------------------------------
  // THERAPIST SELECT
  // ------------------------------------------

  
const TherapistSelect = ({ client }) => (
  <div className="flex min-w-0 flex-col gap-2">
    <div className="relative">
      <Stethoscope
        size={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-purple-500"
      />

      <select
        value={client.therapistId || ''}
        onChange={(e) =>
          assignTherapist(client, e.target.value)
        }
        disabled={
          assigning[client.id] ||
          therapists.length === 0
        }
        className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-60"
      >
        <option value="">
          {therapists.length === 0
            ? 'No therapists available'
            : 'Select therapist'}
        </option>

        {therapists.map((therapist) => (
          <option
            key={therapist.id}
            value={therapist.id}
          >
            {therapist.name}
            {therapist.specialty
              ? ` - ${therapist.specialty}`
              : ''}
          </option>
        ))}
      </select>
    </div>

    {assigning[client.id] ? (
      <span className="flex items-center gap-2 text-xs font-medium text-purple-600">
        <Loader2 size={13} className="animate-spin" />
        Assigning therapist...
      </span>
    ) : client.therapistName ? (
      <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
        <CheckCircle size={13} />
        Assigned to {client.therapistName}
      </span>
    ) : (
      <span className="text-xs text-slate-400">
        No therapist assigned
      </span>
    )}
  </div>
);


  // ------------------------------------------
  // MAIN UI
  // ------------------------------------------

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
                View clients, monitor registrations and assign therapists.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:self-auto">
              <RefreshCw size={16} className="text-emerald-500" />

              <span className="text-sm font-medium text-slate-600">
                Automatically updated
              </span>
            </div>
          </div>

          {/* SUCCESS MESSAGE */}

          {successMessage && (
            <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              <CheckCircle size={19} className="mt-0.5 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ERROR MESSAGE */}

          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertTriangle size={19} className="mt-0.5 shrink-0" />

              <div className="flex-1">
                <p className="font-semibold">
                  Something went wrong
                </p>

                <p className="mt-1">{error}</p>
              </div>

              <button
                onClick={() => setError('')}
                aria-label="Dismiss error"
                className="text-red-500 hover:text-red-700"
              >
                <X size={18} />
              </button>
            </div>
          )}

          {/* STATISTICS */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

            {/* TOTAL CLIENTS */}

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

            {/* NEW CLIENTS */}

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

            {/* ASSIGNED CLIENTS */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2 xl:col-span-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Assigned Clients
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-slate-900">
                    {assignedClients}
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Clients with a therapist
                  </p>
                </div>

                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <UserCheck size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* THERAPIST AVAILABILITY */}

          <div className="flex flex-col gap-3 rounded-2xl border border-purple-100 bg-purple-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white p-3 text-purple-600 shadow-sm">
                <Stethoscope size={21} />
              </div>

              <div>
                <h3 className="font-semibold text-slate-800">
                  Therapist Management
                </h3>

                <p className="text-sm text-slate-500">
                  {therapists.length} therapist
                  {therapists.length === 1 ? '' : 's'} available for assignment
                </p>
              </div>
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-purple-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {therapists.length > 0
                ? 'Ready for assignments'
                : 'No therapists found'}
            </span>
          </div>

          {/* CLIENT LIST */}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* SEARCH HEADER */}

            <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  All Clients
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  View client information and manage therapist assignments.
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
                  Loading clients and therapists...
                </p>
              </div>
            )}

            {/* ERROR STATE */}

            {!loading && error && clients.length === 0 && (
              <div className="px-5 py-16 text-center">
                <AlertCircle
                  size={35}
                  className="mx-auto text-red-500"
                />

                <h3 className="mt-3 font-semibold text-slate-800">
                  Unable to load clients
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Check your Firebase connection and Firestore security rules.
                </p>
              </div>
            )}

            {/* EMPTY STATE */}

            {!loading &&
              !error &&
              filteredClients.length === 0 && (
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

            {/* CLIENT TABLE AND CARDS */}

            {!loading &&
              filteredClients.length > 0 && (
                <>
                  {/* DESKTOP TABLE */}

                  <div className="hidden overflow-x-auto md:block">
                    <table className="w-full min-w-[1050px] text-left">
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

                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                            Assign Therapist
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
                                <ClientAvatar name={client.name} />

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

                            <td className="px-6 py-4">
                              <div className="min-w-[210px]">
                                <TherapistSelect client={client} />
                              </div>
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
                          <ClientAvatar
                            name={client.name}
                            size="h-11 w-11"
                          />

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
                            <Mail
                              size={16}
                              className="shrink-0 text-slate-400"
                            />

                            <span className="break-all">
                              {client.email}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone
                              size={16}
                              className="shrink-0 text-slate-400"
                            />

                            <span>{client.phone}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <CalendarDays
                              size={16}
                              className="shrink-0 text-slate-400"
                            />

                            <span>
                              Joined {formatDate(client.createdAt)}
                            </span>
                          </div>
                        </div>

                        {/* MOBILE THERAPIST ASSIGNMENT */}

                        <div className="mt-4 border-t border-slate-100 pt-4">
                          <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Assign Therapist
                          </label>

                          <TherapistSelect client={client} />
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
                        {Math.min(
                          startIndex + ITEMS_PER_PAGE,
                          filteredClients.length
                        )}
                      </span>

                      {' of '}

                      <span className="font-semibold text-slate-700">
                        {filteredClients.length}
                      </span>

                      {' clients'}
                    </p>

                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() =>
                          handlePageChange(currentPage - 1)
                        }
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
                        onClick={() =>
                          handlePageChange(currentPage + 1)
                        }
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

          {/* FOOTER */}

          <p className="text-center text-xs text-slate-400">
            Client Management · Live Firebase Database
          </p>
        </div>
      </main>
    </div>
  );
}
