// 📄 server.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import hotelRoutes from "./routes/hotelRoutes.js";
import itineraryRoutes from "./routes/itineraryRoutes.js";
import placesRoutes from "./routes/placesRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import transportRoutes from "./routes/transportRoutes.js";

// Load environment variables
dotenv.config({ path: "./.env.local" });

const app = express();

/* ==========================
   ✅ CORS CONFIGURATION
========================== */

// CORS options — allow localhost and any *.vercel.app deploy
const corsOptions = {
  origin: function (origin: any, callback: any) {
    // Allow requests with no origin (e.g. Postman, cURL)
    if (!origin) return callback(null, true);

    const isAllowed =
      origin === 'http://localhost:5173' ||
      origin === 'http://localhost:3000' ||
      /^https:\/\/.*\.vercel\.app$/.test(origin) ||
      /^https:\/\/saarthi.*\.vercel\.app$/.test(origin);

    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('❌ Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
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

// Mount routes
app.use("/api/hotels", hotelRoutes);
app.use("/api/itinerary", itineraryRoutes);
app.use("/api/places", placesRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/transport", transportRoutes);

/* ==========================
   ✅ SERVER START
========================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
