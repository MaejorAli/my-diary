const emailField = document.getElementById('email');
const passwordField = document.getElementById('password');
const enterSignIn = document.getElementById('enter-signin');
const errorField = document.getElementById('errors');


const userToken = '';

const signin = (event) => {
  event.preventDefault();

  const url = 'http://127.0.0.1:5000/api/v1/auth/login';
  const email = emailField.value.trim();
  const password = passwordField.value.trim();

  const signInCred = {
    email,
    password,
  };

  const fetchData = {
    method: 'POST',
    body: JSON.stringify(signInCred),
    headers: {
      Accept: 'application/json, text/plain,  */*',
      'Content-type': 'application/json',
    },
  };

  fetch(url, fetchData)
    .then(res => res.json())
    .then((result) => {
      if (result.message === 'You have successfully signed in') {
        window.localStorage.setItem('token', JSON.stringify(result.token));
      } else {
        throw new Error(result.error);
      }
      window.location.href = '../client/entries.html';
    })
    .catch((error) => {
      errorField.innerHTML = error;
    });
};


window.onload = () => {
  if (enterSignIn !== null) {
    enterSignIn.addEventListener('click', signin);
  }
};
