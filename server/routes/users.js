import userController from '../controllers/users';
import userErrorHandler from '../middlewares/userErrors';


export default (app) => {
  app.post('/api/v1/auth/signup', userErrorHandler.checkNullInput, userController.signup);
  app.post('/api/v1/auth/login', userErrorHandler.checkInvalidSignIn, userController.signin);
};
