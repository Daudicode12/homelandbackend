import { errorResponse } from '../utils/responses.js';

export const errorHandler = (err, req, res, next) => {
  console.error(err);
  return errorResponse(res, 500, 'Internal server error.');
};
