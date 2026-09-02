const express = require('express');
const router = express.Router();
const {generateProjectQuote} = require('./controller');

router.get('/:id/quote', generateProjectQuote); 

module.exports = router;
