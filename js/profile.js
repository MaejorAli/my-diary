const errorField = document.getElementById('errors');
const nameField = document.getElementById('username');
const emailField = document.getElementById('email');
const spanField = document.getElementById('entryCount');
const enterImage = document.getElementById('image');
const inputImage = document.getElementById('file-input');


const dateType = (date) => {
  const parsedDate = new Date(date);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const entryDate = `${months[parsedDate.getMonth()]} ${parsedDate.getDate()}, ${parsedDate.getFullYear()}`;
  return entryDate;
};

const buttonOption = (e) => {
  const entryId = parseInt(e.target.value, 10);
  window.location.href = `../entry-detail.html?entryId=${entryId}`;
};


const getUserDetails = () => {
  const url = 'https://secure-shelf-65268.herokuapp.com/api/v1/auth/user';
  const userToken = JSON.parse(window.localStorage.getItem('token'));

  const fetchData = {
    method: 'GET',
    headers: {
      Accept: 'application/json, text/plain,  */*',
      'Content-type': 'application/json',
      'x-access-token': `${userToken}`,
    },
  };

  fetch(url, fetchData)
    .then(res => res.json())
    .then((result) => {
      const user = result.data;
      if (result.message === 'User successfully gotten!') {
        nameField.innerHTML = `${user.firstname} ${user.lastname}`;
        emailField.innerHTML = user.email;
      }
      if (user.userimage === null) {
        enterImage.src = 'images/profilephoto.png';
      } else {
        enterImage.src = user.userimage;
      }
    })
    .catch((error) => {
      errorField.innerHTML = error;
    });
};


const getEntryCount = () => {
  const url = 'https://secure-shelf-65268.herokuapp.com/api/v1/entries';
  const userToken = JSON.parse(window.localStorage.getItem('token'));

  const fetchData = {
    method: 'GET',
    headers: {
      Accept: 'application/json, text/plain,  */*',
      'Content-type': 'application/json',
      'x-access-token': `${userToken}`,
    },
  };

  fetch(url, fetchData)
    .then(res => res.json())
    .then((result) => {
      if (result.message === 'Entries successfully gotten!') {
        const user = result.data;
        spanField.innerHTML = user.length;
      } else {
        throw new Error(result.error);
      }
    })
    .catch((error) => {
      errorField.innerHTML = error;
    });
};

const getTOpTwoEntries = () => {
  const createNode = element => document.createElement(element);

  const append = (parent, el) => parent.appendChild(el);

  const div = document.getElementById('topEntries');

  const url = 'https://secure-shelf-65268.herokuapp.com/api/v1/entries';
  const userToken = JSON.parse(window.localStorage.getItem('token'));
  const fetchData = {
    method: 'GET',
    headers: {
      Accept: 'application/json, text/plain,  */*',
      'Content-type': 'application/json',
      'x-access-token': `${userToken}`,
    },
  };

  fetch(url, fetchData)
    .then(res => res.json())
    .then((result) => {
      if (result.message === 'Entries successfully gotten!') {
        const entries = result.data.slice(0, 3);
        return entries.map((entry) => {
          const ul = createNode('ul'),
            h2 = createNode('h2'),
            p = createNode('p'),
            button = createNode('button'),
            buttonText = document.createTextNode('Read More');
          button.id = 'entries';
          h2.innerHTML = `${entry.title}`;
          p.innerHTML = dateType(`${entry.createdat}`);
          button.value = `${entry.id}`;
          append(ul, h2);
          append(ul, p);
          append(ul, button);
          append(button, buttonText);
          append(div, ul);
          button.addEventListener('click', buttonOption);
        });
      }
      throw new Error(result.error);
    })
    .catch((error) => {
      errorField.innerHTML = error;
    });
};


const setProfileImage = (file) => {
  const url = 'https://secure-shelf-65268.herokuapp.com/api/v1/auth/userimage';
  const userToken = JSON.parse(window.localStorage.getItem('token'));

  const image = new FormData();
  image.append('image', file);


  const fetchData = {
    method: 'PUT',
    body: image,
    headers: {
      'x-access-token': `${userToken}`,
    },
  };
  fetch(url, fetchData)
    .then(res => res.json())
    .then((result) => {
      if (result.message === 'User Image successfully uploaded!') {
        enterImage.src = result.data.userimage;
      } else {
        throw new Error(result.error);
      }
    })
    .catch((error) => {
      errorField.innerHTML = error;
    });
};

inputImage.addEventListener('change', (e) => {
  const file = e.target.files[0];
  setProfileImage(file);
});

window.onload = () => {
  getUserDetails();
  getEntryCount();
  getTOpTwoEntries();
};

