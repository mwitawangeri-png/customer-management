const express = require('express');
const router = express.Router();
const {generateProjectQuote, uploadFile} = require('./controller');
const upload = require('../middleware/upload');

router.post('/:id/upload', upload.single('document'), uploadFile)
router.get('/:id/quote', generateProjectQuote); 

module.exports = router;
