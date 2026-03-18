import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthProvider from './context/AuthProvider';
import { useAuth } from './hooks/useAuth';
import SocketProvider from './context/SocketProvider';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import Browse from './pages/renter/Browse';
import BikeDetail from './pages/renter/BikeDetail';
import MyBookings from './pages/renter/MyBookings';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import OwnerListings from './pages/owner/OwnerListings';
import AdminDashboard from './pages/admin/AdminDashboard';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">
      Loading...
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/browse" element={
              <ProtectedRoute roles={['RENTER']}>
                <Browse />
              </ProtectedRoute>
            }/>
            <Route path="/bikes/:id" element={
              <ProtectedRoute roles={['RENTER']}>
                <BikeDetail />
              </ProtectedRoute>
            }/>
            <Route path="/my-bookings" element={
              <ProtectedRoute roles={['RENTER']}>
                <MyBookings />
              </ProtectedRoute>
            }/>
            <Route path="/owner/dashboard" element={
              <ProtectedRoute roles={['OWNER']}>
                <OwnerDashboard />
              </ProtectedRoute>
            }/>
            <Route path="/owner/listings" element={
              <ProtectedRoute roles={['OWNER']}>
                <OwnerListings />
              </ProtectedRoute>
            }/>
            <Route path="/admin/dashboard" element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }/>
            <Route path="/notifications" element={
              <ProtectedRoute roles={['RENTER', 'OWNER', 'ADMIN']}>
                <Notifications />
              </ProtectedRoute>
            }/>
            <Route path="/profile" element={
              <ProtectedRoute roles={['RENTER', 'OWNER', 'ADMIN']}>
                <Profile />
              </ProtectedRoute>
            }/>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;