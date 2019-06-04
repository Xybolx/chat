module.exports = function (io) {
    const connections = {};
    
      io.sockets.on('connection', socket => {
        console.log('user connected on: ' + socket.id);
  
        socket.on('disconnect', () => {
          console.log('user disconnected from ' + socket.id);
        });

        socket.on('SEND_ROOM_JOIN', data => {
          socket.join(data.username + data.otherUser);
          io.to(connections[data.otherUser].id).emit('RECEIVE_ROOM_JOIN', data);
        });

        socket.on('SEND_ACCEPT_ROOM_JOIN', data => {
          socket.join(data.roomName);
          io.in(data.roomName).emit('RECEIVE_ACCEPT_ROOM_JOIN', data);
        });

        socket.on('SEND_DM_MESSAGE', data => {
          io.in(data.roomName).emit('RECEIVE_DM_MESSAGE', data);
        });
  
        socket.on('SEND_MESSAGE', data => { 
          io.sockets.emit('RECEIVE_MESSAGE', data);
      });

        socket.on('SEND_PRIVATE_MESSAGE', function (data) {
            console.log(connections[data.receiver].id);
          io.to(connections[data.receiver].id).emit('RECEIVE_PRIVATE_MESSAGE', data);
      });

      socket.on('SEND_STATUS', data => {
        io.to(connections[data.author].id).emit('RECEIVE_STATUS', data);
      });

        socket.on('SEND_USER', data => {
            console.log(data);
            connections[data.user.username] = socket;
            io.sockets.emit('RECEIVE_USER', data);
        });

        socket.on('SEND_TYPING_USER', data => {
          io.sockets.emit('RECEIVE_TYPING_USER', data);
        });
  
      });
  }
  