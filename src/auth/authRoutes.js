'use strict';

const express = require('express');
const authRouter = express.Router();

const { users } = require('./models');
const basicAuth = require('./middleware/basic.js');
const bearerAuth = require('./middleware/bearer.js');
const permissions = require('./middleware/acl.js');

authRouter.use(express.json());

// Users
// User Oreo: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik9yZW8iLCJpYXQiOjE2MzUwMTczMDR9.k_wP2o8-9hYka037LjoSQXFly0zIWgk4mbAEPcsdHEs 
// Writer Loba: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkxvYmEiLCJpYXQiOjE2MzUwMTczMjh9.xTM8uY6QR2P1X0l-AmK3XX_gtdE3JJMU_Yv7VCLaa-g
// Editor Gibby: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkdpYmJ5IiwiaWF0IjoxNjM1MDE3MzQ2fQ.lMmub97I1txpCav8jvXO4BiPN-kw9ObBZUDNSgFKWxw
// Admin Octane: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik9jdGFuZSIsImlhdCI6MTYzNTAxNzExM30.TIxZYl03e0O_xUUsK88kd-ooKQ53FhHB8mgE0wdMTFY

authRouter.get('/', (req, res, next) => {
  res.status(200).send("Auth Final Lab");
});

authRouter.post('/signup', async (req, res, next) => {
  try {
    let userRecord = await users.create(req.body);
    const output = {
      user: userRecord,
      token: userRecord.token
    };
    res.status(201).json(output);
  } catch (e) {
    next(e.message)
  }
});

authRouter.post('/signin', basicAuth, (req, res, next) => {
  const user = {
    user: req.user,
    token: req.user.token
  };
  res.status(200).json(user);
});

authRouter.get('/users', bearerAuth, permissions('delete'), async (req, res, next) => {
  const userRecords = await users.findAll({});
  const list = userRecords.map(user => user.username);
  res.status(200).json(list);
});

authRouter.put('/users/:id', bearerAuth, permissions('delete'), async (req, res, next) => {
  const id = req.params.id;
  let obj = req.body;
  let updatedRecord = await users.findOne({ where: { id } })
    .then(record => record.update(obj));
  res.status(200).json(updatedRecord);
});

authRouter.delete('/users/:id', bearerAuth, permissions('delete'), async (req, res, next) => {
  const id = req.params.id;
  const deletedUser = await users.destroy({where: { id }});
  res.send(200).json(deletedUser);
});

authRouter.get('/secret', bearerAuth, async (req, res, next) => {
  res.status(200).send('Cool Beans, your token works.');
});

module.exports = authRouter;
