const pg = require('pg');

const connectionString = process.env.DB_URL || 'postgres://postgres:ali1702@127.0.0.1:5432/my-diary';

const client = new pg.Client(connectionString);
client.connect();
const query = client.query('CREATE TABLE Entries(id SERIAL PRIMARY KEY not null, title varchar(255) not null, content varchar(600) not null, users int REFERENCES Users(id) not null, createdAt date not null, updatedAt date not null  )');
query.on('end', () => { client.end(); });
