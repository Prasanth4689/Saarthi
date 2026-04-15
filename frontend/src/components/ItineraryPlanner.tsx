import { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import {
  Calendar,
  MapPin,
  Utensils,
  Camera,
  Coffee,
  Train,
} from "lucide-react";

interface ItineraryPlannerProps {
  destination: string;
  days: number;
}

interface Activity {
  time: string;
  title: string;
  description: string;
  icon: string;
  duration: string;
}

interface DayPlan {
  day: number;
  title: string;
  activities: Activity[];
}

export function ItineraryPlanner({ destination, days }: ItineraryPlannerProps) {
  const [itinerary, setItinerary] = useState<DayPlan[]>([]);
  const [activeDay, setActiveDay] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* --- ICON HELPERS --- */
  const getActivityIcon = (iconType: string) => {
    const props = { className: "w-5 h-5 text-white" };
    switch (iconType) {
      case "food":
        return <Utensils {...props} />;
      case "camera":
        return <Camera {...props} />;
      case "coffee":
        return <Coffee {...props} />;
      case "transport":
        return <Train {...props} />;
      default:
        return <MapPin {...props} />;
    }
  };

  const getActivityColor = (iconType: string) => {
    switch (iconType) {
      case "food":
        return "#ff6b6b";
      case "camera":
        return "#f472b6";
      case "coffee":
        return "#fb923c";
      case "transport":
        return "#5b8def";
      default:
        return "#4ecdc4";
    }
  };

  /* --- API CALL --- */
  const generateItinerary = async () => {
    if (!destination || days <= 0) {
      alert("Please enter a valid destination and number of days.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // ✅ Matches backend route /api/itinerary
      // const res = await axios.post(`${API_BASE_URL}/api/itinerary`...
        const res = await axios.post(`${API_BASE_URL}/api/itinerary`, {

        destination,
        days,
      });

      console.log("Itinerary data:", res.data);

      if (res.data?.days?.length > 0) {
        setItinerary(res.data.days);
        setActiveDay(1);
      } else {
        setError(
          "Could not generate itinerary. Try again with a different destination."
        );
      }
    } catch (err: any) {
      console.error("❌ Error fetching itinerary:", err.message);
      setError("Failed to fetch itinerary. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  /* --- UI --- */
  return (
    <div className="bg-white brutal-border brutal-shadow-lg p-6 rotate-[-0.3deg]">
      <div className="rotate-[0.3deg]">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#4ade80] p-3 brutal-border rotate-2">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-black text-xl font-semibold">
            {days}-Day Itinerary for {destination}
          </h2>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateItinerary}
          disabled={loading}
          className={`mb-6 px-4 py-2 brutal-border brutal-shadow text-white font-medium transition-all
            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#ff6b6b] hover:bg-[#ff5252]"
            }`}
        >
          {loading ? "Generating..." : "Generate Itinerary"}
        </button>

        {/* Loading */}
        {loading && (
          <p className="text-gray-500 animate-pulse">
            Creating your personalized travel plan...
          </p>
        )}

        {/* Error */}
        {error && (
          <div className="p-4 mb-4 bg-red-100 text-red-700 brutal-border">
            <p>{error}</p>
          </div>
        )}

        {/* No Data */}
        {!loading && !error && itinerary.length === 0 && (
          <p className="text-gray-600">
            Click "Generate Itinerary" to plan your trip.
          </p>
        )}

        {/* Display Itinerary */}
        {!loading && !error && itinerary.length > 0 && (
          <>
            {/* Day Tabs */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {itinerary.map((day) => (
                <button
                  key={day.day}
                  onClick={() => setActiveDay(day.day)}
                  className={`p-4 brutal-border transition-all ${
                    activeDay === day.day
                      ? "bg-black text-white translate-x-[-2px] translate-y-[-2px] shadow-[6px_6px_0px_#1a1a1a]"
                      : "bg-white hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#1a1a1a]"
                  }`}
                >
                  <div className="text-2xl mb-1 font-semibold">
                    Day {day.day}
                  </div>
                  <div className="text-sm opacity-80">{day.title}</div>
                </button>
              ))}
            </div>

            {/* Active Day Details */}
            {itinerary.map(
              (day) =>
                activeDay === day.day && (
                  <div key={day.day} className="space-y-4">
                    <div className="bg-gradient-to-r from-[#4ade80] to-[#4ecdc4] brutal-border p-4 rotate-[-0.5deg]">
                      <h3 className="text-white font-semibold">
                        Day {day.day}: {day.title}
                      </h3>
                    </div>

                    {/* Activities */}
                    {day.activities.map((activity, index) => (
                      <div
                        key={index}
                        className="brutal-border bg-white p-4 brutal-hover transition-transform"
                        style={{
                          transform: `rotate(${
                            [0.5, -0.3, 0.4, -0.5, 0.3, -0.4][index] || 0
                          }deg)`,
                        }}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className="p-3 brutal-border shrink-0 rotate-3"
                            style={{
                              backgroundColor: getActivityColor(activity.icon),
                            }}
                          >
                            {getActivityIcon(activity.icon)}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="bg-[#ffe66d] brutal-border px-3 py-1 rotate-[-2deg]">
                                <span className="text-sm font-medium">
                                  {activity.time}
                                </span>
                              </div>
                              <div className="bg-[#4ecdc4]/20 brutal-border px-2 py-1 text-xs font-medium">
                                {activity.duration}
                              </div>
                            </div>
                            <h4 className="mt-2 font-semibold">
                              {activity.title}
                            </h4>
                            <p className="text-sm text-gray-700">
                              {activity.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
            )}
          </>
        )}
      </div>
    </div>
  );
}
