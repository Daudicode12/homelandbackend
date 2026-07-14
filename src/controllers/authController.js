import * as authService from '../services/authService.js';
import { successResponse, errorResponse, validationErrorResponse } from '../utils/responses.js';
import { generateTokens, verifyRefreshToken } from '../utils/generateTokens.js';
import { comparePassword } from '../utils/password.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body;
    
    // Check duplicates
    const existingEmail = await authService.findUserByEmail(email);
    if (existingEmail) {
      return validationErrorResponse(res, { email: 'Email is already registered.' });
    }
    
    const normalizedPhone = authService.normalizePhone(phone);
    const existingPhone = await authService.findUserByPhone(normalizedPhone);
    if (existingPhone) {
      return validationErrorResponse(res, { phone: 'Phone number is already registered.' });
    }
    
    const newUser = await authService.createUser({ 
      name, 
      email, 
      phone: normalizedPhone, 
      password, 
      role 
    });
    
    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: newUser
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user = await authService.findUserByEmail(email);
    if (!user) {
      return errorResponse(res, 401, 'Unauthorized.');
    }
    
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return errorResponse(res, 401, 'Unauthorized.');
    }
    
    const tokens = generateTokens(user);
    
    return successResponse(res, 200, 'Login successful.', {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    try {
      const decoded = verifyRefreshToken(refreshToken);
      const user = await authService.findUserById(decoded.userId);
      if (!user) {
        return errorResponse(res, 401, 'Unauthorized.');
      }
      
      const tokens = generateTokens(user);
      return res.status(200).json({
        success: true,
        data: {
          accessToken: tokens.accessToken
        }
      });
    } catch (err) {
      return errorResponse(res, 401, 'Unauthorized.');
    }
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await authService.findUserById(userId);
    
    if (!user) {
      return errorResponse(res, 401, 'Unauthorized.');
    }
    
    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};
