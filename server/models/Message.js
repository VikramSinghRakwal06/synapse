const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    roomId: {type:String, required: true},
    sender: {type:String, required: true},
    text: {type:String},
    timeStamp:{type:Date, default:Date.now}
});

messageSchema.index({roomId:1,timeStamp:-1});

module.exports= mongoose.model('Message',messageSchema);