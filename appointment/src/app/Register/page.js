'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    therapyReason: '',
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
    if (!form.phone.trim()) errs.phone = 'Phone number is required';
    if (!form.dob.trim()) errs.dob = 'Date of Birth is required';
    if (!form.therapyReason.trim()) errs.therapyReason = 'Please provide a reason';
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
    alert('Registration form submitted!');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center py-12">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-10 font-sans">
        <h2 className="text-center text-purple-700 text-3xl font-bold mb-4">
          Therapy Client Registration
        </h2>
        <p className="text-center text-gray-600 text-sm mb-6">
          Please complete the form below to book your first session.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={form.name}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-lg border ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              } bg-gray-50 p-3 focus:ring-2 focus:ring-purple-400`}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* Email and Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={form.email}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-lg border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } bg-gray-50 p-3 focus:ring-2 focus:ring-purple-400`}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={form.phone}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-lg border ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                } bg-gray-50 p-3 focus:ring-2 focus:ring-purple-400`}
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>
          </div>

          {/* Gender and Date of Birth */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                Gender (optional)
              </label>
              <select
                name="gender"
                id="gender"
                value={form.gender}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 focus:ring-2 focus:ring-purple-400"
              >
                <option value="">Select gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                id="dob"
                value={form.dob}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-lg border ${
                  errors.dob ? 'border-red-500' : 'border-gray-300'
                } bg-gray-50 p-3 focus:ring-2 focus:ring-purple-400`}
              />
              {errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}
            </div>
          </div>

          {/* Therapy Reason */}
          <div>
            <label
              htmlFor="therapyReason"
              className="block text-sm font-medium text-gray-700"
            >
              Reason for Therapy
            </label>
            <textarea
              name="therapyReason"
              id="therapyReason"
              rows="4"
              value={form.therapyReason}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-lg border ${
                errors.therapyReason ? 'border-red-500' : 'border-gray-300'
              } bg-gray-50 p-3 focus:ring-2 focus:ring-purple-400`}
              placeholder="Briefly describe what you're seeking help for..."
            ></textarea>
            {errors.therapyReason && (
              <p className="text-red-500 text-sm">{errors.therapyReason}</p>
            )}
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={form.password}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-lg border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } bg-gray-50 p-3 focus:ring-2 focus:ring-purple-400`}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-lg border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                } bg-gray-50 p-3 focus:ring-2 focus:ring-purple-400`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="acceptedTerms"
              name="acceptedTerms"
              checked={form.acceptedTerms}
              onChange={handleChange}
              className="mt-1 w-5 h-5 border-gray-300 focus:ring-2 focus:ring-purple-400"
            />
            <label htmlFor="acceptedTerms" className="text-sm text-gray-700">
              I agree to the{' '}
              <Link
                href="/Customer/Terms"
                className="text-purple-600 underline hover:text-purple-800"
                target="_blank"
              >
                Terms & Conditions
              </Link>
            </label>
          </div>
          {errors.acceptedTerms && (
            <p className="text-red-500 text-sm">{errors.acceptedTerms}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!form.acceptedTerms}
            className={`w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-lg shadow ${
              !form.acceptedTerms ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already registered?{' '}
          <Link href="/" className="text-purple-600 underline hover:text-purple-800">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
