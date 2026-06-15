import { io, Socket } from 'socket.io-client';
import { useEffect } from 'react';

const SOCKET_URL = 'http://localhost:3001';

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 10,
});

socket.on('connect', () => console.log('[WS] Connected'));
socket.on('disconnect', () => console.log('[WS] Disconnected'));

export function useSocketEvent(event: string, callback: (data: any) => void) {
  useEffect(() => {
    socket.on(event, callback);
    return () => { socket.off(event, callback); };
  }, [event, callback]);
}
