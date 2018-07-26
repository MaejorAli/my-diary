import pg from 'pg';


const connectionString = 'postgres://postgres:ali1702@localhost:5432/my-diary';

const addEntry = (req, res) => {
  const results = [];
  const currentDate = `${new Date()}`;
  const entry = {
    title: req.body,
    content: req.body,
    createdAt: currentDate.slice(0, 24),
    updatedAt: currentDate.slice(0, 24)
  };
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if (err) {
      done();
      return res.status(500).json({ success: false, message: err });
    }
    // SQL Query > Insert Data
    client.query(
      'INSERT INTO Entries(title, content, createdAt, updatedAt) values($1, $2, $3, $4)',
      [entry.title, entry.content, entry.createdAt, entry.updatedAt]
    );
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM items ORDER BY id ASC');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
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
