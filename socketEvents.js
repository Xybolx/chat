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
      let receiver = connections[data.receiver].id;
      if (onlineUsers.includes(data.receiver)) {
        io.to(receiver).emit('RECEIVE_PRIVATE_MESSAGE', data);
      }
    });

    socket.on('SEND_MSG_STATUS', data => {
      let author = connections[data.author].id;
      io.to(author).emit('RECEIVE_MSG_STATUS', data);
    });

    socket.on('SEND_PRVT_STATUS', data => {
      let author = connections[data.author].id;
      io.to(author).emit('RECEIVE_PRVT_STATUS', data);
    });

    socket.on('SEND_USER_JOINED', data => {
      let user = data.user.username;
      onlineUsers.push(user);
      connections[user] = socket;
      socket.broadcast.emit('RECEIVE_USER_JOINED', data);
    });

    socket.on('SEND_USER_LEFT', data => {
      let user = data.user.username
      onlineUsers.splice(onlineUsers.indexOf(user), 1);
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
      let user = connections[data.username].id;
      io.to(user).emit('RECEIVE_CLEAR_PRVT_MSGS', data);
    });

  });
};
