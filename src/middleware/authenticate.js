import { verifyAccessToken } from '../utils/generateTokens.js';
import { errorResponse } from '../utils/responses.js';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 401, 'Unauthorized.');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded; // { userId, role, ... }
    next();
  } catch (err) {
    return errorResponse(res, 401, 'Unauthorized.');
  }
};