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
const signupSchema = z.object({

    password: passwordSchema,
    email: emailSchema
})

const validateSignup = (req, res, next) => {
    try{

        req.body = signupSchema.parse(req.body);
        next();

    }catch(error){
        console.error(error)
        return res.status(400).json({message: "Validation failed",
            errors: error.errors
        })
}
}

module.exports = {validateSignup}