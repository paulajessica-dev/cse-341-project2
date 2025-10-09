const passport = require('passport');
const router = require('express').Router();

router.use('/api-docs', require('./swagger'));
router.use('/users', require('./users'));
router.use('/songs', require('./songs'));

router.get('/login', passport.authenticate('github'),  (req, res) => {});

router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) return next(err);
      req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  });
});

module.exports = router;
