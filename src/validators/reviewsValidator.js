import { body } from 'express-validator';

export const createReviewValidator = [
  body('contractId')
    .notEmpty().withMessage('Contract ID is required.')
    .isInt().withMessage('Contract ID must be an integer.'),
  
  body('rating')
    .notEmpty().withMessage('Rating is required.')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5.'),
  
  body('comment')
    .notEmpty().withMessage('Comment is required.')
    .isString().withMessage('Comment must be a string.')
    .isLength({ min: 20 }).withMessage('Comment must be at least 20 characters long.')
];
