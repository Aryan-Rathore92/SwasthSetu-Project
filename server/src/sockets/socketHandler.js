let ioInstance = null;

export const initSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // Join room for facility
    socket.on('join:facility', (facilityId) => {
      if (facilityId) {
        socket.join(`facility:${facilityId}`);
        console.log(`[Socket] ${socket.id} joined facility:${facilityId}`);
      }
    });
    socket.on('leave:facility', (facilityId) => {
      if (facilityId) socket.leave(`facility:${facilityId}`);
    });

    // Join room for doctor
    socket.on('join:doctor', (doctorId) => {
      if (doctorId) {
        socket.join(`doctor:${doctorId}`);
        console.log(`[Socket] ${socket.id} joined doctor:${doctorId}`);
      }
    });
    socket.on('leave:doctor', (doctorId) => {
      if (doctorId) socket.leave(`doctor:${doctorId}`);
    });

    // Join room for patient
    socket.on('join:patient', (patientId) => {
      if (patientId) {
        socket.join(`patient:${patientId}`);
        console.log(`[Socket] ${socket.id} joined patient:${patientId}`);
      }
    });
    socket.on('leave:patient', (patientId) => {
      if (patientId) socket.leave(`patient:${patientId}`);
    });

    // Join room for district admin
    socket.on('join:district', () => {
      socket.join('district');
      console.log(`[Socket] ${socket.id} joined district channel`);
    });
    socket.on('leave:district', () => {
      socket.leave('district');
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => ioInstance;

export const emitToFacility = (facilityId, event, data) => {
  if (ioInstance && facilityId) {
    ioInstance.to(`facility:${facilityId}`).emit(event, data);
  }
};

export const emitToDoctor = (doctorId, event, data) => {
  if (ioInstance && doctorId) {
    ioInstance.to(`doctor:${doctorId}`).emit(event, data);
  }
};

export const emitToPatient = (patientId, event, data) => {
  if (ioInstance && patientId) {
    ioInstance.to(`patient:${patientId}`).emit(event, data);
  }
};

export const emitToDistrict = (event, data) => {
  if (ioInstance) {
    ioInstance.to('district').emit(event, data);
  }
};
