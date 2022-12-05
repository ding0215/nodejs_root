const express = require("express");
const cors = require('cors');
const app = express();
const port = 4321;
app.use(cors());
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
    cors: {
        origin: '*'
    }
});

//Listen for a client connection 
io.on("connection", (socket) => {
    //Socket is a Link to the Client 
    console.log("New Client is Connected!");
    //Here the client is connected and we can exchanged 
    socket.emit("welcome", "Hello and Welcome to the Server");
});

//Listen the HTTP Server 
http.listen(port, () => {
    console.log("Server Is Running Port: " + port);
});

