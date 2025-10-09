const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const path = require('path');

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

router.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(null, {
    swaggerOptions: {
      url: '/swagger.json' 
    }
  })
);

router.get('/swagger.json', (req, res) => {
  res.sendFile(path.join(__dirname, '../swagger.json'));
});

module.exports = router;
