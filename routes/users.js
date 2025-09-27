var router = require('express').Router();
const usersController = require('../controllers/users.js');
const userValidations = require('../middlewares/validate');
const { validateRequest } = require('../helpers/validate');


router.get('/', usersController.getAll);
router.get('/:id', usersController.getSingle);
router.post('/', userValidations,validateRequest,usersController.createUser);
router.put('/:id', validateRequest,usersController.updateUser);
router.delete('/:id', usersController.deleteUser);

module.exports = router;