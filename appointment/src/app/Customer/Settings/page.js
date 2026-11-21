
'use client';

import { useState, useEffect } from 'react';
import Navbar from '../Navbar/page';

import { motion } from 'framer-motion';

import {
  User,
  Mail,
  Phone,
  Camera,
  Bell,
  CalendarClock,
  Lock,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Settings,
  KeyRound,
  RefreshCw,
  ImagePlus,
} from 'lucide-react';

import {
  getAuth,
  onAuthStateChanged,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from '../../lib/firebase';

const DEFAULT_SETTINGS = {
  fullName: '',
  phone: '',
  profileImage: '',
  receiveNotifications: true,
  receiveReminders: true,
};

function ToggleSwitch({ label, description, enabled, onToggle }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-800">
          {label}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        onClick={onToggle}
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200 ${
          enabled ? 'bg-purple-600' : 'bg-slate-300'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

function SettingsInput({
  label,
  icon: Icon,
  ...props
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
        )}

        <input
          {...props}
          className={`w-full rounded-xl border border-slate-200 bg-slate-50 py-3 ${
            Icon ? 'pl-11' : 'pl-4'
          } pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500`}
        />
      </div>
    </div>
  );
}

function Notice({ message, type }) {
  if (!message) return null;

  const success = type === 'success';

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-5 flex items-start gap-3 rounded-xl border p-4 text-sm ${
        success
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
          : 'border-red-200 bg-red-50 text-red-700'
      }`}
    >
      {success ? (
        <CheckCircle2 size={20} className="shrink-0" />
      ) : (
        <AlertCircle size={20} className="shrink-0" />
      )}

      <p>{message}</p>
    </motion.div>
  );
}

export default function CustomerSettings() {
  const [user, setUser] = useState(null);

  const [profile, setProfile] = useState(DEFAULT_SETTINGS);

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [profileMessage, setProfileMessage] = useState({
    type: '',
    text: '',
  });

  const [passwordMessage, setPasswordMessage] = useState({
    type: '',
    text: '',
  });

  // LOAD AUTHENTICATED CUSTOMER
  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const snapshot = await getDoc(userRef);

        const saved = snapshot.exists()
          ? snapshot.data()
          : {};

        setProfile({
          fullName:
            saved.fullName ||
            currentUser.displayName ||
            '',
          phone:
            saved.phone ||
            currentUser.phoneNumber ||
            '',
          profileImage:
            saved.profileImage ||
            currentUser.photoURL ||
            '',
          receiveNotifications:
            saved.receiveNotifications ?? true,
          receiveReminders:
            saved.receiveReminders ?? true,
        });

      } catch (error) {
        console.error('Settings loading error:', error);

        setProfileMessage({
          type: 'error',
          text: 'Unable to load your settings. Please refresh the page.',
        });
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // UPDATE PROFILE INPUTS
  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // UPDATE NOTIFICATION SWITCHES
  const handleToggle = (field) => {
    setProfile((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  };

  // UPDATE PASSWORD INPUTS
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswords((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // SAVE PROFILE AND NOTIFICATION SETTINGS
  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!user) return;

    if (!profile.fullName.trim()) {
      setProfileMessage({
        type: 'error',
        text: 'Please enter your full name.',
      });
      return;
    }

    if (
      profile.phone &&
      !/^[+0-9\s()-]{7,20}$/.test(profile.phone)
    ) {
      setProfileMessage({
        type: 'error',
        text: 'Please enter a valid phone number.',
      });
      return;
    }

    if (profile.profileImage) {
      try {
        const photoURL = new URL(profile.profileImage);

        if (!['http:', 'https:'].includes(photoURL.protocol)) {
          throw new Error('Invalid URL');
        }
      } catch {
        setProfileMessage({
          type: 'error',
          text: 'Please enter a valid profile photo URL.',
        });
        return;
      }
    }

    setSavingProfile(true);

    setProfileMessage({
      type: '',
      text: '',
    });

    try {
      const userRef = doc(db, 'users', user.uid);

      const updatedData = {
        fullName: profile.fullName.trim(),
        email: user.email || '',
        phone: profile.phone.trim(),
        profileImage: profile.profileImage.trim(),

        receiveNotifications: profile.receiveNotifications,
        receiveReminders: profile.receiveReminders,

        updatedAt: serverTimestamp(),
      };

      // SAVE TO FIRESTORE
      await setDoc(userRef, updatedData, {
        merge: true,
      });

      // UPDATE FIREBASE AUTH PROFILE
      await updateProfile(user, {
        displayName: updatedData.fullName,
        photoURL: updatedData.profileImage || null,
      });

      setProfileMessage({
        type: 'success',
        text: 'Your profile and notification settings have been saved successfully!',
      });

    } catch (error) {
      console.error('Profile save error:', error);

      setProfileMessage({
        type: 'error',
        text: error.message || 'Failed to save your settings.',
      });
    } finally {
      setSavingProfile(false);
    }
  };

  // CHANGE PASSWORD USING FIREBASE AUTHENTICATION
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!user) return;

    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setPasswordMessage({
        type: 'error',
        text: 'Please complete all password fields.',
      });
      return;
    }

    if (passwords.new.length < 6) {
      setPasswordMessage({
        type: 'error',
        text: 'Your new password must contain at least 6 characters.',
      });
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setPasswordMessage({
        type: 'error',
        text: 'Your new password and confirmation do not match.',
      });
      return;
    }

    if (passwords.current === passwords.new) {
      setPasswordMessage({
        type: 'error',
        text: 'Your new password must be different from your current password.',
      });
      return;
    }

    if (!user.email) {
      setPasswordMessage({
        type: 'error',
        text: 'This account does not have an email address.',
      });
      return;
    }

    setSavingPassword(true);

    setPasswordMessage({
      type: '',
      text: '',
    });

    try {
      // Reauthenticate the customer
      const credential = EmailAuthProvider.credential(
        user.email,
        passwords.current
      );

      await reauthenticateWithCredential(user, credential);

      // Update Firebase Authentication password
      await updatePassword(user, passwords.new);

      setPasswords({
        current: '',
        new: '',
        confirm: '',
      });

      setPasswordMessage({
        type: 'success',
        text: 'Your password has been changed successfully!',
      });

    } catch (error) {
      console.error('Password update error:', error);

      let errorText = 'Unable to update your password. Please try again.';

      if (
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/wrong-password'
      ) {
        errorText = 'Your current password is incorrect.';
      } else if (error.code === 'auth/weak-password') {
        errorText = 'Your new password is too weak.';
      } else if (error.code === 'auth/requires-recent-login') {
        errorText = 'Please sign in again before changing your password.';
      } else if (error.code === 'auth/too-many-requests') {
        errorText = 'Too many attempts. Please try again later.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorText = 'Password authentication is not enabled for this account.';
      } else if (error.code === 'auth/provider-already-linked') {
        errorText = 'Please check your account authentication provider.';
      }

      setPasswordMessage({
        type: 'error',
        text: errorText,
      });

    } finally {
      setSavingPassword(false);
    }
  };

  // LOADING
  if (loading) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-slate-50 px-4 pt-32">
          <div className="mx-auto max-w-5xl animate-pulse space-y-5">
            <div className="h-10 w-60 rounded-xl bg-slate-200" />
            <div className="h-64 rounded-3xl bg-white" />
            <div className="h-64 rounded-3xl bg-white" />
          </div>
        </main>
      </>
    );
  }

  // NOT AUTHENTICATED
  if (!user) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 pt-24">
          <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <ShieldCheck
              size={42}
              className="mx-auto text-purple-600"
            />

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Login required
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Please log in to manage your account settings.
            </p>

            <a
              href="/"
              className="mt-6 inline-block rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white"
            >
              Return Home
            </a>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 px-4 pb-16 pt-28 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-5xl">

          {/* PAGE HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-purple-600">
              <Settings size={17} />
              ACCOUNT MANAGEMENT
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Account Settings
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Manage your personal details, notifications and account security.
            </p>
          </motion.div>

          {/* PROFILE SETTINGS */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-7 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="border-b border-slate-100 p-5 sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                  <User size={22} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Profile Information
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Update your registered customer details.
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSaveProfile}
              className="p-5 sm:p-7"
            >
              <Notice
                message={profileMessage.text}
                type={profileMessage.type}
              />

              {/* PROFILE PHOTO */}
              <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center">

                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt="Customer profile"
                    className="h-20 w-20 rounded-full border-4 border-purple-100 object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-purple-100 bg-purple-50 text-2xl font-bold text-purple-600">
                    {profile.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800">
                    Profile Photo
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Enter an image URL below to update your profile picture.
                  </p>

                  <div className="relative mt-3">
                    <ImagePlus
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="url"
                      name="profileImage"
                      value={profile.profileImage}
                      onChange={handleProfileChange}
                      placeholder="https://example.com/photo.jpg"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                    />
                  </div>
                </div>
              </div>

              {/* PROFILE FIELDS */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <SettingsInput
                  label="Full Name"
                  icon={User}
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleProfileChange}
                  placeholder="Enter your full name"
                  required
                  maxLength={100}
                />

                <SettingsInput
                  label="Email Address"
                  icon={Mail}
                  type="email"
                  value={user.email || ''}
                  disabled
                />

                <SettingsInput
                  label="Phone Number"
                  icon={Phone}
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  placeholder="+265 999 000 000"
                  maxLength={20}
                />

              </div>

              <div className="mt-7 flex justify-end border-t border-slate-100 pt-5">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {savingProfile ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Profile
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.section>

          {/* NOTIFICATION SETTINGS */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-7 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Bell size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Notification Preferences
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Choose which updates you want to receive.
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">

              <ToggleSwitch
                label="Booking Notifications"
                description="Receive updates when your therapy booking is confirmed, changed or cancelled."
                enabled={profile.receiveNotifications}
                onToggle={() => handleToggle('receiveNotifications')}
              />

              <ToggleSwitch
                label="Appointment Reminders"
                description="Receive reminders about your upcoming therapy sessions."
                enabled={profile.receiveReminders}
                onToggle={() => handleToggle('receiveReminders')}
              />

            </div>

            <p className="mt-4 rounded-xl bg-blue-50 p-3 text-xs leading-5 text-blue-700">
              Remember to click Save Profile above to store your notification preferences.
              These preferences are saved in Firestore; actual email or SMS delivery requires a notification service.
            </p>

          </motion.section>

          {/* PASSWORD SETTINGS */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-7 rounded-3xl border border-slate-200 bg-white shadow-sm"
          >

            <div className="border-b border-slate-100 p-5 sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                  <Lock size={22} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Password & Security
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Protect your account by regularly updating your password.
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleChangePassword}
              className="space-y-5 p-5 sm:p-7"
            >

              <Notice
                message={passwordMessage.text}
                type={passwordMessage.type}
              />

              {[
                {
                  name: 'current',
                  label: 'Current Password',
                  placeholder: 'Enter your current password',
                },
                {
                  name: 'new',
                  label: 'New Password',
                  placeholder: 'Enter your new password',
                },
                {
                  name: 'confirm',
                  label: 'Confirm New Password',
                  placeholder: 'Confirm your new password',
                },
              ].map((field) => (

                <div key={field.name}>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    {field.label}
                  </label>

                  <div className="relative">
                    <KeyRound
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type={showPasswords[field.name] ? 'text' : 'password'}
                      name={field.name}
                      value={passwords[field.name]}
                      onChange={handlePasswordChange}
                      placeholder={field.placeholder}
                      autoComplete={
                        field.name === 'current'
                          ? 'current-password'
                          : 'new-password'
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-12 text-sm outline-none transition focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-100"
                    />

                    <button
                      type="button"
                      aria-label={
                        showPasswords[field.name]
                          ? 'Hide password'
                          : 'Show password'
                      }
                      onClick={() => {
                        setShowPasswords((previous) => ({
                          ...previous,
                          [field.name]: !previous[field.name],
                        }));
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600"
                    >
                      {showPasswords[field.name] ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>
                  </div>
                </div>

              ))}

              <div className="rounded-xl bg-amber-50 p-4 text-xs leading-5 text-amber-800">
                For security, Firebase will verify your current password before allowing you to change it. New passwords must contain at least 6 characters.
              </div>

              <div className="flex justify-end border-t border-slate-100 pt-5">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {savingPassword ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Lock size={17} />
                      Update Password
                    </>
                  )}
                </button>
              </div>

            </form>
          </motion.section>

          {/* ACCOUNT FOOTER */}
          <div className="flex flex-col items-center justify-center gap-2 py-5 text-center">
            <div className="flex items-center gap-2 text-emerald-600">
              <ShieldCheck size={18} />
              <span className="text-sm font-semibold">
                Your account is protected
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Your account settings are associated with your authenticated Firebase account.
            </p>
          </div>

        </div>
      </main>
    </>
  );
}
