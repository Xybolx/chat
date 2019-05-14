module.exports = function (io) {
    const connections = {};
    
      io.sockets.on('connection', socket => {
        console.log('user connected on: ' + socket.id);
  
        socket.on('disconnect', () => {
          console.log('user disconnected from ' + socket.id);
        });
  
        socket.on('SEND_MESSAGE', function(data) { 
          io.sockets.emit('RECEIVE_MESSAGE', data);
      });

        socket.on('SEND_PRIVATE_MESSAGE', function(data) {
            console.log(connections[data.receiver].id);
          io.to(connections[data.receiver].id).emit('RECEIVE_PRIVATE_MESSAGE', data);
      });

        socket.on('SEND_USER', data => {
            console.log(data);
            connections[data.username] = socket;
            console.log(connections);
            io.sockets.emit('RECEIVE_USER', data);
        });
  
      });
  }
  