const router = require('express').Router();
const usersController = require('../controllers/users.js');
const { userValidations } = require('../middlewares/validate');
const { validateRequest } = require('../helpers/validate');
const { isAuthenticated } = require('../middlewares/authenticate');

router.get('/', usersController.getAll);
router.get('/:id', usersController.getSingle);
router.post('/', userValidations, validateRequest, usersController.createUser);
router.put('/:id', userValidations, validateRequest, usersController.updateUser);
router.delete('/:id', userValidations, validateRequest, usersController.deleteUser);

module.exports = router;
