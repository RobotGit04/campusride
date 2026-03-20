import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

let socket;

export default function SocketProvider({ children }) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000');

    socket.on('connect', () => {
      socket.emit('join_room', user.id);
    });

    socket.on('new_notification', (data) => {
      toast(data.message, { icon: '🔔' });
    });

    socket.on('booking_update', (data) => {
      toast(`Booking ${data.status.toLowerCase()}: ${data.bikeName}`, {
        icon: data.status === 'CONFIRMED' ? '✅' : '❌',
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return children;
}