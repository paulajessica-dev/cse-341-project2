const passport = require('passport');
const router = require('express').Router();


router.get('/', (req, res) => {  
  if (req.session?.user) {
    const { displayName, username } = req.session.user;
    res.send(`Logged in as ${displayName || username}`);
  } else {
    res.send('API Conectada - Logged Out');
  }
});

router.use('/users', require('./users'));
router.use('/songs', require('./songs'));
router.use('/api-docs', require('./swagger'));

module.exports = router;

module.exports = router;
