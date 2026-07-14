import { validationResult } from 'express-validator';
import { validationErrorResponse } from '../utils/responses.js';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = {};
    errors.array().forEach((error) => {
      // Keep only the first error for each field
      if (!formattedErrors[error.path]) {
        formattedErrors[error.path] = error.msg;
      }
    });
    return validationErrorResponse(res, formattedErrors);
  }
  next();
};
