import pg from 'pg';


const connectionString = 'postgres://postgres:ali1702@localhost:5432/my-diary';

const addEntry = (req, res) => {
  const currentDate = `${new Date()}`;
  const entry = {
    title: req.body.title,
    content: req.body.content,
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
      'INSERT INTO Entries(title, content, users, createdAt, updatedAt) values($1, $2, $3, $4, $5) RETURNING id, title, content, createdAt, updatedAt',
      [entry.title, entry.content, req.decoded.userId, entry.createdAt, entry.updatedAt],
      (err, result) => {
        if (err) {
          return res.status(500).send({ error: err.message });
        }
        const data = result.rows[0];
        return res.status(200).send({ success: true, message: 'Entry successfully created and added!', data });
      }

    );
  });
};

const modifyEntry = (req, res) => {
  const id = req.params.entryId;
  const currentDate = `${new Date()}`;
  const entry = {
    title: req.body.title,
    content: req.body.content,
    createdAt: currentDate.slice(0, 24),
    updatedAt: currentDate.slice(0, 24)
  };
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if (err) {
      done();
      return res.status(500).json({ success: false, data: err });
    }
    // SQL Query > Update Data
    client.query(
      'UPDATE Entries SET title=($1), content=($2), createdAt=($3), updatedAt=($4) WHERE id=($5) RETURNING id, title, content, createdAt, updatedAt',
      [entry.title, entry.content, entry.createdAt, entry.updatedAt, id],
      (err, result) => {
        if (err) {
          return res.status(500).send({ error: err.message });
        }
        if (!result.rows[0]) {
          return res.status(404).send({ success: false, message: 'Entry not found!' });
        }
        const data = result.rows[0];
        return res.status(200).send({ success: true, message: 'Entry successfully updated!', data });
      }
    );
  });
};

const getAllEntries = (req, res) => {
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if (err) {
      done();
      return res.status(500).json({ success: false, data: err });
    }

    client.query(
      'SELECT * FROM Entries ORDER BY id ASC;',
      (err, result) => {
        if (err) {
          return res.status(500).send({ error: err.message });
        }
        const data = result.rows;
        return res.status(200).send({ success: true, message: 'Entries successfully gotten!', data });
      }
    );
  });
};

export default {
  addEntry,
  modifyEntry,
  getAllEntries
};
