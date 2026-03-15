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
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {notifications.some(n => !n.isRead) && (
            <button onClick={markAllRead}
              className="text-sm text-blue-600 hover:text-blue-700">
              Mark all as read
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No notifications yet</div>
        ) : (
          <div className="space-y-3">
            {notifications.map(n => (
              <div key={n.id}
                className={`bg-white rounded-2xl border p-4 ${
                  !n.isRead ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                }`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{n.title}</p>
                    <p className="text-gray-600 text-sm mt-1">{n.message}</p>
                  </div>
                  {!n.isRead && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-1 shrink-0"/>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {format(new Date(n.createdAt), 'dd MMM yyyy · hh:mm a')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}