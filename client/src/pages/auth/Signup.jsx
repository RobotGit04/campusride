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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Join CampusRide</h1>
        <p className="text-gray-500 mb-6">Create your account to get started</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" placeholder="Full name" value={form.name}
            onChange={handleChange} required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          <input name="email" type="email" placeholder="College email" value={form.email}
            onChange={handleChange} required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          <input name="phone" placeholder="Phone number" value={form.phone}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          <input name="password" type="password" placeholder="Password" value={form.password}
            onChange={handleChange} required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>

          <select name="role" value={form.role} onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="RENTER">I want to rent a bike</option>
            <option value="OWNER">I want to list my bike</option>
          </select>

          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white rounded-xl py-3 font-medium hover:bg-blue-700 transition disabled:opacity-50">
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
}