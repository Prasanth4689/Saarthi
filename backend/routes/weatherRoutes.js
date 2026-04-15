import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config({ path: "./.env.local" });

const router = express.Router();

function mapWeatherCode(code) {
  if (code === 0) return "sunny";
  if ([1, 2, 3, 45, 48].includes(code)) return "partly-cloudy";
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(code)) return "rainy";
  return "partly-cloudy";
}

// Static fallback coords for common Indian places
const FALLBACK_COORDS = {
  goa: { lat: 15.2993, lon: 74.124 },
  delhi: { lat: 28.6139, lon: 77.209 },
  mumbai: { lat: 19.076, lon: 72.8777 },
  jaipur: { lat: 26.9124, lon: 75.7873 },
  kerala: { lat: 10.8505, lon: 76.2711 },
  manali: { lat: 32.2432, lon: 77.1892 },
  shimla: { lat: 31.1048, lon: 77.1734 },
  Shimla: { lat: 31.1048, lon: 77.1734 },
  ooty: { lat: 11.4102, lon: 76.695 },
  udaipur: { lat: 24.5854, lon: 73.7125 },
  varanasi: { lat: 25.3176, lon: 82.9739 },
  rishikesh: { lat: 30.0869, lon: 78.2676 },
  darjeeling: { lat: 27.0411, lon: 88.2663 },
  kashmir: { lat: 34.0837, lon: 74.7973 },
  agra: { lat: 27.1767, lon: 78.0081 },
  leh: { lat: 34.1526, lon: 77.5771 },
  coorg: { lat: 12.3375, lon: 75.8069 },
  munnar: { lat: 10.0889, lon: 77.0595 },
  bangalore: { lat: 12.9716, lon: 77.5946 },
  chennai: { lat: 13.0827, lon: 80.2707 },
  kolkata: { lat: 22.5726, lon: 88.3639 },
  hyderabad: { lat: 17.385, lon: 78.4867 },
  rajasthan: { lat: 27.0238, lon: 74.2179 },
};

function getCoordsFallback(destination) {
  const key = destination.toLowerCase().trim();
  for (const [place, coords] of Object.entries(FALLBACK_COORDS)) {
    if (key.includes(place) || place.includes(key)) return coords;
  }
  // Default to central India
  return { lat: 22.9734, lon: 78.6569 };
}

router.get("/", async (req, res) => {
  const { destination } = req.query;
  if (!destination) return res.status(400).json({ error: "Destination is required" });

  console.log(`🟢 Fetching weather for: ${destination}`);

  // Step 1: Get coordinates
  let coords = getCoordsFallback(destination);

  const apiKey = process.env.OPENTRIPMAP_KEY;
  if (apiKey) {
    try {
      const geoRes = await axios.get("https://api.opentripmap.com/0.1/en/places/geoname", {
        params: { name: destination, lang: "en", country: "IN", apikey: apiKey },
        timeout: 5000,
      });
      if (geoRes.data?.lat && geoRes.data?.lon) {
        coords = { lat: geoRes.data.lat, lon: geoRes.data.lon };
        console.log(`📍 Geocoded ${destination} => lat:${coords.lat}, lon:${coords.lon}`);
      }
    } catch (e) {
      console.warn("⚠️ Geocoding failed, using local lookup:", e.message);
    }
  } else {
    console.warn("⚠️ No OPENTRIPMAP_KEY, using local fallback coords");
  }

  // Step 2: Fetch Open-Meteo (no API key needed)
  try {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`;
    const weatherRes = await axios.get(weatherUrl, { timeout: 8000 });
    const data = weatherRes.data;

    const daysArr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const forecast = [];
    for (let i = 0; i < 5; i++) {
      const dateObj = new Date(data.daily.time[i]);
      forecast.push({
        day: daysArr[dateObj.getDay()],
        high: Math.round(data.daily.temperature_2m_max[i]),
        low: Math.round(data.daily.temperature_2m_min[i]),
        condition: mapWeatherCode(data.daily.weather_code[i]),
      });
    }

    const currentCondition = mapWeatherCode(data.current.weather_code);

    console.log(`✅ Weather fetched for ${destination}`);
    return res.json({
      current: {
        temp: Math.round(data.current.temperature_2m),
        condition: currentCondition.replace("-", " "),
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
        icon: currentCondition,
      },
      forecast,
    });
  } catch (err) {
    console.warn("⚠️ Open-Meteo failed, using static fallback:", err.message);
  }

  // Static fallback weather
  res.json({
    current: { temp: 28, condition: "partly cloudy", humidity: 62, windSpeed: 14, icon: "partly-cloudy" },
    forecast: [
      { day: "Mon", high: 30, low: 22, condition: "sunny" },
      { day: "Tue", high: 29, low: 21, condition: "partly-cloudy" },
      { day: "Wed", high: 27, low: 20, condition: "rainy" },
      { day: "Thu", high: 28, low: 21, condition: "partly-cloudy" },
      { day: "Fri", high: 31, low: 23, condition: "sunny" },
    ],
  });
});

export default router;
