import { Link } from 'react-router-dom';

export default function BikeCard({ bike }) {
  return (
    <Link to={`/bikes/${bike.id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: '#fff', borderRadius: 14,
        border: '0.5px solid #bfdbfe', overflow: 'hidden',
        transition: 'transform 0.15s, box-shadow 0.15s',
        cursor: 'pointer',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(12,30,61,0.1)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}>

        <div style={{
          aspectRatio: '16/9', background: '#e8f0fe',
          overflow: 'hidden', display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}>
          {bike.photos?.[0] ? (
            <img src={bike.photos[0]} alt={bike.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
          ) : (
            <span style={{ fontSize: 40 }}>🚲</span>
          )}
        </div>

        <div style={{ padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: 4 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0c1e3d' }}>{bike.name}</h3>
            <span style={{
              fontSize: 10, fontWeight: 600, padding: '3px 8px',
              borderRadius: 20,
              background: bike.isAvailable ? '#bfdbfe' : '#fde8e8',
              color: bike.isAvailable ? '#0c1e3d' : '#8b1a1a',
            }}>
              {bike.isAvailable ? 'Available' : 'Booked'}
            </span>
          </div>

          <p style={{ fontSize: 11, color: '#7aa3d4', marginBottom: 10, textTransform: 'capitalize' }}>
            {bike.type.toLowerCase()}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#2563eb' }}>
              ₹{bike.pricePerDay}/day
            </span>
            {bike.avgRating && (
              <span style={{ fontSize: 12, color: '#3b5e8a' }}>★ {bike.avgRating}</span>
            )}
          </div>

          <p style={{ fontSize: 11, color: '#7aa3d4', marginTop: 4 }}>
            by {bike.owner?.name}
          </p>
        </div>
      </div>
    </Link>
  );
}