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
    <nav style={{
      background: '#0c1e3d',
      padding: '14px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <Link to="/" style={{
        fontSize: 18, fontWeight: 700, color: '#e8f0fe',
        textDecoration: 'none', letterSpacing: '-0.3px'
      }}>
        CampusRide
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {user?.role === 'RENTER' && <>
          <Link to="/browse" style={{ fontSize: 13, color: '#7aa3d4', textDecoration: 'none' }}>Browse</Link>
          <Link to="/my-bookings" style={{ fontSize: 13, color: '#7aa3d4', textDecoration: 'none' }}>My Bookings</Link>
        </>}
        {user?.role === 'OWNER' && <>
          <Link to="/owner/dashboard" style={{ fontSize: 13, color: '#7aa3d4', textDecoration: 'none' }}>Dashboard</Link>
          <Link to="/owner/listings" style={{ fontSize: 13, color: '#7aa3d4', textDecoration: 'none' }}>My Bikes</Link>
        </>}
        {user?.role === 'ADMIN' && (
          <Link to="/admin/dashboard" style={{ fontSize: 13, color: '#7aa3d4', textDecoration: 'none' }}>Admin</Link>
        )}

        <Link to="/notifications" style={{
          fontSize: 13, color: '#7aa3d4',
          textDecoration: 'none', position: 'relative'
        }}>
          Notifications
          {unread > 0 && (
            <span style={{
              position: 'absolute', top: -8, right: -10,
              background: '#2563eb', color: '#fff',
              fontSize: 9, fontWeight: 700,
              borderRadius: '50%', width: 16, height: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {unread}
            </span>
          )}
        </Link>

        <Link to="/profile" style={{ fontSize: 13, color: '#7aa3d4', textDecoration: 'none' }}>
          Profile
        </Link>

        <button onClick={handleLogout} style={{
          fontSize: 13, color: '#f87171', background: 'none',
          border: 'none', cursor: 'pointer', padding: 0
        }}>
          Logout
        </button>
      </div>
    </nav>
  );
}