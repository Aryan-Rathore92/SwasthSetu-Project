import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

// Middlewares
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Route modules
import authRoutes from './modules/auth/auth.routes.js';
import patientRoutes from './modules/patient/patient.routes.js';
import triageRoutes from './modules/triage/triage.routes.js';
import appointmentRoutes from './modules/appointment/appointment.routes.js';
import teleRoutes from './modules/tele/tele.routes.js';
import referralRoutes from './modules/referral/referral.routes.js';
import inventoryRoutes from './modules/inventory/inventory.routes.js';
import followupRoutes from './modules/followup/followup.routes.js';
import emergencyRoutes from './modules/emergency/emergency.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';
import facilityRoutes from './modules/facility/facility.routes.js';
import aiRoutes from './modules/ai/ai.routes.js';
import { getFhirPatient } from './modules/fhir/fhir.controller.js';
import { authenticate } from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false, // Allows Jitsi Meet iframe in browser
}));

app.use(cors({
  origin: true, // Allow any local development origin (localhost, 127.0.0.1, LAN)
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500, // Generous limit for demonstration
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
});
app.use('/api', limiter);

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'SwasthSetu Rural Healthcare Coordination Platform',
    timestamp: new Date().toISOString(),
    demoMode: process.env.DEMO_MODE === 'true',
  });
});

// Mounted API Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/triage', triageRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/tele', teleRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/medicines', inventoryRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/followups', followupRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/ai', aiRoutes);

// FHIR R4 Interoperability Demonstration Endpoint
app.get('/fhir/Patient/:id', authenticate, getFhirPatient);
app.get('/api/fhir/Patient/:id', authenticate, getFhirPatient);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

