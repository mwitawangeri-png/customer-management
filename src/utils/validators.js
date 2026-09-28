//start with signup
const {z} = require('zod');

const passwordSchema = z.string()
    .min(8, {message: "Password must be at least 8 characters long"
    })
    .refine((val) => /[A-Z]/.test(val),{
        message: "Password must contain at least one upper case letter."
    })
    .refine((val) => /[a-z]/.test(val),{
        message: "Password must contain at least one lowecase leeter."
    })
    .refine((val) => /[0-9]/.test(val), {
        message: "Password must contain atleast one number."
    })
        .refine((val) => /[A-Za-z0-9]/.test(val), {
        message: "Password must contain at least one special character"
    });

const emailSchema = z.string().trim().toLowerCase().pipe(z.email({
    message: "Please enter a valid email address."
 }));

const nameSchema = z.string().min(2, {message: "Name must be at least 2 characters"}).trim();

module.exports = {passwordSchema, emailSchema, nameSchema}