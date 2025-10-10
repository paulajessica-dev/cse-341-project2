const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');


// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated() || req.session.user) {
//     return next();
//   }
//   return res.status(403).send('You do not have access.');
// }


router.get('/swagger.json', (req, res) => {
  res.json(swaggerDocument);
});


router.use(
  '/api-docs',
  ensureAuthenticated, 
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      url: '/swagger.json', 
      withCredentials: true, 
      requestInterceptor: (req) => {
        req.withCredentials = true; 
        return req;
      },
    },
  })
);

module.exports = router;
