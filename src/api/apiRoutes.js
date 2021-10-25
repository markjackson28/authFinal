'use strict';

const express = require('express');
const dataModules = require('../auth/models/index')
const basic = require('../auth/middleware/basic');
const bearer = require('../auth/middleware/bearer');
const permissions = require('../auth/middleware/acl')

const router = express.Router();

router.param('model', (req, res, next) => {
  const modelName = req.params.model;
  if (dataModules[modelName]) {
    req.model = dataModules[modelName];
    next();
  } else {
    next('Invalid Model');
  }
});

router.get('/:model', basic, handleGetAll);
router.get('/:model/:id', basic, handleGetOne);
router.post('/:model', bearer, permissions('create'), handleCreate);
router.put('/:model/:id', bearer, permissions('update'), handleUpdate);
router.delete('/:model/:id', bearer, permissions('delete'), handleDelete);

async function handleGetAll(req, res) {
  let allRecords = await req.model.get();
  let modelList = allRecords.map((item) => {
    let list = `Title: ${item.name}, Rating: ${item.rating}, ID: ${item.id}`;
    return list;
  });
  // console.log('User is able to get list test: ', modelList);
  res.status(200).json(modelList);
}

async function handleGetOne(req, res) {
  const id = req.params.id;
  let theRecord = await req.model.get(id);
  // console.log('User is able to get list test: ', theRecord);
  res.status(200).json(theRecord);
}

async function handleCreate(req, res) {
  let obj = req.body;
  let newRecord = await req.model.create(obj);
  // console.log('writer and above are able to create: ', newRecord);
  res.status(201).json(newRecord);
}

async function handleUpdate(req, res) {
  const id = req.params.id;
  const obj = req.body;
  let updatedRecord = await req.model.update(id, obj);
  // console.log('editor and above are able to update: ', updatedRecord);
  res.status(200).json(updatedRecord);
}

async function handleDelete(req, res) {
  let id = req.params.id;
  let deletedRecord = await req.model.delete(id);
  // console.log('Admin is able to delete: ', deletedRecord);
  res.status(200).json(deletedRecord);
}

module.exports = router;
