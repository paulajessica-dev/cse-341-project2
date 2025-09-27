const router = require('express').Router();
const usersController = require('../controllers/users.js');
const userValidations = require('../middlewares/validate');
const { validateRequest } = require('../helpers/validate');
const authenticateToken = require('../middlewares/authenticate');

/**
 * @swagger
 * /users/:
 *   get:
 *     tags:
 *       - Users
 *     description: Get all users
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticateToken, usersController.getAll);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     description: Get a user by ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/:id', authenticateToken, usersController.getSingle);

/**
 * @swagger
 * /users/:
 *   post:
 *     tags:
 *       - Users
 *     description: Create a new user
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             firstName:
 *               type: string
 *               example: John
 *             lastName:
 *               type: string
 *               example: Doe
 *             email:
 *               type: string
 *               example: john@example.com
 *             password:
 *               type: string
 *               example: mysecretpassword
 *             favoriteColor:
 *               type: string
 *               example: Blue
 *             birthday:
 *               type: string
 *               example: 1990-01-01
 *     responses:
 *       201:
 *         description: User created successfully
 *       409:
 *         description: User already exists
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticateToken, userValidations, validateRequest, usersController.createUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     description: Update a user by ID
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             firstName:
 *               type: string
 *               example: John
 *             lastName:
 *               type: string
 *               example: Doe
 *             email:
 *               type: string
 *               example: john@example.com
 *             favoriteColor:
 *               type: string
 *               example: Blue
 *             birthday:
 *               type: string
 *               example: 1990-01-01
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authenticateToken, validateRequest, usersController.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     description: Delete a user by ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticateToken, usersController.deleteUser);

module.exports = router;
