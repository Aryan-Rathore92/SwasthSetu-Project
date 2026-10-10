import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'http';
import dotenv from 'dotenv';
import { Server as SocketServer } from 'socket.io';

dotenv.config();

import app from '../app.js';
import { initSocket } from '../sockets/socketHandler.js';

let server;
let socketServer;
let baseUrl;

test.before(async () => {
  await new Promise((resolve) => {
    server = http.createServer(app);
    socketServer = new SocketServer(server, {
      cors: { origin: true, methods: ['GET', 'POST'], credentials: true },
    });
    initSocket(socketServer);
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
});

test.after(async () => {
  await new Promise((resolve) => {
    socketServer.close(resolve);
  });
});

// Helper for HTTP requests
const request = async (path, options = {}) => {
  const url = `${baseUrl}${path}`;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const res = await fetch(url, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('json')) {
    const data = await res.json();
    return { status: res.status, data, headers: res.headers };
  } else {
    const buffer = await res.arrayBuffer();
    return { status: res.status, buffer, headers: res.headers };
  }
};

test('1. Health Check Endpoint', async () => {
  const res = await request('/api/health');
  assert.equal(res.status, 200);
  assert.equal(res.data.status, 'healthy');
  assert.equal(res.data.demoMode, true);
});

test('2. Demo Accounts Listing', async () => {
  const res = await request('/api/auth/demo-accounts');
  assert.equal(res.status, 200);
  assert.equal(res.data.success, true);
  assert.ok(Array.isArray(res.data.data));
  assert.ok(res.data.data.length >= 5);
  
  const roles = res.data.data.map(u => u.role);
  assert.ok(roles.includes('patient'));
  assert.ok(roles.includes('health_worker'));
  assert.ok(roles.includes('doctor'));
  assert.ok(roles.includes('facility_admin'));
  assert.ok(roles.includes('district_admin'));
});

test('3. Authentication Flow for All 5 Roles', async () => {
  const testRoles = [
    { phone: '9876543210', role: 'patient' },
    { phone: '9876543211', role: 'health_worker' },
    { phone: '9876543212', role: 'doctor' },
    { phone: '9876543213', role: 'facility_admin' },
    { phone: '9876543214', role: 'district_admin' },
  ];

  for (const item of testRoles) {
    const otpRes = await request('/api/auth/send-otp', {
      method: 'POST',
      body: { phone: item.phone },
    });
    assert.equal(otpRes.status, 200);
    assert.equal(otpRes.data.success, true);
    assert.equal(otpRes.data.demoOtp, '123456');

    const loginRes = await request('/api/auth/login', {
      method: 'POST',
      body: { phone: item.phone, otp: '123456' },
    });
    assert.equal(loginRes.status, 200);
    assert.equal(loginRes.data.success, true);
    assert.ok(loginRes.data.data.token);
    assert.equal(loginRes.data.data.user.role, item.role);
  }
});

test('3d. Session verification, logout, and Socket.IO are available on the API server', async () => {
  const login = await request('/api/auth/login', {
    method: 'POST',
    body: { phone: '9876543210', otp: '123456' },
  });
  assert.equal(login.status, 200);

  const headers = { Authorization: `Bearer ${login.data.data.token}` };
  const session = await request('/api/auth/me', { headers });
  assert.equal(session.status, 200);
  assert.equal(session.data.success, true);

  const logout = await request('/api/auth/logout', { method: 'POST', headers });
  assert.equal(logout.status, 200);
  assert.equal(logout.data.success, true);

  const socket = await fetch(`${baseUrl}/socket.io/?EIO=4&transport=polling`);
  assert.equal(socket.status, 200);
  assert.match(await socket.text(), /^0/);
});

test('3a. Registration is repeatable and duplicate phones return a clear conflict', async () => {
  const registration = {
    name: 'Repeat Test Patient',
    phone: '9999999988',
    age: 28,
    gender: 'Other',
    village: 'Test Village',
  };

  const registrationAttempts = await Promise.all([
    request('/api/auth/register', { method: 'POST', body: registration }),
    request('/api/auth/register', { method: 'POST', body: registration }),
  ]);
  const firstRegistration = registrationAttempts.find((result) => result.status === 201);
  const duplicateRegistration = registrationAttempts.find((result) => result.status !== 201);
  assert.ok(firstRegistration);
  assert.ok(duplicateRegistration);
  assert.equal(firstRegistration.status, 201);
  assert.equal(firstRegistration.data.success, true);
  assert.ok(firstRegistration.data.data.token);

  const anotherDuplicate = await request('/api/auth/register', {
    method: 'POST',
    body: registration,
  });
  assert.equal(duplicateRegistration.status, 409);
  assert.equal(anotherDuplicate.status, 409);
  assert.equal(anotherDuplicate.data.code, 'PHONE_ALREADY_REGISTERED');

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const loginRes = await request('/api/auth/login', {
      method: 'POST',
      body: { phone: registration.phone, otp: '123456' },
    });
    assert.equal(loginRes.status, 200);
    assert.equal(loginRes.data.success, true);
    assert.ok(loginRes.data.data.token);
  }
});

test('3b. Registration validates input without returning an internal error', async () => {
  const invalidRegistration = await request('/api/auth/register', {
    method: 'POST',
    body: {
      name: 'Invalid Age',
      phone: '9999999989',
      age: 'not-a-number',
      gender: 'Other',
      village: 'Test Village',
    },
  });
  assert.equal(invalidRegistration.status, 400);
  assert.equal(invalidRegistration.data.success, false);
});

test('3c. Concurrent registrations for different phones receive unique identities', async () => {
  const registrations = await Promise.all([
    request('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Concurrent Test One',
        phone: '9999999984',
        age: 31,
        gender: 'Female',
        village: 'Test Village',
      },
    }),
    request('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Concurrent Test Two',
        phone: '9999999985',
        age: 32,
        gender: 'Male',
        village: 'Test Village',
      },
    }),
  ]);

  assert.ok(registrations.every((result) => result.status === 201));
  assert.notEqual(registrations[0].data.data.user._id, registrations[1].data.data.user._id);
  assert.notEqual(registrations[0].data.data.patientId, registrations[1].data.data.patientId);
});

