const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Users API',
    description: 'Users API documentation',
    version: '1.0.0'
  },
  host: 'cse-341-project2-7v19.onrender.com',
  basePath: '/', 
  schemes: ['https'],
  consumes: ['application/json'], 
  produces: ['application/json']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js', './routes/users.js', './routes/songs.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
