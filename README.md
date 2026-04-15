# 🧭 Saarthi – AI Smart Trip Planner

> Your trusted AI companion for planning dream trips across Incredible India 🇮🇳

[![Frontend](https://img.shields.io/badge/Frontend-Vite%20+%20React-blue)](https://vitejs.dev)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20+%20Express-green)](https://expressjs.com)

---

## ✨ Features

- 🗓️ **AI Itinerary Generator** — Powered by Google Gemini 2.5 Flash
- 🌤️ **Real-time Weather** — Via Open-Meteo satellite API (no key needed!)
- ✈️ **Transport Options** — AI-generated flights & trains per destination
- 🏨 **Hotel Recommendations** — 3 curated hotel cards per trip with real photos
- 📍 **Places to Visit** — Destination-specific attractions with contextual images
- 📸 **Photo Gallery** — Interactive masonry gallery with lightbox viewer
- 💰 **Budget Estimator** — Smart cost calculator (hotels, food, transport, activities)
- 📥 **Download Itinerary** — Browser-native print-to-PDF
- 🔗 **Share Trip** — Web Share API with clipboard fallback

---

## 🗂️ Project Structure

```
Saarthi/
├── frontend/      # Vite + React + TypeScript + Tailwind
└── backend/       # Express.js Node.js API
```

---

## 🚀 Running Locally

### Backend
```bash
cd backend
cp .env.example .env.local     # Fill in your API keys
npm install
npm start                       # http://localhost:5000
```

### Frontend
```bash
cd frontend
cp .env.example .env.local     # Set VITE_API_BASE_URL=http://localhost:5000
npm install
npm run dev                     # http://localhost:5173
```

---

## 🔑 Environment Variables

### Backend (`backend/.env.local`)
| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google AI Studio API key |
| `RAPIDAPI_KEY` | RapidAPI key for hotel data |
| `OPENTRIPMAP_KEY` | OpenTripMap API key for geocoding |
| `PORT` | Backend port (default: 5000) |

### Frontend (`frontend/.env.local`)
| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API base URL (e.g. `http://localhost:5000`) |

---

## ☁️ Deploying to Vercel

### Deploy Backend
1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import `Saarthi/backend`
3. Add all environment variables from `backend/.env.example` in Vercel dashboard
4. Deploy — note your backend URL (e.g. `https://saarthi-backend.vercel.app`)

### Deploy Frontend
1. Go to [vercel.com](https://vercel.com) → **New Project** → Import `Saarthi/frontend`
2. Add environment variable: `VITE_API_BASE_URL` = `https://saarthi-backend.vercel.app`
3. Deploy!

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | Vite + React 18 + TypeScript |
| Styling | Tailwind CSS + Radix UI |
| Backend | Node.js + Express.js |
| AI | Google Gemini 2.5 Flash |
| Weather | Open-Meteo API |
| Geocoding | OpenTripMap API |
| Hotels | Booking.com via RapidAPI |
| Deployment | Vercel |

---

## 📄 License

MIT © 2025 Saarthi
