const prisma = require('../config/db');

const createClient = async (req, res) => {

    const {firstName, lastName, email} = req.body;
    const userId = req.user.id;

    if (!email || !firstName){ 
       return res.status(400).json({message: "Missing required client fields"})}

    try{

        const client = await prisma.client.create({
            data:{
                firstName: firstName,
                lastName: lastName,
                email: email,
                userId: userId
            }      
        })

        return res.status(201).json({
            message: "Client successfully created",
            client:
            { 
            name: client.firstName + client.lastName,
            email: client.email,
            created: client.createdAt
            }
        })

    }catch(error){

        console.error("Failed to create client", error);
        return res.status(500).json({message: "Request failed!"});
    }

}

const getClients = async (req, res) => {

    const user = req.user.id;

    try{
    const clients = await prisma.client.findMany({
        where: {
            userId: user,
        }
    });

    return res.status(200).json({message: "Clients fetched!",
        clients: clients
    })

    }catch(error){
        console.error("Failed to fetch clients", error);
        return res.status(500).json({message: "Failed to fetch clients"});
    }
};

const deleteClient = async (req, res) => {

    const clientId = req.params.id;
    const userId = req.user.id;

    try{

      const result = await prisma.client.deleteMany({

        where:{
            userId: userId,
            id: clientId
        },
      });

      if (result.count === 0){
            return res.status(404).json({message: "Client not found or unauthorized"});
      }
      
      res.status(200).json({message: "Client successfully deleted"});
    }catch(error){

        console.error("Failed to delete client", error);
        return res.status(500).json({message: "Failed to delete client"});
    }

};

const createProject = async (req, res) => {

    const clientId = req.params.id;
    const user = req.user.id;
    const {title, description} = req.body;


    try{
        if (!title){ return res.status(400).json({message: "Missing required fields"})} //ensure title is provided

        const client = await prisma.client.findFirst({ //check if client exists

            where: {
                id: clientId,
                userId: user
            },
        });

        if (!client){ return res.status(400).json({message: "Client not found or unauthorized"})}

        const project = await prisma.project.create({

            data:{
                title: title,
                description: description,
                clientId: clientId,
                userId: user
            },
        });

        return res.status(201).json({message: "Project created successfully!",
            data: project
        });

    }catch(error){

        console.error("Failed to create project", error);
        res.status(500).json({message: "Internal server error"})
    }
};

module.exports = {createClient, getClients, deleteClient, createProject};