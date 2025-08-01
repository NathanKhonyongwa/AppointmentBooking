'use client';
import { useState, useEffect } from 'react';
import Navbar from '../Admin/Navbar/page'; // Adjust if needed

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
    <div className="min-h-screen bg-gray-100 font-poppins flex flex-col md:flex-row p-4 md:p-8">
      <div className="w-full md:w-64 flex-shrink-0 mb-4 md:mb-0">
        <Navbar />
      </div>

      <main className="flex-1 p-2 md:p-8 overflow-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6 md:mb-8">Admin Dashboard</h2>

        {/* Overview Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md">
            <h3 className="text-base md:text-lg font-medium text-gray-700 mb-2">Upcoming Appointments</h3>
            <p className="text-2xl md:text-3xl font-bold text-purple-600">{appointments.length}</p>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md">
            <h3 className="text-base md:text-lg font-medium text-gray-700 mb-2">Therapists</h3>
            <p className="text-2xl md:text-3xl font-bold text-purple-600">{therapists.length}</p>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md">
            <h3 className="text-base md:text-lg font-medium text-gray-700 mb-2">Clients</h3>
            <p className="text-2xl md:text-3xl font-bold text-purple-600">{clients.length}</p>
          </div>
        </section>

        {/* Appointments Table */}
        <section className="bg-white rounded-2xl shadow-md p-4 md:p-6 overflow-x-auto">
          <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">Upcoming Appointments</h3>
          <table className="min-w-full text-left border-collapse text-sm md:text-base">
            <thead>
              <tr className="border-b border-gray-200 text-gray-600">
                <th className="py-2 px-3 md:py-3 md:px-4">Client</th>
                <th className="py-2 px-3 md:py-3 md:px-4">Therapist</th>
                <th className="py-2 px-3 md:py-3 md:px-4">Date &amp; Time</th>
                <th className="py-2 px-3 md:py-3 md:px-4">Status</th>
                <th className="py-2 px-3 md:py-3 md:px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(({ id, client, therapist, date, status }) => (
                <tr key={id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-3 md:py-3 md:px-4">{client}</td>
                  <td className="py-2 px-3 md:py-3 md:px-4">{therapist}</td>
                  <td className="py-2 px-3 md:py-3 md:px-4">{date}</td>
                  <td
                    className={`py-2 px-3 md:py-3 md:px-4 font-semibold ${
                      status === 'Confirmed'
                        ? 'text-green-600'
                        : status === 'Pending'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {status}
                  </td>
                  <td className="py-2 px-3 md:py-3 md:px-4 space-x-2">
                    <button className="text-blue-600 hover:underline">Edit</button>
                    <button className="text-red-600 hover:underline">Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Therapists list */}
        <section className="mt-6 md:mt-12 bg-white rounded-2xl shadow-md p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">Therapists</h3>
          <ul className="divide-y divide-gray-200">
            {therapists.map(({ id, name, specialty, email }) => (
              <li key={id} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <p className="font-semibold text-gray-900">{name}</p>
                  <p className="text-sm text-gray-600">{specialty}</p>
                  <p className="text-xs text-gray-400">{email}</p>
                </div>
                <button className="mt-3 sm:mt-0 text-purple-600 hover:underline">Edit</button>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
