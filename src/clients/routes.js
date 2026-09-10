const express = require('express');
const router = express.Router();
const protect = require('../middleware/middleware');
const {createClient, getClients, deleteClient, createProject} = require('./controller');
const {createClientSchema} = require('./schema');
const validate = require('../middleware/validate');

router.post('/',validate(createClientSchema), protect, createClient);
router.get('/', protect, getClients);
router.delete('/:id', protect, deleteClient);
router.post('/:id/projects', protect, createProject);

module.exports = router;