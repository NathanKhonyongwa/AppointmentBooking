
'use client';

import { useState, useEffect, useMemo } from 'react';
import Navbar from '../Admin/Navbar/page';

import {
  CalendarIcon,
  UserGroupIcon,
  UsersIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/solid';

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import { motion } from 'framer-motion';

import {
  collection,
  onSnapshot,
  doc,
  updateDoc
} from 'firebase/firestore';

import { db } from '../lib/firebase';

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [clients, setClients] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState('');

  // REAL-TIME FIRESTORE DATA
  useEffect(() => {
    let loaded = {
      appointments: false,
      therapists: false,
      clients: false
    };

    const checkLoading = () => {
      if (Object.values(loaded).every(Boolean)) {
        setLoading(false);
      }
    };

    const handleError = (err) => {
      console.error('Dashboard Firestore error:', err);
      setError(err.message || 'Unable to load dashboard data.');
      setLoading(false);
    };

    const unsubscribeAppointments = onSnapshot(
      collection(db, 'appointments'),
      (snapshot) => {
        setAppointments(
          snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data()
          }))
        );

        loaded.appointments = true;
        checkLoading();
      },
      handleError
    );

    const unsubscribeTherapists = onSnapshot(
      collection(db, 'therapists'),
      (snapshot) => {
        setTherapists(
          snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data()
          }))
        );

        loaded.therapists = true;
        checkLoading();
      },
      handleError
    );

    const unsubscribeClients = onSnapshot(
      collection(db, 'clients'),
      (snapshot) => {
        setClients(
          snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data()
          }))
        );

        loaded.clients = true;
        checkLoading();
      },
      handleError
    );

    return () => {
      unsubscribeAppointments();
      unsubscribeTherapists();
      unsubscribeClients();
    };
  }, []);

  // CONVERT FIRESTORE DATE VALUES
  const getAppointmentDate = (value) => {
    if (!value) return null;

    if (value.toDate) return value.toDate();

    if (typeof value === 'string' || typeof value === 'number') {
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? null : date;
    }

    if (value instanceof Date) return value;

    return null;
  };

  const formatDate = (value) => {
    const date = getAppointmentDate(value);

    if (!date) return 'Date unavailable';

    return date.toLocaleString([], {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  // LIVE APPOINTMENT STATISTICS
  const confirmed = appointments.filter(
    (a) => a.status?.toLowerCase() === 'confirmed'
  ).length;

  const pending = appointments.filter(
    (a) => a.status?.toLowerCase() === 'pending'
  ).length;

  const cancelled = appointments.filter(
    (a) => a.status?.toLowerCase() === 'cancelled'
  ).length;

  // LAST 7 DAYS APPOINTMENT CHART
  const chartData = useMemo(() => {
    const today = new Date();
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - i);

      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const count = appointments.filter((a) => {
        const appointmentDate = getAppointmentDate(a.date);

        return (
          appointmentDate &&
          appointmentDate >= date &&
          appointmentDate < nextDay
        );
      }).length;

      days.push({
        name: date.toLocaleDateString('en', {
          weekday: 'short'
        }),
        appointments: count
      });
    }

    return days;
  }, [appointments]);

  // UPDATE APPOINTMENT STATUS
  const updateStatus = async (id, status) => {
    try {
      setUpdating(id);

      await updateDoc(doc(db, 'appointments', id), {
        status,
        updatedAt: new Date()
      });

    } catch (err) {
      console.error('Appointment update failed:', err);
      alert('Failed to update appointment. Please try again.');
    } finally {
      setUpdating('');
    }
  };

  const statistics = [
    {
      title: 'Total Appointments',
      count: appointments.length,
      icon: CalendarIcon,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Total Therapists',
      count: therapists.length,
      icon: UserGroupIcon,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Total Clients',
      count: clients.length,
      icon: UsersIcon,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Pending Appointments',
      count: pending,
      icon: ClockIcon,
      color: 'bg-yellow-100 text-yellow-600'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">

      <Navbar />

      {/* MAIN CONTENT */}
      <main className="min-w-0 w-full p-4 sm:p-6 lg:ml-64 lg:w-[calc(100%-16rem)]">

        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">

          <div>
            <p className="text-sm text-purple-600 font-semibold">
              MANAGEMENT OVERVIEW
            </p>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">
              Admin Dashboard
            </h1>

            <p className="text-sm text-slate-500 mt-2">
              Monitor your appointment booking activities.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-3 w-fit">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            Live Dashboard
          </div>

        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
              <ArrowPathIcon className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
              <p className="text-slate-500 mt-3">
                Loading dashboard data...
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* STATISTICS */}
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">

              {statistics.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="bg-white border border-slate-100 p-5 sm:p-6 rounded-2xl shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-center justify-between">

                      <div>
                        <p className="text-sm text-slate-500">
                          {item.title}
                        </p>

                        <h2 className="text-3xl font-bold text-slate-800 mt-3">
                          {item.count}
                        </h2>
                      </div>

                      <div className={`p-3 rounded-xl ${item.color}`}>
                        <Icon className="w-7 h-7" />
                      </div>

                    </div>
                  </motion.div>
                );
              })}

            </section>

            {/* APPOINTMENT STATUS */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

              <div className="bg-white rounded-xl border p-4 flex items-center gap-3">
                <CheckCircleIcon className="w-9 h-9 text-green-500" />
                <div>
                  <p className="text-sm text-slate-500">Confirmed</p>
                  <p className="text-xl font-bold">{confirmed}</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border p-4 flex items-center gap-3">
                <ClockIcon className="w-9 h-9 text-yellow-500" />
                <div>
                  <p className="text-sm text-slate-500">Pending</p>
                  <p className="text-xl font-bold">{pending}</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border p-4 flex items-center gap-3">
                <XCircleIcon className="w-9 h-9 text-red-500" />
                <div>
                  <p className="text-sm text-slate-500">Cancelled</p>
                  <p className="text-xl font-bold">{cancelled}</p>
                </div>
              </div>

            </section>

            {/* APPOINTMENT CHART */}
            <section className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm mb-8">

              <div className="mb-6">
                <h2 className="font-bold text-lg text-slate-800">
                  Appointment Trends
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Appointment activity over the last 7 days
                </p>
              </div>

              <div className="w-full h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>

                    <CartesianGrid
                      strokeDasharray="4 4"
                      stroke="#e2e8f0"
                    />

                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis allowDecimals={false} stroke="#94a3b8" />

                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey="appointments"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 7 }}
                    />

                  </LineChart>
                </ResponsiveContainer>
              </div>

            </section>

            {/* APPOINTMENTS TABLE */}
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-8">

              <div className="p-5 sm:p-6 border-b">
                <h2 className="font-bold text-lg text-slate-800">
                  Recent Appointments
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Live bookings from your clients
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">

                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-5 py-4">Client</th>
                      <th className="px-5 py-4">Therapist</th>
                      <th className="px-5 py-4">Date & Time</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {[...appointments]
                      .sort((a, b) => {
                        const dateA = getAppointmentDate(a.date)?.getTime() || 0;
                        const dateB = getAppointmentDate(b.date)?.getTime() || 0;
                        return dateB - dateA;
                      })
                      .slice(0, 10)
                      .map((appointment) => {

                        const status = appointment.status || 'Pending';

                        return (
                          <tr key={appointment.id} className="hover:bg-slate-50">

                            <td className="px-5 py-4 font-medium text-slate-800">
                              {appointment.clientName || appointment.client || 'Unknown'}
                            </td>

                            <td className="px-5 py-4 text-slate-600">
                              {appointment.therapistName || appointment.therapist || 'Unassigned'}
                            </td>

                            <td className="px-5 py-4 text-slate-600">
                              {formatDate(appointment.date)}
                            </td>

                            <td className="px-5 py-4">
                              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                                status.toLowerCase() === 'confirmed'
                                  ? 'bg-green-100 text-green-700'
                                  : status.toLowerCase() === 'cancelled'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {status}
                              </span>
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex gap-3">

                                {status.toLowerCase() !== 'confirmed' &&
                                 status.toLowerCase() !== 'cancelled' && (
                                  <button
                                    disabled={updating === appointment.id}
                                    onClick={() => updateStatus(appointment.id, 'Confirmed')}
                                    className="text-green-600 hover:text-green-800 font-semibold disabled:opacity-50"
                                  >
                                    Confirm
                                  </button>
                                )}

                                {status.toLowerCase() !== 'cancelled' && (
                                  <button
                                    disabled={updating === appointment.id}
                                    onClick={() => updateStatus(appointment.id, 'Cancelled')}
                                    className="text-red-500 hover:text-red-700 font-semibold disabled:opacity-50"
                                  >
                                    Cancel
                                  </button>
                                )}

                              </div>
                            </td>

                          </tr>
                        );
                      })}

                    {appointments.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center py-12 text-slate-400">
                          No appointments have been booked yet.
                        </td>
                      </tr>
                    )}

                  </tbody>
                </table>
              </div>

            </section>

            {/* THERAPISTS */}
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm">

              <div className="p-5 sm:p-6 border-b">
                <h2 className="font-bold text-lg text-slate-800">
                  Registered Therapists
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Your available therapy professionals
                </p>
              </div>

              <div className="divide-y divide-slate-100">

                {therapists.map((therapist) => (
                  <div
                    key={therapist.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                  >

                    <div className="flex items-center gap-3 min-w-0">

                      <div className="w-11 h-11 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold shrink-0">
                        {(therapist.name || 'T').charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800">
                          {therapist.name || 'Unnamed Therapist'}
                        </p>

                        <p className="text-sm text-slate-500">
                          {therapist.specialty || 'Specialty not specified'}
                        </p>

                        <p className="text-xs text-slate-400 break-all">
                          {therapist.email || 'No email provided'}
                        </p>
                      </div>

                    </div>

                    <span className="text-xs bg-green-50 text-green-700 px-3 py-2 rounded-full w-fit">
                      Registered
                    </span>

                  </div>
                ))}

                {therapists.length === 0 && (
                  <p className="p-8 text-center text-slate-400">
                    No therapists registered yet.
                  </p>
                )}

              </div>

            </section>

          </>
        )}

        <footer className="text-center text-xs text-slate-400 py-8">
          Appointment Management System
        </footer>

      </main>
    </div>
  );
}
