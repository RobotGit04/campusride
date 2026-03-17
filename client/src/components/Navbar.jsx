import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (user) {
      api.get('/notifications/unread-count')
        .then(res => setUnread(res.data.count))
        .catch(() => {});
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="text-xl font-bold text-blue-600">CampusRide</Link>

      <div className="flex items-center gap-4">
        {user?.role === 'RENTER' && (
          <Link to="/browse" className="text-sm text-gray-600 hover:text-blue-600">Browse</Link>
        )}
        {user?.role === 'RENTER' && (
          <Link to="/my-bookings" className="text-sm text-gray-600 hover:text-blue-600">My Bookings</Link>
        )}
        {user?.role === 'OWNER' && (
          <Link to="/owner/dashboard" className="text-sm text-gray-600 hover:text-blue-600">Dashboard</Link>
        )}
        {user?.role === 'OWNER' && (
          <Link to="/owner/listings" className="text-sm text-gray-600 hover:text-blue-600">My Bikes</Link>
        )}
        {user?.role === 'ADMIN' && (
          <Link to="/admin/dashboard" className="text-sm text-gray-600 hover:text-blue-600">Admin</Link>
        )}

        <Link to="/notifications" className="relative text-sm text-gray-600 hover:text-blue-600">
          Notifications
          {unread > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {unread}
            </span>
          )}
        </Link>

        <Link to="/profile" className="text-sm text-gray-600 hover:text-blue-600">
          Profile
        </Link>

        <button onClick={handleLogout}
          className="text-sm text-red-500 hover:text-red-700">
          Logout
        </button>
      </div>
    </nav>
  );
}