const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

router.use(
  '/api-docs',
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
