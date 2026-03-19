import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/auth/profile', form);
      login(localStorage.getItem('token'), res.data.user);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const roleLabel = { RENTER: 'Student Renter', OWNER: 'Bike Owner', ADMIN: 'Admin' };

  return (
    <div className="bg-background min-h-screen font-body">
      <Navbar />
      <main className="pt-24 pb-20 px-6 max-w-4xl mx-auto">

        <section className="mb-12 flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-secondary flex items-center justify-center text-white text-5xl font-extrabold"
              style={{ boxShadow: '0 8px 24px rgba(0,81,213,0.2)' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="text-center md:text-left space-y-2">
            <h1 className="font-headline text-4xl font-extrabold tracking-tight text-primary-container">
              {user?.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span className="bg-surface-container-high text-primary-container px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-base">verified_user</span>
                {roleLabel[user?.role]}
              </span>
              <span className="text-on-surface-variant text-sm font-medium">{user?.email}</span>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-surface-container-lowest p-8 rounded-[14px] flex flex-col gap-8"
            style={{ boxShadow: '0 2px 8px rgba(12,30,61,0.05)' }}>

            <div className="border-b border-surface-container pb-4">
              <h2 className="font-headline text-xs font-bold uppercase tracking-widest text-primary-container">
                Identity Core
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant px-1">
                  Full Name
                </label>
                <input value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-surface-container border-transparent focus:border-secondary focus:ring-secondary/10 rounded-lg px-4 py-3 font-medium text-on-surface transition-all outline-none"/>
              </div>

              <div className="flex flex-col gap-2 opacity-70">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant px-1">
                  Academic Email
                </label>
                <div className="flex items-center gap-3 bg-surface-container-low border border-outline-variant/20 rounded-lg px-4 py-3 font-medium text-on-surface cursor-not-allowed">
                  <span className="material-symbols-outlined text-lg">lock</span>
                  {user?.email}
                </div>
                <p className="text-[10px] text-on-surface-variant px-1 italic">
                  Email cannot be changed.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant px-1">
                  Contact Phone
                </label>
                <input value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 9876543210"
                  className="w-full bg-surface-container border-transparent focus:border-secondary focus:ring-secondary/10 rounded-lg px-4 py-3 font-medium text-on-surface transition-all outline-none"/>
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" disabled={loading}
                  className="bg-primary-container text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-secondary transition-all active:scale-95 disabled:opacity-60"
                  style={{ boxShadow: '0 4px 12px rgba(12,30,61,0.2)' }}>
                  {loading ? 'Saving...' : 'Save changes'}
                  <span className="material-symbols-outlined text-lg">save</span>
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-primary-container text-white p-6 rounded-[14px]"
              style={{ boxShadow: '0 4px 16px rgba(12,30,61,0.1)' }}>
              <h3 className="font-headline text-sm font-bold uppercase tracking-widest mb-4 opacity-70">
                Scholarly Motion
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs opacity-80">Role</span>
                  <span className="font-bold">{user?.role}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs opacity-80">Status</span>
                  <span className="font-bold text-green-400">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs opacity-80">Platform</span>
                  <span className="font-bold">CampusRide</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-low p-6 rounded-[14px] flex flex-col gap-4">
              <h3 className="font-headline text-xs font-bold uppercase tracking-widest text-primary-container mb-1">
                Quick Links
              </h3>
              {user?.role === 'RENTER' && (
                <a href="/my-bookings"
                  className="flex items-center gap-3 text-sm font-medium text-on-surface-variant hover:text-secondary transition-colors group"
                  style={{ textDecoration: 'none' }}>
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                    history
                  </span>
                  Booking History
                </a>
              )}
              {user?.role === 'OWNER' && (
                <a href="/owner/listings"
                  className="flex items-center gap-3 text-sm font-medium text-on-surface-variant hover:text-secondary transition-colors group"
                  style={{ textDecoration: 'none' }}>
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                    directions_bike
                  </span>
                  My Listings
                </a>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-12 border-t border-[#dbe3f1] bg-[#f8f9ff]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-headline font-bold text-primary-container text-lg">CampusRide VIT AP</span>
          <p className="font-body text-xs uppercase tracking-widest text-slate-500">
            © 2025 CampusRide VIT AP. Scholarly Kinetic Excellence.
          </p>
        </div>
      </footer>
    </div>
  );
}