import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { MapPin, Calendar as CalendarIcon, Users, Sparkles } from 'lucide-react';

interface TripSearchFormProps {
  onSearch: (data: TripSearchData) => void;
}

export interface TripSearchData {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: string;
  budget: string;
}

const indianDestinations = [
  'Goa', 'Kerala', 'Rajasthan', 'Kashmir', 'Manali', 'Shimla', 'Ooty',
  'Udaipur', 'Jaipur', 'Varanasi', 'Rishikesh', 'Darjeeling', 'Andaman',
  'Leh-Ladakh', 'Coorg', 'Munnar', 'Agra', 'Mumbai', 'Delhi', 'Bangalore'
];

export function TripSearchForm({ onSearch }: TripSearchFormProps) {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelers, setTravelers] = useState('2');
  const [budget, setBudget] = useState('medium');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredDestinations = indianDestinations.filter(dest =>
    dest.toLowerCase().includes(destination.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ destination, startDate, endDate, travelers, budget });
  };

  return (
    <div className="bg-white brutal-border brutal-shadow-lg p-8 rotate-[-0.5deg]">
      <form onSubmit={handleSubmit} className="space-y-6 rotate-[0.5deg]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Destination */}
          <div className="space-y-3">
            <Label htmlFor="destination" className="flex items-center gap-2 text-lg">
              <div className="bg-[#ff6b6b] p-2 brutal-border rotate-3">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              Where to?
            </Label>
            <div className="relative">
              <Input
                id="destination"
                placeholder="e.g., Goa, Kerala, Rajasthan"
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="brutal-border bg-[#ffe66d]/20 h-12 px-4 focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-[6px_6px_0px_#1a1a1a] transition-all"
                required
              />
              {showSuggestions && destination && filteredDestinations.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-white brutal-border brutal-shadow max-h-48 overflow-y-auto">
                  {filteredDestinations.map((dest) => (
                    <button
                      key={dest}
                      type="button"
                      onClick={() => {
                        setDestination(dest);
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-[#ffe66d] transition-colors border-b-2 border-black last:border-b-0"
                    >
                      {dest}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Travelers */}
          <div className="space-y-3">
            <Label htmlFor="travelers" className="flex items-center gap-2 text-lg">
              <div className="bg-[#4ecdc4] p-2 brutal-border rotate-[-3deg]">
                <Users className="w-5 h-5 text-white" />
              </div>
              Travelers
            </Label>
            <select
              id="travelers"
              value={travelers}
              onChange={(e) => setTravelers(e.target.value)}
              className="w-full brutal-border bg-[#4ecdc4]/20 h-12 px-4 focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-[6px_6px_0px_#1a1a1a] transition-all cursor-pointer"
            >
              <option value="1">1 Person</option>
              <option value="2">2 People</option>
              <option value="3">3 People</option>
              <option value="4">4 People</option>
              <option value="5+">5+ People</option>
            </select>
          </div>

          {/* Start Date */}
          <div className="space-y-3">
            <Label htmlFor="startDate" className="flex items-center gap-2 text-lg">
              <div className="bg-[#5b8def] p-2 brutal-border rotate-2">
                <CalendarIcon className="w-5 h-5 text-white" />
              </div>
              Start Date
            </Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="brutal-border bg-[#5b8def]/20 h-12 px-4 focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-[6px_6px_0px_#1a1a1a] transition-all"
              required
            />
          </div>

          {/* End Date */}
          <div className="space-y-3">
            <Label htmlFor="endDate" className="flex items-center gap-2 text-lg">
              <div className="bg-[#a78bfa] p-2 brutal-border rotate-[-2deg]">
                <CalendarIcon className="w-5 h-5 text-white" />
              </div>
              End Date
            </Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || new Date().toISOString().split('T')[0]}
              className="brutal-border bg-[#a78bfa]/20 h-12 px-4 focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-[6px_6px_0px_#1a1a1a] transition-all"
              required
            />
          </div>

          {/* Budget */}
          <div className="space-y-3 md:col-span-2">
            <Label htmlFor="budget" className="text-lg">Budget Range</Label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'budget', label: 'Budget', emoji: '💰', color: '#4ade80' },
                { value: 'medium', label: 'Medium', emoji: '💵', color: '#fbbf24' },
                { value: 'luxury', label: 'Luxury', emoji: '💎', color: '#f472b6' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setBudget(option.value)}
                  className={`brutal-border p-4 transition-all ${
                    budget === option.value
                      ? 'bg-black text-white translate-x-[-2px] translate-y-[-2px] shadow-[6px_6px_0px_#1a1a1a]'
                      : 'bg-white hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#1a1a1a]'
                  }`}
                >
                  <div className="text-3xl mb-2">{option.emoji}</div>
                  <div className="font-black">{option.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-[#ff6b6b] hover:bg-[#ff5252] text-white h-14 brutal-border brutal-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_#1a1a1a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[3px_3px_0px_#1a1a1a] transition-all"
        >
          
          <span className="text-xl">Generate Trip Plan</span>
        </Button>
      </form>
    </div>
  );
}
