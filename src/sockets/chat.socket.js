const express = require('express');
const router = express.Router();
const path = require('path');


const fileUrl = path.join(__dirname, './index.html')
const chatEvent = 'chat message';

router.get('/', (req, res) => {

    res.sendFile(fileUrl);
});

const handleConnection = (socket) => {
    console.log(`User ${socket.user.id} connected`);
    socket.on('disconnect', () => {
        console.log(`User ${socket.user.id} disconnected`)
    });
};

const authenticateSocket = (socket, jwtservice, next) =>{
    try{

        const authHeader = socket.handshake.auth?.token;
        if(!authHeader) return next(new Error('Token missing'));

        const token = authHeader.split(" ")[1];
        socket.user = jwtservice.verifyToken(token)
        return next();
    }catch(error){
        return next(new Error("invalid token"));
    }
};
const initChatSocket= (io, jwtservice) => {

    io.use((socket, next) =>{
        authenticateSocket(socket, jwtservice, next); 
    });

    io.on('connection', (socket) => {
        
        handleConnection(socket);
        // join room
        socket.on('join project', (projectID) => {
            socket.join(projectID);
            console.log(`User ${socket.id} joined room: ${projectID}`)
        });
        
        socket.on(chatEvent, async (data,callback) => {
            try{
                if(!data || !data.msg){
                    return callback({
                        status: 'error',
                        error: 'Message payload is missing'
                    });
                }
                
            console.log(`Message received for ${data.projectID}: ${data.msg}`);

            callback({
              status: 'ok',
              timestamp: new Date().toISOString()
            });

            io.to(data.projectID)
            .emit(chatEvent, {msg: data.msg}); 

            }
            catch(error){
                console.error('Socket processing error:', error);
                callback({
                    status: 'error',
                    error: 'Internal server error processing message'
            });                
            }

        })

        
    })

}

module.exports = {router, initChatSocket};