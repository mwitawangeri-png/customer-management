const express = require('express');
const router = express.Router(); // create router instance
const {registerUser, loginUser} = require('./controller')
const validate = require('../middleware/validate');
const {signupSchema,  loginSchema} = require('./schema');

router.use((req, res, next) => {

    console.log('User route accesed at:', new Date().toISOString());
    next();
});

router.post('/register', validate(signupSchema), registerUser);

router.post('/login', loginUser);

module.exports = router;