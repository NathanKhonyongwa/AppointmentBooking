
'use client';

import Navbar from '@/app/Admin/Navbar/page';
import { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  CalendarDays,
  UserPlus,
  UserRound,
  CreditCard,
  MessageSquare,
  Check,
  CheckCheck,
  Trash2,
  Search,
  Clock,
  Inbox,
  BellRing,
  CircleCheck,
  RefreshCw,
  XCircle,
  Activity,
  Loader2,
  AlertCircle,
} from 'lucide-react';

import { db } from '../../lib/firebase';
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';

const activityConfig = {
  appointment: {
    icon: CalendarDays,
    color: 'bg-blue-50 text-blue-600',
    label: 'Appointment',
  },
  booking: {
    icon: CalendarDays,
    color: 'bg-blue-50 text-blue-600',
    label: 'Booking',
  },
  registration: {
    icon: UserPlus,
    color: 'bg-emerald-50 text-emerald-600',
    label: 'Registration',
  },
  client: {
    icon: UserRound,
    color: 'bg-emerald-50 text-emerald-600',
    label: 'Client',
  },
  profile: {
    icon: UserRound,
    color: 'bg-purple-50 text-purple-600',
    label: 'Profile',
  },
  payment: {
    icon: CreditCard,
    color: 'bg-amber-50 text-amber-600',
    label: 'Payment',
  },
  message: {
    icon: MessageSquare,
    color: 'bg-indigo-50 text-indigo-600',
    label: 'Message',
  },
  cancelled: {
    icon: XCircle,
    color: 'bg-red-50 text-red-600',
    label: 'Cancellation',
  },
  rescheduled: {
    icon: RefreshCw,
    color: 'bg-orange-50 text-orange-600',
    label: 'Rescheduled',
  },
  default: {
    icon: Activity,
    color: 'bg-slate-100 text-slate-600',
    label: 'Activity',
  },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // REAL-TIME FIREBASE LISTENER
  useEffect(() => {
    const notificationsQuery = query(
      collection(db, 'notifications'),
      orderBy('createdAt', 'desc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(
      notificationsQuery,
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setNotifications(data);
        setLoading(false);
        setError('');
      },
      (err) => {
        console.error('Notifications error:', err);
        setError(
          'Unable to load notifications. Check your Firebase permissions and connection.'
        );
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const unreadCount = notifications.filter(
    (item) => !item.isRead
  ).length;

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'unread' && !item.isRead) ||
        (filter === 'read' && item.isRead);

      const text = [
        item.title,
        item.message,
        item.actorName,
        item.actorRole,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return matchesFilter && text.includes(search.toLowerCase());
    });
  }, [notifications, filter, search]);

  // MARK ONE NOTIFICATION AS READ
  const markAsRead = async (id) => {
    try {
      await updateDoc(doc(db, 'notifications', id), {
        isRead: true,
      });
    } catch (err) {
      console.error('Could not mark notification as read:', err);
      alert('Could not update notification. Please try again.');
    }
  };

  // MARK ALL AS READ
  const markAllAsRead = async () => {
    try {
      const unread = notifications.filter((item) => !item.isRead);

      if (!unread.length) return;

      const batch = writeBatch(db);

      unread.forEach((item) => {
        batch.update(doc(db, 'notifications', item.id), {
          isRead: true,
        });
      });

      await batch.commit();
    } catch (err) {
      console.error('Could not update notifications:', err);
      alert('Unable to mark all notifications as read.');
    }
  };

  // DELETE NOTIFICATION
  const deleteNotification = async (id) => {
    try {
      await deleteDoc(doc(db, 'notifications', id));
    } catch (err) {
      console.error('Could not delete notification:', err);
      alert('Unable to delete notification.');
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';

    const date =
      typeof timestamp.toDate === 'function'
        ? timestamp.toDate()
        : new Date(timestamp);

    if (Number.isNaN(date.getTime())) return 'Date unavailable';

    return date.toLocaleString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getConfig = (type) =>
    activityConfig[type] || activityConfig.default;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="min-w-0 w-full px-4 py-6 sm:px-6 lg:ml-60 lg:w-[calc(100%-15rem)] lg:px-8 lg:py-9">
        <div className="mx-auto max-w-6xl space-y-7">

          {/* PAGE HEADER */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-purple-600">
                <Activity size={17} />
                System Activity Center
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-xs text-emerald-600">Live</span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Notifications
              </h1>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                Monitor activities and updates performed by your clients.
              </p>
            </div>

            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
            >
              <CheckCheck size={17} />
              Mark all as read
            </button>
          </div>

          {/* SUMMARY */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total activities
                  </p>
                  <h2 className="mt-2 text-3xl font-bold text-slate-900">
                    {notifications.length}
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    Latest 100 records
                  </p>
                </div>
                <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                  <Bell size={23} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Unread activities
                  </p>
                  <h2 className="mt-2 text-3xl font-bold text-slate-900">
                    {unreadCount}
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    Require your attention
                  </p>
                </div>
                <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                  <Inbox size={23} />
                </div>
              </div>
            </div>
          </div>

          {/* NOTIFICATIONS PANEL */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* FILTERS AND SEARCH */}
            <div className="border-b border-slate-100 p-4 sm:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: 'all', label: 'All activities' },
                    { id: 'unread', label: 'Unread' },
                    { id: 'read', label: 'Read' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setFilter(item.id)}
                      className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                        filter === item.id
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {item.label}
                      {item.id === 'unread' && unreadCount > 0 && (
                        <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="relative w-full lg:max-w-xs">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search client activities..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
                  />
                </div>
              </div>
            </div>

            {/* ACTIVITY LIST */}
            <div className="divide-y divide-slate-100">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="animate-spin text-purple-600" size={32} />
                  <p className="mt-3 text-sm text-slate-500">
                    Loading activities from Firebase...
                  </p>
                </div>
              ) : error ? (
                <div className="px-5 py-14 text-center">
                  <AlertCircle className="mx-auto text-red-500" size={32} />
                  <p className="mt-3 text-sm text-red-600">{error}</p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="px-5 py-16 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <Inbox size={30} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    No activities found
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Client activities will appear here when they use the system.
                  </p>
                </div>
              ) : (
                filteredNotifications.map((item) => {
                  const config = getConfig(item.type);
                  const Icon = config.icon;

                  return (
                    <div
                      key={item.id}
                      className={`flex flex-col gap-4 p-4 transition hover:bg-slate-50 sm:flex-row sm:items-start sm:px-6 sm:py-5 ${
                        !item.isRead ? 'bg-purple-50/40' : 'bg-white'
                      }`}
                    >
                      <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${config.color}`}>
                          <Icon size={21} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                              {item.title || 'System activity'}
                            </h3>

                            {!item.isRead && (
                              <span className="rounded-full bg-purple-100 px-2.5 py-1 text-[10px] font-bold uppercase text-purple-700">
                                New
                              </span>
                            )}
                          </div>

                          <p className="mt-1.5 break-words text-sm leading-6 text-slate-600">
                            {item.message || 'An activity was recorded.'}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
                            <span className="flex items-center gap-1.5">
                              <UserRound size={13} />
                              {item.actorName || 'Unknown client'}
                            </span>

                            <span className="flex items-center gap-1.5">
                              <Clock size={13} />
                              {formatDate(item.createdAt)}
                            </span>

                            <span className="rounded-md bg-slate-100 px-2 py-1 font-medium text-slate-500">
                              {config.label}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 sm:border-0 sm:pt-0">
                        {!item.isRead ? (
                          <button
                            onClick={() => markAsRead(item.id)}
                            title="Mark as read"
                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-purple-700 transition hover:bg-purple-100"
                          >
                            <Check size={15} />
                            Mark read
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-2 text-xs font-medium text-emerald-600">
                            <CircleCheck size={15} />
                            Read
                          </span>
                        )}

                        <button
                          onClick={() => deleteNotification(item.id)}
                          title="Delete activity"
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="border-t border-slate-100 bg-slate-50 px-4 py-4 text-center">
              <p className="text-xs text-slate-500">
                Showing {filteredNotifications.length} of {notifications.length} activities
              </p>
            </div>
          </section>

          <p className="text-center text-xs text-slate-400">
            Live System Activity · Admin Dashboard
          </p>
        </div>
      </main>
    </div>
  );
}
