// socket.js
const { Server } = require("socket.io");
const userModel = require("./models/user.model");
const captainModel = require("./models/captain.model");

function parseOrigins(v) {
    return (v || "").split(",").map(s => s.trim()).filter(Boolean);
}

let io = null;

async function saveSocketId({ userType, userId, socketId }) {
    if (userType === "user") {
        await userModel.findByIdAndUpdate(userId, { socketId });
    } else if (userType === "captain") {
        await captainModel.findByIdAndUpdate(userId, { socketId, status: "active" });
    }
}

async function clearSocketId(socketId) {
    // remove socketId on disconnect so we don't emit to dead sockets
    await Promise.all([
        userModel.updateMany({ socketId }, { $unset: { socketId: 1 } }),
        captainModel.updateMany({ socketId }, { $unset: { socketId: 1 }, status: "inactive" })
    ]);
}

/**
 * initializeSocket(server)
 * Keeps your original events:
 *   - "join"  ({ userId, userType })
 *   - "update-location-captain" ({ userId, location:{lat,lon} })
 * Also supports legacy aliases "user-join", "captain-join", "update-location".
 */
function initializeSocket(server) {
    const allowlist = parseOrigins(process.env.SOCKET_ORIGINS || process.env.CORS_ORIGINS);

    io = new Server(server, {
        cors: {
            origin: allowlist.length ? allowlist : true,
            methods: ["GET", "POST"],
            credentials: true
        },
        transports: ["websocket", "polling"],
        pingTimeout: 25000,
        pingInterval: 20000
    });

    io.on("connection", (socket) => {
        console.log("socket connected:", socket.id);

        const handleJoin = async (payload = {}, ack) => {
            try {
                const { userId, userType } = payload;
                if (!userId || !userType) return ack?.({ ok: false, error: "userId and userType required" });
                await saveSocketId({ userType, userId, socketId: socket.id });
                socket.join(`${userType}:${userId}`); // optional room
                console.log(`JOIN user=${userId} type=${userType} sid=${socket.id}`);
                ack?.({ ok: true });
            } catch (e) {
                console.error("join error:", e?.message);
                ack?.({ ok: false, error: "join failed" });
            }
        };
        socket.on("join", handleJoin);
        socket.on("user-join", p => handleJoin({ ...p, userType: "user" }));
        socket.on("captain-join", p => handleJoin({ ...p, userType: "captain" }));

        const handleUpdateLoc = async (payload = {}, ack) => {
            try {
                const { userId, location } = payload;
                const lat = Number(location?.lat);
                const lon = Number(location?.lon);
                if (!userId || Number.isNaN(lat) || Number.isNaN(lon)) return ack?.({ ok: false, error: "invalid location" });

                await captainModel.findByIdAndUpdate(userId, {
                    location: { type: "Point", coordinates: [lon, lat] }
                });

                console.log(`LOC captain=${userId} lat=${lat} lon=${lon}`);
                ack?.({ ok: true });
            } catch (e) {
                console.error("update-location error:", e?.message);
                ack?.({ ok: false, error: "update failed" });
            }
        };
        socket.on("update-location-captain", handleUpdateLoc);
        socket.on("update-location", handleUpdateLoc); // alias

        socket.on("disconnect", async (reason) => {
            console.log("socket disconnected:", socket.id, reason);
            await clearSocketId(socket.id);
        });
    });

    return io;
}

function sendMessageToSocketId(socketId, { event, data }) {
    if (!io || !socketId || !event) return;
    io.to(socketId).emit(event, data);
}

function getIO() { return io; }

module.exports = { initializeSocket, sendMessageToSocketId, getIO };
