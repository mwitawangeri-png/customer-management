const express = require('express');
const router = express.Router();
const protect = require('../middleware/middleware');
const {createClient} = require('./controller');

router.post('/', protect, createClient);

module.exports = router;