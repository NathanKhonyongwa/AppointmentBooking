'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from './lib/firebase';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  try {
    await signInWithEmailAndPassword(auth, form.email, form.password);

    if (form.email.toLowerCase() === 'admin@admin.com') {
      router.push('/Admin'); // Redirect to admin dashboard
    } else {
      router.push('/Customer'); // Redirect to customer dashboard
    }
  } catch (err) {
    setError('Invalid email or password');
  }
};


  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      <div className="hidden lg:flex w-full lg:w-1/2 items-center justify-center bg-purple-100">
        <img
          src="/1.jpg"
          alt="Therapy System Illustration"
          className="w-full h-full object-cover max-h-screen"
        />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8"
        >
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-purple-700 mb-1">CHMW Therapy System</h1>
          </div>

          <h2 className="text-center text-xl font-semibold text-gray-800 mb-4">
            Login to Your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <p className="text-red-600 text-center">{error}</p>}

            <div>
              <label htmlFor="email" className="block text-gray-800 text-sm mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-800 text-sm mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-lg transition duration-300 shadow-md hover:shadow-lg"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-700">
            Don&apos;t have an account?{' '}
            <Link href="/Register" className="text-purple-600 underline hover:text-purple-800">
              Register here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
