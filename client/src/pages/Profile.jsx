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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <span className={`text-xs px-2 py-1 rounded-full font-medium mt-1 inline-block ${
                user?.role === 'OWNER' ? 'bg-blue-100 text-blue-700' :
                user?.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                'bg-green-100 text-green-700'
              }`}>
                {user?.role}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Full name</label>
              <input value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Phone number</label>
              <input value={form.phone}
                onChange={e => setForm({...form, phone: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Email</label>
              <input value={user?.email} disabled
                className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-400"/>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white rounded-xl py-3 font-medium hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Saving...' : 'Save changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}