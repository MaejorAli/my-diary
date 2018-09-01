const titleField = document.getElementById('title');
const contentField = document.getElementById('content');
const errorField = document.getElementById('errors');
const publishEntry = document.getElementById('publishEntry');
const date = document.getElementById('date');


const dateType = (time) => {
  const parsedDate = new Date(time);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const entryDate = `${months[parsedDate.getMonth()]} ${parsedDate.getDate()}, ${parsedDate.getFullYear()}`;
  return entryDate;
};


const addEntry = (event) => {
  event.preventDefault();

  const url = 'https://secure-shelf-65268.herokuapp.com/api/v1/entries';
  const userToken = JSON.parse(window.localStorage.getItem('token'));
  const title = titleField.value.trim();
  const content = contentField.value.trim();


  const AddEntryBody = {
    title,
    content,
  };
  const fetchData = {
    method: 'POST',
    body: JSON.stringify(AddEntryBody),
    headers: {
      Accept: 'application/json, text/plain,  */*',
      'Content-type': 'application/json',
      'x-access-token': `${userToken}`,
    },
  };

  fetch(url, fetchData)
    .then(res => res.json())
    .then((result) => {
      if (result.message === 'Entry successfully created and added!') {
        window.location.href = './entries.html';
      } else {
        throw new Error(result.error);
      }
    })
    .catch((error) => {
      errorField.innerHTML = error;
    });
};


window.onload = () => {
  if (publishEntry !== null) {
    publishEntry.addEventListener('click', addEntry);
  }
  date.innerHTML = dateType(new Date());
};
