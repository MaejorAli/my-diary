import dotenv from 'dotenv';
import pg from 'pg';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


dotenv.config();
const secret = process.env.SECRET;


const connectionString = process.env.DATABASE_URL;

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
        'INSERT INTO Users(firstname, lastname, password, email, createdAt, updatedAt) values($1, $2, $3, $4, $5, $6) RETURNING id, firstname, lastname, email, createdAt, updatedAt',
        [user.firstname, user.lastname, password, user.email, user.createdAt, user.updatedAt],
        (err, result) => {
          if (err) {
            if (err.code === '23505') {
              return res.status(406).send({ error: 'Another User with this email already exists' });
            }
            return res.status(400).send({ error: err.message });
          }

          const data = result.rows[0];
          const payload = {
            userId: data.id,
          };

          const token = jwt.sign(payload, secret, {
            expiresIn: '100h', // expires in 1 hours
          });
          query.on('end', () => {
            res.status(201).send({ message: 'You have successfully signed up', token });
            done();
          });

          if (err) {
            return res.status(500).send({ error: err.message });
          }
        }
      );
    });
  });
};

const signin = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };
  pg.connect(
    connectionString,
    (err, client, done) => {
      // Handle connection errors
      if (err) {
        done();
        return res.status(500).send({ success: false, error: err.message });
      }
      client.query(
        'SELECT * FROM Users WHERE email= $1',
        [user.email],
        (error, result) => {
          if (error) {
            return res.status(500).send({ error: error.message });
          }
          if (result.rowCount <= 0) {
            return res.status(400).send({ error: 'Invalid email or password' });
          }
          const data = result.rows[0];
          bcrypt.compare(user.password, data.password, (compareError, results) => {
            if (compareError) {
              return res.status(400).send({ error: 'Invalid email or password' });
            }
            if (!results) {
              return res.status(400).send({ error: 'Invalid email or password' });
            }
            const payload = {
              userId: data.id,
            };
            const token = jwt.sign(payload, secret, {
              expiresIn: '100h', // expires in 1 hours
            });
            done();
            return res.status(200).send({ message: 'You have successfully signed in', token });
          });
        },
      );
    },
  );
};

const getUserDetails = (req, res) => {
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if (err) {
      done();
      return res.status(500).json({ success: false, message: err });
    }

    client.query(
      'SELECT * FROM Users WHERE id=($1)',
      [req.decoded.userId],
      (err, result) => {
        if (err) {
          return res.status(500).send({ error: err.message });
        }
        if (!result.rows[0]) {
          return res.status(404).send({ success: false, message: 'User not found!' });
        }
        const data = result.rows[0];
        done();
        return res.status(200).send({ success: true, message: 'User successfully gotten!', data });
      }
    );
  });
};

const imageUpload = (req, res) => {
  const userImage = req.imageData.userImage;
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if (err) {
      done();
      return res.status(500).json({ success: false, message: err });
    }

    client.query(
      'UPDATE Users SET userImage=$1 WHERE id=$2 RETURNING userImage',
      [userImage, req.decoded.userId],
      (err, result) => {
        if (err) {
          return res.status(500).send({ error: err.message });
        }
        const data = result.rows[0];
        done();
        return res.status(200).send({ success: true, message: 'User Image successfully uploaded!', data });
      }
    );
  });
};

export default {
  signup, signin, getUserDetails, imageUpload,
};
