const zod = require('zod');
const signupVal = zod.object({
    username: zod.string(),
    email: zod.email()
    //password: zod.pass
})