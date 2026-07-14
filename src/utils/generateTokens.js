import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const generateTokens = (user) => {
  const payload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = jwt.sign(payload, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  });

  const refreshToken = jwt.sign(payload, env.refreshToken.secret, {
    expiresIn: env.refreshToken.expiresIn,
  });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.jwt.secret);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.refreshToken.secret);
};
