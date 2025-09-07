var router = require('express').Router();
const usersController = require('../controllers/users.js');

router.get('/', usersController.getAll);
router.get('/:id', usersController.getSingle);

module.exports = router;