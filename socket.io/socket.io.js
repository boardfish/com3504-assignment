exports.init = function (io, app){
  console.log('Socket.io is connected');
  io.sockets.on('connection', function (socket) {
    console.log("This bit is working");
    try {

      socket.on('custom-message', function (message, parameter) {
        socket.broadcast.emit('custom-message', message, parameter);
      });

      socket.on('acuityClick', function (id) {
        socket.broadcast.emit('acuityClick', id);
      });
    } catch (err){
      err.print();
    }
  })
};