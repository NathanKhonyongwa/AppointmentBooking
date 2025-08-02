'use client';

import { useState } from 'react';
import Navbar from '../Navbar/page';
import { CheckCircle, XCircle } from 'lucide-react';

export default function AdminSettings() {
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@example.com',
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [isConsented, setIsConsented] = useState(false);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    alert('Profile saved!');
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    alert('Password changed!');
    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleToggleNotifications = () => {
    setEmailNotifications((prev) => !prev);
  };

  const handleToggleConsented = () => {
    setIsConsented((prev) => !prev);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-white to-purple-50 p-8 mr-60 max-w-4xl mx-auto font-sans">
        <h1 className="text-3xl font-bold text-purple-800 mb-10 text-center tracking-wide">
          Admin Settings
        </h1>

        {/* Profile Section */}
        <section className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-purple-200">
          <h2 className="text-xl font-bold text-purple-700 mb-4 border-b border-purple-200 pb-2">
            Profile Information
          </h2>
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div>
              <label className="block mb-1 font-medium text-gray-800 text-sm" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                className="w-full border border-purple-300 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-800 text-sm" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleProfileChange}
                className="w-full border border-purple-300 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-purple-700 hover:bg-purple-800 text-white font-semibold px-6 py-2 rounded-full shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 text-sm"
            >
              Save Profile
              <CheckCircle className="w-4 h-4" />
            </button>
          </form>
        </section>

        {/* Password Section */}
        <section className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-purple-200">
          <h2 className="text-xl font-bold text-purple-700 mb-4 border-b border-purple-200 pb-2">
            Change Password
          </h2>
          <form onSubmit={handleSavePassword} className="space-y-6">
            <div>
              <label className="block mb-1 font-medium text-gray-800 text-sm" htmlFor="oldPassword">
                Current Password
              </label>
              <input
                id="oldPassword"
                name="oldPassword"
                type="password"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                className="w-full border border-purple-300 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
                autoComplete="current-password"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-800 text-sm" htmlFor="newPassword">
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full border border-purple-300 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
                autoComplete="new-password"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-800 text-sm" htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full border border-purple-300 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="bg-purple-700 hover:bg-purple-800 text-white font-semibold px-6 py-2 rounded-full shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 text-sm"
            >
              Change Password
              <CheckCircle className="w-4 h-4" />
            </button>
          </form>
        </section>

        {/* Notification & Consent Section */}
        <section className="bg-white rounded-3xl shadow-lg p-8 border border-purple-200">
          <h2 className="text-xl font-semibold text-purple-700 mb-4 border-b border-purple-200 pb-2">
            Preferences
          </h2>

          <div className="flex flex-col md:flex-row gap-8 md:gap-16">
            {/* Email Notifications */}
            <ToggleSwitch
              label="Email Notifications"
              enabled={emailNotifications}
              onToggle={handleToggleNotifications}
              textClass="text-sm"
            />

            {/* Is Consented */}
            <ToggleSwitch
              label="Is Consented"
              enabled={isConsented}
              onToggle={handleToggleConsented}
              trueIcon={<CheckCircle className="w-5 h-5 text-green-600" />}
              falseIcon={<XCircle className="w-5 h-5 text-red-600" />}
              textClass="text-sm"
            />
          </div>
        </section>
      </main>
    </>
  );
}

function ToggleSwitch({ label, enabled, onToggle, trueIcon = null, falseIcon = null, textClass = '' }) {
  return (
    <div className="flex items-center space-x-2 cursor-pointer select-none" onClick={onToggle}>
      <div
        className={`relative inline-flex h-7 w-12 rounded-full transition-colors duration-300 ${
          enabled ? 'bg-purple-600' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out ${
            enabled ? 'translate-x-5' : 'translate-x-1'
          }`}
        />
      </div>
      <span className={`font-medium text-gray-800 flex items-center gap-1 ${textClass}`}>
        {label} {enabled ? trueIcon : falseIcon}
      </span>
    </div>
  );
}
