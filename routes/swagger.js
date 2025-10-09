const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const path = require('path');


router.get('/swagger.json', (req, res) => {
  res.sendFile(path.join(__dirname, '../swagger.json'));
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

module.exports = router;
