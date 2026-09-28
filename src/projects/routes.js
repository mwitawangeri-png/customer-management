const express = require('express');
const router = express.Router();
const {generateProjectQuote, uploadFile} = require('./controller');
const upload = require('../middleware/upload');
const protect = require('../middleware/middleware');
const {limiterGlobal} = require('../middleware/ratelimiter');


router.post('/:id/upload', limiterGlobal, protect, upload.single('document'), uploadFile)
router.get('/:id/quote', limiterGlobal, protect, generateProjectQuote); 

module.exports = router;
