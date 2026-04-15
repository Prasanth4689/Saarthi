import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Plane, Train, Clock, IndianRupee, Zap, Loader2, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

interface TransportOptionsProps {
  destination: string;
}

interface Flight {
  id: number;
  airline: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  duration: string;
  stops: string;
  price: number;
  class: string;
  available: number;
}

interface TrainOption {
  id: number;
  operator: string;
  trainNumber: string;
  departure: string;
  arrival: string;
  duration: string;
  stops: string;
  price: number;
  class: string;
  amenities: string[];
}

export function TransportOptions({ destination }: TransportOptionsProps) {
  const [activeTab, setActiveTab] = useState('flights');
  const [flights, setFlights] = useState<Flight[]>([]);
  const [trains, setTrains] = useState<TrainOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransport = async () => {
      try {
        setLoading(true);
        setError(null);
        // Replace with your actual backend URL if different
        const response = await axios.get(`${API_BASE_URL}/api/transport`, {
          params: { destination }
        });
        setFlights(response.data.flights || []);
        setTrains(response.data.trains || []);
      } catch (err) {
        console.error("Failed to fetch transport:", err);
        setError("Could not load transport options based on your route.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransport();
  }, [destination]);

  if (loading) {
    return (
      <div className="bg-white brutal-border p-12 flex flex-col items-center justify-center rotate-[0.3deg]">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#a78bfa]" />
        <p>Searching transportation to {destination}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#ff6b6b] brutal-border p-6 flex flex-col items-center justify-center rotate-[0.3deg]">
        <AlertTriangle className="w-8 h-8 text-white mb-2" />
        <p className="text-white font-bold">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white brutal-border brutal-shadow-lg p-6 rotate-[0.3deg]">
      <div className="rotate-[-0.3deg]">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#5b8def] p-3 brutal-border rotate-[-2deg]">
            <Plane className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-black">Transportation to {destination}</h2>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setActiveTab('flights')}
            className={`p-4 brutal-border transition-all flex items-center justify-center gap-2 ${
              activeTab === 'flights'
                ? 'bg-black text-white translate-x-[-2px] translate-y-[-2px] shadow-[6px_6px_0px_#1a1a1a]'
                : 'bg-white hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#1a1a1a]'
            }`}
          >
            <Plane className="w-5 h-5" />
            <span className="text-xl">Flights ✈️</span>
          </button>
          <button
            onClick={() => setActiveTab('trains')}
            className={`p-4 brutal-border transition-all flex items-center justify-center gap-2 ${
              activeTab === 'trains'
                ? 'bg-black text-white translate-x-[-2px] translate-y-[-2px] shadow-[6px_6px_0px_#1a1a1a]'
                : 'bg-white hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#1a1a1a]'
            }`}
          >
            <Train className="w-5 h-5" />
            <span className="text-xl">Trains 🚂</span>
          </button>
        </div>

        {/* Flights */}
        {activeTab === 'flights' && (
          <div className="space-y-4">
            {flights.map((flight, index) => (
              <div
                key={flight.id}
                className="brutal-border bg-white p-6 brutal-hover"
                style={{ transform: `rotate(${[0.5, -0.3, 0.4][index % 3]}deg)` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="mb-1">{flight.airline}</h3>
                    <p className="text-sm text-gray-600">{flight.flightNumber}</p>
                  </div>
                  <div className="bg-[#4ade80] brutal-border px-4 py-2 rotate-[-2deg]">
                    <span className="text-white text-sm">{flight.stops}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  {/* Departure */}
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Departure</p>
                    <p className="text-2xl">{flight.departure}</p>
                  </div>

                  {/* Duration */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Duration</p>
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4" />
                      <p>{flight.duration}</p>
                    </div>
                    <div className="h-1 bg-black mt-2 relative">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#5b8def] brutal-border p-1">
                        <Plane className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Arrival */}
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">Arrival</p>
                    <p className="text-2xl">{flight.arrival}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#ffe66d] brutal-border px-4 py-2 rotate-[2deg]">
                      <div className="flex items-center gap-1">
                        <IndianRupee className="w-5 h-5" />
                        <span className="text-2xl">{flight.price.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    <div className="brutal-border px-3 py-1 bg-white text-sm">
                      {flight.class}
                    </div>
                    {flight.available && (
                      <span className="text-sm text-gray-600">{flight.available} seats left</span>
                    )}
                  </div>
                  <Button className="bg-[#ff6b6b] hover:bg-[#ff5252] text-white brutal-border brutal-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#1a1a1a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_#1a1a1a] transition-all">
                    Book Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trains */}
        {activeTab === 'trains' && (
          <div className="space-y-4">
            {trains.map((train, index) => (
              <div
                key={train.id}
                className="brutal-border bg-white p-6 brutal-hover"
                style={{ transform: `rotate(${[-0.3, 0.5, -0.4][index % 3]}deg)` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="mb-1">{train.operator}</h3>
                    <p className="text-sm text-gray-600">Train #{train.trainNumber}</p>
                  </div>
                  <div className="bg-[#a78bfa] brutal-border px-4 py-2 rotate-2">
                    <span className="text-white text-sm">{train.stops}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  {/* Departure */}
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Departure</p>
                    <p className="text-2xl">{train.departure}</p>
                  </div>

                  {/* Duration */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Duration</p>
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4" />
                      <p>{train.duration}</p>
                    </div>
                    <div className="h-1 bg-black mt-2 relative">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#a78bfa] brutal-border p-1">
                        <Train className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Arrival */}
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">Arrival</p>
                    <p className="text-2xl">{train.arrival}</p>
                  </div>
                </div>

                {/* Amenities */}
                {train.amenities && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {train.amenities.map((amenity, idx) => (
                      <div
                        key={idx}
                        className="brutal-border px-3 py-1 text-sm flex items-center gap-1"
                        style={{
                          backgroundColor: ['#ffe66d', '#4ecdc4', '#ff6b6b'][idx % 3] + '30'
                        }}
                      >
                        <Zap className="w-3 h-3" />
                        {amenity}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#4ade80] brutal-border px-4 py-2 rotate-[-2deg]">
                      <div className="flex items-center gap-1">
                        <IndianRupee className="w-5 h-5 text-white" />
                        <span className="text-2xl text-white">{train.price.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    <div className="brutal-border px-3 py-1 bg-white text-sm">
                      {train.class}
                    </div>
                  </div>
                  <Button className="bg-[#4ecdc4] hover:bg-[#3db8af] text-white brutal-border brutal-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#1a1a1a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_#1a1a1a] transition-all">
                    Book Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
