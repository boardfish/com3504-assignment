var socket = io();
console.log("Script has opened");

function sendText() {
  try {
    console.log("Runs from other page");
    socket.emit('saveStory', 'test');
  } catch (e) {
    console.log("This didn't work");
  }
  return false;

}