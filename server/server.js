const app = require("./app");
const socketIo = require("socket.io");
const connectToMongo = require("./config/db");

// Configuring environment variables 

if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "server/config/config.env" });
}

// Connecting to mongo database

connectToMongo();

const server = app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
})

// Initialization of web sockets

const io = socketIo(server, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }       
})

const onConnection = (socket) => {
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    })

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User joined room: " + room);
    })

    socket.on("typing", (room) => socket.in(room).emit("typing"));

    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageRecieved) => {
        let chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");
    
        chat.users.forEach((user) => {
            if (user == newMessageRecieved.sender._id) return;
    
            socket.in(user).emit("message recieved", newMessageRecieved);
        })
    })

    socket.off("setup", () => {
        console.log("User disconnected");
        socket.leave(userData._id);
    })
}

io.on("connection", onConnection);