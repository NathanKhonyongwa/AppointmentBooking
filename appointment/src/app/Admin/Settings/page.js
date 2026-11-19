
'use client';

import { useState } from 'react';
import Navbar from '../Navbar/page';

import {
  CheckCircle,
  XCircle,
  User,
  Lock,
  Bell,
  Settings,
  ShieldCheck
} from 'lucide-react';

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

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    setSavingProfile(true);

    try {
      // Connect profile saving to Firebase here.
      alert('Profile form submitted successfully.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword.length < 8) {
      alert('Your new password must contain at least 8 characters.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    setSavingPassword(true);

    try {
      // Connect Firebase Authentication password update here.
      alert('Connect Firebase password update to complete this action.');

      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-50">

      <Navbar />

      {/* MAIN CONTENT */}

      <main className="min-w-0 w-full px-4 py-6 sm:px-6 lg:ml-60 lg:w-[calc(100%-15rem)] lg:px-8 lg:py-10">

        <div className="max-w-4xl mx-auto">

          {/* PAGE HEADER */}

          <div className="mb-8 sm:mb-10">

            <div className="flex items-center gap-3 mb-3">

              <div className="bg-purple-100 p-3 rounded-xl">
                <Settings className="w-6 h-6 text-purple-700" />
              </div>

              <div>
                <p className="text-xs sm:text-sm font-semibold text-purple-600 uppercase tracking-wider">
                  Administration
                </p>

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Admin Settings
                </h1>
              </div>

            </div>

            <p className="text-sm text-gray-500">
              Manage your account, security and system preferences.
            </p>

          </div>

          {/* PROFILE SECTION */}

          <section className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-purple-100 p-5 sm:p-7 md:p-8 mb-6">

            <div className="flex items-center gap-3 border-b border-purple-100 pb-4 mb-6">

              <div className="bg-purple-100 p-3 rounded-xl">
                <User className="w-5 h-5 text-purple-700" />
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-bold text-purple-800">
                  Profile Information
                </h2>

                <p className="text-xs sm:text-sm text-gray-500">
                  Update your administrator details.
                </p>
              </div>

            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">

              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-semibold text-gray-700"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  placeholder="Enter your name"
                  className="w-full min-w-0 border border-gray-200 rounded-xl px-4 py-3 text-sm sm:text-base text-gray-800 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-semibold text-gray-700"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  placeholder="Enter your email"
                  className="w-full min-w-0 border border-gray-200 rounded-xl px-4 py-3 text-sm sm:text-base text-gray-800 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="w-full sm:w-auto bg-purple-700 hover:bg-purple-800 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm"
              >
                {savingProfile ? 'Saving...' : 'Save Profile'}
                <CheckCircle className="w-4 h-4" />
              </button>

            </form>

          </section>

          {/* PASSWORD SECTION */}

          <section className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-purple-100 p-5 sm:p-7 md:p-8 mb-6">

            <div className="flex items-center gap-3 border-b border-purple-100 pb-4 mb-6">

              <div className="bg-purple-100 p-3 rounded-xl">
                <Lock className="w-5 h-5 text-purple-700" />
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-bold text-purple-800">
                  Change Password
                </h2>

                <p className="text-xs sm:text-sm text-gray-500">
                  Keep your administrator account secure.
                </p>
              </div>

            </div>

            <form onSubmit={handleSavePassword} className="space-y-5">

              <div>
                <label
                  htmlFor="oldPassword"
                  className="block mb-2 text-sm font-semibold text-gray-700"
                >
                  Current Password
                </label>

                <input
                  id="oldPassword"
                  name="oldPassword"
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  autoComplete="current-password"
                  className="w-full min-w-0 border border-gray-200 rounded-xl px-4 py-3 text-sm sm:text-base outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block mb-2 text-sm font-semibold text-gray-700"
                >
                  New Password
                </label>

                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  autoComplete="new-password"
                  minLength={8}
                  className="w-full min-w-0 border border-gray-200 rounded-xl px-4 py-3 text-sm sm:text-base outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-sm font-semibold text-gray-700"
                >
                  Confirm New Password
                </label>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  autoComplete="new-password"
                  minLength={8}
                  className="w-full min-w-0 border border-gray-200 rounded-xl px-4 py-3 text-sm sm:text-base outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                  required
                />
              </div>

              <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0" />

                  <p className="text-xs sm:text-sm text-purple-800">
                    Use a strong password with at least 8 characters.
                    Never share your administrator credentials.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={savingPassword}
                className="w-full sm:w-auto bg-purple-700 hover:bg-purple-800 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm"
              >
                {savingPassword ? 'Updating...' : 'Change Password'}
                <Lock className="w-4 h-4" />
              </button>

            </form>

          </section>

          {/* PREFERENCES */}

          <section className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-purple-100 p-5 sm:p-7 md:p-8">

            <div className="flex items-center gap-3 border-b border-purple-100 pb-4 mb-6">

              <div className="bg-purple-100 p-3 rounded-xl">
                <Bell className="w-5 h-5 text-purple-700" />
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-bold text-purple-800">
                  Preferences
                </h2>

                <p className="text-xs sm:text-sm text-gray-500">
                  Manage your account preferences.
                </p>
              </div>

            </div>

            <div className="space-y-5">

              <ToggleSwitch
                label="Email Notifications"
                description="Receive email updates about appointments and activities."
                enabled={emailNotifications}
                onToggle={() => setEmailNotifications(prev => !prev)}
              />

              <div className="border-t border-gray-100" />

              <ToggleSwitch
                label="Consent"
                description="Manage your consent preference."
                enabled={isConsented}
                onToggle={() => setIsConsented(prev => !prev)}
                trueIcon={<CheckCircle className="w-4 h-4 text-green-600" />}
                falseIcon={<XCircle className="w-4 h-4 text-red-600" />}
              />

            </div>

          </section>

          <footer className="text-center text-xs text-gray-400 py-8">
            Admin Management System
          </footer>

        </div>

      </main>

    </div>
  );
}

// ==================================
// RESPONSIVE TOGGLE SWITCH
// ==================================

function ToggleSwitch({
  label,
  description,
  enabled,
  onToggle,
  trueIcon,
  falseIcon
}) {
  return (
    <div className="flex items-center justify-between gap-4">

      <div className="min-w-0">
        <p className="text-sm sm:text-base font-semibold text-gray-800">
          {label}
        </p>

        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {description}
        </p>

        <div className="flex items-center gap-2 mt-2 text-xs font-medium">
          {enabled ? trueIcon : falseIcon}
          <span className={enabled ? 'text-green-600' : 'text-gray-500'}>
            {enabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        onClick={onToggle}
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 ${
          enabled ? 'bg-purple-600' : 'bg-gray-300'
        }`}
      >

        <span
          className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />

      </button>

    </div>
  );
}
