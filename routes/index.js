const passport = require('passport');
const router = require('express').Router();

//login
router.get('/login', passport.authenticate('github'));

//callback github
router.get('/github/callback', passport.authenticate('github', {
  failureRedirect: '/api-docs'
}), (req, res) => {
  req.session.user = req.user;
  res.redirect('/');
});

//logout
router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  });
});

//swagger
router.use('/api-docs', require('./swagger')); 

//home
router.get('/', (req, res) => {
    const user = req.session.user;
    if (user) {
        res.send(`Logged in as ${user.displayName || user.username}`);
    } else {
        res.send('API Conectada! <a href="/login">Login com GitHub</a>');
    }
});

//others routes
router.use('/users', require('./users'));
router.use('/songs', require('./songs'));

module.exports = router;
