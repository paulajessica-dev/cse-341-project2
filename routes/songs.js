const router = require('express').Router();
const songsController = require('../controllers/songs.js');
const { songValidations } = require('../middlewares/validate');
const { validateRequest } = require('../helpers/validate.js');
const { isAuthenticated } = require('../middlewares/authenticate');


router.get('/', songsController.getAll);
router.get('/:id', songsController.getSong);
router.post('/', songValidations, validateRequest, songsController.createSong);
router.put('/:id', songValidations, validateRequest, songsController.updateSong);
router.delete('/:id', songsController.deleteSong);


module.exports = router;
