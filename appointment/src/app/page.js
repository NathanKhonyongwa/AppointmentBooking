'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Login submitted!');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 font-poppins"
      >
        <h2 className="text-center text-purple-600 text-2xl font-semibold mb-6">
          Login to Your Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-800 text-sm mb-1" htmlFor="email">
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
            <label className="block text-gray-800 text-sm mb-1" htmlFor="password">
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
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-lg transition-shadow shadow-md hover:shadow-lg"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-700">
          Don't have an account?{' '}
          <Link href="/Register" className="text-purple-600 underline hover:text-purple-800">
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
