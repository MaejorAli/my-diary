import request from 'supertest';
import chai from 'chai';
import app from '../app';


const { expect } = chai;

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

  describe('POST /api/v1/entries', () => {
    it('responds with the right reponse when an entry is created', (done) => {
      const entry = {
        title: 'Enough is enough!',
        story: 'It has been almost a century... ',

      };
      request(app)
        .post('/api/v1/entries')
        .send(entry)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201, done)
        .expect((res) => {
          const { message } = res.body;
          const { title } = res.body.response;
          expect(message).to.equal('Entry successfully created and saved');
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
          .set('Accept', 'application/json')
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
          story: '',
        };
        request(app)
          .post('/api/v1/entries')
          .send(entry)
          .set('Accept', 'application/json')
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
          story: '  ',
        };
        request(app)
          .post('/api/v1/entries')
          .send(entry)
          .set('Accept', 'application/json')
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
          story: '6687',
        };
        request(app)
          .post('/api/v1/entries')
          .send(entry)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(400, done)
          .expect((res) => {
            const { error } = res.body;
            expect(error).to.equal('Input text only!');
          });
      });
      it('responds with the right reponse when some request body field is alphanumeric', (done) => {
        const entry = {
          title: 'Enough is enough!',
          story: '6687fstaff of',
        };
        request(app)
          .post('/api/v1/entries')
          .send(entry)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(400, done)
          .expect((res) => {
            const { error } = res.body;
            expect(error).to.equal('Input text only!');
          });
      });
    });
  });
  describe('GET /api/v1/entries', () => {
    it('returns the right response when getting entries', (done) => {
      request(app)
        .get('/api/v1/entries')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done)
        .expect((res) => {
          expect(res.body.entries.length).to.equal(4);
        });
    });
  });
});
describe('PUT /api/v1/entries/<entryId>', () => {
  it('responds with the right response when it updates a particular entry', (done) => {
    const entry = {
      title: 'Enough is enough!',
      story: 'It has been almost a century... ',

    };
    request(app)
      .put('/api/v1/entries/2')
      .send(entry)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201, done)
      .expect((res) => {
        const { message } = res.body;
        expect(message).to.equal('Successfully Modified');
      });
  });
});
describe('GET /api/v1/entries/entryId', () => {
  it('returns with the right response when getting an entry', (done) => {
    request(app)
      .get('/api/v1/entries/1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done)
      .expect((res) => {
        const { message } = res.body;
        expect(message).to.equal('success');
      });
  });
});
describe('PUT /api/v1/recipes/<entryId>', () => {
  describe('errors are properly handled when a request is made to modify an entry', () => {
    it('responds with the right reponse when some request body field is null', (done) => {
      const entry = {
        title: 'Enough is enough!',
        story: '',
      };
      request(app)
        .put('/api/v1/entries/1')
        .send(entry)
        .set('Accept', 'application/json')
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
        story: '  ',
      };
      request(app)
        .put('/api/v1/entries/1')
        .send(entry)
        .set('Accept', 'application/json')
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
        story: '67889',
      };
      request(app)
        .put('/api/v1/entries/1')
        .send(entry)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400, done)
        .expect((res) => {
          const { error } = res.body;
          expect(error).to.equal('Input text only!');
        });
    });
  });
});
