import { useState } from 'react';
import { IndianRupee, Users, Hotel, Plane, Utensils, ShoppingBag, PiggyBank, TrendingUp, AlertCircle } from 'lucide-react';

interface BudgetEstimatorProps {
  destination: string;
  days: number;
  travelers: string;
  budget: string;
}

const DESTINATION_COST_LEVEL: Record<string, 'low' | 'medium' | 'high'> = {
  goa: 'medium', jaipur: 'low', rajasthan: 'low', kerala: 'medium',
  manali: 'low', shimla: 'low', kashmir: 'medium', agra: 'low',
  varanasi: 'low', rishikesh: 'low', darjeeling: 'low', udaipur: 'medium',
  mumbai: 'high', delhi: 'medium', bangalore: 'high', kolkata: 'low',
  ooty: 'low', coorg: 'medium', leh: 'medium', andaman: 'high',
};

const BUDGET_MULTIPLIER = { budget: 0.6, medium: 1.0, luxury: 2.2 };

const BASE_DAILY_RATES = {
  low:    { hotel: 1800,  food: 600,  transport: 300,  activities: 400  },
  medium: { hotel: 4500,  food: 1200, transport: 600,  activities: 800  },
  high:   { hotel: 9000,  food: 2000, transport: 1000, activities: 1500 },
};

function formatINR(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

export function BudgetEstimator({ destination, days, travelers, budget }: BudgetEstimatorProps) {
  const [expanded, setExpanded] = useState(false);

  const destKey = destination.toLowerCase().trim();
  const costLevel = Object.entries(DESTINATION_COST_LEVEL).find(
    ([key]) => destKey.includes(key) || key.includes(destKey)
  )?.[1] || 'medium';

  const base = BASE_DAILY_RATES[costLevel];
  const mult = BUDGET_MULTIPLIER[budget as keyof typeof BUDGET_MULTIPLIER] || 1;
  const numTravelers = parseInt(travelers) || 2;

  const perNight = Math.round(base.hotel * mult);
  const foodPerDay = Math.round(base.food * mult * numTravelers);
  const transportTotal = Math.round(base.transport * mult * numTravelers * days * 0.4) + Math.round(6000 * mult); // local + intercity
  const activitiesTotal = Math.round(base.activities * mult * numTravelers * days);
  const hotelTotal = perNight * days;
  const foodTotal = foodPerDay * days;
  const shopping = Math.round(1500 * mult * numTravelers);
  const misc = Math.round((hotelTotal + foodTotal + transportTotal) * 0.08); // 8% misc

  const totalMin = hotelTotal + foodTotal + transportTotal + activitiesTotal + shopping;
  const totalMax = Math.round(totalMin * 1.3);

  const breakdown = [
    { label: 'Hotels & Stays', icon: <Hotel className="w-5 h-5" />, amount: hotelTotal, color: '#a78bfa', pct: Math.round((hotelTotal / totalMin) * 100) },
    { label: 'Food & Dining', icon: <Utensils className="w-5 h-5" />, amount: foodTotal, color: '#fb923c', pct: Math.round((foodTotal / totalMin) * 100) },
    { label: 'Transport', icon: <Plane className="w-5 h-5" />, amount: transportTotal, color: '#5b8def', pct: Math.round((transportTotal / totalMin) * 100) },
    { label: 'Activities & Entry', icon: <TrendingUp className="w-5 h-5" />, amount: activitiesTotal, color: '#4ade80', pct: Math.round((activitiesTotal / totalMin) * 100) },
    { label: 'Shopping', icon: <ShoppingBag className="w-5 h-5" />, amount: shopping, color: '#f472b6', pct: Math.round((shopping / totalMin) * 100) },
  ];

  return (
    <div className="bg-white brutal-border brutal-shadow-lg p-6 rotate-[-0.3deg]">
      <div className="rotate-[0.3deg]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-[#4ade80] p-3 brutal-border rotate-[2deg]">
              <PiggyBank className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-black">Trip Budget Estimator</h2>
          </div>
          <button
            onClick={() => setExpanded(e => !e)}
            className="brutal-border px-4 py-2 bg-[#ffe66d] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_#1a1a1a] transition-all font-bold text-sm"
          >
            {expanded ? '▲ Less Details' : '▼ Full Breakdown'}
          </button>
        </div>

        {/* Hero total */}
        <div className="bg-gradient-to-br from-[#4ade80] to-[#4ecdc4] brutal-border p-6 mb-6 rotate-[-0.5deg]">
          <p className="text-white/90 mb-1 text-sm">Estimated Total for {numTravelers} traveler{numTravelers > 1 ? 's' : ''} · {days} days</p>
          <div className="flex items-baseline gap-3">
            <span className="text-5xl text-white font-black">{formatINR(totalMin)}</span>
            <span className="text-white/80 text-lg">– {formatINR(totalMax)}</span>
          </div>
          <p className="text-white/70 text-xs mt-2">* Estimates based on {budget} budget at {destination}. Actual costs may vary.</p>
        </div>

        {/* Visual bar chart */}
        <div className="mb-6">
          <div className="flex h-6 brutal-border overflow-hidden rounded-none mb-3">
            {breakdown.map((b, i) => (
              <div
                key={i}
                style={{ width: `${b.pct}%`, backgroundColor: b.color }}
                title={`${b.label}: ${b.pct}%`}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {breakdown.map((b, i) => (
              <div key={i} className="flex items-center gap-1 text-xs">
                <div className="w-3 h-3 brutal-border" style={{ backgroundColor: b.color }} />
                <span>{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[
            { label: 'Per person / day', value: formatINR(Math.round(totalMin / days / numTravelers)) },
            { label: 'Hotel / night', value: formatINR(perNight) },
            { label: 'Food / day', value: formatINR(foodPerDay) },
          ].map((stat, i) => (
            <div key={i} className="brutal-border p-3 text-center" style={{ transform: `rotate(${[-0.5, 0.5, -0.3][i]}deg)` }}>
              <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
              <p className="font-black text-lg">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Full breakdown (expandable) */}
        {expanded && (
          <div className="space-y-3 mt-4 border-t-4 border-black pt-4">
            <h3 className="text-black text-base mb-3">Detailed Breakdown</h3>
            {breakdown.map((b, i) => (
              <div key={i} className="flex items-center justify-between brutal-border p-3" style={{ backgroundColor: b.color + '18' }}>
                <div className="flex items-center gap-2">
                  <div className="brutal-border p-2" style={{ backgroundColor: b.color }}>
                    <span className="text-white">{b.icon}</span>
                  </div>
                  <span className="font-medium">{b.label}</span>
                </div>
                <div className="text-right">
                  <p className="font-black text-lg">{formatINR(b.amount)}</p>
                  <p className="text-xs text-gray-500">{b.pct}% of total</p>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2 brutal-border p-3 bg-[#ffe66d]/30">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <p className="text-xs text-gray-600">Keep 10-15% extra as emergency buffer. Booking in advance can save 20-30% on hotels and flights.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
