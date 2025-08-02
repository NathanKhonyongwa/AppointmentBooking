'use client';

import { useState } from 'react';
import Navbar from '../../Customer/Navbar/page';
import { PencilSquareIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { motion } from 'framer-motion';

export default function CustomerDashboard() {
  const [form, setForm] = useState({
    therapist: '',
    date: null,
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

    const formattedDate = form.date.toISOString().split('T')[0];
    console.log({ ...form, date: formattedDate });
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-white-50 white-100 pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex justify-center">
        <motion.div
          className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl p-10 grid grid-cols-1 md:grid-cols-2 gap-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Left Side: Title and Stepper */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <PencilSquareIcon className="w-8 h-8 text-purple-700" />
              <h1 className="text-3xl font-extrabold text-purple-700">
                Book a Therapy Session
              </h1>
            </div>
            <div className="space-y-6">
              {['Therapist', 'Date', 'Time', 'Type'].map((step, idx) => (
                <div key={step} className="flex items-center gap-4">
                  <div
                    className={`w-9 h-9 flex items-center justify-center rounded-full font-bold text-white ${
                      form[step.toLowerCase()] ? 'bg-green-500' : 'bg-purple-400'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span className="text-gray-700 font-medium">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Therapist */}
            <div>
              <label htmlFor="therapist" className="block text-gray-700 font-semibold mb-1">
                Therapist
              </label>
              <select
                id="therapist"
                name="therapist"
                value={form.therapist}
                onChange={handleChange}
                className={`w-full border rounded-xl px-4 py-3 text-base transition focus:ring-4 focus:ring-purple-300 focus:outline-none ${
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
              <label htmlFor="date" className="block text-gray-700 font-semibold mb-1">
                Date
              </label>
              <DatePicker
                selected={form.date}
                onChange={handleDateChange}
                minDate={new Date()}
                placeholderText="Select a date"
                dateFormat="MMMM d, yyyy"
                className={`w-full border rounded-xl px-4 py-3 text-base transition focus:ring-4 focus:ring-purple-300 focus:outline-none ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.date && <p className="text-red-500 mt-1 text-sm">{errors.date}</p>}
            </div>

            {/* Time */}
            <div>
              <label htmlFor="time" className="block text-gray-700 font-semibold mb-1">
                Time
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                className={`w-full border rounded-xl px-4 py-3 text-base transition focus:ring-4 focus:ring-purple-300 focus:outline-none ${
                  errors.time ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.time && <p className="text-red-500 mt-1 text-sm">{errors.time}</p>}
            </div>

            {/* Session Type */}
            <div>
              <label htmlFor="type" className="block text-gray-700 font-semibold mb-1">
                Session Type
              </label>
              <select
                id="type"
                name="type"
                value={form.type}
                onChange={handleChange}
                className={`w-full border rounded-xl px-4 py-3 text-base transition focus:ring-4 focus:ring-purple-300 focus:outline-none ${
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
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl shadow-lg transition"
            >
              Book Appointment
            </button>

            {submitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 mt-4 p-4 rounded-xl bg-green-100 text-green-700 shadow"
              >
                <CheckCircleIcon className="w-6 h-6" />
                <span className="font-semibold">Your appointment has been successfully booked!</span>
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </>
  );
}
