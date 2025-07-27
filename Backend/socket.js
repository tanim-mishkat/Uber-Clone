const { Server } = require("socket.io");
const userModel = require("./models/user.model");
const captainModel = require("./models/captain.model");

let ioInstance = null;

function initializeSocket(server) {
    ioInstance = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    ioInstance.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        socket.on("join", async ({ userId, userType }) => {
            try {
                if (userType === "user") {
                    await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
                } else if (userType === "captain") {
                    await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
                }

                console.log(`User ${userId} of type ${userType} joined with socket ID: ${socket.id}`);
            } catch (error) {
                console.error("Error updating socketId:", error);
            }
        });

        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);
        });
    });
}

function sendMessageToSocketId(socketId, event, message) {
    if (ioInstance) {
        ioInstance.to(socketId).emit(event, message); // fixed: use passed event name
    } else {
        console.error("Socket.io instance is not initialized.");
    }
}


module.exports = {
    initializeSocket,
    sendMessageToSocketId
};
