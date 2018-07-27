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


export default {
  addEntry
};
