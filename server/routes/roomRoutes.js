const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const protect = require('../middleware/authMiddleware')

router.get('/',protect, async(req,res)=>{
    try {
        const rooms =await Room.find({}).select('name _id description');
        res.json(rooms);
    } catch (error) {
        res.status(500).json({message: 'Server Error'});
    }
})

router.post('/',protect, async(req,res)=>{
    const {name,description}= req.body;
    const roomExists = await Room.findOne({name});
    if(roomExists)res.status(400).json({message:'Room already exists'});
    try {
        const room = await Room.create({
            name, description, createdBy: req.user.id
        });
        res.status(201).json(room);
    } catch (error) {
        res.status(400).json({message:'Invalid room data'});
    }
});
module.exports= router;