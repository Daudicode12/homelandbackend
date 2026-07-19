import { errorResponse } from '../utils/responses.js';

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return errorResponse(res, 403, 'Access denied.');
    }
    next();
  };
};
