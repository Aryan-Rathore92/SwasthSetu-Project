import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const socketClient = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
    });

    socketClient.on('connect', () => {
      console.log('[Socket] Connected to SwasthSetu real-time gateway:', socketClient.id);

      if (user) {
        // Join facility channel
        const facId = user.facility?._id || user.facilityId?._id || user.facilityId || user.facility;
        if (facId) {
          socketClient.emit('join:facility', facId);
        }

        // Join doctor channel
        if (user.role === 'doctor') {
          socketClient.emit('join:doctor', user._id);
        }

        // Join patient channel
        if (user.role === 'patient') {
          socketClient.emit('join:patient', user._id);
        }

        // Join district channel
        if (user.role === 'district_admin') {
          socketClient.emit('join:district');
        }
      }
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
      if (user?.role === 'doctor' || user?.role === 'facility_admin') {
        toast.success(`📅 New Appointment: Token #${data.tokenNumber}`, {
          description: `Patient: ${data.patientId?.name || 'Patient'} (${data.mode})`,
        });
      }
    });

    setSocket(socketClient);

    return () => {
      socketClient.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};

