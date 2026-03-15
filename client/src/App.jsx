import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthProvider from './context/AuthProvider';
import { useAuth } from './hooks/useAuth';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Browse from './pages/renter/Browse';
import BikeDetail from './pages/renter/BikeDetail';
import MyBookings from './pages/renter/MyBookings';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import OwnerListings from './pages/owner/OwnerListings';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/browse" element={<ProtectedRoute roles={['RENTER']}><Browse /></ProtectedRoute>} />
          <Route path="/owner/dashboard" element={<ProtectedRoute roles={['OWNER']}><div>Owner dashboard coming soon</div></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute roles={['ADMIN']}><div>Admin dashboard coming soon</div></ProtectedRoute>} />
          <Route path="/bikes/:id" element={<ProtectedRoute roles={['RENTER']}><BikeDetail /></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute roles={['RENTER']}><MyBookings /></ProtectedRoute>} />
          <Route path="/owner/dashboard" element={<ProtectedRoute roles={['OWNER']}><OwnerDashboard /></ProtectedRoute>} />
<Route path="/owner/listings" element={<ProtectedRoute roles={['OWNER']}><OwnerListings /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;