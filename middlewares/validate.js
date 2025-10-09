const { body } = require('express-validator');
const mongodb = require('../data/database');

const userValidations = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),

  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
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

  body('favoriteColor')
    .optional()
    .isLength({ max: 30 })
    .withMessage('Favorite color must be at most 30 characters'),

  body('birthday')
    .isISO8601().withMessage('Birthday must be a valid date')
    .custom((value) => {
      if (new Date(value) > new Date()) {
        throw new Error('Birthday cannot be in the future');
      }
      return true;
    })
];

const songValidations = [
  body('title')   
    .notEmpty().withMessage('Title is required')
    .custom(async (value) => {     
      const song = await mongodb.getDatabase()
        .collection('songs')
        .findOne({ title: value });
      if (song) {
        throw new Error('A song with this title already exists');
      }
      return true;
    }),
    
  body('artist')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Artist is required'),

  body('category')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Category is required')
];

module.exports = {
  userValidations,
  songValidations
};
