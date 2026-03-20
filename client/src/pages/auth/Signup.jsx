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
    <div className="min-h-screen flex items-center justify-center p-6 font-body bg-[#e8f0fe]">
      <div className="max-w-md w-full">

        <div className="mb-10 text-center">
          <h1 className="font-headline font-extrabold text-4xl text-primary tracking-tighter italic">
            CampusRide
          </h1>
          <p className="text-on-surface-variant mt-2 font-medium">
            Join the Scholarly Kinetic community.
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-[#bfdbfe] rounded-[16px] p-8 md:p-10"
          style={{ boxShadow: '0 20px 50px -12px rgba(12,30,61,0.08)' }}>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="font-headline font-semibold text-sm text-primary tracking-tight">
                I want to...
              </label>
              <div className="grid grid-cols-2 gap-3 p-1 bg-surface-container rounded-xl">
                {[
                  { value: 'RENTER', label: 'Rent a bike' },
                  { value: 'OWNER', label: 'List my bike' },
                ].map(opt => (
                  <button key={opt.value} type="button"
                    onClick={() => setForm({ ...form, role: opt.value })}
                    className={`py-3 px-4 rounded-lg font-headline font-bold text-sm transition-all duration-200 ${
                      form.role === opt.value
                      ? 'text-white shadow-md'
                      : 'text-on-primary-container hover:bg-surface-container-highest'
                    }`}
                    style={form.role === opt.value ? { background: '#0c1e3d' } : {}}
                >
                  {opt.label}
                </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-headline font-semibold text-xs text-on-surface-variant uppercase tracking-wider mb-1.5 ml-1">
                  Full Name
                </label>
                <input name="name" type="text" placeholder="Alex Rivers"
                  value={form.name} onChange={handleChange} required
                  className="w-full bg-surface-container border-0 rounded-lg py-3.5 px-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-secondary/10 outline-none transition-all"/>
              </div>

              <div>
                <label className="block font-headline font-semibold text-xs text-on-surface-variant uppercase tracking-wider mb-1.5 ml-1">
                  College Email
                </label>
                <input name="email" type="email" placeholder="alex.rivers@vitap.ac.in"
                  value={form.email} onChange={handleChange} required
                  className="w-full bg-surface-container border-0 rounded-lg py-3.5 px-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-secondary/10 outline-none transition-all"/>
              </div>

              <div>
                <label className="block font-headline font-semibold text-xs text-on-surface-variant uppercase tracking-wider mb-1.5 ml-1">
                  Phone Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 rounded-l-lg bg-surface-container-highest text-on-surface-variant text-sm font-medium">
                    +91
                  </span>
                  <input name="phone" type="tel" placeholder="9876543210"
                    value={form.phone} onChange={handleChange}
                    className="w-full bg-surface-container border-0 rounded-r-lg py-3.5 px-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-secondary/10 outline-none transition-all"/>
                </div>
              </div>

              <div>
                <label className="block font-headline font-semibold text-xs text-on-surface-variant uppercase tracking-wider mb-1.5 ml-1">
                  Password
                </label>
                <input name="password" type="password" placeholder="••••••••"
                  value={form.password} onChange={handleChange} required
                  className="w-full bg-surface-container border-0 rounded-lg py-3.5 px-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-secondary/10 outline-none transition-all"/>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ background: '#0c1e3d' }}
              className="w-full text-white font-headline font-bold py-4 rounded-lg shadow-lg hover:opacity-90 transition-all duration-300 active:scale-[0.98] mt-4 disabled:opacity-60">
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-outline-variant/20 text-center">
            <p className="text-sm text-on-surface-variant">
              Already have an account?{' '}
              <Link to="/login" className="text-secondary font-semibold hover:underline ml-1">
                Log in
              </Link>
            </p>
          </div>
        </div>

        <footer className="mt-12 text-center">
          <p className="font-body text-xs text-slate-500 tracking-wide">
            CampusRide.Ride like a breeze
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="#" className="text-xs text-slate-400 hover:text-secondary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-xs text-slate-400 hover:text-secondary transition-colors">
              Privacy Policy
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}