import { useState, useEffect } from 'react';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('stats');
  const [commission, setCommission] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [statsRes, usersRes, bikesRes, bookingsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/listings'),
        api.get('/admin/bookings'),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setBikes(bikesRes.data);
      setBookings(bookingsRes.data);
    } catch {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendUser = async (id) => {
    try {
      await api.put(`/admin/users/${id}/suspend`);
      toast.success('User status updated');
      fetchAll();
    } catch {
      toast.error('Failed to update user');
    }
  };

  const handleSuspendListing = async (id) => {
    try {
      await api.put(`/admin/listings/${id}/suspend`);
      toast.success('Listing status updated');
      fetchAll();
    } catch {
      toast.error('Failed to update listing');
    }
  };

  const handleCommissionUpdate = async () => {
    try {
      await api.put('/admin/commission', { percentage: commission });
      toast.success(`Commission updated to ${commission}%`);
    } catch {
      toast.error('Failed to update commission');
    }
  };

  const tabs = ['stats', 'users', 'listings', 'bookings', 'commission'];

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="text-center py-20 text-gray-400">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'stats' && stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: 'Total users', value: stats.totalUsers },
              { label: 'Total bikes', value: stats.totalBikes },
              { label: 'Total bookings', value: stats.totalBookings },
              { label: 'Active rentals', value: stats.activeRentals },
              { label: 'Commission (₹)', value: stats.totalCommission?.toFixed(0) },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600">Name</th>
                  <th className="text-left px-4 py-3 text-gray-600">Email</th>
                  <th className="text-left px-4 py-3 text-gray-600">Role</th>
                  <th className="text-left px-4 py-3 text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b border-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                    <td className="px-4 py-3 text-gray-500">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'OWNER' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.isSuspended ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {user.isSuspended ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleSuspendUser(user.id)}
                        className={`text-xs px-3 py-1 rounded-lg border ${
                          user.isSuspended
                            ? 'border-green-200 text-green-600 hover:bg-green-50'
                            : 'border-red-200 text-red-500 hover:bg-red-50'
                        }`}>
                        {user.isSuspended ? 'Unsuspend' : 'Suspend'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600">Bike</th>
                  <th className="text-left px-4 py-3 text-gray-600">Owner</th>
                  <th className="text-left px-4 py-3 text-gray-600">Price/day</th>
                  <th className="text-left px-4 py-3 text-gray-600">Bookings</th>
                  <th className="text-left px-4 py-3 text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {bikes.map(bike => (
                  <tr key={bike.id} className="border-b border-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-900">{bike.name}</td>
                    <td className="px-4 py-3 text-gray-500">{bike.owner?.name}</td>
                    <td className="px-4 py-3 text-blue-600 font-medium">₹{bike.pricePerDay}</td>
                    <td className="px-4 py-3 text-gray-500">{bike._count?.bookings}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        bike.isSuspended ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {bike.isSuspended ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleSuspendListing(bike.id)}
                        className={`text-xs px-3 py-1 rounded-lg border ${
                          bike.isSuspended
                            ? 'border-green-200 text-green-600 hover:bg-green-50'
                            : 'border-red-200 text-red-500 hover:bg-red-50'
                        }`}>
                        {bike.isSuspended ? 'Unsuspend' : 'Suspend'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600">Renter</th>
                  <th className="text-left px-4 py-3 text-gray-600">Bike</th>
                  <th className="text-left px-4 py-3 text-gray-600">Total</th>
                  <th className="text-left px-4 py-3 text-gray-600">Commission</th>
                  <th className="text-left px-4 py-3 text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking.id} className="border-b border-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-900">{booking.renter?.name}</td>
                    <td className="px-4 py-3 text-gray-500">{booking.bike?.name}</td>
                    <td className="px-4 py-3 text-blue-600 font-medium">₹{booking.totalCost}</td>
                    <td className="px-4 py-3 text-orange-500">₹{booking.commission?.toFixed(0)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'COMPLETED' ? 'bg-gray-100 text-gray-700' :
                        booking.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
                        booking.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                        booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'commission' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-md">
            <h2 className="font-semibold text-gray-900 mb-4">Platform commission rate</h2>
            <p className="text-sm text-gray-500 mb-4">
              Current rate applied to all new bookings
            </p>
            <div className="flex gap-3 items-center">
              <input
                type="number" min="1" max="50" value={commission}
                onChange={e => setCommission(e.target.value)}
                className="w-24 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-600">%</span>
              <button onClick={handleCommissionUpdate}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-blue-700">
                Update
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}