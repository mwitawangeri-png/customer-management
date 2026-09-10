const {z} = require('zod');
const {passwordSchema, emailSchema, nameSchema} = require('../utils/validators');

const signupSchema = z.object({
    password: passwordSchema,
    email: emailSchema,
    firstName: nameSchema
})

module.exports = {signupSchema};