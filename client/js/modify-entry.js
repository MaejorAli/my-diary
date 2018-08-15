const titleField = document.getElementById('title');
const contentField = document.getElementById('content');
const errorField = document.getElementById('errors');
const publishEntry = document.getElementById('publishEntry');

const entryId = location.search.substring(1).split('=')[1];

const fillFieldsToEdit = () => {
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

const saveEditedContent = (event) => {
  event.preventDefault();

  const url = `http://127.0.0.1:5000/api/v1/entries/${entryId}`;
  const userToken = JSON.parse(window.localStorage.getItem('token'));

  const title = titleField.value.trim();
  const content = contentField.value.trim();

  const AddEntryBody = {
    title,
    content,
  };
  const fetchData = {
    method: 'PUT',
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
      if (result.message === 'Entry successfully updated!') {
        window.location.href = '../client/entries.html';
      } else {
        throw new Error(result.error);
      }
    })
    .catch((error) => {
      errorField.innerHTML = error;
    });
};


window.onload = () => {
  fillFieldsToEdit();
};

if (publishEntry !== null) {
  publishEntry.addEventListener('click', saveEditedContent);
}

