import { io } from 'socket.io-client';

export const initSocket = async () => {
  const options = {
    forceNew: true,
    reconnectionAttempts: Infinity,
    timeout: 10000,
    transports: ['websocket'],
  };

  const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000', options);

  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err.message);
    throw err;
  });

  return socket;
};
