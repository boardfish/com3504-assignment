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

      socket.on('disconnect', function(){
        console.log('User disconnected');
      });
    } catch (err){
      err.print();
    }
  })
};
exports.joinRoom = function (io, app) {
  console.log("JOINING ROOM");
  io.on('connection', function (socket) {
    socket.on('joining', function (userId, roomId) {
      socket.join(roomId);
      console.log("ROOM ID IS " + roomId);
      socket.to(roomId).emit('updatechat', socket.username + 'has joined this room', '');

    });
    socket.on('sendchat', function (data) {
      io.sockets.in(socket.room).emit('updatechat', socket.username, data);
    });
  });
};