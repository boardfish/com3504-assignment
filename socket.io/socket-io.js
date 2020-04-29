exports.init = function (io, app){
  io.sockets.on('connection', function (socket) {
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