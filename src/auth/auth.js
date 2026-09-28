const express = require('express');
const router = express.Router(); // create router instance
const {registerUser, loginUser} = require('./controller')
const validate = require('../middleware/validate');
const {signupSchema,  loginSchema} = require('./schema');
const {limiterAuth} = require('../middleware/ratelimiter');

router.use((req, res, next) => {
    console.log('User route accesed at:', new Date().toISOString());
    next();
});

router.post('/register', limiterAuth, validate(signupSchema), registerUser);

router.post('/login', limiterAuth, validate(loginSchema), loginUser);

module.exports = router;