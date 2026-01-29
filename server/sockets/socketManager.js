const Message = require('../models/Message');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on('join_room', async (room) => {
            socket.join(room);
            socket.currentRoom = room;
            console.log(`User ${socket.id} joined room: ${room}`);

            try {
                const history = await Message.find({ roomId: room })
                    .sort({ timeStamp: -1 })
                    .limit(50);
                
                socket.emit('room_history', {
                    roomId: room,
                    messages: history.reverse()
                });
            } catch (error) {
                console.error('Error loading messages', error);
            }
        });

        socket.on('send_message', async (data) => {
            const { roomId, sender, text } = data;
            
            // Broadcast to everyone in room (including sender is usually fine for chat text, 
            // but usually we use io.to for chat sync)
            io.to(roomId).emit('receive_message', data);

            try {
                await Message.create({ roomId, sender, text });
            } catch (error) {
                console.error('DB save error', error);
            }
        });

        socket.on('typing', (data) => {
            socket.to(data.roomId).emit('display_typing', data.userName);
        });

    
        socket.on("callUser", (data) => {
          
            socket.to(data.userToCall).emit("callUser", {
                signal: data.signalData,
                from: data.from,
                name: data.name
            });
        });

        socket.on("answerCall", (data) => {
          
            io.to(data.to).emit("callAccepted", data.signal);
        });

        socket.on('disconnect', () => {
            if (socket.currentRoom) {
                socket.to(socket.currentRoom).emit('user_left');
            }
        });
    });
};