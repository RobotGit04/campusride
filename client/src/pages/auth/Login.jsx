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
    <div className="min-h-screen flex items-center justify-center p-6 font-body"
      style={{ background: 'linear-gradient(135deg, #f8f9ff 0%, #eef4ff 100%)' }}>

      <div className="w-full max-w-[420px] flex flex-col items-center">
        <div className="mb-10 text-center">
          <h1 className="font-headline text-4xl font-extrabold tracking-tight italic text-primary-container">
            CampusRide
          </h1>
          <p className="mt-3 text-on-surface-variant font-medium">
            The Scholarly Kinetic
          </p>
        </div>

        <div className="w-full bg-surface-container-lowest rounded-[16px] p-8 md:p-10 border border-[#bfdbfe]"
          style={{ boxShadow: '0 20px 50px -12px rgba(12,30,61,0.08)' }}>

          <div className="mb-8">
            <h2 className="font-headline text-2xl font-bold text-on-surface">Welcome back</h2>
            <p className="text-on-surface-variant text-sm mt-1">Please enter your university credentials</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-primary-container">
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-primary-container text-xl">
                  mail
                </span>
                <input name="email" type="email"
                  placeholder="student@vitap.ac.in"
                  value={form.email} onChange={handleChange} required
                  className="w-full pl-11 pr-4 py-3 bg-[#e8f0fe] border border-[#bfdbfe] rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none text-on-surface font-medium placeholder:text-on-primary-container/50"/>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-primary-container">
                  Password
                </label>
                <Link to="/forgot-password"
                  className="text-xs font-semibold text-secondary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-primary-container text-xl">
                  lock
                </span>
                <input name="password" type="password"
                  placeholder="••••••••"
                  value={form.password} onChange={handleChange} required
                  className="w-full pl-11 pr-4 py-3 bg-[#e8f0fe] border border-[#bfdbfe] rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none text-on-surface font-medium"/>
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" disabled={loading}
                className="w-full bg-primary-container text-white font-headline font-bold py-4 rounded-lg hover:bg-primary transition-all shadow-lg active:scale-[0.98] duration-150 disabled:opacity-60">
                {loading ? 'Logging in...' : 'Log in'}
              </button>
            </div>
          </form>

          <div className="mt-8 p-4 bg-surface-container-low rounded-xl flex gap-3 items-start">
            <span className="material-symbols-outlined text-secondary text-xl">info</span>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              You will be automatically redirected to your role-specific dashboard upon successful authentication.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-on-surface-variant">
            New to CampusRide?{' '}
            <Link to="/signup" className="text-secondary font-semibold hover:underline ml-1">
              Sign up
            </Link>
          </p>
        </div>

        <div className="mt-16 text-center opacity-40">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-primary-container">
            VIT AP · Digital Transit Ecosystem
          </p>
        </div>
      </div>

      <div className="fixed -bottom-24 -left-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none"/>
      <div className="fixed -top-24 -right-24 w-96 h-96 bg-primary-container/5 rounded-full blur-3xl pointer-events-none"/>
    </div>
  );
}