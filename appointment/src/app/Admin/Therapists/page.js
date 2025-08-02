'use client';

import { useState } from 'react';
import Navbar from '../Navbar/page';
import { PencilSquareIcon, TrashIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function TherapistPage() {
  // Sample initial data
  const [therapists, setTherapists] = useState([
    { id: 1, name: 'Dr. Chikondi M.', specialty: 'Stress Management', contact: '+265 999 123 456' },
    { id: 2, name: 'Dr. Rose Z.', specialty: 'Anxiety & Depression', contact: '+265 998 654 321' },
  ]);

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingTherapist, setEditingTherapist] = useState(null);
  const [form, setForm] = useState({ name: '', specialty: '', contact: '' });

  // Open modal for adding new therapist
  const openAddModal = () => {
    setEditingTherapist(null);
    setForm({ name: '', specialty: '', contact: '' });
    setModalOpen(true);
  };

  // Open modal for editing therapist
  const openEditModal = (therapist) => {
    setEditingTherapist(therapist);
    setForm({ name: therapist.name, specialty: therapist.specialty, contact: therapist.contact });
    setModalOpen(true);
  };

  // Delete therapist by id
  const deleteTherapist = (id) => {
    if (confirm('Are you sure you want to delete this therapist?')) {
      setTherapists(therapists.filter((t) => t.id !== id));
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit (add or edit)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.specialty.trim() || !form.contact.trim()) {
      alert('Please fill all fields');
      return;
    }

    if (editingTherapist) {
      // Edit existing therapist
      setTherapists((prev) =>
        prev.map((t) =>
          t.id === editingTherapist.id
            ? { ...t, name: form.name, specialty: form.specialty, contact: form.contact }
            : t
        )
      );
    } else {
      // Add new therapist
      const newTherapist = {
        id: Math.max(0, ...therapists.map((t) => t.id)) + 1,
        name: form.name,
        specialty: form.specialty,
        contact: form.contact,
      };
      setTherapists((prev) => [...prev, newTherapist]);
    }

    setModalOpen(false);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen p-8 ml-60 bg-gradient-to-br from-white to-purple-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">Manage Therapists</h2>

          <div className="flex justify-end mb-4">
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              <PlusIcon className="w-5 h-5" /> Add New Therapist
            </button>
          </div>

          {therapists.length === 0 ? (
            <p className="text-center text-gray-500">No therapists found.</p>
          ) : (
            <div className="overflow-x-auto bg-white rounded-xl shadow-md">
              <table className="min-w-full divide-y divide-purple-200">
                <thead className="bg-purple-100 text-purple-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Specialty</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Contact</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {therapists.map(({ id, name, specialty, contact }) => (
                    <tr key={id} className="hover:bg-purple-50">
                      <td className="px-6 py-4 whitespace-nowrap">{name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{specialty}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{contact}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center flex justify-center gap-4">
                        <button
                          onClick={() => openEditModal({ id, name, specialty, contact })}
                          className="text-purple-600 hover:text-purple-900"
                          aria-label={`Edit ${name}`}
                        >
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteTherapist(id)}
                          className="text-red-600 hover:text-red-900"
                          aria-label={`Delete ${name}`}
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Modal */}
          {isModalOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
              onClick={() => setModalOpen(false)}
            >
              <div
                className="bg-white rounded-2xl p-6 max-w-md w-full relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                  onClick={() => setModalOpen(false)}
                  aria-label="Close modal"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
                <h3 className="text-xl font-semibold mb-4 text-purple-700">
                  {editingTherapist ? 'Edit Therapist' : 'Add New Therapist'}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      required
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor="specialty"
                    >
                      Specialty
                    </label>
                    <input
                      id="specialty"
                      name="specialty"
                      type="text"
                      value={form.specialty}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="contact">
                      Contact
                    </label>
                    <input
                      id="contact"
                      name="contact"
                      type="text"
                      value={form.contact}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
                  >
                    {editingTherapist ? 'Save Changes' : 'Add Therapist'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
