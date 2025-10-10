const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');


router.get('/swagger.json', (req, res) => {
  res.json(swaggerDocument);
});


router.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      url: '/swagger.json',
      withCredentials: true,
    },
  })
);

module.exports = router;
