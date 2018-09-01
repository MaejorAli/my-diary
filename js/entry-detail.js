const dateField = document.getElementById('date');
const titleField = document.getElementById('title');
const contentField = document.getElementById('content');
const errorField = document.getElementById('errors');
const deleteButton = document.getElementById('deleteButton');
const modifyButton = document.getElementById('modifyButton');

const dateType = (date) => {
  const parsedDate = new Date(date);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const entryDate = `${months[parsedDate.getMonth()]} ${parsedDate.getDate()}, ${parsedDate.getFullYear()}`;
  return entryDate;
};

const deleteEntry = (entryId) => {
  const url = `https://secure-shelf-65268.herokuapp.com/api/v1/entries/${entryId}`;
  const userToken = JSON.parse(window.localStorage.getItem('token'));

  const fetchData = {
    method: 'DELETE',
    headers: {
      Accept: 'application/json, text/plain,  */*',
      'Content-type': 'application/json',
      'x-access-token': `${userToken}`,
    },
  };

  fetch(url, fetchData)
    .then(res => res.json())
    .then((result) => {
      if (result.message === 'Entry successfully deleted') {
        window.location.href = '../entries.html';
      } else {
        throw new Error(result.error);
      }
    })
    .catch((error) => {
      errorField.innerHTML = error;
    });
};

const buttonOption = (e) => {
  const entryId = parseInt(e.target.value, 10);
  if (e.target === modifyButton) {
    window.location.href = `../modify-entry.html?entryId=${entryId}`;
  }

  if (e.target === deleteButton) {
    deleteEntry(entryId);
  }
};


const viewEntryDetail = () => {
  const entryId = location.search.substring(1).split('=')[1];

  const url = `https://secure-shelf-65268.herokuapp.com/api/v1/entries/${entryId}`;
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
      if (result.message === 'Entry successfully gotten!') {
        dateField.innerHTML = dateType(result.data.createdat);
        titleField.innerHTML = result.data.title;
        contentField.innerHTML = result.data.content;
        modifyButton.value = entryId;
        deleteButton.value = entryId;
      } else {
        throw new Error(result.error);
      }
    })
    .catch((error) => {
      errorField.innerHTML = error;
    });
};


window.onload = () => {
  viewEntryDetail();
  modifyButton.addEventListener('click', buttonOption);
  deleteButton.addEventListener('click', buttonOption);
};
