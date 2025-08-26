// server.js
const http = require("http");
const app = require("./app");
const { initializeSocket } = require("./socket");
const connectToDb = require("./db/db");

const port = process.env.PORT || 3000;
const server = http.createServer(app);

(async () => {
    // 1) connect DB first
    await connectToDb();

    // 2) initialize socket on the server
    initializeSocket(server);

    // 3) start listening
    server.listen(port, "0.0.0.0", () => {
        console.log("Server is running on port", port);
    });
})().catch(err => {
    console.error("Fatal startup error:", err);
    process.exit(1);
});
