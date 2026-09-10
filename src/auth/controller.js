const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');


const registerUser = async (req, res) => { //register a new user
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

const loginUser = async (req,res) => { // receive data from body
    const {email, password} = req.body;

    try{
        
        const user = await prisma.user.findUnique({ // check if email exists in db

            where: {
                email: email
            },
            select:{
                id:true,
                passwordHash:true,
            },
        });


        if (!user){ return res.status(401).json({message: "Invalid credentials"})}

        const match = await bcrypt.compare(password, user.passwordHash); // compare password hash
        
        if(!match){ return res.status(401).json({message: "Invalid credentials"})}

        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET,{expiresIn: '1h'});//log the user in (create jwt token)
        return res.json({message: "Login successful!", token: token})

    }catch(error){

        console.log("Login Failed", error)
        return res.status(500).json({message: "Login Failed", error: error})
    }

}

module.exports = {registerUser, loginUser}