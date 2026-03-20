import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/mark-read');
      fetchNotifications();
      toast.success('All marked as read');
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  return (
    <div className="bg-background min-h-screen font-body">
      <Navbar />
      <main className="pt-32 pb-24 max-w-4xl mx-auto px-6">

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <h1 className="font-headline text-5xl font-bold text-primary tracking-tight mb-2">
              Notifications
            </h1>
            <p className="text-on-surface-variant font-medium">
              Stay updated with your latest campus travels and bookings.
            </p>
          </div>
          {notifications.some(n => !n.isRead) && (
            <button onClick={markAllRead}
              className="text-secondary font-semibold text-sm hover:underline flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-full transition-all active:scale-95">
              <span className="material-symbols-outlined text-sm">done_all</span>
              Mark all as read
            </button>
          )}
        </header>

        {loading ? (
          <div className="text-center py-20 text-on-surface-variant">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20 text-on-surface-variant">No notifications yet</div>
        ) : (
          <div className="space-y-4">
            {notifications.map(n => (
              <div key={n.id}
                className={`p-6 rounded-2xl shadow-sm cursor-pointer transition-all hover:translate-x-1 ${
                  !n.isRead
                    ? 'bg-surface-container border-l-4 border-secondary'
                    : 'bg-surface-container-lowest border border-outline-variant/10'
                }`}>
                <div className="flex gap-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${
                    !n.isRead ? 'bg-white shadow-sm' : 'bg-surface-container-low'
                  }`}>
                    <span className={`material-symbols-outlined ${
                      !n.isRead ? 'text-secondary' : 'text-on-surface-variant'
                    }`}>
                      directions_bike
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className={`font-headline font-bold text-on-surface text-lg ${
                        !n.isRead ? 'font-bold' : 'font-semibold'
                      }`}>
                        {n.title}
                      </h3>
                      {!n.isRead && (
                        <span className="h-2.5 w-2.5 bg-secondary rounded-full shrink-0 mt-1"/>
                      )}
                    </div>
                    <p className="text-on-surface-variant mt-1 leading-relaxed">{n.message}</p>
                    <span className="text-on-primary-container text-xs font-medium uppercase tracking-wider mt-3 block">
                      {format(new Date(n.createdAt), 'dd MMM yyyy · hh:mm a')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="w-full py-12 border-t border-[#dbe3f1] bg-[#f8f9ff]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          <div className="flex flex-col gap-2">
            <span className="font-headline font-bold text-primary-container text-xl">CampusRide VIT AP</span>
            <p className="font-body text-xs uppercase tracking-widest text-slate-500">
              © 2025 CampusRide VIT AP. Scholarly Kinetic Excellence.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 md:justify-end">
            {['Terms of Service', 'Privacy Policy', 'Campus Map'].map(link => (
              <a key={link} href="#"
                className="font-body text-xs uppercase tracking-widest text-slate-500 hover:text-primary-container opacity-80 hover:opacity-100 transition-all">
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}