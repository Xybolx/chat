module.exports = function (io) {
    connections = {};
    
      io.sockets.on('connection', socket => {
        connections[socket.id] = socket;
        console.log('Connected: %s sockets connected', connections.length);
  
        socket.on('disconnect', () => {
          console.log('user disconnected from ' + socket.id);
        });
  
        socket.on('SEND_MESSAGE', function(data) { 
          io.sockets.emit('RECEIVE_MESSAGE', data);
      });
  
      });
  }
  