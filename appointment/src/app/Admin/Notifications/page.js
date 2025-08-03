'use client';

import Navbar from '@/app/Admin/Navbar/page';
import { useEffect, useState } from 'react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Simulated fetch (replace with real API call if needed)
    const mockNotifications = [
      {
        id: 1,
        title: 'New Appointment Booked',
        message: 'John Doe booked an appointment for August 5, 2025.',
        timestamp: '2025-08-03T09:15:00Z',
        isRead: false,
      },
      {
        id: 2,
        title: 'Client Registered',
        message: 'Jane Smith registered as a new client.',
        timestamp: '2025-08-02T14:30:00Z',
        isRead: true,
      },
      {
        id: 3,
        title: 'Therapist Updated Profile',
        message: 'Therapist Lucy updated her availability schedule.',
        timestamp: '2025-08-01T11:20:00Z',
        isRead: false,
      },
    ];
    setNotifications(mockNotifications);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-2xl font-bold mb-6 text-purple-700">Notifications</h2>

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <p className="text-gray-500">No notifications available.</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border rounded-lg shadow-sm transition-all ${
                  notification.isRead
                    ? 'bg-white border-gray-200'
                    : 'bg-purple-50 border-purple-200'
                }`}
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {notification.title}
                </h3>
                <p className="text-sm text-gray-600">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(notification.timestamp).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
