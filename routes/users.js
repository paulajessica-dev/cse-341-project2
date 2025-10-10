const router = require('express').Router();
const usersController = require('../controllers/users.js');
const { userValidations } = require('../middlewares/validate');
const { validateRequest } = require('../helpers/validate');
const { isAuthenticated } = require('../middlewares/authenticate');

router.get('/', usersController.getAll);
router.get('/:id', usersController.getSingle);
router.post('/', isAuthenticated,userValidations, validateRequest, usersController.createUser);
router.put('/:id', isAuthenticated, usersController.updateUser);
router.delete('/:id', isAuthenticated,usersController.deleteUser);

module.exports = router;
