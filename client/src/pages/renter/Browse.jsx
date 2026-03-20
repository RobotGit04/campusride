import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/Navbar';

export default function Browse() {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = {};
      if (search) params.search = search;
      if (type) params.type = type;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      api.get('/bikes', { params })
        .then(res => setBikes(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [search, type, minPrice, maxPrice]);

  const clearFilters = () => {
    setSearch(''); setType(''); setMinPrice(''); setMaxPrice('');
  };

  const typeLabels = { CYCLE: 'Cycle', SCOOTER: 'Scooter', MOPED: 'Moped' };

  return (
    <div className="bg-background font-body text-on-background antialiased min-h-screen">
      <Navbar />

      <main className="pt-32 pb-20 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">

        <header className="mb-12">
          <h1 className="text-5xl font-extrabold font-headline text-primary-container tracking-tight mb-4">
            Find a bike
          </h1>
          <p className="text-on-surface-variant max-w-2xl font-body text-lg">
            Select your preferred scholarly kinetic companion for cross-campus transit.
          </p>
        </header>

        {/* Filter Bar */}
        <div className="mb-10 p-6 bg-white rounded-xl flex flex-wrap gap-4 items-end shadow-sm border border-[#bfdbfe]">
          <div className="flex-1 min-w-[240px]">
            <label className="block text-xs font-bold text-on-surface-variant mb-2 font-headline uppercase tracking-wider">
              Search
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
                search
              </span>
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-slate-200 rounded-lg focus:ring-2 focus:ring-secondary/20 font-body outline-none text-on-surface text-sm"
                placeholder="Search models or owners..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                type="text"
              />
            </div>
          </div>

          <div className="w-full md:w-40">
            <label className="block text-xs font-bold text-on-surface-variant mb-2 font-headline uppercase tracking-wider">
              Type
            </label>
            <select
              className="w-full px-4 py-2.5 bg-surface-container-lowest border border-slate-200 rounded-lg focus:ring-2 focus:ring-secondary/20 font-body outline-none text-on-surface text-sm cursor-pointer"
              value={type}
              onChange={e => setType(e.target.value === 'All' ? '' : e.target.value)}
            >
              <option value="">All</option>
              <option value="CYCLE">Cycle</option>
              <option value="SCOOTER">Scooter</option>
              <option value="MOPED">Moped</option>
            </select>
          </div>

          <div className="w-full md:w-32">
            <label className="block text-xs font-bold text-on-surface-variant mb-2 font-headline uppercase tracking-wider">
              Min Price
            </label>
            <input
              className="w-full px-4 py-2.5 bg-surface-container-lowest border border-slate-200 rounded-lg focus:ring-2 focus:ring-secondary/20 font-body outline-none text-on-surface text-sm"
              placeholder="₹0"
              type="number"
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
            />
          </div>

          <div className="w-full md:w-32">
            <label className="block text-xs font-bold text-on-surface-variant mb-2 font-headline uppercase tracking-wider">
              Max Price
            </label>
            <input
              className="w-full px-4 py-2.5 bg-surface-container-lowest border border-slate-200 rounded-lg focus:ring-2 focus:ring-secondary/20 font-body outline-none text-on-surface text-sm"
              placeholder="₹999"
              type="number"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
            />
          </div>

          <button
            onClick={clearFilters}
            className="px-6 py-2.5 font-bold text-secondary hover:bg-slate-50 rounded-lg transition-colors font-headline text-sm flex items-center gap-2 border border-transparent"
          >
            <span className="material-symbols-outlined text-lg">close</span>
            Clear
          </button>
        </div>

        {/* Bike Grid */}
        {loading ? (
          <div className="text-center py-20 text-on-surface-variant font-headline text-lg">
            Loading bikes...
          </div>
        ) : bikes.length === 0 ? (
          <div className="text-center py-20 text-on-surface-variant font-headline text-lg">
            No bikes found. Try adjusting your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {bikes.map(bike => (
              <Link
                key={bike.id}
                to={`/bikes/${bike.id}`}
                style={{ textDecoration: 'none' }}
                className="group bg-surface-container-lowest rounded-[14px] p-4 border border-[#bfdbfe] hover:-translate-y-2 transition-all duration-300 block"
                style={{ boxShadow: '0 10px 30px -5px rgba(12,30,61,0.06)' }}
              >
                <div className="relative mb-4 overflow-hidden rounded-xl bg-surface-container-low">
                  {bike.photos?.[0] ? (
                    <img
                      src={bike.photos[0]}
                      alt={bike.name}
                      className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-44 flex items-center justify-center bg-surface-container">
                      <span className="material-symbols-outlined text-6xl text-outline-variant">
                        directions_bike
                      </span>
                    </div>
                  )}
                  <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm ${
                    bike.isAvailable
                      ? 'bg-[#bfdbfe] text-primary-container'
                      : 'bg-[#fde8e8] text-red-700'
                  }`}>
                    {bike.isAvailable ? 'Available' : 'Booked'}
                  </div>
                </div>

                <div className="px-2">
                  <div className="flex justify-between items-start mb-1.5">
                    <h3 className="font-headline font-bold text-base text-primary-container">
                      {bike.name}
                    </h3>
                    <span className="text-[#2563eb] font-bold font-headline">
                      ₹{bike.pricePerDay}/day
                    </span>
                  </div>
                  <p className="text-on-surface-variant text-xs mb-4">
                    {typeLabels[bike.type] || bike.type}
                    {bike.avgRating && ` • ★ ${bike.avgRating}`}
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-surface-container-highest">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white text-xs font-bold">
                      {bike.owner?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-[10px]">
                      <p className="font-semibold text-on-surface">{bike.owner?.name}</p>
                      <p className="text-on-surface-variant">VIT AP Campus</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-8 border-t border-slate-200 bg-white font-body text-sm text-slate-500">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <div className="space-y-4">
            <span className="text-lg font-bold text-primary-container font-headline">CampusRide</span>
            <p className="leading-relaxed">Connecting students and faculty through high-performance sustainable transit.</p>
          </div>
          <div className="space-y-4">
            <h4 className="font-headline font-bold text-primary-container uppercase tracking-widest text-[10px]">Ecosystem</h4>
            <ul className="space-y-2">
              {['Campus Map', 'Fleet Status', 'Parking Zones'].map(l => (
                <li key={l}><a href="#" className="hover:text-secondary transition-all">{l}</a></li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-headline font-bold text-primary-container uppercase tracking-widest text-[10px]">Support</h4>
            <ul className="space-y-2">
              {['Terms of Service', 'Privacy Policy', 'Help Center'].map(l => (
                <li key={l}><a href="#" className="hover:text-secondary transition-all">{l}</a></li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-headline font-bold text-primary-container uppercase tracking-widest text-[10px]">Contact</h4>
            <p>Support VIT AP Campus<br/>Andhra Pradesh, India</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2025 CampusRide VIT AP. The Scholarly Kinetic.</p>
          <div className="flex gap-6">
            <a href="#" className="text-secondary font-medium hover:underline">Terms of Service</a>
            <a href="#" className="hover:text-secondary hover:underline">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
