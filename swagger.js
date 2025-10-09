const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: { title: 'Users API', description: 'Users API' },
    host: 'localhost:3001',
    schemes: ['https'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js', './routes/users.js', './routes/songs.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
