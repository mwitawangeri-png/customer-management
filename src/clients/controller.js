const prisma = require('../config/db');

const createClient = async (req, res) => {

    const {firstName, lastName, email} = req.body;
    const userId = req.user.id;

    if (!userId || !email || !firstName){ 
       return res.status(400).json({message: "Missing user, oe email or name"})}

    try{
        
        const client = await prisma.client.create({
            data:{
                firstName: firstName,
                lastName: lastName,
                email: email,
                userId: userId
            }      
        })

        return res.status(201).json({message: "Client successfully created", client: client})

    }catch(error){

        console.error("Failed to create client", error);
        return res.status(500).json({message: "Request failed!"});
    }

}

module.exports = {createClient};