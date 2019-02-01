const request = require('supertest');

const app = require('../app');

describe('Items Controller', () => {
  it('resond with json with list of products', done => {
    request(app)
      .get('/items')
      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.body).not.toBeUndefined;
        done();
      });
  });
});
