exports.init = function (io, app){
  console.log('Socket.io is connected');
  io.sockets.on('connection', function (socket) {
    console.log("This bit is working");
    socket.broadcast.emit('broadcast', 'hello!');
    try {
      socket.on('saveStory', function (data){
        io.emit('updatechat', 'This should submit when done');

        console.log("Ran from io file");
      });

      socket.on('custom-message', function (message, parameter) {
        socket.broadcast.emit('custom-message', message, parameter);
      });

      socket.on('acuityClick', function (id) {
        socket.broadcast.emit('acuityClick', id);
      });
      socket.on('connection', function(socket){
        console.log("CONNECTED!!!");

      });
      socket.on('disconnect', function(){
        console.log('User disconnected');
      });
    } catch (err){
      err.print();
    }
  })
};