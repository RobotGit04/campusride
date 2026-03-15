import { useState, useEffect } from 'react';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import BikeCard from '../../components/BikeCard';

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Find a bike</h1>

        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-3">
          <input
            placeholder="Search by bike or owner name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-48 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select value={type} onChange={e => setType(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All types</option>
            <option value="CYCLE">Cycle</option>
            <option value="SCOOTER">Scooter</option>
            <option value="MOPED">Moped</option>
          </select>

          <input placeholder="Min price" type="number" value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            className="w-28 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>

          <input placeholder="Max price" type="number" value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            className="w-28 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>

          <button onClick={() => { setSearch(''); setType(''); setMinPrice(''); setMaxPrice(''); }}
            className="text-sm text-gray-500 hover:text-red-500 px-3">
            Clear
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading bikes...</div>
        ) : bikes.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No bikes found</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {bikes.map(bike => <BikeCard key={bike.id} bike={bike} />)}
          </div>
        )}
      </div>
    </div>
  );
}