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

        socket.on('SEND_MSG_STATUS', data => {
          io.to(connections[data.author].id).emit('RECEIVE_MSG_STATUS', data);
        });

        socket.on('SEND_PRVT_STATUS', data => {
          io.to(connections[data.author].id).emit('RECEIVE_PRVT_STATUS', data);
        });

      socket.on('SEND_USER_JOINED', data => {
          connections[data.user.username] = socket;
          socket.broadcast.emit('RECEIVE_USER_JOINED', data);
        });

      socket.on('SEND_USER_LEFT', data => {
          socket.broadcast.emit('RECEIVE_USER_LEFT', data);
        });

      socket.on('SEND_TYPING_USER', data => {
          socket.broadcast.emit('RECEIVE_TYPING_USER', data);
        });

      socket.on('SEND_CLEAR_MSGS', data => { 
          io.sockets.emit('RECEIVE_CLEAR_MSGS', data);
        });
  
  });
};
  