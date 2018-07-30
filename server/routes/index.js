import entryController from '../controllers/entries';
import errorHandler from '../middlewares/errors';
import auth from '../middlewares/authentication';


export default (app) => {
  app.get('/api', (req, res) => {
    res.send({ message: 'Welcome to the my-diary Api' });
  });

  app.post('/api/v1/entries', auth, errorHandler.checkNullInput, entryController.addEntry);
  app.put('/api/v1/entries/:entryId', errorHandler.checkInvalidModification, entryController.modifyEntry);
  app.get('/api/v1/entries', auth, entryController.getAllEntries);
  app.get('/api/v1/entries/:entryId', auth, entryController.getAnEntry);
};
