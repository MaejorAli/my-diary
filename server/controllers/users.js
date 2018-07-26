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

      client.query(
        'INSERT INTO Users(firstname, lastname, password, email, createdAt, updatedAt) values($1, $2, $3, $4, $5, $6)',
        [user.firstname, user.lastname, password, user.email, user.createdAt, user.updatedAt]
      );
      const payload = {
        userId: user.id,
      };
      const token = jwt.sign(payload, secret, {
        expiresIn: '100h', // expires in 1 hours
      });
      done();
      res.status(200).send({ message: 'You have successfully signed up', token, user });
    });
    if (err) {
      return res.status(500).send({ error: err.message });
    }
  });
};

const signin = (req, res) => {

};

export default { signup, signin };
