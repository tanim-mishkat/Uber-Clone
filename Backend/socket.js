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

        socket.on("update-location-captain", async (data) => {
            const { userId, location } = data;

            if (!location || !location.lat || !location.lon) {
                return socket.emit("error", { message: "Invalid location data" });
            }

            await captainModel.findByIdAndUpdate(userId, {
                location: {
                    type: "Point",
                    coordinates: [location.lon, location.lat]
                }
            });

            console.log(`Captain ${userId} updated location: ${location.lat}, ${location.lon}`);


        });


        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);
        });
    });
}
function sendMessageToSocketId(socketId, { event, data }) {
    if (!ioInstance) {
        console.error("Socket.io instance is not initialized.");
        return;
    }

    if (!event || typeof event !== 'string') {
        console.error("Invalid or missing event name.");
        return;
    }

    ioInstance.to(socketId).emit(event, data);
}



module.exports = {
    initializeSocket,
    sendMessageToSocketId
};
