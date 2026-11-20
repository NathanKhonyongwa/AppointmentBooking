
'use client';

import { useState } from 'react';
import Navbar from '../../Customer/Navbar/page';
import {
  CalendarDays,
  Clock3,
  HeartHandshake,
  CheckCircle2,
  UserRound,
  Video,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  ClipboardCheck,
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { motion } from 'framer-motion';
import { db } from '../../lib/firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';

const timeOptions = [];

for (let hour = 1; hour <= 12; hour++) {
  for (let minute = 0; minute < 60; minute += 30) {
    timeOptions.push(
      `${hour}:${minute.toString().padStart(2, '0')}`
    );
  }
}

const steps = [
  { label: 'Therapist', icon: UserRound },
  { label: 'Date', icon: CalendarDays },
  { label: 'Time', icon: Clock3 },
  { label: 'Session', icon: HeartHandshake },
];

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
  const [submitError, setSubmitError] = useState('');

  // Replace these with authenticated Firebase user details.
  const user = {
    email: 'nkhonyongwa@gmail.com',
    id: 'C6Z3ZKyFLdXTrFKsmciuFV6wvvJ3',
    name: 'Guest',
  };

  const validate = () => {
    const errs = {};

    if (!form.therapist) {
      errs.therapist = 'Please select a therapist.';
    }

    if (!form.date) {
      errs.date = 'Please select an appointment date.';
    }

    if (!form.time) {
      errs.time = 'Please select your preferred time.';
    }

    if (!form.type) {
      errs.type = 'Please choose a session type.';
    }

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));

    setSubmitted(false);
    setSubmitError('');
  };

  const handleDateChange = (date) => {
    setForm((prev) => ({
      ...prev,
      date,
    }));

    setErrors((prev) => ({
      ...prev,
      date: '',
    }));

    setSubmitted(false);
  };

  const completedSteps = [
    !!form.therapist,
    !!form.date,
    !!form.time,
    !!form.type,
  ].filter(Boolean).length;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitted(false);
      return;
    }

    setLoading(true);
    setSubmitError('');
    setSubmitted(false);

    try {
      const formattedDate = [
        form.date.getFullYear(),
        String(form.date.getMonth() + 1).padStart(2, '0'),
        String(form.date.getDate()).padStart(2, '0'),
      ].join('-');

      const formattedTime = `${form.time} ${form.period}`;

      await addDoc(collection(db, 'bookings'), {
        therapist: form.therapist,
        date: formattedDate,
        time: formattedTime,
        type: form.type,
        status: 'pending',
        createdAt: serverTimestamp(),
        userEmail: user.email,
        userId: user.id,
        userName: user.name,
      });

      setSubmitted(true);

      setForm({
        therapist: '',
        date: null,
        time: '',
        period: 'AM',
        type: '',
      });

      setErrors({});
    } catch (error) {
      console.error('Error saving booking:', error);
      setSubmitError(
        'We could not submit your booking. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100';

  return (
    <main className="min-h-screen bg-[#f7f7fc]">
      <Navbar />

      {/* PAGE HEADER */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-800 via-purple-700 to-indigo-800 px-5 pb-24 pt-32 sm:px-8 sm:pb-28">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-pink-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl text-center sm:text-left"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-purple-100 backdrop-blur">
              <Sparkles size={15} />
              YOUR WELLNESS JOURNEY
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
              Book Your Therapy
              <span className="block text-purple-200">
                Appointment
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-purple-100 sm:text-base sm:leading-8">
              Take the first step towards a healthier mind. Choose your
              therapist, select a convenient time and schedule your session.
            </p>
          </motion.div>
        </div>
      </section>

      {/* BOOKING CONTENT */}
      <section className="relative px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto -mt-12 grid max-w-7xl grid-cols-1 items-start gap-7 lg:grid-cols-[0.8fr_1.2fr]">

          {/* LEFT INFORMATION PANEL */}
          <motion.aside
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-purple-900/5"
          >
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 sm:p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-lg shadow-purple-200">
                <HeartHandshake size={28} />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-slate-900">
                Your wellbeing matters.
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                We are here to help you connect with the support you need.
                Complete the booking steps to request your appointment.
              </p>

              <div className="mt-8 rounded-2xl border border-purple-100 bg-white p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-slate-700">
                    Booking progress
                  </span>

                  <span className="text-sm font-bold text-purple-700">
                    {completedSteps}/4
                  </span>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-purple-100">
                  <motion.div
                    className="h-full rounded-full bg-purple-600"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(completedSteps / 4) * 100}%`,
                    }}
                    transition={{ duration: 0.4 }}
                  />
                </div>

                <div className="mt-6 space-y-5">
                  {steps.map((step, index) => {
                    const Icon = step.icon;

                    const completed = [
                      !!form.therapist,
                      !!form.date,
                      !!form.time,
                      !!form.type,
                    ][index];

                    return (
                      <div
                        key={step.label}
                        className="flex items-center gap-4"
                      >
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                            completed
                              ? 'bg-green-100 text-green-700'
                              : 'bg-purple-50 text-purple-600'
                          }`}
                        >
                          {completed ? (
                            <CheckCircle2 size={21} />
                          ) : (
                            <Icon size={21} />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-slate-400">
                            STEP {index + 1}
                          </p>

                          <p className="font-semibold text-slate-800">
                            {step.label}
                          </p>
                        </div>

                        {completed && (
                          <span className="text-xs font-semibold text-green-600">
                            Done
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-4 p-6 sm:p-8">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  className="mt-0.5 shrink-0 text-purple-600"
                  size={21}
                />

                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Your privacy matters
                  </h3>

                  <p className="mt-1 text-xs leading-6 text-slate-500">
                    Your appointment information should be handled
                    confidentially and securely.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CalendarDays
                  className="mt-0.5 shrink-0 text-purple-600"
                  size={21}
                />

                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Appointment requests
                  </h3>

                  <p className="mt-1 text-xs leading-6 text-slate-500">
                    Your booking will be submitted as pending until it is
                    reviewed and confirmed.
                  </p>
                </div>
              </div>
            </div>
          </motion.aside>

          {/* RIGHT BOOKING FORM */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="rounded-3xl border border-slate-100 bg-white p-5 shadow-xl shadow-purple-900/5 sm:p-8 md:p-10"
          >
            <div className="mb-8 border-b border-slate-100 pb-6">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-purple-600">
                Appointment details
              </span>

              <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                Schedule a session
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Fill in the information below to request your appointment.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-7">

              {/* THERAPIST */}
              <div>
                <label
                  htmlFor="therapist"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
                >
                  <UserRound size={17} className="text-purple-600" />
                  Select Therapist
                </label>

                <select
                  id="therapist"
                  name="therapist"
                  value={form.therapist}
                  onChange={handleChange}
                  className={`${inputClass} ${
                    errors.therapist ? 'border-red-400' : ''
                  }`}
                >
                  <option value="">Choose your therapist</option>
                  <option value="Therapist Alinane Shamu">
                    Therapist Alinane Shamu
                  </option>
                </select>

                {errors.therapist && (
                  <p className="mt-2 flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle size={14} />
                    {errors.therapist}
                  </p>
                )}
              </div>

              {/* DATE */}
              <div>
                <label
                  htmlFor="appointment-date"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
                >
                  <CalendarDays size={17} className="text-purple-600" />
                  Appointment Date
                </label>

                <DatePicker
                  id="appointment-date"
                  selected={form.date}
                  onChange={handleDateChange}
                  minDate={new Date()}
                  placeholderText="Choose your appointment date"
                  dateFormat="MMMM d, yyyy"
                  className={`${inputClass} ${
                    errors.date ? 'border-red-400' : ''
                  }`}
                  wrapperClassName="w-full"
                  calendarClassName="!rounded-2xl !border-0 !shadow-xl"
                  showPopperArrow={false}
                />

                {errors.date && (
                  <p className="mt-2 flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle size={14} />
                    {errors.date}
                  </p>
                )}
              </div>

              {/* TIME */}
              <div>
                <label
                  htmlFor="time"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
                >
                  <Clock3 size={17} className="text-purple-600" />
                  Preferred Time
                </label>

                <div className="grid grid-cols-[1fr_auto] gap-2 sm:gap-3">
                  <select
                    id="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    className={`${inputClass} min-w-0 ${
                      errors.time ? 'border-red-400' : ''
                    }`}
                  >
                    <option value="">Select a time</option>

                    {timeOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>

                  <div className="flex overflow-hidden rounded-xl border border-slate-200">
                    {['AM', 'PM'].map((period) => (
                      <button
                        key={period}
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            period,
                          }))
                        }
                        className={`min-w-12 px-3 text-sm font-bold transition sm:min-w-16 ${
                          form.period === period
                            ? 'bg-purple-600 text-white'
                            : 'bg-white text-slate-600 hover:bg-purple-50'
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>

                {errors.time && (
                  <p className="mt-2 flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle size={14} />
                    {errors.time}
                  </p>
                )}
              </div>

              {/* SESSION TYPE */}
              <div>
                <label className="mb-3 block text-sm font-semibold text-slate-700">
                  Choose Session Type
                </label>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({
                        ...prev,
                        type: 'In-Person',
                      }));
                      setErrors((prev) => ({
                        ...prev,
                        type: '',
                      }));
                    }}
                    className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                      form.type === 'In-Person'
                        ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-100'
                        : 'border-slate-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                      <MapPin size={22} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-800">
                        In-Person
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Face-to-face session
                      </p>
                    </div>

                    {form.type === 'In-Person' && (
                      <CheckCircle2
                        size={20}
                        className="shrink-0 text-purple-600"
                      />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({
                        ...prev,
                        type: 'Virtual',
                      }));
                      setErrors((prev) => ({
                        ...prev,
                        type: '',
                      }));
                    }}
                    className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                      form.type === 'Virtual'
                        ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-100'
                        : 'border-slate-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                      <Video size={22} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-800">
                        Virtual
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Online session
                      </p>
                    </div>

                    {form.type === 'Virtual' && (
                      <CheckCircle2
                        size={20}
                        className="shrink-0 text-purple-600"
                      />
                    )}
                  </button>
                </div>

                {errors.type && (
                  <p className="mt-2 flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle size={14} />
                    {errors.type}
                  </p>
                )}
              </div>

              {/* SUBMIT */}
              <div className="border-t border-slate-100 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-purple-600 px-6 py-4 font-bold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5 hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Submitting Request...
                    </>
                  ) : (
                    <>
                      Book Appointment
                      <ArrowRight size={19} />
                    </>
                  )}
                </button>

                <p className="mt-3 text-center text-xs leading-6 text-slate-400">
                  By submitting, you are requesting an appointment. Your
                  booking remains pending until approved.
                </p>
              </div>

              {/* SUCCESS MESSAGE */}
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4"
                >
                  <CheckCircle2
                    size={23}
                    className="shrink-0 text-green-600"
                  />

                  <div>
                    <p className="font-bold text-green-800">
                      Booking request submitted!
                    </p>

                    <p className="mt-1 text-sm leading-6 text-green-700">
                      Your appointment request has been saved successfully.
                      Please wait for confirmation from the administrator.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* ERROR MESSAGE */}
              {submitError && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <AlertCircle
                    size={20}
                    className="shrink-0"
                  />
                  <p>{submitError}</p>
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 bg-white px-5 py-8 text-center sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center gap-2">
            <HeartHandshake className="text-purple-600" size={22} />
            <span className="text-lg font-extrabold text-slate-800">
              CHMW
            </span>
          </div>

          <p className="mt-3 text-xs text-slate-500 sm:text-sm">
            Taking care of your mind is taking care of yourself.
          </p>

          <p className="mt-5 text-xs text-slate-400">
            © {new Date().getFullYear()} CHMW. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
