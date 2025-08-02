'use client';

import { motion } from 'framer-motion';
import { User, Mail, Phone, CalendarDays, UserCheck } from 'lucide-react';
import Navbar from '../Navbar/page';

const userData = {
  fullName: 'Jane Doe',
  email: 'jane.doe@example.com',
  phone: '+265 999 123 456',
  dateOfBirth: '1990-08-15',
  membershipSince: '2024-01-12',
  sessionCount: 8,
  therapist: 'Dr. Chikondi M.',
  profileImage: 'https://i.pravatar.cc/150?img=5', // placeholder image
};

export default function CustomerProfile() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-white to-pink-50 p-6 flex justify-center items-start mt-15">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl p-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
            <img
              src={userData.profileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-purple-300 shadow-md object-cover"
            />
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-800">{userData.fullName}</h2>
              <p className="text-purple-600 font-medium">Client Profile</p>
            </div>
          </div>

          <div className="grid gap-5 text-gray-800">
            <ProfileItem icon={<Mail className="text-purple-600 w-5 h-5" />} label="Email" value={userData.email} />
            <ProfileItem icon={<Phone className="text-purple-600 w-5 h-5" />} label="Phone" value={userData.phone} />
            <ProfileItem icon={<CalendarDays className="text-purple-600 w-5 h-5" />} label="Date of Birth" value={userData.dateOfBirth} />
            <ProfileItem icon={<CalendarDays className="text-purple-600 w-5 h-5" />} label="Member Since" value={userData.membershipSince} />
            <ProfileItem icon={<UserCheck className="text-purple-600 w-5 h-5" />} label="Total Sessions" value={`${userData.sessionCount} sessions`} />
            <ProfileItem icon={<User className="text-purple-600 w-5 h-5" />} label="Assigned Therapist" value={userData.therapist} />
          </div>

          <div className="text-center mt-8">
            <a
              href="/Customer/Settings"
              className="inline-block bg-purple-600 text-white px-8 py-3 rounded-full shadow hover:bg-purple-700 transition"
            >
              Edit Profile
            </a>
          </div>
        </motion.div>
      </main>
    </>
  );
}

function ProfileItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4 bg-purple-50 p-4 rounded-xl shadow-sm hover:bg-purple-100 transition">
      <div className="pt-1">{icon}</div>
      <div>
        <p className="text-sm text-purple-700 font-semibold">{label}</p>
        <p className="text-base font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}
