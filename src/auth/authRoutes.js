'use strict';

const express = require('express');
const { users } = require('./models');
const basic = require('./middleware/basic.js');
const bearer = require('./middleware/bearer.js');
const permissions = require('./middleware/acl.js');
const authRouter = express.Router();

authRouter.get('/', handleMain);
authRouter.post('/signup', handleCreate);
authRouter.post('/signin', basic, handleSignin);
authRouter.get('/users', bearer, permissions('delete'), handleGetAll);
authRouter.put('/users/:id', bearer, permissions('delete'), handleUpdate);
authRouter.delete('/users/:id', bearer, permissions('delete'), handleDelete);

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
    // console.log('User Create Test: ', output);
    res.status(201).json(output);
  } catch (e) {
    next(e.message)
  }
};

function handleSignin (req, res, next) {
  const user = {
    user: req.user,
  };
  // console.log('User Sign-in Test: ', user);
  res.status(200).json(user);
};

async function handleGetAll (req, res, next) {
  const userRecords = await users.findAll({});
  const list = userRecords.map(user => 
    `User/Username: ${user.username}, User Role: ${user.role}, ID: ${user.id}`);
  // console.log('Admin is able to get list test: ', list);
  res.status(200).json(list);
};

async function handleUpdate (req, res, next) {
  const id = req.params.id;
  let obj = req.body;
  let updatedRecord = await users.findOne({ where: { id } })
    .then(record => record.update(obj));
  // console.log('Admin is able to update Test: ', updatedRecord);
  res.status(200).json(updatedRecord);
};

async function handleDelete (req, res, next) {
  const id = req.params.id;
  const deletedUser = await users.destroy({where: { id }});
  // console.log('Admin is able to delete user Test: ', deletedUser);
  res.status(200).json(`User Deleted ${deletedUser}`);
};

module.exports = authRouter;
