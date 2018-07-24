const alphaNumeric = (inputtxt) => {
  const letterNumber = /((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i;
  if (inputtxt.match(letterNumber)) {
    return true;
  }
  return false;
};

const checkNullInput = (req, res, next) => {
  let isUndefined = false;
  let isNull = false;
  let isString = true;
  const {
    title,
    content,
  } = req.body;
  [title, content].forEach((info) => {
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


const checkInvalidModification = (req, res, next) => {
  const {
    title,
    content,
  } = req.body;
  const modifiedFields = [];
  let isUndefined = false;
  let isNull = false;
  let isString = true;
  [title, content].forEach((field) => {
    if (field !== undefined) {
      modifiedFields.push(field);
    }
  });
  modifiedFields.forEach((info) => {
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

export default {
  checkNullInput,
  checkInvalidModification,
};

