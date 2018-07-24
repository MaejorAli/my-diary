import db from '../db';


let idTracker = 0;


const addEntry = (req, res) => {
  const { title, content } = req.body;
  const currentDate = `${new Date()}`;
  const createdAt = currentDate.slice(0, 24);
  const updatedAt = currentDate.slice(0, 24);
  idTracker = db.length + 1;
  const id = idTracker;
  const response = {
    id,
    title,
    content,
    createdAt,
    updatedAt,
  };
  db.push(response);
  res.status(201).send({ message: 'Entry successfully created and saved', success: true, response });
};

const modifyEntry = (req, res) => {
  const id = parseFloat(req.params.entryId);
  let entry = null;
  db.map((rec) => {
    if (rec.id === id) {
      entry = rec;
    }
    return entry;
  });
  if (entry) {
    entry.title = req.body.title || entry.title;
    entry.story = req.body.content || entry.content;
    res.status(201).send({ message: 'Successfully Modified', success: true, entry });
  } else {
    res.status(404).send({ message: 'Entry not found', success: false });
  }
};

const getAllEntries = (req, res) =>
  res.status(200).send({ success: true, entries: db });

const getAnEntry = (req, res) => {
  let entry = null;
  db.forEach((rec, i) => {
    if (db[i].id === parseFloat(req.params.entryId)) {
      entry = rec;
    }
  });
  if (entry) {
    return res.status(200).send({ message: 'success', success: true, entry });
  }
  return res.status(404).send({ message: 'Entry not found!', success: false });
};

const removeEntry = (req, res) => {
  let entry = null;
  db.forEach((rec, i) => {
    if (db[i].id === parseFloat(req.params.entryId)) {
      db.splice(i, 1);
      entry = rec;
    }
  });
  if (entry) {
    return res.status(200).send({ message: 'Entry successfully deleted', success: true });
  }
  return res.status(404).send({ message: 'Entry you intended to delete does not exist', success: false });
};


export default {
  addEntry, modifyEntry, getAllEntries, getAnEntry, removeEntry,
};
