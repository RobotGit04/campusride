import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="w-full py-12 border-t border-[#dbe3f1] bg-[#f8f9ff]">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="flex flex-col gap-2">
        <span className="font-headline font-bold text-primary-container text-xl block mb-2">CampusRide</span>
        <p className="font-body text-xs text-slate-500 leading-relaxed">
          Transforming the way students move across VIT AP. Efficiency meets sustainability in every pedal.
        </p>
      </div>
      {[
        { title: 'Platform', links: ['Browse Bikes', 'Pricing', 'Campus Map'] },
        { title: 'Support', links: ['Help Center', 'Privacy Policy', 'Terms of Service'] },
        { title: 'Connect', links: ['VIT AP University'] },
      ].map(col => (
        <div key={col.title}>
          <h4 className="font-headline font-bold text-xs uppercase tracking-widest text-primary-container mb-4">
            {col.title}
          </h4>
          <div className="flex flex-col gap-2">
            {col.links.map(link => (
              <a key={link} href="#"
                className="text-xs text-slate-500 hover:text-primary-container transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
    <div className="max-w-7xl mx-auto px-6 mt-8 pt-6 border-t border-[#dbe3f1] flex justify-between items-center">
      <p className="text-xs text-slate-400">CampusRide.Ride like a breeze</p>
      <span className="text-xs text-green-500 font-semibold flex items-center gap-1">
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse inline-block"/>
        All systems operational
      </span>
    </div>
  </footer>
);

export default function Landing() {
  return (
    <div className="bg-background font-body text-on-background min-h-screen">

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center h-16 px-6 md:px-12 font-headline font-semibold tracking-tight"
        style={{ background: 'rgba(12,30,61,0.9)', backdropFilter: 'blur(12px)', boxShadow: '0 4px 20px rgba(0,5,22,0.2)' }}>
        <div className="flex items-center gap-8">
          <span className="text-2xl font-bold text-white tracking-tighter">CampusRide</span>
          <div className="hidden md:flex gap-2">
            <Link to="/browse" className="text-slate-300 hover:text-white hover:bg-white/10 rounded-lg px-3 py-1 transition-all text-sm" style={{ textDecoration: 'none' }}>Browse</Link>
            <a href="#" className="text-slate-300 hover:text-white hover:bg-white/10 rounded-lg px-3 py-1 transition-all text-sm" style={{ textDecoration: 'none' }}>My Bookings</a>
            <a href="#" className="text-slate-300 hover:text-white hover:bg-white/10 rounded-lg px-3 py-1 transition-all text-sm" style={{ textDecoration: 'none' }}>Dashboard</a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-slate-300 hover:text-white text-sm font-medium px-3 py-1 transition-all" style={{ textDecoration: 'none' }}>
            Login
          </Link>
          <Link to="/signup" className="bg-secondary text-white text-sm font-bold px-5 py-2 rounded-lg hover:bg-primary-container transition-all" style={{ textDecoration: 'none' }}>
            Get Started
          </Link>
          <button className="p-2 text-slate-300 hover:bg-white/10 rounded-lg transition-all">
            <span className="material-symbols-outlined text-xl">notifications</span>
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-16 min-h-screen flex items-center"
        style={{ background: 'linear-gradient(135deg, #0c1e3d 0%, #1a2f52 60%, #0f1f3d 100%)' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">
          <div>
            <span className="inline-block bg-secondary/20 text-blue-300 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6 border border-secondary/30">
              Built for VIT AP University
            </span>
            <h1 className="font-headline text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4">
              Rent a bike.<br/>
              <span className="text-secondary">Explore</span> campus life.
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-lg">
              The premier cycling ecosystem for students and faculty. Turn your idle bicycle into earnings or navigate the VIT AP campus with academic velocity.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link to="/signup"
                className="bg-secondary text-white font-headline font-bold px-8 py-4 rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2 active:scale-95"
                style={{ textDecoration: 'none' }}>
                Find a bike
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Link>
              <Link to="/signup"
                className="border border-slate-500 text-white font-headline font-semibold px-8 py-4 rounded-lg hover:bg-white/10 transition-all"
                style={{ textDecoration: 'none' }}>
                List your bike
              </Link>
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600"
                alt="Bike on campus"
                className="w-full h-64 object-cover rounded-xl"
              />
              <div className="absolute bottom-8 left-8 bg-white rounded-xl px-4 py-3 flex items-center gap-3 shadow-xl">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-sm">directions_bike</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Standard MTB</p>
                  <p className="text-[10px] text-green-500 font-medium">Available near Block 1</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary py-6">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { num: '120+', label: 'Active Bikes' },
            { num: '800+', label: 'Students' },
            { num: '4.8★', label: 'Student Rating' },
            { num: '₹0', label: 'Hidden Fees' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="font-headline text-3xl font-extrabold text-secondary">{s.num}</div>
              <div className="text-xs uppercase tracking-widest text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-headline text-4xl font-bold text-primary tracking-tight mb-3">
            Redefining Campus Mobility
          </h2>
          <div className="w-16 h-1 bg-secondary rounded-full mb-12"/>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: 'location_on',
                title: 'Real-time availability',
                desc: 'Locate the nearest bicycle instantly via our interactive campus map.',
                link: 'Explore Map'
              },
              {
                icon: 'verified_user',
                title: 'Secure bookings',
                desc: 'OTP-verified booking system ensures only authorized students access the fleet.',
                link: 'Trust Center'
              },
              {
                icon: 'payments',
                title: 'Transparent pricing',
                desc: 'Simple hourly rates with no deposits. What you see is exactly what you pay.',
                link: 'View Rates'
              },
            ].map(f => (
              <div key={f.title}
                className="p-8 rounded-xl border border-slate-200 hover:shadow-lg transition-all"
                style={{ background: '#ffffff' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-6"
                  style={{ background: '#eef4ff' }}>
                  <span className="material-symbols-outlined" style={{ color: '#0051d5' }}>{f.icon}</span>
                </div>
                <h3 className="font-headline font-bold text-lg mb-3" style={{ color: '#141c26' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: '#44474e' }}>{f.desc}</p>
                <a href="#" className="text-sm font-semibold flex items-center gap-1"
                  style={{ color: '#0051d5', textDecoration: 'none' }}>
                  {f.link}
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </a>
                </div>
            ))}      
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 rounded-2xl overflow-hidden relative min-h-64 flex items-end p-8"
            style={{ background: '#0c1e3d' }}>
            <div className="absolute top-6 right-6 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: '#0051d5' }}>
              24/7 SUPPORT
            </div>
            <div>
              <h3 className="font-headline text-2xl font-bold text-white mb-2">
                Widespread Campus Coverage
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                From Central Library to Hostels, our network spans every corner of the VIT AP ecosystem.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-2xl p-6 flex flex-col gap-3" style={{ background: '#0051d5' }}>
              <span className="material-symbols-outlined text-white text-3xl">bolt</span>
              <h3 className="font-headline font-bold text-white text-lg">Instant Unlock</h3>
              <p className="text-blue-200 text-sm">Scan QR and ride in under 10 seconds.</p>
            </div>
            <div className="rounded-2xl p-6 flex flex-col gap-3 border border-slate-200"
              style={{ background: '#ffffff' }}>
              <span className="material-symbols-outlined text-green-500 text-3xl">eco</span>
              <h3 className="font-headline font-bold text-lg" style={{ color: '#141c26' }}>Green Transit</h3>
              <p className="text-sm" style={{ color: '#44474e' }}>
                Join 800+ students in reducing the campus carbon footprint.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 mx-6 md:mx-12 rounded-2xl mb-12" style={{ background: '#0c1e3d' }}>
        <div className="text-center px-6">
          <h2 className="font-headline text-4xl font-extrabold text-white mb-4">Ready to ride?</h2>
          <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto">
            Join the scholarship-speed movement. Sign up through your VIT AP institutional ID today.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/signup"
              className="text-white font-headline font-bold px-10 py-4 rounded-lg transition-all"
              style={{ background: '#0051d5', textDecoration: 'none' }}>
              Get Started Now
            </Link>
            <span className="text-slate-500 text-sm">No paperwork required.</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}