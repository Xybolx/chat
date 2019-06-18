module.exports = function (io) {
    const connections = {};
    const onlineUsers = [];
    
      io.sockets.on('connection', socket => {
        console.log('user connected on: ' + socket.id);
  
        socket.on('disconnect', () => {
          console.log('user disconnected from ' + socket.id);
        });
  
        socket.on('SEND_MESSAGE', data => { 
          io.emit('RECEIVE_MESSAGE', data);
        });

        socket.on('SEND_PRIVATE_MESSAGE', data => {
          if (onlineUsers.includes(data.receiver)) {
            io.to(connections[data.receiver].id).emit('RECEIVE_PRIVATE_MESSAGE', data);
          }

        });

        socket.on('SEND_MSG_STATUS', data => {
          io.to(connections[data.author].id).emit('RECEIVE_MSG_STATUS', data);
        });

        socket.on('SEND_PRVT_STATUS', data => {
          io.to(connections[data.author].id).emit('RECEIVE_PRVT_STATUS', data);
        });

      socket.on('SEND_USER_JOINED', data => {
          let user = data.user.username;
          onlineUsers.push(user); 
          connections[user] = socket;
          socket.broadcast.emit('RECEIVE_USER_JOINED', data);
        });

      socket.on('SEND_USER_LEFT', data => {
          onlineUsers.splice(onlineUsers.indexOf(data.user.username), 1);
          console.log(onlineUsers);
          socket.broadcast.emit('RECEIVE_USER_LEFT', data);
        });

      socket.on('SEND_TYPING_USER', data => {
          socket.broadcast.emit('RECEIVE_TYPING_USER', data);
        });

      socket.on('SEND_CLEAR_MSGS', data => { 
          io.emit('RECEIVE_CLEAR_MSGS', data);
        });

      socket.on('SEND_CLEAR_PRVT_MSGS', data => {
          io.to(connections[data.username].id).emit('RECEIVE_CLEAR_PRVT_MSGS', data);
      });
  
  });
};
  