test('4. Deterministic Clinical Triage Engine with Bilingual Explanations', async () => {
  // Login as Health Worker
  const hwLogin = await request('/api/auth/login', {
    method: 'POST',
    body: { phone: '9876543211', otp: '123456' },
  });
  const token = hwLogin.data.data.token;

  // Test RED urgency
  const redPayload = {
    patientId: 'pat-10001',
    vitals: { heartRate: 140, oxygenLevel: 87, systolicBP: 185, diastolicBP: 115, temperature: 103 },
    symptoms: ['Chest Pain', 'Shortness of Breath'],
  };
  const redRes = await request('/api/triage/evaluate', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: redPayload,
  });
  assert.equal(redRes.status, 201);
  assert.equal(redRes.data.success, true);
  assert.equal(redRes.data.data.finalLevel, 'RED');
  assert.ok(redRes.data.data.explanationEnglish.length > 0);
  assert.ok(redRes.data.data.explanationHindi.length > 0);

  // Test GREEN urgency
  const greenPayload = {
    patientId: 'pat-10002',
    vitals: { heartRate: 72, oxygenLevel: 98, systolicBP: 118, diastolicBP: 78, temperature: 98.4 },
    symptoms: ['Mild Cough'],
  };
  const greenRes = await request('/api/triage/evaluate', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: greenPayload,
  });
  assert.equal(greenRes.status, 201);
  assert.equal(greenRes.data.success, true);
  assert.equal(greenRes.data.data.finalLevel, 'GREEN');
});

