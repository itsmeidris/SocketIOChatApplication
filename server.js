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

//Specify the path to the public directory where your static files are located.
app.use(express.static('./views'));

// Define the path to the HTML file
const path = './views/index.html';
// Handle requests to the root URL and send the HTML file
app.get('/entry.html', (req, res) => {
    res.sendFile(join(__dirname, 'views', 'entry.html'));
});

// Serve the chat page
app.get('/chat.html', (req, res) => {
    res.sendFile(join(__dirname, 'views', 'index.html'));
});

// Redirect to entry page by default
app.get('/', (req, res) => {
    res.redirect('/entry.html');
});

// Listen for socket connections
io.on('connection', (socket) => {
    console.log('User connected');

    joinChatFunction(socket);
    messagesFunction(socket);
    disconnectFunction(socket);
});

const connectedUsers = {};

// Listen for 'user join' events from clients
let joinChatFunction = (socket) => {
    socket.on('join chat', (userName) => {
        connectedUsers[socket.id] = userName;
        io.emit('join message', `${userName} has joined the chat :)`);

    });
};

// Listen for chat messages from clients
let messagesFunction = (socket) =>{
    socket.on('chat message' ,(msg ,userName) =>{
        console.log(`Message : ${msg}`);

        connectedUsers[socket.id] = userName;
        io.emit('chat message' ,{ message : `${msg}` ,sender : userName});
        
    });
}

// Listen for disconnect events
let disconnectFunction = (socket) =>{
    socket.on('disconnect' ,() =>{
        console.log('User disconnected');

        const username = connectedUsers[socket.id];
        io.emit('join message', `${username} has left the chat :(`);
        delete connectedUsers[socket.id];
    });
}

// Set up the server to listen on port 5050
const PORT = 5050;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
