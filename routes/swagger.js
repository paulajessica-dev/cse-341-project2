const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

// Middleware para verificar se o usuário está logado
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated() || req.session.user) {
    return next();
  }
  return res.status(403).send('You do not have access.');
}

// 🔐 Protege a rota do Swagger
router.use(
  '/api-docs',
  ensureAuthenticated,
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      withCredentials: true, // envia cookies da sessão
      requestInterceptor: (req) => {
        req.withCredentials = true;
        return req;
      }
    }
  })
);

module.exports = router;
