const dateField = document.getElementById('date');
const titleField = document.getElementById('title');
const contentField = document.getElementById('content');
const errorField = document.getElementById('errors');


const dateType = (date) => {
  const parsedDate = new Date(date);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const entryDate = `${months[parsedDate.getMonth()]} ${parsedDate.getDate()}, ${parsedDate.getFullYear()}`;
  return entryDate;
};

const viewEntryDetail = () => {
  const entryId = location.search.substring(1).split('=')[1];

  const url = `http://127.0.0.1:5000/api/v1/entries/${entryId}`;
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
};
