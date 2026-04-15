import { useState, useRef } from "react";
import { TripSearchForm, TripSearchData } from "./components/TripSearchForm";
import { WeatherWidget } from "./components/WeatherWidget";
import { HotelRecommendations } from "./components/HotelRecommendations";
import { PlacesToVisit } from "./components/PlacesToVisit";
import { ItineraryPlanner } from "./components/ItineraryPlanner";
import { TransportOptions } from "./components/TransportOptions";
import { BudgetEstimator } from "./components/BudgetEstimator";
import { DestinationGallery } from "./components/DestinationGallery";
import { Button } from "./components/ui/button";
import {
  Sparkles,
  ArrowLeft,
  MapPin,
  Calendar,
  Hotel,
  Plane,
  Mountain,
  Palmtree,
} from "lucide-react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";

export default function App() {
  const [tripData, setTripData] = useState<TripSearchData | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const itineraryRef = useRef<HTMLElement>(null);

  const handleDownloadItinerary = async () => {
    // html2canvas struggles with Tailwind's Oklab color profiles.
    // Triggering the browser's native print prompt (which saves to PDF safely) is the cleanest approach!
    window.print();
  };

  const handleShareTrip = async () => {
    const textToShare = `Check out my ${getDayCount()}-day trip to ${tripData?.destination} planned with Saarthi! Plan yours at https://saarthi.example.com`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Saarthi Trip Plan",
          text: textToShare,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(textToShare);
        alert("Trip summary copied to clipboard!");
      } catch (err) {
        alert("Failed to copy to clipboard.");
      }
    }
  };

  const handleSearch = (data: TripSearchData) => {
    setTripData(data);
    setShowResults(true);
    setTimeout(() => {
      window.scrollTo({ top: 700, behavior: "smooth" });
    }, 100);
  };

  const handleReset = () => {
    setShowResults(false);
    setTripData(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getDayCount = () => {
    if (!tripData?.startDate || !tripData?.endDate) return 3;
    const start = new Date(tripData.startDate);
    const end = new Date(tripData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 3;
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* Header */}
      <header className="bg-white brutal-border-thick border-t-0 border-l-0 border-r-0 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-[#ff6b6b] to-[#f472b6] brutal-border px-4 py-2 rotate-[-2deg]">
                <h1 className="text-white text-3xl">Saarthi</h1>
              </div>
              <div className="hidden md:block"></div>
            </div>
            {showResults && (
              <Button
                onClick={handleReset}
                className="
    bg-[#fffef0] 
    brutal-border 
    brutal-shadow 
    text-black 
    font-semibold
    px-6 
    py-3
    rounded-none
    rotate-[-1deg]
    hover:rotate-0 
    hover:translate-x-[-2px] 
    hover:translate-y-[-2px] 
    hover:shadow-[6px_6px_0px_#1a1a1a] 
    active:translate-x-[2px] 
    active:translate-y-[2px] 
    active:shadow-[2px_2px_0px_#1a1a1a] 
    transition-all 
  "
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                New Trip
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {!showResults && (
        <section className="relative overflow-hidden py-20 pattern-dots">
          <div className="container mx-auto px-4">
            {/* Hero Content */}
            <div className="max-w-5xl mx-auto text-center mb-16">
              <div className="inline-block bg-[#ffe66d] brutal-border px-6 py-2 rotate-[-1deg] mb-6">
                <span className="text-sm">
                  🎉 Discover Incredible India with AI
                </span>
              </div>

              <h1 className="mb-6 text-6xl md:text-7xl lg:text-8xl">
                <span className="inline-block bg-white brutal-border-thick px-6 py-3 rotate-[1deg] mr-3 mb-4">
                  Plan Your
                </span>
                <span className="inline-block bg-[#ff6b6b] text-white brutal-border-thick px-6 py-3 rotate-[-1.5deg]">
                  Perfect Trip
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-8">
                From the <strong>Himalayas to the beaches of Goa</strong>, from{" "}
                <strong>temples to palaces</strong>- let AI plan your ultimate
                Indian adventure! 🚀
              </p>

              {/* Floating Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
                {[
                  { icon: "🏔️", text: "Mountains", color: "#5b8def" },
                  { icon: "🏖️", text: "Beaches", color: "#4ecdc4" },
                  { icon: "🕌", text: "Heritage", color: "#a78bfa" },
                  { icon: "🍛", text: "Cuisine", color: "#ff6b6b" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="brutal-border bg-white p-4 brutal-hover cursor-pointer"
                    style={{
                      transform: `rotate(${[2, -1.5, 1, -2][index]}deg)`,
                      backgroundColor: item.color + "20",
                    }}
                  >
                    <div className="text-4xl mb-2">{item.icon}</div>
                    <p className="text-sm">{item.text}</p>
                  </div>
                ))}
              </div>

              {/* Destination Showcase */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {[
                  {
                    name: "Taj Mahal",
                    location: "Agra",
                    img: "https://images.unsplash.com/photo-1663918455395-49146be36cbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYSUyMHRhaiUyMG1haGFsJTIwbGFuZG1hcmt8ZW58MXx8fHwxNzYyMTQxNzM0fDA&ixlib=rb-4.1.0&q=80&w=1080",
                  },
                  {
                    name: "Kerala Backwaters",
                    location: "Kerala",
                    img: "https://images.unsplash.com/photo-1680599022555-57fb95b64b5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrZXJhbGElMjBiYWNrd2F0ZXJzJTIwaW5kaWF8ZW58MXx8fHwxNzYyMDgzMDY0fDA&ixlib=rb-4.1.0&q=80&w=1080",
                  },
                  {
                    name: "Rajasthan Desert",
                    location: "Rajasthan",
                    img: "https://images.unsplash.com/photo-1670687174580-c003b4716959?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWphc3RoYW4lMjBkZXNlcnQlMjBjYW1lbHxlbnwxfHx8fDE3NjIxNDE3MzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
                  },
                ].map((dest, index) => (
                  <div
                    key={index}
                    className="brutal-border bg-white overflow-hidden brutal-hover cursor-pointer"
                    style={{
                      transform: `rotate(${[-1, 0.5, -0.8][index]}deg)`,
                    }}
                  >
                    <div className="h-48 overflow-hidden border-b-4 border-black">
                      <ImageWithFallback
                        src={dest.img}
                        alt={dest.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg mb-1">{dest.name}</h3>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {dest.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Search Form */}
            <div className="max-w-4xl mx-auto">
              <TripSearchForm onSearch={handleSearch} />
            </div>

            {/* Features Grid */}
            <div className="max-w-6xl mx-auto mt-20">
              <div className="text-center mb-12">
                <h2 className="mb-4">What Makes Saarthi Special?</h2>
                <p className="text-gray-600">
                  AI-powered features to make your trip unforgettable
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: <Calendar className="w-8 h-8 text-white" />,
                    title: "Smart Itineraries",
                    description:
                      "Day-by-day plans optimized for your preferences",
                    color: "#4ade80",
                    emoji: "📅",
                  },
                  {
                    icon: <Hotel className="w-8 h-8 text-white" />,
                    title: "Hotel Picks",
                    description: "Curated stays matching your budget perfectly",
                    color: "#a78bfa",
                    emoji: "🏨",
                  },
                  {
                    icon: <Plane className="w-8 h-8 text-white" />,
                    title: "Best Routes",
                    description: "Compare flights & trains for best deals",
                    color: "#5b8def",
                    emoji: "✈️",
                  },
                  {
                    icon: <MapPin className="w-8 h-8 text-white" />,
                    title: "Top Attractions",
                    description: "Must-visit places and hidden gems",
                    color: "#f472b6",
                    emoji: "📍",
                  },
                  {
                    icon: <Mountain className="w-8 h-8 text-white" />,
                    title: "Weather Forecast",
                    description: "Plan with accurate weather predictions",
                    color: "#4ecdc4",
                    emoji: "🌤️",
                  },
                  {
                    icon: <Palmtree className="w-8 h-8 text-white" />,
                    title: "Local Experiences",
                    description: "Authentic cultural & culinary adventures",
                    color: "#ff6b6b",
                    emoji: "🎭",
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="brutal-border bg-white p-6 brutal-hover cursor-pointer"
                    style={{
                      transform: `rotate(${
                        [-0.5, 1, -1, 0.8, -0.7, 0.5][index]
                      }deg)`,
                      backgroundColor: feature.color + "10",
                    }}
                  >
                    <div
                      className="brutal-border p-3 inline-block mb-4 rotate-3"
                      style={{ backgroundColor: feature.color }}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="mb-2 flex items-center gap-2">
                      {feature.title}
                      <span>{feature.emoji}</span>
                    </h3>
                    <p className="text-sm text-gray-700">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Results Section */}
      {showResults && tripData?.destination && (
        <section ref={itineraryRef} className="container mx-auto px-4 py-12 space-y-8 bg-[#f7f7f7]">
          {/* Success Message */}
          <div className="bg-gradient-to-r from-[#4ade80] to-[#4ecdc4] brutal-border brutal-shadow-lg p-8 text-center rotate-[-0.5deg]">
            <div className="rotate-[0.5deg]">
              <h2 className="text-white mb-2">🎉 Trip Plan Generated!</h2>
              <p className="text-white/90 text-xl">
                Your personalized {getDayCount()}-day adventure to{" "}
                <strong>{tripData.destination}</strong> is ready!
              </p>
            </div>
          </div>

          {/* Photo Gallery */}
          <DestinationGallery destination={tripData.destination} />

          {/* Weather Widget */}
          <WeatherWidget destination={tripData.destination} />

          {/* Budget Estimator */}
          <BudgetEstimator
            destination={tripData.destination}
            days={getDayCount()}
            travelers={tripData.travelers}
            budget={tripData.budget}
          />

          {/* Transportation Options */}
          <TransportOptions destination={tripData.destination} />

          {/* Hotel Recommendations */}
          <HotelRecommendations
            destination={tripData.destination}
            budget={tripData.budget}
          />

          {/* Places to Visit */}
          <PlacesToVisit destination={tripData.destination} />

          {/* Itinerary Planner */}
          <ItineraryPlanner
            destination={tripData.destination}
            days={getDayCount()}
          />

          {/* Footer CTA */}
          <div className="bg-gradient-to-r from-[#ff6b6b] to-[#f472b6] brutal-border brutal-shadow-lg p-8 text-center rotate-[0.5deg]">
            <div className="rotate-[-0.5deg]">
              <h2 className="text-white mb-3">Ready for Your Adventure? 🚀</h2>
              <p className="text-white/90 mb-6 text-lg">
                Save your itinerary and start booking your journey across
                Incredible India!
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button 
                  onClick={handleDownloadItinerary} 
                  className="bg-white text-black brutal-border brutal-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#1a1a1a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_#1a1a1a] transition-all text-lg px-6 py-6"
                >
                  📥 Download / Print Itinerary
                </Button>
                <Button 
                  onClick={handleShareTrip}
                  className="bg-black text-white brutal-border brutal-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#ffffff] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_#ffffff] transition-all text-lg px-6 py-6"
                >
                  🔗 Share Trip
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-black text-white brutal-border-thick border-b-0 border-l-0 border-r-0 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="bg-[#ff6b6b] brutal-border px-4 py-2 inline-block rotate-[-2deg] mb-4">
                <h3 className="text-white">Saarthi</h3>
              </div>
              <p className="text-white/80">
                Your trusted AI companion for exploring the beauty and diversity
                of India.
              </p>
            </div>
            <div>
              <h4 className="mb-3 text-white">Popular Destinations</h4>
              <ul className="space-y-2 text-white/80">
                <li>• Goa Beaches</li>
                <li>• Rajasthan Heritage</li>
                <li>• Kerala Backwaters</li>
                <li>• Himalayan Adventures</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-white">Features</h4>
              <ul className="space-y-2 text-white/80">
                <li>• AI Itinerary Planning</li>
                <li>• Hotel Recommendations</li>
                <li>• Transport Booking</li>
                <li>• Weather Forecasts</li>
              </ul>
            </div>
          </div>
          <div className="border-t-4 border-white pt-6 text-center text-white/80">
            <p>
              © 2025 Saarthi - AI Smart Trip Planner. Made with ❤️ for India 🇮🇳
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
