const express = require('express');
const router = express.Router();
const auth = require('../middleware/middleware');

router.post('/', auth, /*create client*/);