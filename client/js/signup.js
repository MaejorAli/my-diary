const firstnameField = document.getElementById('firstname');
const lastnameField = document.getElementById('lastname');
const emailField = document.getElementById('email');
const passwordField = document.getElementById('password');
const confirmPasswordField = document.getElementById('confirm-password');
const enterSignUp = document.getElementById('enter-signup');
const errorField = document.getElementById('errors');

const signup = (event) => {
  event.preventDefault();

  const url = 'https://secure-shelf-65268.herokuapp.com/api/v1/auth/signup';
  const email = emailField.value.trim();
  const password = passwordField.value.trim();
  const firstname = firstnameField.value.trim();
  const lastname = lastnameField.value.trim();
  const confirmPassword = confirmPasswordField.value.trim();

  const signUpCred = {
    firstname,
    lastname,
    email,
    password,
  };

  const fetchData = {
    method: 'POST',
    body: JSON.stringify(signUpCred),
    headers: {
      Accept: 'application/json, text/plain,  */*',
      'Content-type': 'application/json',
    },
  };

  fetch(url, fetchData)
    .then(res => res.json())
    .then((result) => {
      if (result.message === 'You have successfully signed up') {
        window.localStorage.setItem('token', JSON.stringify(result.token));
        window.location.href = '../client/dashboard.html';
      } else {
        throw new Error(result.error);
      }
    })
    .catch((error) => {
      errorField.innerHTML = error;
    });
};

window.onload = () => {
  if (enterSignUp !== null) {
    enterSignUp.addEventListener('click', signup);
  }
};
