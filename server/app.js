import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import logger from 'morgan';
import swaggerUi from 'swagger-ui-express';
import bodyParser from 'body-parser';
import swagDoc from '../swagger.json';
import entryRoutes from './routes/entries';
import userRoutes from './routes/users';


dotenv.config();

// Set up the express app
const app = express();

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagDoc));

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

entryRoutes(app);
userRoutes(app);


// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the beginning of nothingness.',
}));


app.all('*', (req, res) => res.status(404).send({ error: 'Invalid route!' }));

module.exports = app;
