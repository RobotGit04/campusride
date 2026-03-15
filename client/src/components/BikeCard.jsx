import { Link } from 'react-router-dom';

export default function BikeCard({ bike }) {
  return (
    <Link to={`/bikes/${bike.id}`}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition block">
      <div className="aspect-video bg-gray-100 overflow-hidden">
        {bike.photos?.[0] ? (
          <img src={bike.photos[0]} alt={bike.name}
            className="w-full h-full object-cover"/>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No photo
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-semibold text-gray-900">{bike.name}</h3>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            bike.isAvailable
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {bike.isAvailable ? 'Available' : 'Booked'}
          </span>
        </div>

        <p className="text-xs text-gray-500 mb-2 capitalize">{bike.type.toLowerCase()}</p>

        <div className="flex items-center justify-between">
          <span className="text-blue-600 font-semibold">₹{bike.pricePerDay}/day</span>
          {bike.avgRating && (
            <span className="text-xs text-gray-500">★ {bike.avgRating}</span>
          )}
        </div>

        <p className="text-xs text-gray-400 mt-1">by {bike.owner?.name}</p>
      </div>
    </Link>
  );
}