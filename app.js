const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const validateMessage = require('./validateMessageMiddleware'); // Importez le middleware de validation

app.get('/', (req, res) => {
    res.send('<h1>Resteau Server</h1>');
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});

io.on('connect', (socket) => {
    console.log('Connected with ID', socket.id);
  
    socket.on('new-message', (message) => {
        console.log('New message:', message);
        // Utilisez le middleware de validation ici
        validateMessage(message, () => {
            const { client, content, type } = JSON.parse(message);
            console.log('Client:', client);
            console.log('Content:', content);
            console.log('Type:', type);

            io.emit('broadcast', {
                client,
                content: content + ' - Server'
            });
        });
    });

    socket.on('disconnect', () => {
        console.log('Socket Disconnected', socket.id);
    });
});
