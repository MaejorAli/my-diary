import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});


async function cloudUpload(req, res, next) { // reference: www.cloudinary.com
  const id = req.decoded.userId;
  const content = await (cloudinary.uploader.upload(req.files.image.path, result => result));
  const userImage = content.secure_url;
  req.imageData = {
    userImage,
    id,
  };


  return next();
}


export default cloudUpload;
