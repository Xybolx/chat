module.exports = function (io) {
    const connections = {};
    
      io.sockets.on('connection', socket => {
        console.log('user connected on: ' + socket.id);
  
        socket.on('disconnect', () => {
          console.log('user disconnected from ' + socket.id);
      });
  
        socket.on('SEND_MESSAGE', data => { 
          io.sockets.emit('RECEIVE_MESSAGE', data);
      });

        socket.on('SEND_PRIVATE_MESSAGE', function (data) {
          io.to(connections[data.receiver].id).emit('RECEIVE_PRIVATE_MESSAGE', data);
      });

      socket.on('SEND_STATUS', data => {
        io.to(connections[data.author].id).emit('RECEIVE_STATUS', data);
      });

      socket.on('SEND_USER_JOINED', data => {
          connections[data.user.username] = socket;
          io.sockets.emit('RECEIVE_USER_JOINED', data);
      });

      socket.on('SEND_USER_LEFT', data => {
          socket.broadcast.emit('RECEIVE_USER_LEFT', data);
      });

      socket.on('SEND_TYPING_USER', data => {
        io.sockets.emit('RECEIVE_TYPING_USER', data);
      });
  
      });
  };
  