'use client';
import { useState, useEffect } from 'react';
import Navbar from '../Admin/Navbar/page'; // Adjust path if necessary
import { UserGroupIcon, CalendarIcon, UsersIcon } from '@heroicons/react/24/solid';

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    setAppointments([
      { id: 1, client: 'John Doe', therapist: 'Dr. Smith', date: '2025-08-05 10:00 AM', status: 'Confirmed' },
      { id: 2, client: 'Jane Roe', therapist: 'Dr. Lee', date: '2025-08-06 2:00 PM', status: 'Pending' },
      { id: 3, client: 'Alex Johnson', therapist: 'Dr. Brown', date: '2025-08-07 11:30 AM', status: 'Cancelled' },
    ]);
    setTherapists([
      { id: 1, name: 'Dr. Smith', specialty: 'Cognitive Therapy', email: 'smith@therapy.com' },
      { id: 2, name: 'Dr. Lee', specialty: 'Behavioral Therapy', email: 'lee@therapy.com' },
    ]);
    setClients([
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Roe', email: 'jane@example.com' },
      { id: 3, name: 'Alex Johnson', email: 'alex@example.com' },
    ]);
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen font-poppins flex">
      {/* Sidebar */}
      <Navbar />

      {/* Main Content */}
      <main className="ml-64 w-full p-6 md:p-10">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">Admin Dashboard</h2>

        {/* Overview Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Appointments</p>
                <p className="text-3xl font-bold text-purple-600">{appointments.length}</p>
              </div>
              <CalendarIcon className="w-10 h-10 text-purple-100 bg-purple-500 p-2 rounded-full group-hover:scale-105 transition" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Therapists</p>
                <p className="text-3xl font-bold text-purple-600">{therapists.length}</p>
              </div>
              <UserGroupIcon className="w-10 h-10 text-purple-100 bg-purple-500 p-2 rounded-full group-hover:scale-105 transition" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Clients</p>
                <p className="text-3xl font-bold text-purple-600">{clients.length}</p>
              </div>
              <UsersIcon className="w-10 h-10 text-purple-100 bg-purple-500 p-2 rounded-full group-hover:scale-105 transition" />
            </div>
          </div>
        </section>

        {/* Appointments Table */}
        <section className="bg-white p-6 rounded-2xl shadow mb-10">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Upcoming Appointments</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-gray-600">
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Therapist</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(({ id, client, therapist, date, status }) => (
                  <tr key={id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 px-4">{client}</td>
                    <td className="py-3 px-4">{therapist}</td>
                    <td className="py-3 px-4">{date}</td>
                    <td className={`py-3 px-4 font-semibold ${
                      status === 'Confirmed'
                        ? 'text-green-600'
                        : status === 'Pending'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}>
                      {status}
                    </td>
                    <td className="py-3 px-4 space-x-3">
                      <button className="text-sm text-blue-600 hover:underline">Edit</button>
                      <button className="text-sm text-red-600 hover:underline">Cancel</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Therapists List */}
        <section className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Therapists</h3>
          <ul className="divide-y divide-gray-200">
            {therapists.map(({ id, name, specialty, email }) => (
              <li key={id} className="py-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-900">{name}</p>
                  <p className="text-sm text-gray-600">{specialty}</p>
                  <p className="text-xs text-gray-400">{email}</p>
                </div>
                <button className="text-sm text-purple-600 hover:underline">Edit</button>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
