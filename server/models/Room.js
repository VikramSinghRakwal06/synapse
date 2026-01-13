const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true,
        trim:true,
    },
    description:{
        type: String,
        default:"A synapse channel"
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    isPrivate:{
        type:Boolean,
        default: false
    }
},{timestamps:true});

module.exports= mongoose.model('Room',roomSchema);