'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    if (!form.password) errs.password = 'Password is required';
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = 'Passwords do not match';
    if (!form.acceptedTerms) errs.acceptedTerms = 'You must accept the terms';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // Your registration logic here (e.g., API call)
    alert('Registration form submitted!');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-16">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 font-poppins">
        <h2 className="text-center text-purple-600 text-2xl font-semibold mb-6">
          Register Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
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
              className={`w-full px-4 py-3 rounded-xl bg-gray-100 border ${
                errors.name ? 'border-red-500' : 'border-gray-200'
              } focus:outline-none focus:ring-2 focus:ring-purple-300`}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
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
              className={`w-full px-4 py-3 rounded-xl bg-gray-100 border ${
                errors.email ? 'border-red-500' : 'border-gray-200'
              } focus:outline-none focus:ring-2 focus:ring-purple-300`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              className="block text-gray-800 text-sm mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl bg-gray-100 border ${
                errors.password ? 'border-red-500' : 'border-gray-200'
              } focus:outline-none focus:ring-2 focus:ring-purple-300`}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              className="block text-gray-800 text-sm mb-1"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl bg-gray-100 border ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
              } focus:outline-none focus:ring-2 focus:ring-purple-300`}
              required
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="acceptedTerms"
              name="acceptedTerms"
              checked={form.acceptedTerms}
              onChange={handleChange}
              className={`w-5 h-5 rounded border-gray-300 focus:ring-2 focus:ring-purple-400 ${
                errors.acceptedTerms ? 'border-red-500' : ''
              }`}
            />
            <label
              htmlFor="acceptedTerms"
              className="text-gray-700 text-sm select-none"
            >
              I accept the{' '}
              <Link
                href="/Customer/Terms"
                className="text-purple-600 underline hover:text-purple-800"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms and Conditions
              </Link>
            </label>
          </div>
          {errors.acceptedTerms && (
            <p className="text-red-500 text-sm mt-1">{errors.acceptedTerms}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!form.acceptedTerms}
            className={`w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-lg transition-shadow shadow-md hover:shadow-lg ${
              !form.acceptedTerms ? 'opacity-50 cursor-not-allowed' : ''
            }`}
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
