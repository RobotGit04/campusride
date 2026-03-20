import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const statusConfig = {
  PENDING:   { cls: 'bg-[#fef3c7] text-[#92400e]',   label: 'Pending' },
  CONFIRMED: { cls: 'bg-[#dbeafe] text-[#1e40af]',   label: 'Confirmed' },
  ACTIVE:    { cls: 'bg-[#dcfce7] text-[#166534]',   label: 'Active' },
  COMPLETED: { cls: 'bg-[#f3f4f6] text-[#374151]',   label: 'Completed' },
  CANCELLED: { cls: 'bg-[#fde8e8] text-[#991b1b]',   label: 'Cancelled' },
  REJECTED:  { cls: 'bg-[#fde8e8] text-[#991b1b]',   label: 'Rejected' },
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All Rides');
  const [ratingBooking, setRatingBooking] = useState(null);
  const [stars, setStars] = useState(5);
  const [review, setReview] = useState('');

  const tabs = ['All Rides', 'Active', 'Pending', 'Completed'];

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/renter');
      setBookings(res.data);
      setFiltered(res.data);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  useEffect(() => {
    if (activeTab === 'All Rides') {
      setFiltered(bookings);
    } else {
      setFiltered(bookings.filter(b => b.status === activeTab.toUpperCase()));
    }
  }, [activeTab, bookings]);

  const handleCancel = async (id) => {
    try {
      await api.put(`/bookings/${id}/cancel`);
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancel failed');
    }
  };

  const handleRating = async () => {
    try {
      await api.post('/ratings', { bookingId: ratingBooking, stars, review });
      toast.success('Rating submitted!');
      setRatingBooking(null);
      setReview('');
      setStars(5);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Rating failed');
    }
  };

  return (
    <div className="bg-background text-on-background antialiased font-body">
      <Navbar />

      <main className="pt-32 pb-20 px-6 md:px-16 max-w-7xl mx-auto min-h-screen">

        <section className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary tracking-tight mb-4">
            My Bookings
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl">
            Track your cycling journeys across campus. Manage your active rentals and plan your next ride.
          </p>
        </section>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-4 mb-10 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${
                activeTab === tab
                  ? 'bg-primary-container text-white shadow-md'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-on-surface-variant">Loading bookings...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-on-surface-variant text-lg mb-6">No bookings found</p>
            <Link to="/browse"
              className="bg-primary-container text-white font-bold px-8 py-3 rounded-lg hover:bg-secondary transition-all"
              style={{ textDecoration: 'none' }}>
              Browse bikes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filtered.map(booking => (
              <div
                key={booking.id}
                className="bg-surface-container-lowest rounded-[14px] p-6 flex flex-col md:flex-row gap-6"
                style={{ boxShadow: '0 10px 30px -5px rgba(12,30,61,0.06)' }}
              >
                <div className="md:w-1/3 shrink-0">
                  {booking.bike?.photos?.[0] ? (
                    <img
                      src={booking.bike.photos[0]}
                      alt={booking.bike.name}
                      className="w-full h-48 md:h-full object-cover rounded-xl shadow-inner"
                    />
                  ) : (
                    <div className="w-full h-48 rounded-xl bg-surface-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-5xl text-outline-variant">
                        directions_bike
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-3 py-1 text-[10px] font-bold tracking-widest rounded-full uppercase ${statusConfig[booking.status]?.cls}`}>
                        {booking.status}
                      </span>
                      <span className="text-[#2563eb] font-bold font-headline">₹{booking.totalCost}</span>
                    </div>

                    <h3 className="text-xl font-bold text-primary font-headline mb-1">
                      {booking.bike?.name}
                    </h3>
                    <p className="text-on-surface-variant text-sm flex items-center gap-1 mb-4">
                      <span className="material-symbols-outlined text-sm">person</span>
                      Owner: {booking.bike?.owner?.name}
                    </p>

                    <div className="space-y-2 text-sm text-on-surface">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-base">calendar_today</span>
                        <span>
                          {format(new Date(booking.startDate), 'dd MMM')} — {format(new Date(booking.endDate), 'dd MMM yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    {['PENDING', 'CONFIRMED'].includes(booking.status) && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        className="flex-1 py-2 rounded-lg border border-error text-error font-semibold text-sm hover:bg-error/5 transition-all"
                      >
                        Cancel
                      </button>
                    )}
                    {booking.status === 'COMPLETED' && !booking.rating && (
                      <button
                        onClick={() => setRatingBooking(booking.id)}
                        className="flex-1 py-2 rounded-lg bg-primary-container text-white font-semibold text-sm hover:bg-secondary transition-all"
                      >
                        Leave a review
                      </button>
                    )}
                    {booking.status === 'COMPLETED' && booking.rating && (
                      <span className="text-xs text-on-surface-variant font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-[#16a34a]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        Reviewed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Rating Modal */}
      {ratingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-md"
            style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
            <h3 className="font-headline font-bold text-xl text-primary mb-6">Leave a review</h3>

            <div className="flex gap-2 mb-6">
              {[1,2,3,4,5].map(s => (
                <button key={s} onClick={() => setStars(s)}
                  className={`text-3xl transition-colors ${s <= stars ? 'text-yellow-400' : 'text-slate-300'}`}>
                  ★
                </button>
              ))}
            </div>

            <textarea
              placeholder="Write your review (optional)"
              value={review}
              onChange={e => setReview(e.target.value)}
              rows={3}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-secondary/20 mb-6 resize-none"
            />

            <div className="flex gap-3">
              <button onClick={handleRating}
                className="flex-1 bg-primary-container text-white rounded-xl py-3 text-sm font-bold hover:bg-secondary transition-all">
                Submit
              </button>
              <button onClick={() => setRatingBooking(null)}
                className="flex-1 border border-slate-200 rounded-xl py-3 text-sm font-semibold text-on-surface-variant hover:bg-slate-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="w-full py-12 px-8 border-t border-[#dbe3f1] bg-[#f8f9ff]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-lg font-bold text-primary font-headline">CampusRide VIT AP</span>
          <p className="font-body text-sm text-slate-500">© 2025 CampusRide VIT AP. The Scholarly Kinetic.</p>
        </div>
      </footer>
    </div>
  );
}
