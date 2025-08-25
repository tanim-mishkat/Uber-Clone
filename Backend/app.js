// app.js
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectToDb = require("./db/db");
const userRoutes = require("./routes/user.routes");
const captainRoutes = require("./routes/captain.routes");
const mapsRoutes = require("./routes/maps.routes");
const rideRoutes = require("./routes/ride.routes");

const app = express();

/* ---------- Proxy & CORS FIRST ---------- */
// Behind Render’s proxy => enable Secure/SameSite=None cookies and correct IPs
app.set("trust proxy", 1);

// Comma-separated allowlist via env
const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

const corsConfig = {
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);                 // server-to-server/curl
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("CORS blocked: " + origin));
  }
};

app.use(cors(corsConfig));
// Optional explicit preflight (safe regex form)
app.options(/.*/, cors(corsConfig));

/* ---------- Parsers ---------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ---------- Health (BEFORE routes ok too) ---------- */
app.get("/api/checkhealth", (_req, res) => res.status(200).send("ok"));

/* ---------- App Routes ---------- */
app.get("/", (_req, res) => res.send("Hello World"));

app.use("/users", userRoutes);
app.use("/captains", captainRoutes);
app.use("/maps", mapsRoutes);
app.use("/rides", rideRoutes);

/* ---------- DB connect (export app for server.js) ---------- */
connectToDb();

module.exports = app;
