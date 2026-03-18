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

  const inputStyle = {
    background: '#fff', border: '1px solid #bfdbfe',
    borderRadius: 8, padding: '9px 14px',
    fontSize: 13, color: '#0c1e3d', outline: 'none',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f5ff' }}>
      <Navbar />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>

        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0c1e3d', marginBottom: 4 }}>
            Find a bike
          </h1>
          <p style={{ fontSize: 13, color: '#3b5e8a' }}>
            Browse available bikes near VIT AP campus
          </p>
        </div>

        <div style={{
          background: '#fff', borderRadius: 14,
          border: '0.5px solid #bfdbfe', padding: '16px 20px',
          marginBottom: 24, display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center'
        }}>
          <input placeholder="Search by bike or owner name..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle, flex: '1', minWidth: 200 }}/>

          <select value={type} onChange={e => setType(e.target.value)}
            style={{ ...inputStyle, minWidth: 130 }}>
            <option value="">All types</option>
            <option value="CYCLE">Cycle</option>
            <option value="SCOOTER">Scooter</option>
            <option value="MOPED">Moped</option>
          </select>

          <input placeholder="Min ₹" type="number" value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            style={{ ...inputStyle, width: 90 }}/>

          <input placeholder="Max ₹" type="number" value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            style={{ ...inputStyle, width: 90 }}/>

          <button onClick={() => { setSearch(''); setType(''); setMinPrice(''); setMaxPrice(''); }}
            style={{
              fontSize: 12, color: '#3b5e8a', background: 'none',
              border: 'none', cursor: 'pointer', padding: '4px 8px'
            }}>
            Clear
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#7aa3d4' }}>
            Loading bikes...
          </div>
        ) : bikes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#7aa3d4' }}>
            No bikes found
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 16
          }}>
            {bikes.map(bike => <BikeCard key={bike.id} bike={bike} />)}
          </div>
        )}
      </div>
    </div>
  );
}