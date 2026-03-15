import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingBooking, setRatingBooking] = useState(null);
  const [stars, setStars] = useState(5);
  const [review, setReview] = useState('');

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/renter');
      setBookings(res.data);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

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
      await api.post('/ratings', {
        bookingId: ratingBooking,
        stars,
        review,
      });
      toast.success('Rating submitted!');
      setRatingBooking(null);
      setReview('');
      setStars(5);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Rating failed');
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h1>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">No bookings yet</p>
            <Link to="/browse"
              className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm hover:bg-blue-700">
              Browse bikes
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => (
              <div key={booking.id}
                className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0">
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
                          Owner: {booking.bike?.owner?.name}
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
                      <span className="font-medium text-blue-600">₹{booking.totalCost}</span>
                    </div>

                    <div className="mt-3 flex gap-2">
                      {['PENDING', 'CONFIRMED'].includes(booking.status) && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          className="text-xs border border-red-200 text-red-500 px-3 py-1 rounded-lg hover:bg-red-50">
                          Cancel
                        </button>
                      )}
                      {booking.status === 'COMPLETED' && !booking.rating && (
                        <button
                          onClick={() => setRatingBooking(booking.id)}
                          className="text-xs border border-blue-200 text-blue-500 px-3 py-1 rounded-lg hover:bg-blue-50">
                          Leave a review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {ratingBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="font-bold text-gray-900 mb-4">Leave a review</h3>

              <div className="flex gap-2 mb-4">
                {[1,2,3,4,5].map(s => (
                  <button key={s} onClick={() => setStars(s)}
                    className={`text-2xl ${s <= stars ? 'text-yellow-400' : 'text-gray-300'}`}>
                    ★
                  </button>
                ))}
              </div>

              <textarea
                placeholder="Write your review (optional)"
                value={review}
                onChange={e => setReview(e.target.value)}
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"/>

              <div className="flex gap-3">
                <button onClick={handleRating}
                  className="flex-1 bg-blue-600 text-white rounded-xl py-2 text-sm font-medium hover:bg-blue-700">
                  Submit
                </button>
                <button onClick={() => setRatingBooking(null)}
                  className="flex-1 border border-gray-200 rounded-xl py-2 text-sm text-gray-600 hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}