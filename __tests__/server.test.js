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

  let admin, user, token, token2;

  beforeAll(async () => {
    user = await mockRequest.post('/signup').send({ username: 'testUser', password: 'password', role: 'user'});
    admin = await mockRequest.post('/signup').send({ username: 'testAdmin', password: 'password', role: 'admin'});
    token = admin.body.token;
    token2 = user.body.token;
  });

  it('should hit a bad route', async () => {
    let response = await mockRequest.get('/potato');
    expect(response.status).toBe(404);
  });

  it('should hit a main route w/ 200', async () => {
    let response = await mockRequest.get('/');
    expect(response.status).toBe(200);
  });

  it('should post a movie: Admin', async () => {
    const response = await mockRequest.post('/api/apiRoutes/movie').send({ name: 'Fury', rating: 9, reason: 'Coolbeans' }).auth(token, { type: 'bearer'});
    // console.log('inside post', response);
    expect(response.status).toEqual(201);
    expect(response.body).toBeDefined();
  });

  it('should not be able to post a movie: User', async () => {
    const response = await mockRequest.post('/api/apiRoutes/movie').send({ name: 'Fury', rating: 9, reason: 'Coolbeans' }).auth(token2, { type: 'bearer'});
    // console.log('inside post', response);
    expect(response.status).toEqual(500);
  });

});
