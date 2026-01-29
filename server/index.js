require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { Server } = require('socket.io');

const connectDB = require('./db/connect'); 
const authRoutes = require('./routes/authRoutes'); // Ensure file exists
const roomRoutes = require('./routes/roomRoutes'); // Ensure file exists
const socketManager = require('./sockets/socketManager');

const app = express();
connectDB();

app.use(express.json());
app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "http://localhost:5173"],
        connectSrc: ["'self'", "http://localhost:5173", "ws://localhost:5173"], 
        imgSrc: ["'self'", "data:", "blob:"],
      },
    },
}));
app.use(morgan('dev'));
app.use(cors());

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

const server = http.createServer(app);

// SOCKET CONFIG
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // Frontend URL
        methods: ["GET", "POST"],
    }
});
app.set('io', io);
socketManager(io);

const PORT = process.env.PORT || 3004;
server.listen(PORT, () => {
    console.log(`Synapse Server running on port ${PORT}`);
});