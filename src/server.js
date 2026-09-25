require('dotenv').config();
const {createServer} = require('node:http');
const {Server} = require('socket.io');
const express = require('express');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

//apply CORS
app.use(helmet());
const allowedOrgins = process.env.ALLOWED_ORIGINS? process.env.ALLOWED_ORIGINS.split(','):['http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {

      if (!origin || allowedOrgins.includes(origin)) {
        callback(null,true);
      } else{
        callback(new Error('CORS policy violation: Origin not allowed'));
      }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']

}));

const server = createServer(app);
const io = new Server(server,{
  cors: {origin: "*"}
});

const jwtservice = {
  verifyToken: (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
        }
};

const authRouter = require('./auth/auth');
const clientRouter = require('./clients/routes');
const project = require('./projects/routes');
const {router: chatRouter, initChatSocket} = require('./sockets/chat.socket');
const port = process.env.PORT; 

app.use(express.json());
app.use('/api/v1/auth', authRouter); // Mount auth router to app
app.use('/api/v1/clients', clientRouter);
app.use('/api/v1/projects', project);
app.use('/', chatRouter);

initChatSocket(io, jwtservice);

if (process.env.NODE_ENV !== 'test'){
  server.listen(port, () => {
    console.log(`CRM Backend is live and listening on port ${port}`);
  });
}

module.exports = app;