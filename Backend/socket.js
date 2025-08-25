// socket.js
const { Server } = require("socket.io");
const userModel = require("./models/user.model");
const captainModel = require("./models/captain.model");

/** parse comma-separated origins from env */
function parseOrigins(v) {
    return (v || "")
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);
}

let io = null;

/**
 * Initialize Socket.IO on the given HTTP server
 * - Reads allowed origins from SOCKET_ORIGINS (fallback: CORS_ORIGINS)
 * - Enables credentials
 * - Uses websocket + polling (works on Render free)
 * - Longer ping timeouts to tolerate cold starts
 */
function initializeSocket(server) {
    const allowlist = parseOrigins(process.env.SOCKET_ORIGINS || process.env.CORS_ORIGINS);

    io = new Server(server, {
        cors: {
            origin: allowlist.length ? allowlist : [], // [] => no cross-origin allowed
            methods: ["GET", "POST"],
            credentials: true
        },
        transports: ["websocket", "polling"],
        pingTimeout: 25000,
        pingInterval: 20000
    });

    io.on("connection", (socket) => {
        console.log("socket connected:", socket.id);

        // Expect: { userId: string, userType: "user" | "captain" }
        socket.on("join", async ({ userId, userType }) => {
            try {
                if (!userId || !userType) {
                    return socket.emit("error", { message: "userId and userType are required" });
                }

                if (userType === "user") {
                    await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
                } else if (userType === "captain") {
                    await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
                } else {
                    return socket.emit("error", { message: "Invalid userType" });
                }

                console.log(`JOIN user=${userId} type=${userType} sid=${socket.id}`);
                socket.emit("joined", { ok: true });
            } catch (err) {
                console.error("join error:", err?.message);
                socket.emit("error", { message: "Failed to join" });
            }
        });

        // Expect: { userId: string, location: { lat: number, lon: number } }
        socket.on("update-location-captain", async ({ userId, location }) => {
            try {
                const lat = location?.lat;
                const lon = location?.lon;
                if (!userId || typeof lat !== "number" || typeof lon !== "number") {
                    return socket.emit("error", { message: "Invalid location payload" });
                }

                await captainModel.findByIdAndUpdate(userId, {
                    location: { type: "Point", coordinates: [lon, lat] }
                });

                console.log(`LOC captain=${userId} lat=${lat} lon=${lon}`);
                socket.emit("location-updated", { ok: true });
            } catch (err) {
                console.error("update-location error:", err?.message);
                socket.emit("error", { message: "Failed to update location" });
            }
        });

        socket.on("disconnect", (reason) => {
            console.log("socket disconnected:", socket.id, reason);
            // (optional) clear socketId from DB here if you want
        });
    });

    return io;
}

/** Utility to emit to a specific socket id */
function sendMessageToSocketId(socketId, { event, data }) {
    if (!io) return console.error("Socket.io not initialized");
    if (!socketId || !event) return console.error("Invalid emit args");
    io.to(socketId).emit(event, data);
}

/** optional accessor */
function getIO() {
    return io;
}

module.exports = {
    initializeSocket,
    sendMessageToSocketId,
    getIO
};
