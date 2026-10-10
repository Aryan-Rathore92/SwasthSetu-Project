import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { randomUUID } from 'node:crypto';
import { User } from '../../models/User.js';
import { memoryStore } from '../../config/memoryStore.js';

export const sendOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    const isDemo = process.env.DEMO_MODE === 'true';
    const demoOtp = isDemo ? (process.env.DEMO_OTP || '123456') : null;

    res.json({
      success: true,
      message: isDemo ? 'Demo OTP sent successfully (Use 123456)' : 'OTP sent successfully',
      demoOtp: isDemo ? demoOtp : undefined,
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Phone number and OTP are required' });
    }

    const expectedOtp = process.env.DEMO_OTP || '123456';
    if (otp !== expectedOtp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP entered. (For hackathon demo, enter 123456)',
        code: 'INVALID_OTP',
      });
    }

    let user = null;
    if (mongoose.connection.readyState === 1) {
      user = await User.findOne({ phone }).populate('facilityId');
    } else {
      user = memoryStore.users.find(u => u.phone === phone);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user account found registered with phone ${phone}. Please use one of the seeded demo accounts.`,
        code: 'USER_NOT_FOUND',
      });
    }

    const secret = process.env.JWT_SECRET || 'swasthsetu_hackathon_jwt_secret_2026_super_safe';
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        phone: user.phone,
      },
      secret,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          phone: user.phone,
          role: user.role,
          facility: user.facilityId,
          department: user.department,
          registrationNumber: user.registrationNumber,
          language: user.language,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: req.user,
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (err) {
    next(err);
  }
};

export const getDemoAccounts = async (req, res, next) => {
  try {
    const roles = ['patient', 'health_worker', 'doctor', 'facility_admin', 'district_admin'];
    let userList = [];

    if (mongoose.connection.readyState === 1) {
      userList = await User.find({ role: { $in: roles } }).populate('facilityId');
    } else {
      userList = memoryStore.users;
    }

    const uniqueByRole = {};
    userList.forEach(u => {
      if (!uniqueByRole[u.role]) {
        uniqueByRole[u.role] = {
          name: u.name,
          phone: u.phone,
          role: u.role,
          facilityName: u.facilityId?.name || (u.role === 'district_admin' ? 'District Administration HQ' : 'Community Care'),
          department: u.department,
          otp: '123456',
        };
      }
    });

    res.json({
      success: true,
      data: Object.values(uniqueByRole),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Self-registration — creates a new Patient user account and linked Patient record.
 * Immediately issues a JWT so the user is logged in right after registration.
 */
export const registerSelf = async (req, res, next) => {
  try {
    const { name, phone, age, gender, village, district = 'Sitapur', address = '' } = req.body;

    const normalizedName = typeof name === 'string' ? name.trim() : '';
    const normalizedPhone = typeof phone === 'string' ? phone.trim() : '';
    const normalizedVillage = typeof village === 'string' ? village.trim() : '';
    const normalizedAge = Number(age);

    if (!normalizedName || !normalizedPhone || !age || !gender || !normalizedVillage) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields: name, phone, age, gender, and village.',
      });
    }

    if (!/^\d{10}$/.test(normalizedPhone)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit mobile number.' });
    }

    if (!Number.isInteger(normalizedAge) || normalizedAge < 1 || normalizedAge > 120) {
      return res.status(400).json({ success: false, message: 'Please enter a valid age between 1 and 120.' });
    }

    if (!['Male', 'Female', 'Other'].includes(gender)) {
      return res.status(400).json({ success: false, message: 'Please select a valid gender.' });
    }

    if (typeof district !== 'string' || !district.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter a valid district.' });
    }

    const secret = process.env.JWT_SECRET || 'swasthsetu_hackathon_jwt_secret_2026_super_safe';

    // ── MongoDB mode ──────────────────────────────────────────────────────────
    if (mongoose.connection.readyState === 1) {
      const existing = await User.findOne({ phone: normalizedPhone });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'An account with this phone number already exists. Please log in instead.',
          code: 'PHONE_ALREADY_REGISTERED',
        });
      }

      const user = await User.create({ name: normalizedName, phone: normalizedPhone, role: 'patient', language: 'hi' });
      const { Patient } = await import('../../models/Patient.js');
      let patient;
      try {
        for (let attempt = 0; attempt < 5; attempt += 1) {
          const patCount = await Patient.countDocuments();
          try {
            patient = await Patient.create({
              patientId: `P-${20000 + patCount + 1}`,
              userId: user._id,
              name: normalizedName,
              phone: normalizedPhone,
              age: normalizedAge,
              gender,
              village: normalizedVillage,
              district: district.trim(),
              address: typeof address === 'string' && address.trim() ? address.trim() : `${normalizedVillage}, ${district.trim()}`,
              conditions: [],
              allergies: [],
              pregnancy: { isPregnant: false },
              riskLevel: 'GREEN',
              consentForSharing: true,
            });
            break;
          } catch (err) {
            const patientIdCollision = err.code === 11000 && (
              err.keyPattern?.patientId || err.keyValue?.patientId
            );
            if (!patientIdCollision || attempt === 4) throw err;
          }
        }
      } catch (err) {
        await User.findByIdAndDelete(user._id);
        throw err;
      }

      const token = jwt.sign({ id: user._id, role: 'patient', phone: normalizedPhone }, secret, { expiresIn: '7d' });
      return res.status(201).json({
        success: true,
        message: `Welcome to SwasthSetu, ${normalizedName}! Your patient account has been created.`,
        data: { token, user: { _id: user._id, name: normalizedName, phone: normalizedPhone, role: 'patient' }, patientId: patient.patientId },
      });
    }

    // ── In-Memory mode ────────────────────────────────────────────────────────
    const existing = memoryStore.users.find(u => u.phone === normalizedPhone);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this phone number already exists. Please log in instead.',
        code: 'PHONE_ALREADY_REGISTERED',
      });
    }

    const newUserId = `usr-patient-${randomUUID()}`;
    const newUser = {
      _id: newUserId,
      name: normalizedName,
      phone: normalizedPhone,
      role: 'patient',
      facilityId: null,
      language: 'hi',
      isActive: true,
      createdAt: new Date(),
    };
    memoryStore.users.push(newUser);

    const patCount = memoryStore.patients.length;
    const newPatientId = `P-${20000 + patCount + 1}`;
    const newPatient = {
      _id: `pat-new-${randomUUID()}`,
      patientId: newPatientId,
      userId: newUserId,
      name: normalizedName,
      phone: normalizedPhone,
      age: normalizedAge,
      gender,
      village: normalizedVillage,
      district: district.trim(),
      address: typeof address === 'string' && address.trim() ? address.trim() : `${normalizedVillage}, ${district.trim()}`,
      conditions: [],
      allergies: [],
      pregnancy: { isPregnant: false },
      riskLevel: 'GREEN',
      demoAbhaId: `ABHA-DEMO-${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 9000 + 1000)}`,
      consentForSharing: true,
      registeredBy: null,
      registeredAtFacility: memoryStore.facilities[4] || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryStore.patients.push(newPatient);

    const token = jwt.sign({ id: newUserId, role: 'patient', phone: normalizedPhone }, secret, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: `Welcome to SwasthSetu, ${normalizedName}! Your patient account has been created.`,
      data: { token, user: { _id: newUserId, name: normalizedName, phone: normalizedPhone, role: 'patient' }, patientId: newPatientId },
    });
  } catch (err) {
    if (err.code === 11000 && (err.keyPattern?.phone || err.keyValue?.phone)) {
      return res.status(409).json({
        success: false,
        message: 'An account with this phone number already exists. Please log in instead.',
        code: 'PHONE_ALREADY_REGISTERED',
      });
    }
    next(err);
  }
};
