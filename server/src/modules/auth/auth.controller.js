import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
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

