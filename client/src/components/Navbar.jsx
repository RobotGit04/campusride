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
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center h-16 px-6 md:px-12 font-headline font-semibold tracking-tight"
      style={{
        background: 'rgba(12, 30, 61, 0.85)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 20px rgba(0,5,22,0.2)'
      }}>

      <div className="flex items-center gap-8">
        <Link to="/" className="text-2xl font-bold text-white tracking-tighter no-underline"
          style={{ textDecoration: 'none' }}>
          CampusRide
        </Link>

        <div className="hidden md:flex gap-2 items-center">
          {user?.role === 'RENTER' && <>
            <Link to="/browse"
              className="text-slate-300 hover:text-white hover:bg-white/10 rounded-lg px-3 py-1 transition-all text-sm"
              style={{ textDecoration: 'none' }}>
              Browse
            </Link>
            <Link to="/my-bookings"
              className="text-slate-300 hover:text-white hover:bg-white/10 rounded-lg px-3 py-1 transition-all text-sm"
              style={{ textDecoration: 'none' }}>
              My Bookings
            </Link>
          </>}
          {user?.role === 'OWNER' && <>
            <Link to="/owner/dashboard"
              className="text-slate-300 hover:text-white hover:bg-white/10 rounded-lg px-3 py-1 transition-all text-sm"
              style={{ textDecoration: 'none' }}>
              Dashboard
            </Link>
            <Link to="/owner/listings"
              className="text-slate-300 hover:text-white hover:bg-white/10 rounded-lg px-3 py-1 transition-all text-sm"
              style={{ textDecoration: 'none' }}>
              Listings
            </Link>
          </>}
          {user?.role === 'ADMIN' && (
            <Link to="/admin/dashboard"
              className="text-slate-300 hover:text-white hover:bg-white/10 rounded-lg px-3 py-1 transition-all text-sm"
              style={{ textDecoration: 'none' }}>
              Admin
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link to="/notifications"
          className="relative p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          style={{ textDecoration: 'none' }}>
          <span className="material-symbols-outlined">notifications</span>
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full"/>
          )}
        </Link>

        <Link to="/profile"
          className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          style={{ textDecoration: 'none' }}>
          <span className="material-symbols-outlined">account_circle</span>
        </Link>

        {user && (
          <button onClick={handleLogout}
            className="ml-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/10 rounded-lg px-3 py-1 transition-all font-medium">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}