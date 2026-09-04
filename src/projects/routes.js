const express = require('express');
const router = express.Router();
const {generateProjectQuote, uploadFile} = require('./controller');
const upload = require('../middleware/upload');
const protect = require('../middleware/middleware')

router.post('/:id/upload', protect, upload.single('document'), uploadFile)
router.get('/:id/quote', protect, generateProjectQuote); 

module.exports = router;
