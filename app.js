const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

app.get('/', (req, res) => {
  res.send('<h1>Resteau Server</h1>');
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

io.on('connect', (socket) => {
  console.log('Connected with ID', socket.id);
  
  socket.on('new-message', (message) => {
    const { client, content } = JSON.parse(message);

    // Any validation can be done here on content

    io.emit('broadcast', {
      client,
      content : content + ' - Server' // Adding this to show that server is responding
    });
  });

  // If you want to create a new type of events
  // socket.onAny((eventName, ...args) => {
  //   console.log(`Received event: ${eventName}`, args);  
  // }); 

  socket.on('disconnect', () => {
    console.log('Socket Disconnected', socket.id);
  });
});



