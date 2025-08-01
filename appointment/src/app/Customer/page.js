'use client';

import { useState } from 'react';
import Navbar from '../Customer/Navbar/page';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function CustomerDashboard() {
  const [form, setForm] = useState({
    therapist: '',
    date: null, // will hold a Date object
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

  // Handle date change for react-datepicker
  const handleDateChange = (date) => {
    setForm((prev) => ({ ...prev, date }));
    setErrors((prev) => ({ ...prev, date: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitted(false);
      return;
    }

    // Format the date for output or API (YYYY-MM-DD)
    const formattedDate = form.date.toISOString().split('T')[0];

    // TODO: Replace console.log with your API call
    console.log({
      ...form,
      date: formattedDate,
    });

    setSubmitted(true);
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="max-w-3xl w-full bg-white rounded-3xl shadow-lg p-10 space-y-10">
          <h1 className="flex items-center gap-3 text-3xl font-extrabold text-purple-700">
            <PencilSquareIcon className="w-8 h-8" />
            Book a Therapy Session
          </h1>

          {/* Step Indicator */}
          <div className="flex justify-between items-center">
            {['Therapist', 'Date', 'Time', 'Type'].map((step, idx) => (
              <div key={step} className="flex flex-col items-center text-gray-400">
                <div className="w-10 h-10 rounded-full border-2 border-purple-400 flex items-center justify-center text-purple-600 font-bold select-none text-lg">
                  {idx + 1}
                </div>
                <span className="mt-2 text-sm font-semibold">{step}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Therapist */}
            <div>
              <label
                className="block font-semibold text-gray-700 mb-2"
                htmlFor="therapist"
              >
                Select Therapist
              </label>
              <select
                id="therapist"
                name="therapist"
                value={form.therapist}
                onChange={handleChange}
                className={`w-full border rounded-xl p-4 text-lg focus:outline-none focus:ring-4 focus:ring-purple-400 transition
                  ${
                    errors.therapist ? 'border-red-500' : 'border-gray-300'
                  }`}
              >
                <option value="">-- Choose a Therapist --</option>
                <option value="Therapist A">Therapist A</option>
                <option value="Therapist B">Therapist B</option>
                <option value="Therapist C">Therapist C</option>
              </select>
              {errors.therapist && (
                <p className="text-red-500 mt-1 text-sm">{errors.therapist}</p>
              )}
            </div>

            {/* Date Picker */}
            <div>
              <label
                className="block font-semibold text-gray-700 mb-2"
                htmlFor="date"
              >
                Choose Date
              </label>
              <DatePicker
                id="date"
                selected={form.date}
                onChange={handleDateChange}
                minDate={new Date()}
                placeholderText="Select a date"
                className={`w-full border rounded-xl p-4 text-lg focus:outline-none focus:ring-4 focus:ring-purple-400 transition
                  ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                dateFormat="MMMM d, yyyy"
                calendarClassName="rounded-lg shadow-lg"
                showPopperArrow={false}
              />
              {errors.date && (
                <p className="text-red-500 mt-1 text-sm">{errors.date}</p>
              )}
            </div>

            {/* Time */}
            <div>
              <label
                className="block font-semibold text-gray-700 mb-2"
                htmlFor="time"
              >
                Choose Time
              </label>
              <input
                id="time"
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                className={`w-full border rounded-xl p-4 text-lg focus:outline-none focus:ring-4 focus:ring-purple-400 transition
                  ${
                    errors.time ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {errors.time && (
                <p className="text-red-500 mt-1 text-sm">{errors.time}</p>
              )}
            </div>

            {/* Session Type */}
            <div>
              <label
                className="block font-semibold text-gray-700 mb-2"
                htmlFor="type"
              >
                Session Type
              </label>
              <select
                id="type"
                name="type"
                value={form.type}
                onChange={handleChange}
                className={`w-full border rounded-xl p-4 text-lg focus:outline-none focus:ring-4 focus:ring-purple-400 transition
                  ${
                    errors.type ? 'border-red-500' : 'border-gray-300'
                  }`}
              >
                <option value="">-- Select Type --</option>
                <option value="In-Person">In-Person</option>
                <option value="Virtual">Virtual</option>
              </select>
              {errors.type && (
                <p className="text-red-500 mt-1 text-sm">{errors.type}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-4 rounded-2xl font-semibold hover:bg-purple-700 transition"
            >
              Book Appointment
            </button>
          </form>

          {submitted && (
            <div className="mt-6 p-5 rounded-xl bg-green-100 text-green-800 font-semibold text-center animate-fadeIn shadow-md">
              🎉 Your appointment has been successfully booked!
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in forwards;
        }
      `}</style>
    </>
  );
}
