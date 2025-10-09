const passport = require('passport');
const router = require('express').Router();


router.get('/', (req, res) => {
  
  res.send(req.session?.user
    ? `Logged in as ${req.session.user.displayName}`
    : 'API Conectada - Logged Out');
});


router.use('/users', require('./users'));
router.use('/songs', require('./songs'));
router.use('/api-docs', require('./swagger'));

module.exports = router;

module.exports = router;
