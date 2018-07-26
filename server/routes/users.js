import userController from '../controllers/users';


export default (app) => {
  app.post('/api/v1/auth/signup', userController.signup);
  app.post('/api/v1/auth/login', userController.signin);
};
