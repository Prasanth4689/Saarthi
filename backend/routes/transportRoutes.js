import express from "express";
import dotenv from "dotenv";

dotenv.config({ path: "./.env.local" });

const router = express.Router();

// ====== DESTINATION-AWARE FALLBACK DATA ======
function generateFallbackTransport(destination) {
  const dest = destination || "Destination";

  const flightOptions = [
    { id: 1, airline: "IndiGo", flightNumber: "6E 2345", departure: "07:15 AM", arrival: "09:45 AM", duration: "2h 30m", stops: "Non-stop", price: 4850, class: "Economy", available: 18 },
    { id: 2, airline: "Air India", flightNumber: "AI 612", departure: "01:30 PM", arrival: "04:20 PM", duration: "2h 50m", stops: "Non-stop", price: 5900, class: "Economy", available: 9 },
    { id: 3, airline: "SpiceJet", flightNumber: "SG 404", departure: "06:45 PM", arrival: "09:15 PM", duration: "2h 30m", stops: "Non-stop", price: 3799, class: "Economy", available: 24 },
  ];

  const trainOptions = [
    { id: 1, operator: "Rajdhani Express", trainNumber: "12951", departure: "06:00 AM", arrival: "02:30 PM", duration: "8h 30m", stops: "4 stops", price: 1950, class: "2AC", amenities: ["Meals", "Bedding", "Charging", "AC"] },
    { id: 2, operator: "Shatabdi Express", trainNumber: "12017", departure: "10:00 AM", arrival: "06:00 PM", duration: "8h 00m", stops: "3 stops", price: 1280, class: "CC", amenities: ["Meals", "AC", "Charging"] },
    { id: 3, operator: "Vande Bharat Express", trainNumber: "22439", departure: "08:00 AM", arrival: "01:30 PM", duration: "5h 30m", stops: "2 stops", price: 2100, class: "EC", amenities: ["Meals", "WiFi", "AC"] },
  ];

  return { flights: flightOptions, trains: trainOptions };
}

// ====== ROUTE ======
router.get("/", async (req, res) => {
  const { destination } = req.query;
  console.log(`🟢 Fetching transport for: ${destination}`);

  if (!destination) {
    return res.status(400).json({ error: "Destination is required" });
  }

  // Try Gemini if key is available
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        You are an expert Indian travel planner API.
        Create 3 realistic flight options and 3 realistic train options to travel to ${destination} from Delhi or Mumbai.
        Respond ONLY in valid JSON (no markdown, no explanations).
        Structure:
        {
          "flights": [
            { "id": 1, "airline": "string", "flightNumber": "string", "departure": "string", "arrival": "string", "duration": "string", "stops": "string", "price": number, "class": "Economy", "available": number }
          ],
          "trains": [
            { "id": 1, "operator": "string", "trainNumber": "string", "departure": "string", "arrival": "string", "duration": "string", "stops": "string", "price": number, "class": "string", "amenities": ["string"] }
          ]
        }
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        const cleaned = text.match(/\{[\s\S]*\}/);
        data = cleaned ? JSON.parse(cleaned[0]) : null;
      }

      if (data?.flights?.length > 0 && data?.trains?.length > 0) {
        console.log("✅ Gemini transport generated");
        return res.json(data);
      }
    } catch (err) {
      console.warn("⚠️ Gemini transport failed, using fallback:", err.message);
    }
  }

  console.log("🔄 Returning fallback transport for:", destination);
  res.json(generateFallbackTransport(destination));
});

export default router;
