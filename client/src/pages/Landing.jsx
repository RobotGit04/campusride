import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: '#f0f5ff' }}>

      <nav style={{
        background: '#0c1e3d',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: '#e8f0fe', letterSpacing: '-0.3px' }}>
          CampusRide
        </span>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link to="/login" style={{ fontSize: 13, color: '#7aa3d4', textDecoration: 'none' }}>
            Log in
          </Link>
          <Link to="/signup" style={{
            fontSize: 13, fontWeight: 600, padding: '7px 18px',
            borderRadius: 8, background: '#2563eb', color: '#fff',
            textDecoration: 'none'
          }}>
            Get started
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '60px 24px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{
            display: 'inline-block', fontSize: 12, fontWeight: 600,
            background: '#bfdbfe', color: '#0c1e3d', padding: '4px 14px',
            borderRadius: 20, marginBottom: 16, letterSpacing: '0.03em'
          }}>
            Built for VIT AP University
          </span>
          <h1 style={{
            fontSize: 48, fontWeight: 800, color: '#0c1e3d',
            lineHeight: 1.2, marginBottom: 16
          }}>
            Rent a bike.<br/>
            <span style={{ color: '#2563eb' }}>Explore campus life.</span>
          </h1>
          <p style={{
            fontSize: 16, color: '#3b5e8a', lineHeight: 1.7,
            maxWidth: 520, margin: '0 auto 32px'
          }}>
            CampusRide connects students who need bikes with owners who have them.
            Real-time booking, transparent pricing, zero hassle.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" style={{
              fontSize: 14, fontWeight: 600, padding: '12px 28px',
              borderRadius: 10, background: '#0c1e3d', color: '#e8f0fe',
              textDecoration: 'none'
            }}>
              Find a bike
            </Link>
            <Link to="/signup" style={{
              fontSize: 14, fontWeight: 600, padding: '12px 28px',
              borderRadius: 10, background: 'transparent', color: '#0c1e3d',
              border: '1.5px solid #1e40af', textDecoration: 'none'
            }}>
              List your bike
            </Link>
          </div>
        </div>

        <div style={{
          background: '#0c1e3d', borderRadius: 16,
          padding: '20px 32px', display: 'flex',
          justifyContent: 'space-around', flexWrap: 'wrap',
          gap: 16, marginBottom: 48
        }}>
          {[
            { num: '120+', label: 'Bikes listed' },
            { num: '800+', label: 'Students served' },
            { num: '4.8★', label: 'Avg rating' },
            { num: '₹0', label: 'Hidden fees' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#60a5fa' }}>{s.num}</div>
              <div style={{ fontSize: 11, color: '#7aa3d4', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 16, marginBottom: 48
        }}>
          {[
            {
              icon: '📅',
              title: 'Real-time availability',
              desc: 'See which bikes are available right now. No more guessing or word of mouth.'
            },
            {
              icon: '🔒',
              title: 'Secure bookings',
              desc: 'Digital receipts, booking history and a trust system that protects both sides.'
            },
            {
              icon: '💰',
              title: 'Transparent pricing',
              desc: 'Know exactly what you pay. No hidden fees, no surprises at pickup.'
            },
          ].map(f => (
            <div key={f.title} style={{
              background: '#fff', borderRadius: 14,
              border: '0.5px solid #bfdbfe', padding: '24px'
            }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0c1e3d', marginBottom: 8 }}>
                {f.title}
              </h3>
              <p style={{ fontSize: 13, color: '#3b5e8a', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        <div style={{
          background: '#0c1e3d', borderRadius: 16,
          padding: '40px 32px', textAlign: 'center'
        }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#e8f0fe', marginBottom: 12 }}>
            Ready to ride?
          </h2>
          <p style={{ fontSize: 14, color: '#7aa3d4', marginBottom: 24 }}>
            Join hundreds of VIT AP students already using CampusRide.
          </p>
          <Link to="/signup" style={{
            fontSize: 14, fontWeight: 600, padding: '12px 32px',
            borderRadius: 10, background: '#2563eb', color: '#fff',
            textDecoration: 'none', display: 'inline-block'
          }}>
            Create free account
          </Link>
        </div>
      </div>

      <footer style={{
        borderTop: '0.5px solid #bfdbfe',
        padding: '24px',
        textAlign: 'center',
        fontSize: 12,
        color: '#7aa3d4',
        background: '#f0f5ff'
      }}>
        CampusRide · Built for VIT AP University · ACM Student Chapter
      </footer>
    </div>
  );
}