import { errorResponse } from '../utils/responses.js';

export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return errorResponse(res, 403, 'Access denied.');
    }
    next();
  };
};
