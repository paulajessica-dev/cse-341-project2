const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

// rota para servir o JSON do Swagger
router.get('/swagger.json', (req, res) => {
  res.json(swaggerDocument);
});

// rota para exibir a UI do Swagger
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
