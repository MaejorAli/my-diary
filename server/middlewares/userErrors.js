const validEmail = (email) => {
  const chars = new RegExp(/^\w+([\.-]?\w+)*@\w+([ \.-]?\w+)*(\.\w{2,3})+$/);
  if (chars.test(email)) {
    return true;
  }
  return false;
};
const alphaNumeric = (inputTxt) => {
  const letterNumber = /((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i;
  if (inputTxt.match(letterNumber)) {
    return true;
  }
  return false;
};

const checkNullInput = (req, res, next) => {
  let isUndefined = false;
  let isNull = false;
  let isString = true;
  const {
    firstname,
    lastname,
    email,
  } = req.body;

  [firstname, lastname, email].forEach((info) => {
    if (info === undefined) {
      isUndefined = true;
    }
    if (!isUndefined && !alphaNumeric(info)) {
      if (Number.isInteger(parseFloat(info))) {
        isString = false;
      }
    }
    if (!isUndefined) {
      if (info.trim().length < 1) {
        isNull = true;
      }
    }
  });
  if (isUndefined) {
    return res.status(400).send({ error: 'Invalid Input' });
  }
  if (isNull) {
    return res.status(400).send({ error: 'A field does not contain any input' });
  }
  if (!isString) {
    return res.status(400).send({ error: 'Input text only!' });
  }
  return next();
};

const checkInvalidSignIn = (req, res, next) => {
  if (req.body.email === undefined || req.body.email.trim().length < 1) {
    return res.status(400).send({ error: 'Input Email please!' });
  }
  if (req.body.password === undefined) {
    return res.status(400).send({ error: 'Input Password please!' });
  }
  if (!validEmail(req.body.email)) {
    return res.status(400).send({ error: 'Email is not valid!' });
  }
  next();
};

export default {
  checkNullInput,
  checkInvalidSignIn,
};

