import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.token, res.data.user);
      toast.success('Welcome back!');
      if (res.data.user.role === 'OWNER') navigate('/owner/dashboard');
      else if (res.data.user.role === 'ADMIN') navigate('/admin/dashboard');
      else navigate('/browse');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#f0f5ff',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{
            fontSize: 22, fontWeight: 800, color: '#0c1e3d',
            textDecoration: 'none', letterSpacing: '-0.5px'
          }}>
            CampusRide
          </Link>
          <p style={{ fontSize: 13, color: '#3b5e8a', marginTop: 4 }}>
            Bike rentals for VIT AP students
          </p>
        </div>

        <div style={{
          background: '#fff', borderRadius: 16,
          border: '0.5px solid #bfdbfe', padding: 32
        }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0c1e3d', marginBottom: 4 }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 13, color: '#3b5e8a', marginBottom: 24 }}>
            Log in to your CampusRide account
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: '#3b5e8a', display: 'block', marginBottom: 6 }}>
                Email address
              </label>
              <input name="email" type="email" placeholder="you@vit.ac.in"
                value={form.email} onChange={handleChange} required
                style={{
                  width: '100%', background: '#f0f5ff',
                  border: '1px solid #bfdbfe', borderRadius: 8,
                  padding: '10px 14px', fontSize: 13, color: '#0c1e3d',
                  outline: 'none', boxSizing: 'border-box'
                }}/>
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={{ fontSize: 12, color: '#3b5e8a', display: 'block', marginBottom: 6 }}>
                Password
              </label>
              <input name="password" type="password" placeholder="••••••••"
                value={form.password} onChange={handleChange} required
                style={{
                  width: '100%', background: '#f0f5ff',
                  border: '1px solid #bfdbfe', borderRadius: 8,
                  padding: '10px 14px', fontSize: 13, color: '#0c1e3d',
                  outline: 'none', boxSizing: 'border-box'
                }}/>
            </div>

            <div style={{ textAlign: 'right', marginBottom: 20 }}>
              <Link to="/forgot-password" style={{ fontSize: 12, color: '#2563eb', textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', background: '#0c1e3d', color: '#e8f0fe',
              border: 'none', borderRadius: 8, padding: '12px',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
              opacity: loading ? 0.6 : 1
            }}>
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, color: '#3b5e8a', marginTop: 20 }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}