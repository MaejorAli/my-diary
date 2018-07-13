import entryController from '../controllers/entries';


export default (app) => {
  app.get('/api', (req, res) => {
    res.send({ message: 'Welcome to the my-diary Api' });
  });

  app.post('/api/v1/entries', entryController.addEntry);
};
