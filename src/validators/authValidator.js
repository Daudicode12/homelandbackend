import { body } from 'express-validator';

export const registerValidator = [
  body('name')
    .notEmpty().withMessage('Name is required.')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters.'),
  body('email')
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please enter a valid email address.'),
  body('phone')
    .notEmpty().withMessage('Phone number is required.')
    .matches(/^(07\d{8}|2547\d{8}|\+2547\d{8})$/).withMessage('Invalid phone number format.'),
  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
    .matches(/(?=.*[a-z])/).withMessage('Password must contain at least one lowercase letter.')
    .matches(/(?=.*[A-Z])/).withMessage('Password must contain at least one uppercase letter.')
    .matches(/(?=.*\d)/).withMessage('Password must contain at least one number.'),
  body('role')
    .notEmpty().withMessage('Role is required.')
    .isIn(['freelancer', 'employer']).withMessage('Role must be either freelancer or employer.')
];


export const loginValidator = [
  body('email')
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please enter a valid email address.'),
  body('password')
    .notEmpty().withMessage('Password is required.')
];

export const refreshValidator = [
  body('refreshToken')
    .notEmpty().withMessage('Refresh token is required.')
];
