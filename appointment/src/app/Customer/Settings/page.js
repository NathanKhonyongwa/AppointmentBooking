'use client';

import { useState } from 'react';
import Navbar from '../Navbar/page'; // Adjust path
import { Switch } from '@headlessui/react';
import { PencilIcon } from '@heroicons/react/24/outline';

export default function CustomerSettings() {
  const [profile, setProfile] = useState({
    fullName: 'John Doe',
    email: 'johndoe@example.com',
    phone: '+265999000111',
    receiveNotifications: true,
    receiveReminders: true,
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleToggle = (field) =>
    setProfile((prev) => ({ ...prev, [field]: !prev[field] }));

  return (
    <>
      <Navbar />

      <main className="pt-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
        <h1 className="text-3xl font-normal text-purple-700 mb-8">Settings</h1>

        {/* Profile Section */}
        <section className="bg-white rounded-2xl shadow p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-700 mb-4">Profile Information</h2>
          <div className="flex items-center gap-4 mb-4">
            <img
              src="https://via.placeholder.com/80"
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
            <button className="px-3 py-2 text-sm text-purple-600 border border-purple-300 rounded hover:bg-purple-100">
              <PencilIcon className="h-4 w-4 inline-block mr-1" />
              Change Photo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Full Name</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="mt-1 w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="mt-1 w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Phone</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="mt-1 w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
              />
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="bg-white rounded-2xl shadow p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-700 mb-4">Notifications</h2>
          <div className="space-y-4">
            <ToggleSwitch
              label="Receive Booking Notifications"
              enabled={profile.receiveNotifications}
              onToggle={() => handleToggle('receiveNotifications')}
            />
            <ToggleSwitch
              label="Receive Appointment Reminders"
              enabled={profile.receiveReminders}
              onToggle={() => handleToggle('receiveReminders')}
            />
          </div>
        </section>

        {/* Password Section */}
        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-medium text-gray-700 mb-4">Change Password</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Current Password</label>
              <input
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                className="mt-1 w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">New Password</label>
              <input
                type="password"
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                className="mt-1 w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Confirm New Password</label>
              <input
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                className="mt-1 w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function ToggleSwitch({ label, enabled, onToggle }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-700">{label}</span>
      <Switch
        checked={enabled}
        onChange={onToggle}
        className={`${
          enabled ? 'bg-purple-600' : 'bg-gray-300'
        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
      >
        <span
          className={`${
            enabled ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform bg-white rounded-full transition-transform`}
        />
      </Switch>
    </div>
  );
}
