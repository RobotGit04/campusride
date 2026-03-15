import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function OwnerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/owner');
      setBookings(res.data);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      toast.success(`Booking ${status.toLowerCase()}`);
      fetchBookings();
    } catch {
      toast.error('Failed to update booking');
    }
  };

  const statusColor = (status) => {
    const map = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      CONFIRMED: 'bg-blue-100 text-blue-700',
      ACTIVE: 'bg-green-100 text-green-700',
      COMPLETED: 'bg-gray-100 text-gray-700',
      CANCELLED: 'bg-red-100 text-red-700',
      REJECTED: 'bg-red-100 text-red-700',
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  };

  const totalEarnings = bookings
    .filter(b => ['CONFIRMED', 'ACTIVE', 'COMPLETED'].includes(b.status))
    .reduce((sum, b) => sum + b.netPayout, 0);

  const totalCommission = bookings
    .filter(b => ['CONFIRMED', 'ACTIVE', 'COMPLETED'].includes(b.status))
    .reduce((sum, b) => sum + b.commission, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Owner Dashboard</h1>
          <Link to="/owner/listings"
            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-blue-700">
            My Bikes
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Total bookings</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{bookings.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Net earnings</p>
            <p className="text-3xl font-bold text-green-600 mt-1">₹{totalEarnings.toFixed(0)}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Commission paid</p>
            <p className="text-3xl font-bold text-orange-500 mt-1">₹{totalCommission.toFixed(0)}</p>
          </div>
        </div>

        <h2 className="font-semibold text-gray-900 mb-4">Booking requests</h2>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No bookings yet</div>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => (
              <div key={booking.id}
                className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    {booking.bike?.photos?.[0] ? (
                      <img src={booking.bike.photos[0]} alt=""
                        className="w-full h-full object-cover"/>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No photo
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{booking.bike?.name}</h3>
                        <p className="text-sm text-gray-500">
                          Renter: {booking.renter?.name} · {booking.renter?.phone}
                        </p>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                      <span>
                        {format(new Date(booking.startDate), 'dd MMM yyyy')} →{' '}
                        {format(new Date(booking.endDate), 'dd MMM yyyy')}
                      </span>
                    </div>

                    <div className="mt-2 flex gap-4 text-sm">
                      <span className="text-gray-600">Total: <span className="font-medium">₹{booking.totalCost}</span></span>
                      <span className="text-orange-500">Commission: ₹{booking.commission.toFixed(0)}</span>
                      <span className="text-green-600">You get: ₹{booking.netPayout.toFixed(0)}</span>
                    </div>

                    {booking.status === 'PENDING' && (
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => handleStatus(booking.id, 'CONFIRMED')}
                          className="text-xs bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-700">
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatus(booking.id, 'REJECTED')}
                          className="text-xs border border-red-200 text-red-500 px-4 py-1.5 rounded-lg hover:bg-red-50">
                          Reject
                        </button>
                      </div>
                    )}
                    {booking.status === 'CONFIRMED' && (
                      <div className="mt-3">
                        <button
                          onClick={() => handleStatus(booking.id, 'COMPLETED')}
                          className="text-xs bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700">
                          Mark as completed
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}