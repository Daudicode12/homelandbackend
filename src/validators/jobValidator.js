import { body } from 'express-validator';

export const createJobValidator = [
  body('title')
    .notEmpty().withMessage('Title is required.')
    .isLength({ min: 5 }).withMessage('Title must be at least 5 characters.'),
  body('description')
    .notEmpty().withMessage('Description is required.')
    .isLength({ min: 30 }).withMessage('Description must be at least 30 characters.'),
  body('category')
    .notEmpty().withMessage('Category is required.'),
  body('location')
    .notEmpty().withMessage('Location is required.'),
  body('budget')
    .notEmpty().withMessage('Budget is required.')
    .isFloat({ gt: 0 }).withMessage('Budget must be greater than zero.'),
  body('deadline')
    .notEmpty().withMessage('Deadline is required.')
    .isISO8601().toDate().withMessage('Deadline must be a valid date.')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Deadline must be a future date.');
      }
      return true;
    }),
];
