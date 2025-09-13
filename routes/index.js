const router = require('express').Router();

router.use('/', require('./swagger'));

router.get('/', (req,res) => {
    //#swagger.tags=['API Conneted!']
    res.send('API Conneted!')
})

router.use('/users', require('./users'));

module.exports = router;