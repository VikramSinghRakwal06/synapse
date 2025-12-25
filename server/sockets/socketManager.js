const Message = require('../models/Message');

module.exports = (io)=>{
   io.on('connection',(socket)=>{
    console.log(`User connected: ${socket.id}`);

    socket.on('join_room',async(room)=>{
        socket.join(room);
        socket.currentRoom = room;
        console.log(`User ${socket.id} joined room: ${room}`)
        try {
            const history = await Message.find({roomId: room})
                                            .sort({timestamp:-1})
                                            .limit(50);
            socket.emit('load_history', history.reverse());
        } catch (error) {
            console.error('Error loading messages', error);
        }
    })
    socket.on('send_message',async(data)=>{
        const {roomId, sender, text}=data;
        io.to(roomId).emit('receive_message',data);
        try {
           await Message.create({ roomId, sender, text });
        } catch (error) {
            console.error('DB save error',error);
        }   
    })
    socket.on('typing', (data)=>{
        socket.to(data.roomId).emit('display_typing',data.username);
    })

    socket.on("callUser",(data)=>{
        io.to(data.userToCall).emit("callUser",{
            signal: data.signalData,
            from:data.from,
            name:data.name
        });
    })

    socket.on("answerCall",(data)=>{
        io.to(data.to).emit("callAccepted",data.signal);
    })

    socket.on('disconnect',()=>{
        console.log(`User ${socket.id} disconnected`);
        if(socket.currentRoom){
             socket.to(socket.currentRoom).emit('user_left');
        }
       
    })
   })
}