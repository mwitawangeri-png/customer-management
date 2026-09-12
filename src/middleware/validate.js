
// Higher function to pass in the validation schemas
const validate = (schema) => {

    return (req, res, next) => {
        try{
            req.body = schema.parse(req.body);
            next();
        }
        catch(error){
            const formattedErrors = error.flatten().fieldErrors;
            return res.status(400).json({message: "Validation failed",
                errors: formattedErrors
            })            
        }
    }
}

module.exports = validate