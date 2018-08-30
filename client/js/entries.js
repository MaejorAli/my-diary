const errorField = document.getElementById('errors');


const dateType = (date) => {
  const parsedDate = new Date(date);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const entryDate = `${months[parsedDate.getMonth()]} ${parsedDate.getDate()}, ${parsedDate.getFullYear()}`;
  return entryDate;
};


const buttonOption = (e) => {
  const entryId = parseInt(e.target.value, 10);
  window.location.href = `../client/entry-detail.html?entryId=${entryId}`;
};

const getAllEntries = () => {
  const createNode = element => document.createElement(element);

  const append = (parent, el) => parent.appendChild(el);

  const div = document.getElementById('entries');

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
        const entries = result.data;
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


window.onload = () => {
  getAllEntries();
};

