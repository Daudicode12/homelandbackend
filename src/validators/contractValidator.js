import { body } from 'express-validator';

export const disputeValidator = [
  body('reason')
    .notEmpty().withMessage('Reason is required.')
    .isLength({ min: 20 }).withMessage('Reason must contain at least 20 characters.')
];
