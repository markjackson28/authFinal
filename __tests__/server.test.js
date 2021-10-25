'use strict';

const supertest = require('supertest');
const { server } = require('../src/server');
const { db } = require('../src/auth/models/index');

const mockRequest = supertest(server);

beforeAll(async () => {
  await db.sync();
});
afterAll(async () => {
  await db.drop();
});


describe('Router', () => {

  it('should hit a bad route', async () => {
    let response = await mockRequest.get('/potato');
    expect(response.status).toBe(404);
  });

  it('should hit a main route w/ 200', async () => {
    let response = await mockRequest.get('/');
    expect(response.status).toBe(200);
  });

});
