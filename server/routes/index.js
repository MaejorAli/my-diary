import entryController from '../controllers/entries';
import errorHandler from '../middlewares/errors';


export default (app) => {
  app.get('/api', (req, res) => {
    res.send({ message: 'Welcome to the my-diary Api' });
  });

  app.post('/api/v1/entries', errorHandler.checkNullInput, entryController.addEntry);
};
