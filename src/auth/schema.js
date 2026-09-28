const {z} = require('zod');
const {passwordSchema, emailSchema, nameSchema} = require('../utils/validators');

const signupSchema = z.object({
    password: passwordSchema,
    email: emailSchema,
    firstName: nameSchema
})

const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema
})

module.exports = {signupSchema, loginSchema};