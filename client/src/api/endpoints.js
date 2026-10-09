import api from './client.js';

// AUTH
export const authApi = {
  sendOtp: (phone) => api.post('/auth/send-otp', { phone }),
  register: (data) => api.post('/auth/register', data),
  login: (phone, otp) => api.post('/auth/login', { phone, otp }),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  getDemoAccounts: () => api.get('/auth/demo-accounts'),
};

// PATIENTS
export const patientApi = {
  create: (patientData) => api.post('/patients', patientData),
  getAll: (params) => api.get('/patients', { params }),
  getById: (id) => api.get(`/patients/${id}`),
  update: (id, data) => api.patch(`/patients/${id}`, data),
  getTimeline: (id) => api.get(`/patients/${id}/timeline`),
};

// TRIAGE
export const triageApi = {
  evaluate: (assessmentData) => api.post('/triage/evaluate', assessmentData),
  getHistory: (patientId) => api.get(`/triage/patient/${patientId}`),
};

// APPOINTMENTS & QUEUE
export const appointmentApi = {
  create: (data) => api.post('/appointments', data),
  getAll: (params) => api.get('/appointments', { params }),
  getById: (id) => api.get(`/appointments/${id}`),
  updateStatus: (id, status) => api.patch(`/appointments/${id}/status`, { status }),
  getQueue: (facilityId, params) => api.get(`/appointments/queue/${facilityId}`, { params }),
};

// TELECONSULTATION & PRESCRIPTIONS
export const teleApi = {
  start: (appointmentId) => api.post('/tele/start', { appointmentId }),
  getDetails: (id) => api.get(`/tele/${id}`),
  completeWithPrescription: (id, data) => api.post(`/tele/${id}/prescription`, data),
  getPdfDownloadUrl: (encounterId) => `${import.meta.env.VITE_API_URL || '/api'}/tele/prescription/${encounterId}/pdf`,
};

// REFERRALS
export const referralApi = {
  create: (data) => api.post('/referrals', data),
  getAll: (params) => api.get('/referrals', { params }),
  getById: (id) => api.get(`/referrals/${id}`),
  accept: (id, note) => api.patch(`/referrals/${id}/accept`, { note }),
  markArrived: (id, note) => api.patch(`/referrals/${id}/arrived`, { note }),
  close: (id, note) => api.patch(`/referrals/${id}/close`, { note }),
};

// MEDICINES & INVENTORY
export const medicineApi = {
  search: (params) => api.get('/medicines/search', { params }),
  getInventory: (params) => api.get('/inventory', { params }),
  addInventory: (data) => api.post('/inventory', data),
  updateInventory: (id, data) => api.patch(`/inventory/${id}`, data),
};

// FOLLOW-UPS
export const followupApi = {
  getDue: (params) => api.get('/followups/due', { params }),
  update: (id, data) => api.patch(`/followups/${id}`, data),
};

// EMERGENCY SOS
export const emergencyApi = {
  createSos: (data) => api.post('/emergency/sos', data),
  getAll: (params) => api.get('/emergency', { params }),
  updateStatus: (id, data) => api.patch(`/emergency/${id}/status`, data),
};

// DASHBOARDS
export const dashboardApi = {
  getPatient: () => api.get('/dashboard/patient'),
  getHealthWorker: () => api.get('/dashboard/health-worker'),
  getDoctor: () => api.get('/dashboard/doctor'),
  getFacility: (id) => api.get(`/dashboard/facility/${id}`),
  getDistrict: () => api.get('/dashboard/district'),
};

// FACILITIES
export const facilityApi = {
  getAll: (params) => api.get('/facilities', { params }),
  getById: (id) => api.get(`/facilities/${id}`),
  getDoctors: (id, params) => api.get(`/facilities/${id}/doctors`, { params }),
};

// AI
export const aiApi = {
  getSummary: (patientId) => api.post(`/ai/summary/${patientId}`),
};

