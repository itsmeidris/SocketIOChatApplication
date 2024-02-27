// Import the 'express' module
const express = require('express');
// Import the 'createServer' function from 'node:http'
const { createServer } = require('node:http');
// Import the 'join' function from 'node:path'
const { join } = require('node:path');
// Import the 'Server' class from 'socket.io'
const { Server } = require('socket.io');

// Create an Express application
const app = express();
// Create an HTTP server using the 'createServer' function
const server = createServer(app);
// Create a new instance of the 'Server' class for WebSocket communication
const io = new Server(server);

app.use()
const connectedUsers = {};

// Define the path to the HTML file
const path = '/public/index.html';
// Handle requests to the root URL and send the HTML file
app.get('/', (req, res, next) => {
    res.sendFile(join(__dirname + path));
});


// Listen for socket connections
io.on('connection', (socket) => {
    console.log('User connected');

    joinChatFunction(socket);
    messagesFunction(socket);
    disconnectFunction(socket);
});

// Listen for chat messages from clients
let messagesFunction = (socket) =>{
    socket.on('chat message' ,(msg) =>{
        console.log(`Message : ${msg}`);
        io.emit('chat message' ,msg);
    });
}

// Listen for disconnect events
let disconnectFunction = (socket) =>{
    socket.on('disconnect' ,() =>{
        console.log('User disconnected');

        const username = connectedUsers[socket.id];
        io.emit('chat message', `${username} has left the chat :(`);
        delete connectedUsers[socket.id];
    });
}

// Listen for 'user join' events from clients
let joinChatFunction = (socket) =>{
    socket.on('join chat' ,(username) =>{
        connectedUsers[socket.id] = username;
        io.emit('chat message' ,(`${username} has joined the chat :)`));
    });
}
// Set up the server to listen on port 5050
const PORT = 5050;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
