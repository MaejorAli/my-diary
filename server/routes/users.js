import userController from '../controllers/users';


export default (app) => {
  app.post('/api/v1/users', userController.signup);
};
