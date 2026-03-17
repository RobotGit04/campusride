import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('OTP sent to your email!');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { email, otp, newPassword });
      toast.success('Password reset successfully!');
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-md p-8">

        {step === 1 && (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot password</h1>
            <p className="text-gray-500 mb-6">Enter your email to receive an OTP</p>
            <form onSubmit={handleSendOtp} className="space-y-4">
              <input type="email" placeholder="Your email" value={email}
                onChange={e => setEmail(e.target.value)} required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              <button type="submit" disabled={loading}
                className="w-full bg-blue-600 text-white rounded-xl py-3 font-medium hover:bg-blue-700 disabled:opacity-50">
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Enter OTP</h1>
            <p className="text-gray-500 mb-6">Check your email for the 6-digit OTP</p>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <input placeholder="6-digit OTP" value={otp}
                onChange={e => setOtp(e.target.value)} required maxLength={6}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              <input type="password" placeholder="New password" value={newPassword}
                onChange={e => setNewPassword(e.target.value)} required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              <button type="submit" disabled={loading}
                className="w-full bg-blue-600 text-white rounded-xl py-3 font-medium hover:bg-blue-700 disabled:opacity-50">
                {loading ? 'Resetting...' : 'Reset password'}
              </button>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Password reset!</h1>
            <p className="text-gray-500 mb-6">Your password has been reset successfully.</p>
            <Link to="/login"
              className="block w-full bg-blue-600 text-white rounded-xl py-3 font-medium hover:bg-blue-700 text-center">
              Back to login
            </Link>
          </>
        )}

        <p className="text-center text-sm text-gray-500 mt-4">
          <Link to="/login" className="text-blue-600">Back to login</Link>
        </p>
      </div>
    </div>
  );
}