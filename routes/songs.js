const router = require('express').Router();
const songsController = require('../controllers/songs.js');
const songValidations = require('../middlewares/validate.js');
const { validateRequest } = require('../helpers/validate.js');
const { isAuthenticated } = require('../middlewares/authenticate');


router.get('/', songsController.getAll);
router.get('/:id', songsController.getSong);
router.post('/', isAuthenticated, songValidations, validateRequest, songsController.createSong);
router.put('/:id', isAuthenticated, validateRequest, songsController.updateSong);
router.delete('/:id', isAuthenticated, songsController.deleteSong);

module.exports = router;
