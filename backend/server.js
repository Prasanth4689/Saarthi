// 📄 server.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import hotelRoutes from "./routes/hotelRoutes.js";
import itineraryRoutes from "./routes/itineraryRoutes.js";
import placesRoutes from "./routes/placesRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import transportRoutes from "./routes/transportRoutes.js";

// Load environment variables (.env.local for local, Vercel dashboard for production)
dotenv.config({ path: "./.env.local" });

const app = express();

/* ==========================
   ✅ CORS CONFIGURATION
========================== */

// Allow localhost dev and any *.vercel.app deploy
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, cURL, server-to-server)
    if (!origin) return callback(null, true);

    const isAllowed =
      origin === "http://localhost:5173" ||
      origin === "http://localhost:3000" ||
      /^https:\/\/.*\.vercel\.app$/.test(origin);

    if (isAllowed) {
      callback(null, true);
    } else {
      console.log("❌ Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

// Apply CORS middleware
app.use(cors(corsOptions));

/* ==========================
   ✅ EXPRESS SETUP
========================== */
app.use(express.json());

// Health check — visit /api to confirm backend is alive
app.get("/api", (req, res) => {
  res.json({ status: "ok", message: "🚀 Saarthi backend is running!" });
});

// Mount routes
app.use("/api/hotels", hotelRoutes);
app.use("/api/itinerary", itineraryRoutes);
app.use("/api/places", placesRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/transport", transportRoutes);

/* ==========================
   ✅ SERVER START
   Only listen on a port when running locally.
   Vercel runs the app as a serverless function — no listen() needed.
========================== */
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
}

// Export for Vercel serverless
export default app;
