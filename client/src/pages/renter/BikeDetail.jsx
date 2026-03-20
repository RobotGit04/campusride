import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  const [selectedPhoto, setSelectedPhoto] = useState(0);

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
    if (days <= 0) return null;
    const total = days * bike.pricePerDay;
    const commission = total * 0.10;
    return { days, total, commission };
  };

  const handleBook = async () => {
    if (!startDate || !endDate) return toast.error('Please select dates');
    const cost = calcCost();
    if (!cost || cost.days <= 0) return toast.error('Invalid date range');
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
    <div className="bg-background min-h-screen font-body">
      <Navbar />
      <div className="text-center pt-48 text-on-surface-variant font-headline text-lg">Loading...</div>
    </div>
  );

  if (!bike) return null;

  const cost = calcCost();
  const typeLabels = { CYCLE: 'Cycle', SCOOTER: 'Scooter', MOPED: 'Moped' };

  return (
    <div className="bg-background text-on-background antialiased font-body">
      <Navbar />

      <main className="mt-32 max-w-7xl mx-auto px-6 md:px-12 pb-24">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-on-surface-variant text-sm">
          <Link to="/browse" className="hover:text-secondary" style={{ textDecoration: 'none' }}>Browse</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-on-surface font-semibold">{bike.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* Left Column */}
          <div className="flex-1 space-y-12">

            {/* Gallery */}
            <section className="space-y-4">
              <div className="rounded-[14px] overflow-hidden bg-surface-container-highest aspect-[16/10]">
                {bike.photos?.[selectedPhoto] ? (
                  <img
                    src={bike.photos[selectedPhoto]}
                    alt={bike.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-surface-container">
                    <span className="material-symbols-outlined text-9xl text-outline-variant">
                      directions_bike
                    </span>
                  </div>
                )}
              </div>

              {bike.photos?.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {bike.photos.slice(0, 4).map((photo, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedPhoto(i)}
                      className={`rounded-xl overflow-hidden cursor-pointer transition-opacity ${
                        selectedPhoto === i ? 'ring-2 ring-secondary' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={photo} alt="" className="w-full h-24 object-cover"/>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Info */}
            <section className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-extrabold text-primary tracking-tight">{bike.name}</h1>
                    <span className="bg-primary/5 text-primary text-[10px] uppercase font-bold px-2.5 py-1 rounded tracking-wider border border-primary/10">
                      {typeLabels[bike.type]}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-on-surface-variant">
                    {bike.avgRating && (
                      <>
                        <span className="flex items-center gap-1 font-semibold text-secondary">
                          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          {bike.avgRating}
                        </span>
                        <span>•</span>
                      </>
                    )}
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      VIT AP Campus
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">
                    ₹{bike.pricePerDay}
                    <span className="text-sm font-normal text-on-surface-variant">/day</span>
                  </div>
                </div>
              </div>

              {/* Deposit Notice */}
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg flex gap-4 items-start">
                <span className="material-symbols-outlined text-amber-600">info</span>
                <div>
                  <h4 className="font-bold text-amber-900 text-sm uppercase tracking-wider">
                    Refundable Deposit Required
                  </h4>
                  <p className="text-amber-800 text-sm mt-1">
                    A safety deposit of ₹{bike.deposit} will be held during the rental period and refunded after return.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-primary">Description</h3>
                <p className="text-on-surface-variant leading-relaxed">{bike.description}</p>
              </div>

              <hr className="border-outline-variant/20"/>

              {/* Owner */}
              <div className="flex items-center justify-between bg-surface-container-low p-6 rounded-[14px]">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-white text-xl font-bold">
                    {bike.owner?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-primary">Hosted by {bike.owner?.name}</h4>
                    <p className="text-sm text-on-surface-variant">VIT AP Campus Owner</p>
                    {bike.owner?.phone && (
                      <p className="text-sm text-on-surface-variant mt-0.5">{bike.owner.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              <hr className="border-outline-variant/20"/>

              {/* Reviews */}
              {bike.ratings?.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-primary">
                    Reviews ({bike.ratings.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bike.ratings.map(r => (
                      <div
                        key={r.id}
                        className="bg-surface-container-lowest p-6 rounded-xl"
                        style={{ boxShadow: '0 10px 30px -5px rgba(12,30,61,0.06)' }}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            {r.rater?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-on-surface text-sm">{r.rater?.name}</p>
                            <span className="text-yellow-400 text-sm">{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</span>
                          </div>
                        </div>
                        {r.review && <p className="text-on-surface-variant text-sm leading-relaxed">{r.review}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Right Column — Booking Card */}
          <div className="lg:w-96 shrink-0">
            <div
              className="bg-surface-container-lowest rounded-[14px] p-8 sticky top-28"
              style={{ boxShadow: '0 10px 30px -5px rgba(12,30,61,0.06)', border: '1px solid #bfdbfe' }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-headline font-bold text-xl text-primary">Book this bike</h2>
                <span className="text-2xl font-extrabold text-[#2563eb] font-headline">
                  ₹{bike.pricePerDay}<span className="text-sm font-normal text-on-surface-variant">/day</span>
                </span>
              </div>

              {!bike.isAvailable ? (
                <div className="bg-[#fde8e8] border border-red-200 rounded-xl p-6 text-center">
                  <p className="text-red-600 font-bold font-headline">Currently Booked</p>
                  <p className="text-red-400 text-sm mt-1">Check back later for availability</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                        Start Date
                      </label>
                      <DatePicker
                        selected={startDate}
                        onChange={date => setStartDate(date)}
                        minDate={new Date()}
                        excludeDates={bookedDates}
                        placeholderText="Select start date"
                        className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-secondary/20 bg-surface-container-lowest"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                        End Date
                      </label>
                      <DatePicker
                        selected={endDate}
                        onChange={date => setEndDate(date)}
                        minDate={startDate || new Date()}
                        excludeDates={bookedDates}
                        placeholderText="Select end date"
                        className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-secondary/20 bg-surface-container-lowest"
                      />
                    </div>
                  </div>

                  {cost && (
                    <div className="bg-surface-container-low p-5 rounded-xl mb-6 space-y-3">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Price Breakdown</p>
                      <div className="flex justify-between text-sm">
                        <span className="text-on-surface-variant">₹{bike.pricePerDay} × {cost.days} days</span>
                        <span className="font-semibold text-primary">₹{cost.total}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-on-surface-variant">Platform fee (10%)</span>
                        <span className="text-[#ea580c] font-semibold">₹{cost.commission.toFixed(0)}</span>
                      </div>
                      <div className="pt-2 border-t border-outline-variant/20 flex justify-between">
                        <span className="font-bold text-primary">Total</span>
                        <span className="font-bold text-[#2563eb]">₹{cost.total}</span>
                      </div>
                      <p className="text-xs text-slate-400">+ ₹{bike.deposit} refundable deposit</p>
                    </div>
                  )}

                  <button
                    onClick={handleBook}
                    disabled={booking || !startDate || !endDate}
                    className="w-full bg-primary-container text-white font-headline font-bold py-4 rounded-xl hover:bg-primary transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {booking ? 'Sending request...' : 'Request to Book'}
                  </button>

                  <p className="text-xs text-center text-on-surface-variant mt-3">
                    Owner will confirm your request within 24 hours
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-12 px-8 border-t border-[#dbe3f1] bg-[#f8f9ff]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-lg font-bold text-primary font-headline">CampusRide VIT AP</span>
          <p className="font-body text-sm text-slate-500">© 2025 CampusRide VIT AP. The Scholarly Kinetic.</p>
        </div>
      </footer>
    </div>
  );
}