test('5. Medicine Locator with Haversine Geolocation', async () => {
  // Login as Patient
  const patLogin = await request('/api/auth/login', {
    method: 'POST',
    body: { phone: '9876543210', otp: '123456' },
  });
  const token = patLogin.data.data.token;

  const res = await request('/api/medicines/search?q=Paracetamol&lat=27.5684&lng=80.6829&district=Sitapur', {
    headers: { Authorization: `Bearer ${token}` },
  });
  assert.equal(res.status, 200);
  assert.equal(res.data.success, true);
  assert.ok(Array.isArray(res.data.data));
  assert.ok(res.data.data.length > 0);
  assert.ok(typeof res.data.data[0].distanceKm === 'number' || res.data.data[0].distanceKm === null);
  assert.ok(res.data.data[0].quantity > 0);
});

test('6. Emergency SOS Dispatch', async () => {
  const res = await request('/api/emergency/sos', {
    method: 'POST',
    body: {
      reporterName: 'Ramesh Patel',
      reporterPhone: '9876543210',
      address: 'Near Rampur Gram Panchayat',
      notes: 'Sudden acute chest compression',
    },
  });
  assert.equal(res.status, 201);
  assert.equal(res.data.success, true);
  assert.ok(res.data.data._id);
  assert.equal(res.data.data.severity, 'CRITICAL');
});

test('7. Authenticated Role Dashboards', async () => {
  // Doctor Dashboard
  const docLogin = await request('/api/auth/login', {
    method: 'POST',
    body: { phone: '9876543212', otp: '123456' },
  });
  const docToken = docLogin.data.data.token;

  const docDash = await request('/api/dashboard/doctor', {
    headers: { Authorization: `Bearer ${docToken}` },
  });
  assert.equal(docDash.status, 200);
  assert.equal(docDash.data.success, true);
  assert.ok(docDash.data.data.todayAppointments);

  // Health Worker Dashboard
  const hwLogin = await request('/api/auth/login', {
    method: 'POST',
    body: { phone: '9876543211', otp: '123456' },
  });
  const hwDash = await request('/api/dashboard/health-worker', {
    headers: { Authorization: `Bearer ${hwLogin.data.data.token}` },
  });
  assert.equal(hwDash.status, 200);
  assert.equal(hwDash.data.success, true);
  assert.ok(hwDash.data.data.totalPatients > 0);

  // District Admin Dashboard
  const distLogin = await request('/api/auth/login', {
    method: 'POST',
    body: { phone: '9876543214', otp: '123456' },
  });
  const distToken = distLogin.data.data.token;

  const distDash = await request('/api/dashboard/district', {
    headers: { Authorization: `Bearer ${distToken}` },
  });
  assert.equal(distDash.status, 200);
  assert.equal(distDash.data.success, true);
  assert.ok(distDash.data.data.facilities);
  assert.ok(distDash.data.data.charts);
});

test('8. HL7 FHIR R4 Patient Export Endpoint', async () => {
  const distLogin = await request('/api/auth/login', {
    method: 'POST',
    body: { phone: '9876543214', otp: '123456' },
  });
  const token = distLogin.data.data.token;

  const res = await request('/fhir/Patient/P-10001', {
    headers: { Authorization: `Bearer ${token}` },
  });
  assert.equal(res.status, 200);
  assert.equal(res.data.resourceType, 'Patient');
  assert.equal(res.data.id, 'P-10001');
  assert.ok(Array.isArray(res.data.name));
  assert.ok(Array.isArray(res.data.telecom));
});

test('9. Printable PDFKit Prescription Generation', async () => {
  // Use seeded encounter enc-001
  const res = await request('/api/tele/prescription/enc-001/pdf');
  assert.equal(res.status, 200);
  const ct = res.headers.get('content-type');
  assert.ok(ct.includes('application/pdf'));
  assert.ok(res.buffer.byteLength > 1000);
});
