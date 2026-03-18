import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'RENTER', phone: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/signup', form);
      login(res.data.token, res.data.user);
      toast.success('Account created!');
      if (res.data.user.role === 'OWNER') navigate('/owner/dashboard');
      else navigate('/browse');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
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
            Join CampusRide
          </h1>
          <p style={{ fontSize: 13, color: '#3b5e8a', marginBottom: 24 }}>
            Create your account to get started
          </p>

          <form onSubmit={handleSubmit}>
            {[
              { name: 'name', label: 'Full name', type: 'text', placeholder: 'Your full name' },
              { name: 'email', label: 'College email', type: 'email', placeholder: 'you@vit.ac.in' },
              { name: 'phone', label: 'Phone number', type: 'text', placeholder: '+91 9876543210' },
              { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
            ].map(field => (
              <div key={field.name} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, color: '#3b5e8a', display: 'block', marginBottom: 6 }}>
                  {field.label}
                </label>
                <input
                  name={field.name} type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.name]} onChange={handleChange}
                  required={field.name !== 'phone'}
                  style={{
                    width: '100%', background: '#f0f5ff',
                    border: '1px solid #bfdbfe', borderRadius: 8,
                    padding: '10px 14px', fontSize: 13, color: '#0c1e3d',
                    outline: 'none', boxSizing: 'border-box'
                  }}/>
              </div>
            ))}

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: '#3b5e8a', display: 'block', marginBottom: 6 }}>
                I want to
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { value: 'RENTER', label: 'Rent a bike' },
                  { value: 'OWNER', label: 'List my bike' },
                ].map(opt => (
                  <button key={opt.value} type="button"
                    onClick={() => setForm({ ...form, role: opt.value })}
                    style={{
                      padding: '10px', borderRadius: 8, fontSize: 13,
                      fontWeight: form.role === opt.value ? 600 : 400,
                      background: form.role === opt.value ? '#0c1e3d' : '#f0f5ff',
                      color: form.role === opt.value ? '#e8f0fe' : '#3b5e8a',
                      border: form.role === opt.value ? 'none' : '1px solid #bfdbfe',
                      cursor: 'pointer',
                    }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', background: '#0c1e3d', color: '#e8f0fe',
              border: 'none', borderRadius: 8, padding: '12px',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
              opacity: loading ? 0.6 : 1
            }}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, color: '#3b5e8a', marginTop: 20 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}