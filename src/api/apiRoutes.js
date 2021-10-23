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

// Users
// User Oreo: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik9yZW8iLCJpYXQiOjE2MzUwMTczMDR9.k_wP2o8-9hYka037LjoSQXFly0zIWgk4mbAEPcsdHEs 
// Writer Loba: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkxvYmEiLCJpYXQiOjE2MzUwMTczMjh9.xTM8uY6QR2P1X0l-AmK3XX_gtdE3JJMU_Yv7VCLaa-g
// Editor Gibby: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkdpYmJ5IiwiaWF0IjoxNjM1MDE3MzQ2fQ.lMmub97I1txpCav8jvXO4BiPN-kw9ObBZUDNSgFKWxw
// Admin Octane: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik9jdGFuZSIsImlhdCI6MTYzNTAxNzExM30.TIxZYl03e0O_xUUsK88kd-ooKQ53FhHB8mgE0wdMTFY

router.get('/:model', basic, handleGetAll);
router.get('/:model/:id', basic, handleGetOne);
router.post('/:model', bearer, permissions('create'), handleCreate);
router.put('/:model/:id', bearer, permissions('update'), handleUpdate);
router.delete('/:model/:id', bearer, permissions('delete'), handleDelete);

async function handleGetAll(req, res) {
  let allRecords = await req.model.get();
  res.status(200).json(allRecords);
}

async function handleGetOne(req, res) {
  const id = req.params.id;
  let theRecord = await req.model.get(id);
  // console.log('inside suace', theRecord);
  res.status(200).json(theRecord);
}

async function handleCreate(req, res) {
  let obj = req.body;
  let newRecord = await req.model.create(obj);
  res.status(201).json(newRecord);
}

async function handleUpdate(req, res) {
  const id = req.params.id;
  const obj = req.body;
  let updatedRecord = await req.model.update(id, obj);
  res.status(200).json(updatedRecord);
}

async function handleDelete(req, res) {
  let id = req.params.id;
  let deletedRecord = await req.model.delete(id);
  res.status(200).json(deletedRecord);
}

module.exports = router;
