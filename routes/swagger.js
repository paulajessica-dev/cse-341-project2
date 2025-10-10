const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

// Middleware de autenticação
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated() || req.session.user) {
    return next();
  }
  return res.status(403).send('You do not have access.');
}

// Serve swagger.json
router.get('/swagger.json', (req, res) => {
  res.json(swaggerDocument);
});

// Swagger UI protegido
router.use(
  '/api-docs',
  ensureAuthenticated,
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      url: '/swagger.json',
      withCredentials: true,
      requestInterceptor: (req) => {
        req.credentials = 'include'; // envia cookie
        return req;
      },
    },
  })
);

module.exports = router;
