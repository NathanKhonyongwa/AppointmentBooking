
'use client';

import { useEffect, useMemo, useState } from 'react';
import Navbar from '../Navbar/page';

import { db } from '../../lib/firebase';

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';

import {
  Users,
  UserRound,
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Phone,
  BriefcaseMedical,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Stethoscope,
  RefreshCw,
} from 'lucide-react';

export default function TherapistPage() {
  const [therapists, setTherapists] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [search, setSearch] = useState('');

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingTherapist, setEditingTherapist] = useState(null);

  const [form, setForm] = useState({
    name: '',
    specialty: '',
    contact: '',
  });

  // REAL-TIME FIREBASE LISTENER
  useEffect(() => {
    const therapistsQuery = query(
      collection(db, 'therapists'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      therapistsQuery,
      (snapshot) => {
        const data = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        }));

        setTherapists(data);
        setLoading(false);
        setError('');
      },
      (err) => {
        console.error('Therapist loading error:', err);
        setError(
          'Unable to load therapists. Check your Firebase connection and permissions.'
        );
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // SEARCH
  const filteredTherapists = useMemo(() => {
    const value = search.toLowerCase().trim();

    return therapists.filter((therapist) => {
      return (
        (therapist.name || '').toLowerCase().includes(value) ||
        (therapist.specialty || '').toLowerCase().includes(value) ||
        (therapist.contact || '').toLowerCase().includes(value)
      );
    });
  }, [therapists, search]);

  // SPECIALTY COUNT
  const specialtyCount = new Set(
    therapists
      .map((therapist) => therapist.specialty?.trim().toLowerCase())
      .filter(Boolean)
  ).size;

  // OPEN ADD MODAL
  const openAddModal = () => {
    setEditingTherapist(null);

    setForm({
      name: '',
      specialty: '',
      contact: '',
    });

    setError('');
    setSuccess('');
    setModalOpen(true);
  };

  // OPEN EDIT MODAL
  const openEditModal = (therapist) => {
    setEditingTherapist(therapist);

    setForm({
      name: therapist.name || '',
      specialty: therapist.specialty || '',
      contact: therapist.contact || '',
    });

    setError('');
    setSuccess('');
    setModalOpen(true);
  };

  // FORM INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ADD OR UPDATE FIREBASE RECORD
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.specialty.trim() ||
      !form.contact.trim()
    ) {
      setError('Please complete all fields.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    const therapistData = {
      name: form.name.trim(),
      specialty: form.specialty.trim(),
      contact: form.contact.trim(),
      updatedAt: serverTimestamp(),
    };

    try {
      if (editingTherapist) {
        // UPDATE EXISTING THERAPIST
        await updateDoc(
          doc(db, 'therapists', editingTherapist.id),
          therapistData
        );

        setSuccess('Therapist updated successfully.');
      } else {
        // ADD NEW THERAPIST
        await addDoc(collection(db, 'therapists'), {
          ...therapistData,
          createdAt: serverTimestamp(),
        });

        setSuccess('New therapist added successfully.');
      }

      setModalOpen(false);

      setForm({
        name: '',
        specialty: '',
        contact: '',
      });

      setEditingTherapist(null);
    } catch (err) {
      console.error('Therapist save error:', err);
      setError('Unable to save therapist. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // DELETE THERAPIST
  const deleteTherapist = async (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${name}?`
    );

    if (!confirmed) return;

    setError('');
    setSuccess('');

    try {
      await deleteDoc(doc(db, 'therapists', id));

      setSuccess(`${name} was deleted successfully.`);
    } catch (err) {
      console.error('Delete therapist error:', err);
      setError('Unable to delete therapist. Please try again.');
    }
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingTherapist(null);
    setError('');

    setForm({
      name: '',
      specialty: '',
      contact: '',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="min-w-0 w-full px-4 py-6 sm:px-6 lg:ml-60 lg:w-[calc(100%-15rem)] lg:px-8 lg:py-9">
        <div className="mx-auto max-w-7xl space-y-7">

          {/* HEADER */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-purple-600">
                <Stethoscope size={17} />
                Staff Management

                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                <span className="text-xs font-medium text-emerald-600">
                  Live Firebase
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Manage Therapists
              </h1>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                Manage therapist profiles, specialties and contact information.
              </p>
            </div>

            <button
              onClick={openAddModal}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 sm:w-auto"
            >
              <Plus size={19} />
              Add New Therapist
            </button>
          </div>

          {/* SUCCESS MESSAGE */}
          {success && (
            <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              <CheckCircle2 size={19} />
              <span>{success}</span>

              <button
                onClick={() => setSuccess('')}
                className="ml-auto"
                aria-label="Dismiss success message"
              >
                <X size={17} />
              </button>
            </div>
          )}

          {/* ERROR MESSAGE */}
          {error && !isModalOpen && (
            <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle size={19} />
              <span>{error}</span>

              <button
                onClick={() => setError('')}
                className="ml-auto"
                aria-label="Dismiss error message"
              >
                <X size={17} />
              </button>
            </div>
          )}

          {/* STATISTICS */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total Therapists
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-slate-900">
                    {therapists.length}
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Registered therapist profiles
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
                    Specialties
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-slate-900">
                    {specialtyCount}
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Different areas of practice
                  </p>
                </div>

                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <BriefcaseMedical size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* THERAPIST LIST */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* SEARCH HEADER */}
            <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Therapist Directory
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  View and manage all registered therapists.
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
                  placeholder="Search therapists..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
                />
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
                  Loading therapists from Firebase...
                </p>
              </div>
            )}

            {/* ERROR */}
            {!loading && error && therapists.length === 0 && (
              <div className="px-5 py-16 text-center">
                <AlertCircle
                  size={34}
                  className="mx-auto text-red-500"
                />

                <h3 className="mt-3 font-semibold text-slate-800">
                  Unable to load therapists
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Check your Firebase permissions and connection.
                </p>
              </div>
            )}

            {/* EMPTY STATE */}
            {!loading && !error && filteredTherapists.length === 0 && (
              <div className="px-5 py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <UserRound size={30} />
                </div>

                <h3 className="mt-4 text-lg font-semibold text-slate-800">
                  {search ? 'No matching therapists' : 'No therapists yet'}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  {search
                    ? 'Try searching with another name or specialty.'
                    : 'Add your first therapist to get started.'}
                </p>

                {!search && (
                  <button
                    onClick={openAddModal}
                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700"
                  >
                    <Plus size={17} />
                    Add Therapist
                  </button>
                )}
              </div>
            )}

            {/* DESKTOP TABLE */}
            {!loading && !error && filteredTherapists.length > 0 && (
              <>
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                          Therapist
                        </th>

                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                          Specialty
                        </th>

                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                          Contact
                        </th>

                        <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {filteredTherapists.map((therapist) => (
                        <tr
                          key={therapist.id}
                          className="transition hover:bg-purple-50/40"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 font-bold text-purple-700">
                                {(therapist.name || 'T')
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <span className="font-semibold text-slate-800">
                                {therapist.name}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span className="inline-flex rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                              {therapist.specialty}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-600">
                            {therapist.contact}
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => openEditModal(therapist)}
                                title="Edit therapist"
                                className="rounded-lg p-2 text-purple-600 transition hover:bg-purple-100"
                              >
                                <Pencil size={18} />
                              </button>

                              <button
                                onClick={() =>
                                  deleteTherapist(
                                    therapist.id,
                                    therapist.name
                                  )
                                }
                                title="Delete therapist"
                                className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* MOBILE CARDS */}
                <div className="grid grid-cols-1 gap-3 p-4 md:hidden">
                  {filteredTherapists.map((therapist) => (
                    <div
                      key={therapist.id}
                      className="rounded-xl border border-slate-200 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-100 font-bold text-purple-700">
                            {(therapist.name || 'T')
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <h3 className="break-words font-bold text-slate-900">
                              {therapist.name}
                            </h3>

                            <p className="mt-1 text-xs text-purple-600">
                              {therapist.specialty}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 gap-1">
                          <button
                            onClick={() => openEditModal(therapist)}
                            className="rounded-lg p-2 text-purple-600 hover:bg-purple-50"
                            aria-label="Edit therapist"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            onClick={() =>
                              deleteTherapist(
                                therapist.id,
                                therapist.name
                              )
                            }
                            className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                            aria-label="Delete therapist"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 text-sm text-slate-600">
                        <Phone size={16} className="shrink-0 text-slate-400" />
                        {therapist.contact}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* FOOTER */}
            {!loading && !error && filteredTherapists.length > 0 && (
              <div className="border-t border-slate-100 bg-slate-50 px-4 py-4 sm:px-6">
                <p className="text-center text-xs text-slate-500 sm:text-left">
                  Showing {filteredTherapists.length} of {therapists.length} therapists
                </p>
              </div>
            )}
          </section>

          <p className="text-center text-xs text-slate-400">
            Therapist Management · Firebase Database
          </p>
        </div>
      </main>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="my-auto w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingTherapist
                    ? 'Edit Therapist'
                    : 'Add New Therapist'}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter the therapist's information below.
                </p>
              </div>

              <button
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40"
                aria-label="Close modal"
              >
                <X size={21} />
              </button>
            </div>

            {/* MODAL FORM */}
            <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Therapist Name
                </label>

                <div className="relative">
                  <UserRound
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Dr. Chikondi M."
                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                    required
                    disabled={saving}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="specialty"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Specialty
                </label>

                <div className="relative">
                  <BriefcaseMedical
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="specialty"
                    name="specialty"
                    type="text"
                    value={form.specialty}
                    onChange={handleChange}
                    placeholder="e.g. Stress Management"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                    required
                    disabled={saving}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Contact Number
                </label>

                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="contact"
                    name="contact"
                    type="tel"
                    value={form.contact}
                    onChange={handleChange}
                    placeholder="+265 999 123 456"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                    required
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      {editingTherapist ? (
                        <Pencil size={17} />
                      ) : (
                        <Plus size={18} />
                      )}

                      {editingTherapist
                        ? 'Save Changes'
                        : 'Add Therapist'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
