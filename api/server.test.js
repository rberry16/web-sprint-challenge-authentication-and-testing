// Write your tests here
const request = require('supertest');
const server = require('../api/server');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const jwtDecode = require('jwt-decode');
const db = require('../data/dbConfig');

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
})

afterAll(async () => {
  await db.destroy();
})

test('sanity', () => {
  expect(true).not.toBe(false)
})

test('[1] auth register with bad credentials sends correct message', async () => {
  const res = await request(server).post('/api/auth/register').send({username: null, password: null});
  expect(res.body.message).toMatch('username and password are required');
})

test('[2] auth register with good credentials returns new user', async () => {
  await request(server).post('/api/auth/register').send({username: 'fred', password: 'pswd'});
  const user = await db('users').where('username', 'fred').first();
  expect(user).toMatchObject({username: 'fred'})
})

test('[3] get request to jokes without token recieves correct message', async () => {
  const res = await request(server).get('/api/jokes');
  expect(res.body.message).toMatch('token required');
})

test('[4] get request to jokes with token recieves jokes', async () => {
  const res = await request(server).post('/api/auth/login').send({username: 'fred', password: 'pswd'});
  const jokes = await request(server).get('/api/jokes').set('Authorization', res.body.token);
  expect(jokes.body[0]).toMatchObject(
    {
      "id": "0189hNRf2g",
      "joke": "I'm tired of following my dreams. I'm just going to ask them where they are going and meet up with them later."
    },
    {
      "id": "08EQZ8EQukb",
      "joke": "Did you hear about the guy whose whole left side was cut off? He's all right now."
    },
    {
      "id": "08xHQCdx5Ed",
      "joke": "Why didn’t the skeleton cross the road? Because he had no guts."
    },
  )
})

test('[5] auth login with bad credentials returns correct message', async () => {
  const res = await request(server).post('/api/auth/login').send({username: 'fizz', password: 'fazz'});
  expect(res.body.message).toMatch('invalid credentials');
})

test('[6] auth login with good credentials returns correct message', async () => {
  const res = await request(server).post('/api/auth/login').send({username: 'fred', password: 'pswd'});
  expect(res.body.message).toMatch('welcome, fred');
})
