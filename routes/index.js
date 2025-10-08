const passport = require('passport');
const router = require('express').Router();

//login/logout
router.get('/login', passport.authenticate('github'));

router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) return next(err);
        req.session.destroy(() => {
            res.clearCookie('connect.sid', { path: '/', httpOnly: true, sameSite: 'lax' });
            res.redirect('/');
        });
    });
});

//swagger
router.use('/api-docs', require('./swagger')); // acesso: /api-docs

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
