const signout = () => {
  window.localStorage.removeItem('token');
  window.location.hash = 'no-back-button';// https://stackoverflow.com/questions/12381563/how-to-stop-browser-back-button-using-javascript
  window.location.hash = 'Again-No-back-button';// again because google chrome don't insert first hash into history
  window.onhashchange = function noBack() { window.location.hash = 'no-back-button'; };
};


window.onload = () => {
  signout();
};

