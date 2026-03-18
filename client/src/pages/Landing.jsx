import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <span className="text-xl font-bold text-blue-600">CampusRide</span>
        <div className="flex gap-3">
          <Link to="/login"
            className="text-sm text-gray-600 hover:text-blue-600 px-4 py-2">
            Log in
          </Link>
          <Link to="/signup"
            className="text-sm bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700">
            Get started
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <span className="bg-blue-50 text-blue-600 text-sm px-4 py-2 rounded-full font-medium">
          Built for VIT AP University
        </span>
        <h1 className="text-5xl font-bold text-gray-900 mt-6 mb-4 leading-tight">
          Rent a bike.<br/>Explore campus life.
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          CampusRide connects students who need bikes with owners who have them.
          Real-time booking, transparent pricing, zero hassle.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/signup"
            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-medium hover:bg-blue-700 text-lg">
            Find a bike
          </Link>
          <Link to="/signup"
            className="border border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-medium hover:bg-gray-50 text-lg">
            List your bike
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              title: 'Real-time availability',
              desc: 'See which bikes are available right now. No more guessing or word of mouth.'
            },
            {
              title: 'Secure bookings',
              desc: 'Digital receipts, booking history, and a trust system that protects both sides.'
            },
            {
              title: 'Transparent pricing',
              desc: 'Know exactly what you pay. No hidden fees, no surprises at pickup.'
            },
          ].map(f => (
            <div key={f.title} className="bg-gray-50 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        CampusRide · Built for VIT AP University · ACM Student Chapter
      </footer>
    </div>
  );
}