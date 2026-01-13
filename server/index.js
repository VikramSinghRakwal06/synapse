require('dotenv').config();
const express= require('express');
const http= require('http');
const cors = require('cors');
const helmet  = require('helmet');
const morgan = require('morgan');
const {Server}=require('socket.io');

const connectDB = require('./db/connect');
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const socketManager = require('./sockets/socketManager');

const app = express();
connectDB();

app.use(express.json());//parse json
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "http://localhost:5173"], // Allow Vite & Eval
        connectSrc: ["'self'", "http://localhost:5173", "ws://localhost:5173"], // Allow Sockets
        imgSrc: ["'self'", "data:", "blob:"], // Allow WebRTC Video Blobs
      },
    },
  })
);//secure HTTP headers
app.use(morgan('dev'));//Request logging
app.use(cors());//Allow cross origin requests

app.use('/api/auth',authRoutes);
app.use('/api/rooms',roomRoutes);

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:'*',//frontend url after deployment
        methods:[ "GET","POST"],
    }
})

socketManager(io);

const PORT = process.env.PORT || 3004;

server.listen(PORT, ()=>{
    console.log(`Synapse running on ${PORT}`);
})