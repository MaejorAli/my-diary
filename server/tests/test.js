import request from 'supertest';
import chai from 'chai';
import app from '../app';

const { expect } = chai;

let tk = '';
let id = '';
const randNum = Math.floor((Math.random() * 999999) + 1);
const userDetails = {
  firstname: 'anyfirstname',
  lastname: 'anylastname',
  email: `testmail${randNum}@yahoo.com`,
  password: 'Testpassword',
};
const user = {
  email: `testmail${randNum}@yahoo.com`,
  password: 'Testpassword',
};
describe('test-cases for api routes', () => {
  describe('GET /', () => {
    it('responds with a 200 and welcome message in json', (done) => {
      request(app)
        .get('/')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, { message: 'Welcome to the beginning of nothingness.' }, done);
    });
  });
  describe('GET /api', () => {
    it('responds with a 200 and welcome message in json', (done) => {
      request(app)
        .get('/api')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, { message: 'Welcome to the my-diary Api' }, done);
    });
  });
  describe('POST /api/v1/auth/signup', () => {
    it('creates a user and responds with 201', (done) => {
      request(app)
        .post('/api/v1/auth/signup')
        .send(userDetails)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201, done)
        .expect((res) => {
          expect(res.body.message).to.equal('You have successfully signed up');
        });
    });
    it('sends a 400 response status if user input contain only numbers', (done) => {
      userDetails.firstname = '2345';
      request(app)
        .post('/api/v1/auth/signup')
        .send(userDetails)
        .set('Accept', 'application/json')
        .expect(400, done)
        .expect((res) => {
          expect(res.body.error).to.equal('Input cannot be numbers only!');
        });
    });
    it('sends a 400 response status if a user input is null', (done) => {
      userDetails.firstname = '';
      request(app)
        .post('/api/v1/auth/signup')
        .send(userDetails)
        .set('Accept', 'application/json')
        .expect(400, done)
        .expect((res) => {
          expect(res.body.error).to.equal('A field does not contain any input');
        });
    });
    it('sends a 400 response status if email is invalid', (done) => {
      userDetails.email = 'alidhddhdhd.com';
      request(app)
        .post('/api/v1/auth/signup')
        .send(userDetails)
        .set('Accept', 'application/json')
        .expect(400, done)
        .expect((res) => {
          expect(res.body.error).to.equal('Email is not valid!');
        });
    });
    describe('POST /api/v1/auth/login', () => {
      it('logs in  a user and responds with 200', (done) => {
        request(app)
          .post('/api/v1/auth/login')
          .send(user)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200, done)
          .expect((res) => {
            const { token } = res.body;
            tk = token;
            expect(typeof res.body.token).to.be.a('string');
          });
      });
      describe('It handles invalid user input', () => {
        const signinInfo = {
          email: user.email,
          password: 'thesamallest',
        };
        it('responds with a 400 if a user password is incorrect', (done) => {
          request(app)
            .post('/api/v1/auth/login')
            .send(signinInfo)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400, done)
            .expect((res) => {
              expect(res.body.error).to.equal('Invalid email or password');
            });
        });
        it('responds with a 400 if a user email is incorrect', (done) => {
          user.email = 'alishaibu2002@gma.com';
          request(app)
            .post('/api/v1/auth/login')
            .send(user)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400, done)
            .expect((res) => {
              expect(res.body.error).to.equal('Invalid email or password');
            });
        });
        it('responds with a 400 if a user input is null', (done) => {
          delete user.email;
          request(app)
            .post('/api/v1/auth/login')
            .send(user)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400, done)
            .expect((res) => {
              expect(res.body.error).to.equal('Input Email please!');
            });
        });
        it('responds with a 400 if a user input is undefined', (done) => {
          delete user.email;
          request(app)
            .post('/api/v1/auth/login')
            .send(user)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400, done)
            .expect((res) => {
              expect(res.body.error).to.equal('Input Email please!');
            });
        });
        it('responds with a 400 if a user email is invalid', (done) => {
          user.email = 'alihdhddhdhd.com';
          request(app)
            .post('/api/v1/auth/login')
            .send(user)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400, done)
            .expect((res) => {
              expect(res.body.error).to.equal('Email is not valid!');
            });
        });
        describe('POST /api/v1/entries', () => {
          it('responds with the right reponse when an entry is created', (done) => {
            const entry = {
              title: 'Enough is enough!',
              content: 'It has been almost a century... ',
            };
            request(app)
              .post('/api/v1/entries')
              .set('x-access-token', tk)
              .send(entry)
              .expect('Content-Type', /json/)
              .expect(201, done)
              .expect((res) => {
                const entryId = res.body.data.id;
                id = entryId;
                const { message } = res.body;
                const { title } = res.body.data;
                expect(message).to.equal('Entry successfully created and added!');
                expect(title).to.equal('Enough is enough!');
              });
          });
          describe('errors are properly handled when a request is made to create an entry', () => {
            it('responds with the right reponse when some of the request body field is missing', (done) => {
              const entry = {
                title: 'Enough is enough!',
              };
              request(app)
                .post('/api/v1/entries')
                .send(entry)
                .set('x-access-token', tk)
                .expect('Content-Type', /json/)
                .expect(400, done)
                .expect((res) => {
                  const { error } = res.body;
                  expect(error).to.equal('Invalid Input');
                });
            });
            it('responds with the right reponse when some request body field is null', (done) => {
              const entry = {
                title: 'Enough is enough!',
                content: '',
              };
              request(app)
                .post('/api/v1/entries')
                .send(entry)
                .set('x-access-token', tk)
                .expect('Content-Type', /json/)
                .expect(400, done)
                .expect((res) => {
                  const { error } = res.body;
                  expect(error).to.equal('A field does not contain any input');
                });
            });
            it('responds with the right reponse when some request body field contains only whitespaces', (done) => {
              const entry = {
                title: 'Enough is enough!',
                content: '  ',
              };
              request(app)
                .post('/api/v1/entries')
                .send(entry)
                .set('x-access-token', tk)
                .expect('Content-Type', /json/)
                .expect(400, done)
                .expect((res) => {
                  const { error } = res.body;
                  expect(error).to.equal('A field does not contain any input');
                });
            });
            it('responds with the right reponse when some request body field contains only digits', (done) => {
              const entry = {
                title: 'Enough is enough!',
                content: '6687',
              };
              request(app)
                .post('/api/v1/entries')
                .send(entry)
                .set('x-access-token', tk)
                .expect('Content-Type', /json/)
                .expect(400, done)
                .expect((res) => {
                  const { error } = res.body;
                  expect(error).to.equal('Cannot be numbers only!');
                });
            });
            describe('GET /api/v1/entries', () => {
              it('returns the right response when getting entries', (done) => {
                request(app)
                  .get('/api/v1/entries')
                  .set('x-access-token', tk)
                  .expect('Content-Type', /json/)
                  .expect(200, done);
              });
            });
            describe('PUT /api/v1/entries/<entryId>', () => {
              it('responds with the right response when it updates a particular entry', (done) => {
                const entry = {
                  title: 'Enough is enough!',
                  content: 'It has been almost a century... ',
                };
                request(app)
                  .put(`/api/v1/entries/${id}`)
                  .send(entry)
                  .set('x-access-token', tk)
                  .expect('Content-Type', /json/)
                  .expect(201, done)
                  .expect((res) => {
                    const { message } = res.body;
                    expect(message).to.equal('Entry successfully updated!');
                  });
              });
              it('responds with the right response when it a particular entry to be updated is not found', (done) => {
                const entry = {
                  title: 'Enough is enough!',
                  content: 'It has been almost a century... ',

                };
                request(app)
                  .put('/api/v1/entries/700')
                  .send(entry)
                  .set('x-access-token', tk)
                  .expect('Content-Type', /json/)
                  .expect(404, done)
                  .expect((res) => {
                    const { message } = res.body;
                    expect(message).to.equal('Entry not found!');
                  });
              });
              describe('PUT /api/v1/entries/<entryId>', () => {
                describe('errors are properly handled when a request is made to modify an entry', () => {
                  it('responds with the right reponse when some request body field is null', (done) => {
                    const entry = {
                      title: 'Enough is enough!',
                      content: '',
                    };
                    request(app)
                      .put(`/api/v1/entries/${id}`)
                      .send(entry)
                      .set('x-access-token', tk)
                      .expect('Content-Type', /json/)
                      .expect(400, done)
                      .expect((res) => {
                        const { error } = res.body;
                        expect(error).to.equal('A field does not contain any input');
                      });
                  });
                  it('responds with the right reponse when some request body field contains only whitespaces', (done) => {
                    const entry = {
                      title: 'Enough is enough!',
                      content: '  ',
                    };
                    request(app)
                      .put(`/api/v1/entries/${id}`)
                      .send(entry)
                      .set('x-access-token', tk)
                      .expect('Content-Type', /json/)
                      .expect(400, done)
                      .expect((res) => {
                        const { error } = res.body;
                        expect(error).to.equal('A field does not contain any input');
                      });
                  });
                  it('responds with the right reponse when some request body field contains only digits', (done) => {
                    const entry = {
                      title: 'Enough is enough!',
                      content: '67889',
                    };
                    request(app)
                      .put(`/api/v1/entries/${id}`)
                      .send(entry)
                      .set('x-access-token', tk)
                      .expect('Content-Type', /json/)
                      .expect(400, done)
                      .expect((res) => {
                        const { error } = res.body;
                        expect(error).to.equal('Cannot be numbers only!');
                      });
                  });
                  describe('GET /api/v1/entries/entryId', () => {
                    it('returns with the right response when getting an entry of a specific user', (done) => {
                      request(app)
                        .get(`/api/v1/entries/${id}`)
                        .set('x-access-token', tk)
                        .expect('Content-Type', /json/)
                        .expect(200, done)
                        .expect((res) => {
                          const { message } = res.body;
                          expect(message).to.equal('Entry successfully gotten!');
                        });
                    });
                    describe('GET /api/v1/entries', () => {
                      it('returns with the right response when getting entries of a particular user', (done) => {
                        request(app)
                          .get('/api/v1/entries')
                          .set('x-access-token', tk)
                          .expect('Content-Type', /json/)
                          .expect(200, done)
                          .expect((res) => {
                            const { message } = res.body;
                            expect(message).to.equal('Entries successfully gotten!');
                          });
                      });
                      it('returns with the right response when entry to be gotten is not found', (done) => {
                        request(app)
                          .get('/api/v1/entries/10')
                          .set('x-access-token', tk)
                          .expect('Content-Type', /json/)
                          .expect(404, done)
                          .expect((res) => {
                            const { message } = res.body;
                            expect(message).to.equal('Entry not found!');
                          });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

