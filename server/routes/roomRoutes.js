const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const protect = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
    try {
        const rooms = await Room.find({}).select('name _id description');
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/', protect, async (req, res) => {
    const { name, description } = req.body;

    if (!name) return res.status(400).json({ message: 'Room name is required' });

    try {
     
        const roomExists = await Room.findOne({ name });
        
        
        if (roomExists) {
            return res.status(400).json({ message: 'Room already exists' });
        }

        const room = await Room.create({
            name,
            description,
            createdBy: req.user.id || req.user._id 
        });

     
        const io = req.app.get('io');
        if (io) {
            io.emit('room_created', room);
        }

        res.status(201).json(room);
    } catch (error) {
        console.error("Create Room Error:", error);
        res.status(400).json({ message: 'Invalid room data' });
    }
});

module.exports = router;