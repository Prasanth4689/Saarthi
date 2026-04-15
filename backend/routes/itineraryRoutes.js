import express from "express";
import dotenv from "dotenv";

dotenv.config({ path: "./.env.local" });

const router = express.Router();

// ====== FALLBACK GENERATOR ======
function generateFallbackItinerary(destination, days) {
  const themes = [
    "Arrival & First Impressions",
    "Historical & Cultural Gems",
    "Nature & Outdoor Adventures",
    "Food & Local Experiences",
    "Hidden Gems & Shopping",
    "Leisure & Relaxation",
    "Final Day & Departure",
  ];

  const activities = [
    [
      { time: "09:00 AM", title: `Arrive in ${destination}`, description: "Check in to your hotel and freshen up after journey.", icon: "transport", duration: "2 hrs" },
      { time: "12:00 PM", title: "Welcome Lunch", description: `Try local delicacies in a famous ${destination} restaurant.`, icon: "food", duration: "1.5 hrs" },
      { time: "03:00 PM", title: "City Orientation Walk", description: "Stroll around the main market and landmarks.", icon: "camera", duration: "2 hrs" },
      { time: "07:00 PM", title: "Sunset Dinner", description: "Enjoy a relaxing dinner at a rooftop or riverside venue.", icon: "food", duration: "2 hrs" },
    ],
    [
      { time: "08:00 AM", title: "Morning Heritage Walk", description: `Explore the iconic forts, palaces and temples of ${destination}.`, icon: "camera", duration: "3 hrs" },
      { time: "12:00 PM", title: "Traditional Thali Lunch", description: "Savour authentic regional cuisine.", icon: "food", duration: "1.5 hrs" },
      { time: "02:30 PM", title: "Museum Visit", description: "Discover the rich history and local artifacts.", icon: "camera", duration: "2 hrs" },
      { time: "06:00 PM", title: "Evening Coffee & Markets", description: "Browse local handicrafts and sip chai / coffee.", icon: "coffee", duration: "2 hrs" },
    ],
    [
      { time: "07:00 AM", title: "Sunrise Viewpoint", description: `Catch the stunning sunrise over ${destination}'s scenic surroundings.`, icon: "camera", duration: "1.5 hrs" },
      { time: "10:00 AM", title: "Nature Trek", description: "Hike through local trails and scenic landscapes.", icon: "camera", duration: "3 hrs" },
      { time: "01:00 PM", title: "Packed Lunch Picnic", description: "Enjoy your meal surrounded by nature.", icon: "food", duration: "1 hr" },
      { time: "04:00 PM", title: "Local Village Tour", description: "Visit nearby villages and experience the local lifestyle.", icon: "camera", duration: "2 hrs" },
    ],
    [
      { time: "09:00 AM", title: "Cooking Class", description: `Learn to make authentic ${destination} dishes from a local chef.`, icon: "food", duration: "2.5 hrs" },
      { time: "12:00 PM", title: "Street Food Trail", description: "Sample the best street food the city has to offer.", icon: "food", duration: "2 hrs" },
      { time: "03:00 PM", title: "Spice Market Tour", description: "Explore local spice markets and bring home flavourful souvenirs.", icon: "coffee", duration: "1.5 hrs" },
      { time: "07:00 PM", title: "Cultural Performance", description: "Watch a traditional dance or music show.", icon: "camera", duration: "2 hrs" },
    ],
    [
      { time: "09:00 AM", title: "Hidden Temple Trail", description: `Discover lesser-known spiritual sites around ${destination}.`, icon: "camera", duration: "2 hrs" },
      { time: "11:30 AM", title: "Artisan Workshop Visit", description: "Watch local craftsmen create traditional artworks.", icon: "camera", duration: "1.5 hrs" },
      { time: "01:30 PM", title: "Lunch Break", description: "Try a restaurant recommended by locals.", icon: "food", duration: "1 hr" },
      { time: "03:30 PM", title: "Shopping & Souvenirs", description: "Pick up the best local handicrafts and gifts.", icon: "coffee", duration: "2.5 hrs" },
    ],
    [
      { time: "09:30 AM", title: "Spa & Wellness Morning", description: "Rejuvenate with a traditional Ayurvedic or yoga session.", icon: "coffee", duration: "2 hrs" },
      { time: "12:00 PM", title: "Waterfront Leisure", description: `Relax by ${destination}'s river, lake, or beach.`, icon: "camera", duration: "2 hrs" },
      { time: "03:00 PM", title: "Afternoon High Tea", description: "Enjoy tea and snacks at a scenic café.", icon: "coffee", duration: "1.5 hrs" },
      { time: "06:00 PM", title: "Night Market & Dinner", description: "Wrap up the day exploring a vibrant night market.", icon: "food", duration: "2.5 hrs" },
    ],
    [
      { time: "08:00 AM", title: "Last Sunrise & Breakfast", description: `One last peaceful breakfast view in ${destination}.`, icon: "coffee", duration: "1.5 hrs" },
      { time: "10:30 AM", title: "Final Souvenir Shopping", description: "Last chance to pick up any remaining gifts.", icon: "camera", duration: "1.5 hrs" },
      { time: "01:00 PM", title: "Farewell Lunch", description: "Celebrate your trip with a memorable final meal.", icon: "food", duration: "2 hrs" },
      { time: "04:00 PM", title: "Depart", description: `Head to the station or airport with beautiful memories of ${destination}.`, icon: "transport", duration: "Variable" },
    ],
  ];

  return Array.from({ length: days }, (_, i) => ({
    day: i + 1,
    title: themes[i % themes.length],
    activities: activities[i % activities.length],
  }));
}

// ====== ROUTE ======
router.post("/", async (req, res) => {
  const { destination, days } = req.body;
  console.log("🟢 Incoming itinerary request:", { destination, days });

  if (!destination || !days) {
    return res.status(400).json({ error: "Destination and days are required" });
  }

  // Try Gemini if key is available and not known-dead
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (apiKey) {
    try {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        You are an expert Indian travel planner.
        Create a ${days}-day travel itinerary for ${destination}.
        Respond ONLY in valid JSON (no markdown, no explanations).
        Structure:
        {
          "days": [
            {
              "day": 1,
              "title": "string",
              "activities": [
                {
                  "time": "string",
                  "title": "string",
                  "description": "string",
                  "icon": "food | camera | coffee | transport",
                  "duration": "string"
                }
              ]
            }
          ]
        }
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();

      let itineraryData;
      try {
        itineraryData = JSON.parse(text);
      } catch {
        const cleaned = text.match(/\{[\s\S]*\}/);
        itineraryData = cleaned ? JSON.parse(cleaned[0]) : null;
      }

      if (itineraryData?.days?.length > 0) {
        console.log("✅ Gemini itinerary generated");
        return res.json(itineraryData);
      }
    } catch (err) {
      console.warn("⚠️ Gemini failed, using fallback:", err.message);
    }
  }

  // Fallback
  console.log("🔄 Returning fallback itinerary for:", destination);
  res.json({ days: generateFallbackItinerary(destination, days) });
});

export default router;
