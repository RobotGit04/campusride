import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-gray-200">404</h1>
        <p className="text-xl font-semibold text-gray-700 mt-4">Page not found</p>
        <p className="text-gray-400 mt-2">The page you're looking for doesn't exist.</p>
        <Link to="/"
          className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700">
          Go home
        </Link>
      </div>
    </div>
  );
}