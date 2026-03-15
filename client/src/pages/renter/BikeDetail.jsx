import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import toast from 'react-hot-toast';

export default function BikeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [booking, setBooking] = useState(false);
  const [bookedDates, setBookedDates] = useState([]);

  useEffect(() => {
    api.get(`/bikes/${id}`)
      .then(res => {
        setBike(res.data);
        const dates = [];
        res.data.bookings?.forEach(b => {
          let current = new Date(b.startDate);
          while (current <= new Date(b.endDate)) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + 1);
          }
        });
        setBookedDates(dates);
      })
      .catch(() => toast.error('Bike not found'))
      .finally(() => setLoading(false));
  }, [id]);


  const calcCost = () => {
    if (!startDate || !endDate) return null;
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const total = days * bike.pricePerDay;
    const commission = total * 0.10;
    return { days, total, commission };
  };

  const handleBook = async () => {
    if (!startDate || !endDate) return toast.error('Please select dates');
    setBooking(true);
    try {
      await api.post('/bookings', {
        bikeId: id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      toast.success('Booking request sent!');
      navigate('/my-bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="text-center py-20 text-gray-400">Loading...</div>
    </div>
  );

  if (!bike) return null;

  const cost = calcCost();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          <div>
            <div className="rounded-2xl overflow-hidden bg-gray-100 aspect-video mb-4">
              {bike.photos?.[0] ? (
                <img src={bike.photos[0]} alt={bike.name} className="w-full h-full object-cover"/>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No photo</div>
              )}
            </div>

            {bike.photos?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {bike.photos.slice(1).map((photo, i) => (
                  <img key={i} src={photo} alt="" className="w-20 h-20 object-cover rounded-xl shrink-0"/>
                ))}
              </div>
            )}

            <div className="mt-6">
              <h1 className="text-2xl font-bold text-gray-900">{bike.name}</h1>
              <p className="text-sm text-gray-500 capitalize mt-1">{bike.type.toLowerCase()}</p>
              <p className="text-gray-600 mt-3">{bike.description}</p>

              <div className="flex items-center gap-4 mt-4">
                <span className="text-2xl font-bold text-blue-600">₹{bike.pricePerDay}/day</span>
                {bike.avgRating && <span className="text-gray-500">★ {bike.avgRating}</span>}
              </div>

              <div className="mt-3 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                <p className="text-sm text-yellow-800">Security deposit: ₹{bike.deposit}</p>
              </div>

              <div className="mt-4 flex items-center gap-3">
                {bike.owner?.photo && (
                  <img src={bike.owner.photo} alt="" className="w-10 h-10 rounded-full object-cover"/>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">{bike.owner?.name}</p>
                  <p className="text-xs text-gray-500">{bike.owner?.phone}</p>
                </div>
              </div>
            </div>

            {bike.ratings?.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Reviews</h3>
                <div className="space-y-3">
                  {bike.ratings.map(r => (
                    <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-yellow-500">{'★'.repeat(r.stars)}</span>
                        <span className="text-sm font-medium text-gray-700">{r.rater?.name}</span>
                      </div>
                      {r.review && <p className="text-sm text-gray-600">{r.review}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
              <h2 className="font-bold text-gray-900 text-lg mb-4">Book this bike</h2>

              {!bike.isAvailable ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                  <p className="text-red-600 font-medium">Currently booked</p>
                  <p className="text-red-400 text-sm mt-1">Check back later</p>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="text-sm text-gray-600 mb-1 block">Start date</label>
                    <DatePicker
                      selected={startDate}
                      onChange={date => setStartDate(date)}
                      minDate={new Date()}
                      excludeDates={bookedDates}
                      placeholderText="Select start date"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="text-sm text-gray-600 mb-1 block">End date</label>
                    <DatePicker
                      selected={endDate}
                      onChange={date => setEndDate(date)}
                      minDate={startDate || new Date()}
                      excludeDates={bookedDates}
                      placeholderText="Select end date"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {cost && (
                    <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">₹{bike.pricePerDay} × {cost.days} days</span>
                        <span className="font-medium">₹{cost.total}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Platform fee (10%)</span>
                        <span className="text-gray-600">₹{cost.commission.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
                        <span>Total</span>
                        <span className="text-blue-600">₹{cost.total}</span>
                      </div>
                      <p className="text-xs text-gray-400">+ ₹{bike.deposit} refundable deposit</p>
                    </div>
                  )}

                  <button onClick={handleBook} disabled={booking || !startDate || !endDate}
                    className="w-full bg-blue-600 text-white rounded-xl py-3 font-medium hover:bg-blue-700 transition disabled:opacity-50">
                    {booking ? 'Sending request...' : 'Request to book'}
                  </button>

                  <p className="text-xs text-gray-400 text-center mt-2">
                    Owner will confirm your request
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}