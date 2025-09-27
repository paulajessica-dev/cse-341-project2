const { body } = require('express-validator');
const mongodb = require('../data/database');

const userValidations = [
    
    body('firstName')
    .trim()
    .isLength( { min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),


    body('lastName')
    .trim()
    .isLength( { min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .custom(async (value, { req }) => {     
      const user = await mongodb.getDatabase()
        .collection('users')
        .findOne({
          firstName: req.body.firstName,
          lastName: value
        });

      if (user) {
        throw new Error('A user with this first name and last name already exists');
      }
      return true;
    }),

    body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email')
    .custom(async (value) => {
      const user = await mongodb.getDatabase()
        .collection('users')
        .findOne({ email: value });
      if (user) {
        throw new Error('Email already in use');
      }
      return true;
    }),

    body('password')
    .trim()
    .isLength( { min: 8 })
    .withMessage('Password must be minim 8 characters'),

    body('favoriteColor')
    .optional()
    .isLength( { max: 30 })
    .withMessage('First name must be between 2 and 50 characters'),
    
    
    body('birthday')
    .isISO8601()
    .withMessage('Birthday must be a valid date')
    .custom((value) => {
        if (new Date(value) > new Date()) {
        throw new Error('Birthday cannot be in the future');
      }
        return true;
    })
];

module.exports = userValidations;