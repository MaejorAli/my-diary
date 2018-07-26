import dotenv from 'dotenv';
import pg from 'pg';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


dotenv.config();
const secret = process.env.SECRET;


const connectionString = 'postgres://postgres:ali1702@localhost:5432/my-diary';

const signup = (req, res) => {
  const currentDate = `${new Date()}`;
  const user = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    createdAt: currentDate.slice(0, 24),
    updatedAt: currentDate.slice(0, 24)
  };

  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).send({ error: 'an error occurred' });
    }
    const password = hash;

    pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
      if (err) {
        done();
        return res.status(500).send({ success: false, error: err.message });
      }

      const query = client.query(
        'INSERT INTO Users(firstname, lastname, password, email, createdAt, updatedAt) values($1, $2, $3, $4, $5, $6)',
        [user.firstname, user.lastname, password, user.email, user.createdAt, user.updatedAt]
        , (err) => {
          if (err) {
            if (err.code === '23505') {
              return res.status(406).send({ error: 'Another User with this email already exists' });
            }
            return res.status(400).send({ error: err.message });
          }
        }
      );
      const payload = {
        userId: user.id,
      };
      const token = jwt.sign(payload, secret, {
        expiresIn: '100h', // expires in 1 hours
      });
      query.on('end', () => {
        res.status(200).send({ message: 'You have successfully signed up', token });
        done();
      });
    });
    if (err) {
      return res.status(500).send({ error: err.message });
    }
  });
};


export default { signup };