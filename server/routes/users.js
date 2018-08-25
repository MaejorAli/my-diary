import multi from 'connect-multiparty';
import userController from '../controllers/users';
import userErrorHandler from '../middlewares/userErrors';
import auth from '../middlewares/authentication';
import cloud from '../middlewares/cloudinary';


const multipart = multi();

export default (app) => {
  app.post('/api/v1/auth/signup', userErrorHandler.checkNullInput, userController.signup);
  app.post('/api/v1/auth/login', userErrorHandler.checkInvalidSignIn, userController.signin);
  app.get('/api/v1/auth/user', auth, userController.getUserDetails);
  app.put('/api/v1/auth/userimage', auth, multipart, cloud, userController.imageUpload);
};
