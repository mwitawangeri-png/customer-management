const express = require('express');
const router = express.Router(); // create router instance
const {registerUser} = require('./controller')

router.use((req, res, next) => {

    console.log('User route accesed at:', new Date().toISOString());
    next();
});

router.post('/register', registerUser);

router.post('/login', (req, res) => {
   
});

module.exports = router;