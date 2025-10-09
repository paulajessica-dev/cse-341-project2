const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Users API',
    description: 'Users API documentation',
    version: '1.0.0'
  },
  host: 'localhost:3001',
  basePath: '/', 
  schemes: ['http'],
  consumes: ['application/json'], 
  produces: ['application/json']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js', './routes/users.js', './routes/songs.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
