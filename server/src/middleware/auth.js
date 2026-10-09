import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { memoryStore } from '../config/memoryStore.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No token provided.',
        code: 'AUTH_REQUIRED',
      });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'swasthsetu_hackathon_jwt_secret_2026_super_safe';

    const decoded = jwt.verify(token, secret);
    let user = null;

    if (mongoose.connection.readyState === 1) {
      user = await User.findById(decoded.id).populate('facilityId');
    } else {
      user = memoryStore.users.find(u => u._id === decoded.id || u.phone === decoded.phone);
    }

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User session is invalid or user has been deactivated.',
        code: 'USER_INACTIVE',
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.',
      code: 'TOKEN_INVALID',
    });
  }
};

export const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access.',
        code: 'UNAUTHORIZED',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: role '${req.user.role}' does not have permission to access this resource.`,
        code: 'FORBIDDEN',
      });
    }

    next();
  };
};

