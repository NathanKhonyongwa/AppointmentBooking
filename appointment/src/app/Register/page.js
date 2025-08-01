'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your registration logic here: validation, API calls, etc.
    alert('Registration form submitted!');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-16">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 font-poppins">
        <h2 className="text-center text-purple-600 text-2xl font-semibold mb-6">
          Register Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-800 text-sm mb-1" htmlFor="name">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
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
          <div>
            <label className="block text-gray-800 text-sm mb-1" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-lg transition-shadow shadow-md hover:shadow-lg"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-700">
          Already have an account?{' '}
          <Link href="/" className="text-purple-600 underline hover:text-purple-800">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
