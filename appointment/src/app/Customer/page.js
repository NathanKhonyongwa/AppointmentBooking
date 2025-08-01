'use client';

import { useState } from 'react';
import Navbar from '../Customer/Navbar/page';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

export default function CustomerDashboard() {
  const [form, setForm] = useState({
    therapist: '',
    date: '',
    time: '',
    type: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.therapist) errs.therapist = 'Please select a therapist';
    if (!form.date) errs.date = 'Please select a date';
    if (!form.time) errs.time = 'Please select a time';
    if (!form.type) errs.type = 'Please select session type';
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitted(false);
      return;
    }
    // TODO: Replace console.log with API call
    console.log('Booking:', form);
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-10 space-y-8">
          <h1 className="flex items-center gap-3 text-3xl font-extrabold text-purple-700">
            <PencilSquareIcon className="w-8 h-8" />
            Book a Therapy Session
          </h1>

          {/* Step Indicator */}
          <div className="flex justify-between items-center">
            {['Therapist', 'Date', 'Time', 'Type'].map((step, idx) => (
              <div key={step} className="flex flex-col items-center text-gray-500">
                <div className="w-8 h-8 rounded-full border-2 border-purple-400 flex items-center justify-center text-purple-600 font-bold select-none">
                  {idx + 1}
                </div>
                <span className="mt-2 text-sm font-semibold">{step}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Therapist */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1" htmlFor="therapist">
                Select Therapist
              </label>
              <select
                id="therapist"
                name="therapist"
                value={form.therapist}
                onChange={handleChange}
                className={`w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-400 transition ${
                  errors.therapist ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">-- Choose a Therapist --</option>
                <option value="Therapist A">Therapist A</option>
                <option value="Therapist B">Therapist B</option>
                <option value="Therapist C">Therapist C</option>
              </select>
              {errors.therapist && <p className="text-red-500 mt-1 text-sm">{errors.therapist}</p>}
            </div>

            {/* Date */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1" htmlFor="date">
                Choose Date
              </label>
              <input
                id="date"
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className={`w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-400 transition ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.date && <p className="text-red-500 mt-1 text-sm">{errors.date}</p>}
            </div>

            {/* Time */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1" htmlFor="time">
                Choose Time
              </label>
              <input
                id="time"
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                className={`w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-400 transition ${
                  errors.time ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.time && <p className="text-red-500 mt-1 text-sm">{errors.time}</p>}
            </div>

            {/* Session Type */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1" htmlFor="type">
                Session Type
              </label>
              <select
                id="type"
                name="type"
                value={form.type}
                onChange={handleChange}
                className={`w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-400 transition ${
                  errors.type ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">-- Select Type --</option>
                <option value="In-Person">In-Person</option>
                <option value="Virtual">Virtual</option>
              </select>
              {errors.type && <p className="text-red-500 mt-1 text-sm">{errors.type}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Book Appointment
            </button>
          </form>

          {submitted && (
            <div className="mt-6 p-4 rounded-lg bg-green-100 text-green-800 font-semibold text-center animate-fadeIn">
              🎉 Your appointment has been successfully booked!
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in forwards;
        }
      `}</style>
    </>
  );
}
