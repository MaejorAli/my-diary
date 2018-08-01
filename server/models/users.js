const pg = require('pg');

const connectionString = process.env.DB_URL || 'postgres://postgres:ali1702@127.0.0.1:5432/my-diary';

const client = new pg.Client(connectionString);
client.connect();
const query = client.query('CREATE TABLE Users(id SERIAL PRIMARY KEY not null, firstname varchar(255) not null, lastname varchar(255) not null, email varchar(255) unique not null, password varchar(255) not null, createdAt date not null, updatedAt date not null  )');
query.on('end', () => { client.end(); });
