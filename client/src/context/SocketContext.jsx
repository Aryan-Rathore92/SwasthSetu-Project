import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

const joinUserRooms = (socket, user) => {
  if (!user) return;

  const facId = user.facility?._id || user.facilityId?._id || user.facilityId || user.facility;
  if (facId) socket.emit('join:facility', facId);
  if (user.role === 'doctor') socket.emit('join:doctor', user._id);
  if (user.role === 'patient') socket.emit('join:patient', user._id);
  if (user.role === 'district_admin') socket.emit('join:district');
};

const leaveUserRooms = (socket, user) => {
  if (!user) return;

  const facId = user.facility?._id || user.facilityId?._id || user.facilityId || user.facility;
  if (facId) socket.emit('leave:facility', facId);
  if (user.role === 'doctor') socket.emit('leave:doctor', user._id);
  if (user.role === 'patient') socket.emit('leave:patient', user._id);
  if (user.role === 'district_admin') socket.emit('leave:district');
};

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const [socket, setSocket] = useState(null);
  const userRef = useRef(user);
  const previousUserRef = useRef(user);

  userRef.current = user;

  useEffect(() => {
    if (loading || !isAuthenticated) {
      setSocket(null);
      return undefined;
    }

    const socketUrl = import.meta.env.VITE_SOCKET_URL || window.location.origin;
    const socketClient = io(socketUrl, {
      transports: ['polling', 'websocket'],
      reconnectionAttempts: 5,
    });

    socketClient.on('connect', () => {
      console.log('[Socket] Connected to SwasthSetu real-time gateway:', socketClient.id);
      joinUserRooms(socketClient, userRef.current);
    });

    // Real-time Event Handlers
    socketClient.on('emergency:new', (alertData) => {
      toast.error(`🚨 Emergency SOS Alert Triggered!`, {
        description: `Location: ${alertData.location?.address || 'Community area'} | Severity: ${alertData.severity}`,
        duration: 8000,
      });
    });

    socketClient.on('referral:update', (referralData) => {
      toast.info(`🔄 Referral Update: Status is now '${referralData.status}'`, {
        description: `Patient: ${referralData.patientId?.name || 'Patient'} -> ${referralData.toFacilityId?.name || 'Destination'}`,
      });
    });

    socketClient.on('queue:update', (data) => {
      console.log('[Socket] Queue status refreshed:', data);
    });

    socketClient.on('appointment:created', (data) => {
      const currentUser = userRef.current;
      if (currentUser?.role === 'doctor' || currentUser?.role === 'facility_admin') {
        toast.success(`📅 New Appointment: Token #${data.tokenNumber}`, {
          description: `Patient: ${data.patientId?.name || 'Patient'} (${data.mode})`,
        });
      }
    });

    setSocket(socketClient);

    return () => {
      socketClient.disconnect();
    };
  }, [isAuthenticated, loading]);

  useEffect(() => {
    if (!socket?.connected) {
      previousUserRef.current = user;
      return;
    }

    if (previousUserRef.current !== user) {
      leaveUserRooms(socket, previousUserRef.current);
    }
    joinUserRooms(socket, user);
    previousUserRef.current = user;
  }, [socket, user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
