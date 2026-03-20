import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const statusColors = {
  PENDING: 'bg-[#fef3c7] text-[#92400e]',
  CONFIRMED: 'bg-[#dbeafe] text-[#1e40af]',
  ACTIVE: 'bg-[#dcfce7] text-[#166534]',
  COMPLETED: 'bg-[#f3f4f6] text-[#374151]',
  CANCELLED: 'bg-[#fde8e8] text-[#991b1b]',
  REJECTED: 'bg-[#fde8e8] text-[#991b1b]',
};

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

  const totalEarnings = bookings
    .filter(b => ['CONFIRMED', 'ACTIVE', 'COMPLETED'].includes(b.status))
    .reduce((sum, b) => sum + b.netPayout, 0);

  const totalCommission = bookings
    .filter(b => ['CONFIRMED', 'ACTIVE', 'COMPLETED'].includes(b.status))
    .reduce((sum, b) => sum + b.commission, 0);

  return (
    <div className="bg-background font-body text-on-background antialiased">
      <Navbar />

      <main className="pt-32 pb-20 px-6 md:px-16 max-w-7xl mx-auto">

        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-primary font-headline tracking-tight mb-2">
            Owner Dashboard
          </h1>
          <p className="text-on-surface-variant font-medium">
            Here's what's happening with your fleet today.
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div
            className="bg-surface-container-lowest p-8 rounded-[14px] flex flex-col justify-between h-48 group hover:translate-y-[-4px] transition-all duration-300 border-l-4 border-slate-400"
            style={{ boxShadow: '0 10px 30px -5px rgba(12,30,61,0.06)' }}
          >
            <div className="flex justify-between items-start">
              <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
                <span className="material-symbols-outlined">calendar_month</span>
              </div>
              <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">Overview</span>
            </div>
            <div>
              <h3 className="text-slate-500 font-semibold text-sm mb-1">Total Bookings</h3>
              <p className="text-4xl font-extrabold text-primary font-headline">{bookings.length}</p>
            </div>
          </div>

          <div
            className="bg-surface-container-lowest p-8 rounded-[14px] flex flex-col justify-between h-48 border-l-4 border-[#16a34a] group hover:translate-y-[-4px] transition-all duration-300"
            style={{ boxShadow: '0 10px 30px -5px rgba(12,30,61,0.06)' }}
          >
            <div className="flex justify-between items-start">
              <div className="p-3 bg-emerald-50 text-[#16a34a] rounded-xl">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  payments
                </span>
              </div>
              <span className="text-[#16a34a] text-xs font-bold tracking-widest uppercase">Net Payout</span>
            </div>
            <div>
              <h3 className="text-slate-500 font-semibold text-sm mb-1">Net Earnings</h3>
              <p className="text-4xl font-extrabold text-[#16a34a] font-headline">
                ₹{totalEarnings.toFixed(0)}
              </p>
            </div>
          </div>

          <div
            className="bg-surface-container-lowest p-8 rounded-[14px] flex flex-col justify-between h-48 border-l-4 border-[#ea580c] group hover:translate-y-[-4px] transition-all duration-300"
            style={{ boxShadow: '0 10px 30px -5px rgba(12,30,61,0.06)' }}
          >
            <div className="flex justify-between items-start">
              <div className="p-3 bg-orange-50 text-[#ea580c] rounded-xl">
                <span className="material-symbols-outlined">account_balance_wallet</span>
              </div>
              <span className="text-[#ea580c] text-xs font-bold tracking-widest uppercase">Flat 10% Rate</span>
            </div>
            <div>
              <h3 className="text-slate-500 font-semibold text-sm mb-1">Commission Paid</h3>
              <p className="text-4xl font-extrabold text-[#ea580c] font-headline">
                ₹{totalCommission.toFixed(0)}
              </p>
            </div>
          </div>
        </div>

        {/* Booking Requests */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-primary font-headline">Booking Requests</h2>
            <Link to="/owner/listings"
              className="flex items-center gap-2 text-secondary font-semibold text-sm hover:underline"
              style={{ textDecoration: 'none' }}>
              My Bikes
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-20 text-on-surface-variant">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-20 text-on-surface-variant">No bookings yet</div>
          ) : (
            <div className="space-y-6">
              {bookings.map(booking => (
                <div
                  key={booking.id}
                  className="bg-surface-container-lowest rounded-[14px] overflow-hidden flex flex-col lg:flex-row border border-outline-variant/10"
                  style={{ boxShadow: '0 10px 30px -5px rgba(12,30,61,0.06)' }}
                >
                  {/* Bike Info */}
                  <div className="lg:w-1/4 p-6 bg-surface-container-low/30">
                    {booking.bike?.photos?.[0] ? (
                      <img
                        src={booking.bike.photos[0]}
                        alt={booking.bike.name}
                        className="w-full h-40 object-cover rounded-xl shadow-sm mb-4"
                      />
                    ) : (
                      <div className="w-full h-40 rounded-xl bg-surface-container flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-5xl text-outline-variant">
                          directions_bike
                        </span>
                      </div>
                    )}
                    <h4 className="font-headline font-bold text-primary">{booking.bike?.name}</h4>
                    <p className="text-sm text-on-surface-variant capitalize">
                      {booking.bike?.type?.toLowerCase()}
                    </p>
                  </div>

                  {/* Details */}
                  <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 gap-8 border-l border-outline-variant/10">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-white font-bold">
                          {booking.renter?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Renter</p>
                          <p className="font-bold text-primary">{booking.renter?.name}</p>
                          <p className="text-xs text-secondary font-medium">{booking.renter?.email}</p>
                        </div>
                      </div>

                      <div className="pt-4 space-y-2">
                        <div className="flex items-center gap-3 text-on-surface-variant">
                          <span className="material-symbols-outlined text-sm">calendar_today</span>
                          <span className="text-sm font-medium">
                            {format(new Date(booking.startDate), 'dd MMM')} — {format(new Date(booking.endDate), 'dd MMM yyyy')}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[booking.status]}`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="bg-surface-container-low/50 p-6 rounded-xl space-y-3">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Cost Breakdown
                      </p>
                      <div className="flex justify-between text-sm">
                        <span className="text-on-surface-variant">Total Paid</span>
                        <span className="font-semibold text-primary">₹{booking.totalCost}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-on-surface-variant">Commission (10%)</span>
                        <span className="font-semibold text-[#ea580c]">₹{booking.commission?.toFixed(0)}</span>
                      </div>
                      <div className="pt-2 border-t border-outline-variant/20 flex justify-between">
                        <span className="font-bold text-primary">You Get</span>
                        <span className="font-bold text-[#16a34a]">₹{booking.netPayout?.toFixed(0)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-8 bg-surface-container-lowest flex flex-col justify-center gap-3 lg:w-64 border-l border-outline-variant/10">
                    {booking.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleStatus(booking.id, 'CONFIRMED')}
                          className="w-full bg-[#16a34a] text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-all active:scale-95"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatus(booking.id, 'REJECTED')}
                          className="w-full border-2 border-red-500 text-red-500 font-bold py-2.5 px-6 rounded-lg hover:bg-red-50 transition-all active:scale-95"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {booking.status === 'CONFIRMED' && (
                      <>
                        <button
                          onClick={() => handleStatus(booking.id, 'COMPLETED')}
                          className="w-full bg-[#2563eb] text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-all active:scale-95"
                        >
                          Mark as completed
                        </button>
                        <p className="text-[10px] text-center text-slate-400 font-medium px-4">
                          Wait for bike return before completion
                        </p>
                      </>
                    )}
                    {['COMPLETED', 'CANCELLED', 'REJECTED'].includes(booking.status) && (
                      <span className={`text-center text-sm font-bold px-3 py-2 rounded-lg ${statusColors[booking.status]}`}>
                        {booking.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="w-full py-12 px-8 border-t border-[#dbe3f1]/20 bg-[#f8f9ff]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-lg font-bold text-primary font-headline">CampusRide VIT AP</span>
          <p className="font-body text-sm text-slate-500">© 2025 CampusRide VIT AP. The Scholarly Kinetic.</p>
        </div>
      </footer>
    </div>
  );
}
