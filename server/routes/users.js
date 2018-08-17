import userController from '../controllers/users';
import userErrorHandler from '../middlewares/userErrors';
import auth from '../middlewares/authentication';


export default (app) => {
  app.post('/api/v1/auth/signup', userErrorHandler.checkNullInput, userController.signup);
  app.post('/api/v1/auth/login', userErrorHandler.checkInvalidSignIn, userController.signin);
  app.get('/api/v1/auth/user', auth, userController.getUserDetails);
};
