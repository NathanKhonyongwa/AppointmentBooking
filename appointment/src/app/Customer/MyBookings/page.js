'use client';

import { useState } from 'react';
import Navbar from '../../Customer/Navbar/page';
import { PencilSquareIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { motion } from 'framer-motion';
import { db } from '../../lib/firebase'; // your firebase.js config file
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function CustomerDashboard() {
  const [form, setForm] = useState({
    therapist: '',
    date: null,
    time: '',
    period: 'AM',
    type: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitted(false);
      return;
    }

    setLoading(true);
    try {
      const formattedDate = form.date.toISOString().split('T')[0];
      const formattedTime = `${form.time} ${form.period}`;

      await addDoc(collection(db, 'bookings'), {
        therapist: form.therapist,
        date: formattedDate,
        time: formattedTime,
        type: form.type,
        status: 'pending',
        createdAt: serverTimestamp(),
        userEmail: 'nkhonyongwa@gmail.com', // replace with real logged-in user email
        userId: 'C6Z3ZKyFLdXTrFKsmciuFV6wvvJ3', // replace with real logged-in user UID
        userName: 'Guest', // replace with actual name if available
      });

      setSubmitted(true);
      setForm({
        therapist: '',
        date: null,
        time: '',
        period: 'AM',
        type: '',
      });
    } catch (error) {
      console.error('Error saving booking: ', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate time options
  const timeOptions = [];
  for (let hour = 1; hour <= 12; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      timeOptions.push(`${hour}:${minute.toString().padStart(2, '0')}`);
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex justify-center">
        <motion.div
          className="max-w-5xl w-full bg-white rounded-3xl shadow-xl p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Left Side: Title and Stepper */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <PencilSquareIcon className="w-6 h-6 text-purple-700" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Book Your Therapy Session
              </h1>
            </div>
            
            <div className="space-y-6 pl-2">
              {['Therapist', 'Date', 'Time', 'Type'].map((step, idx) => {
                const key = step.toLowerCase();
                const isCompleted = form[key];
                return (
                  <div key={step} className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full font-bold text-white mt-0.5 ${
                      isCompleted ? 'bg-green-500' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {idx + 1}
                    </div>
                    <div>
                      <span className={`block text-sm font-medium ${
                        isCompleted ? 'text-gray-500' : 'text-gray-700'
                      }`}>Step {idx + 1}</span>
                      <span className={`block ${
                        isCompleted ? 'text-gray-900 font-semibold' : 'text-gray-700'
                      }`}>{step}</span>
                      {isCompleted && <span className="block text-xs text-green-600 mt-1">Completed</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side: Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Therapist */}
            <div>
              <label htmlFor="therapist" className="block text-sm font-medium text-gray-700 mb-2">
                Select Therapist
              </label>
              <select
                id="therapist"
                name="therapist"
                value={form.therapist}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-3 text-base transition-all focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none ${
                  errors.therapist ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <option value="">Choose a Therapist</option>
                <option value="Therapist Alinane Shamu">Therapist Alinane Shamu</option>
              </select>
              {errors.therapist && <p className="text-red-500 mt-1 text-sm">{errors.therapist}</p>}
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Date
              </label>
              <DatePicker
                selected={form.date}
                onChange={handleDateChange}
                minDate={new Date()}
                placeholderText="Select a date"
                dateFormat="MMMM d, yyyy"
                className={`w-full border rounded-lg px-4 py-3 text-base transition-all focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none ${
                  errors.date ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                }`}
              />
              {errors.date && <p className="text-red-500 mt-1 text-sm">{errors.date}</p>}
            </div>

            {/* Time with AM/PM */}
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Time
              </label>
              <div className="flex gap-3">
                <select
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  className={`flex-1 border rounded-lg px-4 py-3 text-base transition-all focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none ${
                    errors.time ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <option value="">-- Select Time --</option>
                  {timeOptions.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
                <div className="flex">
                  {['AM', 'PM'].map(period => (
                    <button
                      key={period}
                      type="button"
                      onClick={() => setForm({...form, period})}
                      className={`px-4 py-3 border transition-all ${
                        form.period === period 
                          ? 'bg-purple-600 text-white border-purple-600' 
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      } ${
                        period === 'AM' ? 'rounded-l-lg border-r-0' : 'rounded-r-lg border-l-0'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              {errors.time && <p className="text-red-500 mt-1 text-sm">{errors.time}</p>}
            </div>

            {/* Session Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['In-Person', 'Virtual'].map((type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => setForm({ ...form, type })}
                    className={`py-3 px-4 rounded-lg border transition-all ${
                      form.type === type 
                        ? 'border-purple-500 bg-purple-50 text-purple-700 ring-1 ring-purple-500' 
                        : 'border-gray-300 hover:border-gray-400 text-gray-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              {errors.type && <p className="text-red-500 mt-1 text-sm">{errors.type}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all disabled:opacity-50"
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>

            {submitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-start gap-3 mt-4 p-4 rounded-lg bg-green-50 text-green-700 border border-green-200"
              >
                <CheckCircleIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold block">Appointment Confirmed!</span>
                </div>
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </>
  );
}
