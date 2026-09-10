const {z} = require('zod');
const { emailSchema, nameSchema} = require('../utils/validators');

const createClientSchema = z.object({
    email: emailSchema,
    firstName: nameSchema,
    lastName: nameSchema.optional()
})

module.exports = {createClientSchema};