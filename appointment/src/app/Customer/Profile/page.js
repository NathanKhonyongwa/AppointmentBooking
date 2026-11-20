
'use client';

import { useState, useEffect } from 'react';
import Navbar from '../Navbar/page';

import {
  User,
  Mail,
  Phone,
  CalendarDays,
  UserCheck,
  Camera,
  Pencil,
  Save,
  X,
  Clock,
  ClipboardList,
  ShieldCheck,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

import { motion } from 'framer-motion';

import {
  getAuth,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';

import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from '../../lib/firebase';

const EMPTY_PROFILE = {
  fullName: '',
  phone: '',
  dateOfBirth: '',
  profileImage: '',
};

function formatDate(value) {
  if (!value) return 'Not provided';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return 'Not provided';

  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function ProfileItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:border-purple-200 hover:bg-purple-50/50">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
        <Icon size={21} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-slate-800 sm:text-base">
          {value || 'Not provided'}
        </p>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-emerald-100 text-emerald-600',
    blue: 'bg-blue-100 text-blue-600',
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${colors[color]}`}>
          <Icon size={21} />
        </div>

        <span className="text-2xl font-bold text-slate-900">
          {value}
        </span>
      </div>

      <p className="mt-4 text-sm font-medium text-slate-500">
        {label}
      </p>
    </div>
  );
}

export default function CustomerProfile() {
  const [user, setUser] = useState(null);

  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [editData, setEditData] = useState(EMPTY_PROFILE);

  const [sessionCount, setSessionCount] = useState(0);
  const [therapist, setTherapist] = useState('Not assigned');
  const [membershipSince, setMembershipSince] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const [message, setMessage] = useState({
    type: '',
    text: '',
  });

  // Load authenticated customer
  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setLoading(false);
        return;
      }

      await loadCustomerData(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Fetch profile and booking information
  const loadCustomerData = async (currentUser) => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnapshot = await getDoc(userRef);

      const savedData = userSnapshot.exists()
        ? userSnapshot.data()
        : {};

      const customerData = {
        fullName:
          savedData.fullName ||
          currentUser.displayName ||
          '',
        phone:
          savedData.phone ||
          currentUser.phoneNumber ||
          '',
        dateOfBirth: savedData.dateOfBirth || '',
        profileImage:
          savedData.profileImage ||
          currentUser.photoURL ||
          '',
      };

      setProfile(customerData);
      setEditData(customerData);

      setMembershipSince(
        savedData.membershipSince ||
        currentUser.metadata?.creationTime ||
        ''
      );

      // Fetch customer bookings
      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('userId', '==', currentUser.uid)
      );

      const bookingSnapshot = await getDocs(bookingsQuery);

      const customerBookings = bookingSnapshot.docs.map((bookingDoc) => ({
        id: bookingDoc.id,
        ...bookingDoc.data(),
      }));

      setSessionCount(customerBookings.length);

      // Find the most recent assigned therapist
      const sortedBookings = customerBookings
        .filter((booking) => booking.therapist)
        .sort((a, b) => {
          return (b.date || '').localeCompare(a.date || '');
        });

      setTherapist(
        sortedBookings[0]?.therapist || 'Not assigned'
      );

    } catch (error) {
      console.error('Error loading customer profile:', error);

      setMessage({
        type: 'error',
        text: 'Unable to load your profile. Please refresh and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Save profile to Firebase
  const handleSave = async (e) => {
    e.preventDefault();

    if (!user) return;

    if (!editData.fullName.trim()) {
      setMessage({
        type: 'error',
        text: 'Please enter your full name.',
      });
      return;
    }

    if (editData.phone && !/^[+0-9\s()-]{7,20}$/.test(editData.phone)) {
      setMessage({
        type: 'error',
        text: 'Please enter a valid phone number.',
      });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const userRef = doc(db, 'users', user.uid);

      const updatedData = {
        fullName: editData.fullName.trim(),
        email: user.email || '',
        phone: editData.phone.trim(),
        dateOfBirth: editData.dateOfBirth,
        profileImage: editData.profileImage.trim(),
        membershipSince:
          membershipSince || user.metadata?.creationTime || '',
        updatedAt: serverTimestamp(),
      };

      // Save customer information
      await setDoc(userRef, updatedData, {
        merge: true,
      });

      // Update Firebase Authentication display name and photo
      await updateProfile(user, {
        displayName: updatedData.fullName,
        photoURL: updatedData.profileImage || null,
      });

      setProfile({
        fullName: updatedData.fullName,
        phone: updatedData.phone,
        dateOfBirth: updatedData.dateOfBirth,
        profileImage: updatedData.profileImage,
      });

      setEditing(false);

      setMessage({
        type: 'success',
        text: 'Your profile has been updated successfully!',
      });

    } catch (error) {
      console.error('Error saving profile:', error);

      setMessage({
        type: 'error',
        text: error.message || 'Unable to save your profile. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  const cancelEditing = () => {
    setEditData(profile);
    setEditing(false);
    setMessage({ type: '', text: '' });
  };

  // Loading screen
  if (loading) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-slate-50 px-4 pt-32">
          <div className="mx-auto max-w-5xl space-y-5 animate-pulse">
            <div className="h-12 w-64 rounded-xl bg-slate-200" />
            <div className="h-52 rounded-3xl bg-white" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="h-28 rounded-2xl bg-white" />
              <div className="h-28 rounded-2xl bg-white" />
              <div className="h-28 rounded-2xl bg-white" />
            </div>
          </div>
        </main>
      </>
    );
  }

  // Authentication check
  if (!user) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 pt-24">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
              <ShieldCheck size={30} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Login required
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Please log in to view and manage your customer profile.
            </p>

            <a
              href="/"
              className="mt-6 inline-flex rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
              Return to Home
            </a>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 px-4 pb-16 pt-28 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-6xl">

          {/* PAGE HEADING */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-purple-600">
              <Sparkles size={17} />
              CUSTOMER DASHBOARD
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              My Profile
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Manage your personal information and therapy account.
            </p>
          </motion.div>

          {/* NOTIFICATIONS */}
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 flex items-start gap-3 rounded-xl border p-4 text-sm ${
                message.type === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-red-200 bg-red-50 text-red-700'
              }`}
            >
              {message.type === 'success'
                ? <CheckCircle2 size={20} className="shrink-0" />
                : <AlertCircle size={20} className="shrink-0" />
              }

              <p>{message.text}</p>
            </motion.div>
          )}

          {/* PROFILE HEADER */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative mb-7 overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 via-purple-600 to-fuchsia-600 p-6 text-white shadow-xl sm:p-9"
          >
            <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border-[35px] border-white/10" />
            <div className="pointer-events-none absolute -bottom-24 right-1/3 h-52 w-52 rounded-full bg-white/5" />

            <div className="relative flex flex-col items-center gap-6 sm:flex-row">

              {/* PROFILE IMAGE */}
              <div className="relative shrink-0">
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt="Customer profile"
                    className="h-28 w-28 rounded-full border-4 border-white/70 object-cover shadow-lg sm:h-32 sm:w-32"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white/70 bg-white/20 text-4xl font-bold sm:h-32 sm:w-32">
                    {profile.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}

                <div className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-purple-600 bg-emerald-400 text-white">
                  <CheckCircle2 size={17} />
                </div>
              </div>

              {/* CUSTOMER DETAILS */}
              <div className="min-w-0 flex-1 text-center sm:text-left">
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                  <ShieldCheck size={14} />
                  Registered Customer
                </div>

                <h2 className="break-words text-2xl font-bold sm:text-3xl">
                  {profile.fullName || 'Complete your profile'}
                </h2>

                <p className="mt-2 break-all text-sm text-purple-100">
                  {user.email}
                </p>

                <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium">
                    Member since {formatDate(membershipSince)}
                  </span>
                </div>
              </div>

              {/* EDIT BUTTON */}
              {!editing && (
                <button
                  onClick={() => {
                    setEditData(profile);
                    setEditing(true);
                    setMessage({ type: '', text: '' });
                  }}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-purple-700 shadow-md transition hover:bg-purple-50"
                >
                  <Pencil size={17} />
                  Edit Profile
                </button>
              )}
            </div>
          </motion.section>

          {/* STATISTICS */}
          <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">

            <StatCard
              icon={ClipboardList}
              label="Total Bookings"
              value={sessionCount}
              color="purple"
            />

            <StatCard
              icon={UserCheck}
              label="Assigned Therapist"
              value={therapist === 'Not assigned' ? '—' : 'Assigned'}
              color="green"
            />

            <StatCard
              icon={CalendarDays}
              label="Membership"
              value={membershipSince ? 'Active' : 'New'}
              color="blue"
            />

          </div>

          {/* MAIN CONTENT */}
          <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-3">

            {/* PERSONAL INFORMATION */}
            <section className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                    Personal Information
                  </h3>

                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Your registered customer details.
                  </p>
                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                  <User size={22} />
                </div>
              </div>

              {editing ? (

                <form onSubmit={handleSave} className="space-y-5">

                  {/* FULL NAME */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Full Name
                    </label>

                    <div className="relative">
                      <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                      <input
                        type="text"
                        name="fullName"
                        value={editData.fullName}
                        onChange={handleChange}
                        required
                        maxLength={100}
                        placeholder="Enter your full name"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-800 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                      />
                    </div>
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                      <input
                        type="email"
                        value={user.email || ''}
                        disabled
                        className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 py-3 pl-12 pr-4 text-sm text-slate-500"
                      />
                    </div>

                    <p className="mt-1 text-xs text-slate-400">
                      Your email is managed through Firebase Authentication.
                    </p>
                  </div>

                  {/* PHONE */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Phone Number
                    </label>

                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                      <input
                        type="tel"
                        name="phone"
                        value={editData.phone}
                        onChange={handleChange}
                        placeholder="+265 ..."
                        maxLength={20}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-800 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                      />
                    </div>
                  </div>

                  {/* DATE OF BIRTH */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Date of Birth
                    </label>

                    <div className="relative">
                      <CalendarDays className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                      <input
                        type="date"
                        name="dateOfBirth"
                        value={editData.dateOfBirth}
                        onChange={handleChange}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-800 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                      />
                    </div>
                  </div>

                  {/* PROFILE IMAGE URL */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Profile Photo URL
                    </label>

                    <div className="relative">
                      <Camera className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                      <input
                        type="url"
                        name="profileImage"
                        value={editData.profileImage}
                        onChange={handleChange}
                        placeholder="https://example.com/photo.jpg"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-800 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                      />
                    </div>

                    <p className="mt-1 text-xs text-slate-400">
                      Enter a publicly accessible image URL.
                    </p>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

                    <button
                      type="button"
                      onClick={cancelEditing}
                      disabled={saving}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                    >
                      <X size={17} />
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          Save Changes
                        </>
                      )}
                    </button>

                  </div>

                </form>

              ) : (

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                  <ProfileItem
                    icon={User}
                    label="Full Name"
                    value={profile.fullName}
                  />

                  <ProfileItem
                    icon={Mail}
                    label="Email Address"
                    value={user.email}
                  />

                  <ProfileItem
                    icon={Phone}
                    label="Phone Number"
                    value={profile.phone}
                  />

                  <ProfileItem
                    icon={CalendarDays}
                    label="Date of Birth"
                    value={formatDate(profile.dateOfBirth)}
                  />

                  <ProfileItem
                    icon={CalendarDays}
                    label="Member Since"
                    value={formatDate(membershipSince)}
                  />

                  <ProfileItem
                    icon={UserCheck}
                    label="Total Sessions"
                    value={`${sessionCount} sessions`}
                  />

                </div>

              )}

            </section>

            {/* ACCOUNT INFORMATION */}
            <aside className="space-y-5">

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                    <ShieldCheck size={23} />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Account Status
                    </h3>

                    <p className="text-xs text-emerald-600 font-semibold">
                      Authenticated
                    </p>
                  </div>
                </div>

                <div className="my-5 border-t border-slate-100" />

                <div className="space-y-4 text-sm">

                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Account type</span>
                    <span className="font-semibold text-slate-800">
                      Customer
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Therapist</span>
                    <span className="max-w-[55%] break-words text-right font-semibold text-slate-800">
                      {therapist}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Total bookings</span>
                    <span className="font-semibold text-slate-800">
                      {sessionCount}
                    </span>
                  </div>

                </div>

              </div>

              {/* MEMBERSHIP CARD */}
              <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-purple-950 p-6 text-white shadow-lg">

                <Sparkles className="mb-5 text-purple-300" size={27} />

                <h3 className="text-lg font-bold">
                  Your Wellness Journey
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Your wellbeing matters. Keep track of your therapy sessions and stay committed to your personal growth.
                </p>

                <div className="mt-6 flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 p-3">
                  <Clock size={20} className="text-purple-300" />

                  <div>
                    <p className="text-xs text-slate-300">
                      Member since
                    </p>

                    <p className="text-sm font-semibold">
                      {formatDate(membershipSince)}
                    </p>
                  </div>
                </div>

              </div>

              {/* REFRESH */}
              <button
                onClick={() => loadCustomerData(user)}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <RefreshCw size={17} />
                Refresh Profile
              </button>

            </aside>

          </div>

          {/* FOOTER */}
          <div className="mt-10 text-center">
            <p className="text-xs text-slate-400">
              Your information is securely stored in your customer account.
            </p>
          </div>

        </div>
      </main>
    </>
  );
}
