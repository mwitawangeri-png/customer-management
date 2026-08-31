const bcrypt = require('bcrypt');
const prisma = require('../db')

const registerUser = async (req, res) => {
    const {email, password, firstName} = req.body;

    try {

        // Validate that email and password fields are not empty
        if(!email || !password || !firstName){
            return res.status(400).json({message: 'All fields are required'});
        }

        // Check that the user doesn't already exist
        const userExists = await prisma.user.findUnique({

            where:{email: email}
        });
        
        if(userExists){ return res.status(400).json({message: "User already exists"})}

        // Hash password
        const salt = bcrypt.genSaltSync(10);
        const passwordHash = await bcrypt.hashSync(password, salt);

        const newUser = await prisma.user.create({

            data:{
                email: email,
                passwordHash: passwordHash,
                firstName: firstName
            }
        });

        return res.status(201).json({message :"Account successfully created",
                id: `${newUser.id}`
        })

    }catch(error){

        console.error("Request failed", error);
        return res.status(500).json({message: "Request failed", error: error});
    }
}

module.exports = {registerUser}