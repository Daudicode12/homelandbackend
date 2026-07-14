import { body } from 'express-validator';

export const createProposalValidator = [
  body('cover_letter')
    .notEmpty().withMessage('Cover letter is required.')
    .isLength({ min: 50 }).withMessage('Cover letter must be at least 50 characters.'),
  body('proposed_budget')
    .notEmpty().withMessage('Proposed budget is required.')
    .isFloat({ gt: 0 }).withMessage('Proposed budget must be greater than zero.'),
  body('timeline_days')
    .notEmpty().withMessage('Timeline is required.')
    .isInt({ gt: 0 }).withMessage('Timeline must be a positive integer.'),
];
