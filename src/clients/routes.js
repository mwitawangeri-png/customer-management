const express = require('express');
const router = express.Router();
const protect = require('../middleware/middleware');
const {createClient, getClients, deleteClient, createProject} = require('./controller');
const {createClientSchema} = require('./schema');
const validate = require('../middleware/validate');
const {limiterGlobal} = require('../middleware/ratelimiter');

router.post('/', limiterGlobal,protect, validate(createClientSchema), createClient);
router.get('/', limiterGlobal, protect, getClients);
router.delete('/:id', limiterGlobal, protect, deleteClient);
router.post('/:id/projects', limiterGlobal, protect, createProject);

module.exports = router;