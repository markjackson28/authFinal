'use strict';

const express = require('express');
const { users } = require('./models');
const basic = require('./middleware/basic.js');
const bearer = require('./middleware/bearer.js');
const permissions = require('./middleware/acl.js');
const authRouter = express.Router();

authRouter.use(express.json());

authRouter.get('/', handleMain);
authRouter.post('/signup', handleCreate);
authRouter.post('/signin', basic, handleSignin);
authRouter.get('/users', bearer, permissions('delete'), handleGetAll);
authRouter.put('/users/:id', bearer, permissions('delete'), handleUpdate);
authRouter.delete('/users/:id', bearer, permissions('delete'), handleDelete);

// Oreo eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlN1bW1lciIsImlhdCI6MTYzNTExMDkxNn0.HHaxO7cA9QCME_LjT7bmVOC77X5fOYsXlbBZzWMWR1c
// Oreo eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik9yZW8iLCJpYXQiOjE2MzUxMTEwNjF9.o9WmLeW-5BaqHO7ezJi__cwOjSyPbRee5a8m3AoPb_4

function handleMain (req, res, next) {
  res.status(200).send("Auth Final Lab");
}

async function handleCreate (req, res, next) {
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
};

function handleSignin (req, res, next) {
  const user = {
    user: req.user,
    token: req.user.token
  };
  res.status(200).json(user);
};

async function handleGetAll (req, res, next) {
  const userRecords = await users.findAll({});
  const list = userRecords.map(user => user.username);
  res.status(200).json(list);
};

async function handleUpdate (req, res, next) {
  const id = req.params.id;
  let obj = req.body;
  let updatedRecord = await users.findOne({ where: { id } })
    .then(record => record.update(obj));
  res.status(200).json(updatedRecord);
};

async function handleDelete (req, res, next) {
  const id = req.params.id;
  const deletedUser = await users.destroy({where: { id }});
  res.send(200).json(deletedUser);
};

module.exports = authRouter;
