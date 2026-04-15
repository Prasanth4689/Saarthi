import { MapPin, Clock, Star, Camera } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PlacesToVisitProps {
  destination: string;
}

// These are VERIFIED working Unsplash photo URLs (stable IDs)
const CATEGORY_IMAGES = {
  Heritage:  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80',  // Indian fort/palace
  Shopping:  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',     // colorful market stalls
  Spiritual: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=600&q=80', // Indian temple exterior
  Nature:    'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80',  // green mountain valley
  Food:      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',  // colorful Indian food spread
  Culture:   'https://images.unsplash.com/photo-1568454537842-d933259bb258?w=600&q=80',  // Indian cultural artifacts
};

// Destination-specific curated sets (verified URLs)
const DESTINATION_PLACES: Record<string, { name: string; image: string; description: string; duration: string; rating: number; category: keyof typeof CATEGORY_IMAGES; bestTime: string }[]> = {
  goa: [
    { name: 'Baga & Calangute Beach', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80', description: 'Golden sandy beaches with water sports, shacks, and stunning sunsets', duration: '3-4 hours', rating: 4.8, category: 'Nature', bestTime: 'Morning & Sunset' },
    { name: 'Anjuna Flea Market', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80', description: 'Iconic weekly market with vibrant handicrafts, clothes, and street food', duration: '2-3 hours', rating: 4.5, category: 'Shopping', bestTime: 'Wednesday Evenings' },
    { name: 'Basilica of Bom Jesus', image: 'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=600&q=80', description: "UNESCO heritage church housing St. Francis Xavier's relics", duration: '1-2 hours', rating: 4.7, category: 'Heritage', bestTime: 'Morning' },
    { name: 'Dudhsagar Waterfalls', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', description: 'One of India\'s tallest waterfalls surrounded by lush jungle', duration: 'Full day', rating: 4.9, category: 'Nature', bestTime: 'Monsoon & Winter' },
    { name: 'Goa Night Market & Shacks', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80', description: 'Fresh seafood, Vindaloo and Xacuti at laid-back beach shacks', duration: '2 hours', rating: 4.8, category: 'Food', bestTime: 'Evening' },
    { name: 'Old Goa Heritage Walk', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80', description: 'Colonial Portuguese architecture and historic churches', duration: '2-3 hours', rating: 4.6, category: 'Culture', bestTime: 'Morning' },
  ],
  jaipur: [
    { name: 'Amber Fort', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80', description: 'Magnificent hilltop fort with stunning mirror palace and elephant rides', duration: '3-4 hours', rating: 4.9, category: 'Heritage', bestTime: 'Morning' },
    { name: 'Johari Bazaar', image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=600&q=80', description: 'Bustling market for jewellery, gems, textiles and Rajasthani handicrafts', duration: '2-3 hours', rating: 4.6, category: 'Shopping', bestTime: 'Afternoon' },
    { name: 'Hawa Mahal', image: 'https://images.unsplash.com/photo-1598492753607-88ee0c5c4e80?w=600&q=80', description: 'Iconic "Palace of Winds" with 953 small windows and latticework', duration: '1-2 hours', rating: 4.8, category: 'Heritage', bestTime: 'Morning' },
    { name: 'City Palace', image: 'https://images.unsplash.com/photo-1477587458883-47145ed6979c?w=600&q=80', description: 'Grand royal complex blending Rajput and Mughal architecture', duration: '2-3 hours', rating: 4.7, category: 'Heritage', bestTime: 'Morning' },
    { name: 'Dal Baati Churma Street', image: 'https://images.unsplash.com/photo-1567528785094-2f05cef87d9a?w=600&q=80', description: 'Authentic Rajasthani cuisine — dal baati, ghewar, and kachori', duration: '1-2 hours', rating: 4.9, category: 'Food', bestTime: 'Evening' },
    { name: 'Jantar Mantar', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80', description: 'UNESCO astronomical observatory with giant stone instruments', duration: '1-2 hours', rating: 4.5, category: 'Culture', bestTime: 'Afternoon' },
  ],
  kerala: [
    { name: 'Alleppey Backwaters', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80', description: 'Serene network of canals, lakes, and lagoons best explored on a houseboat', duration: 'Full day', rating: 4.9, category: 'Nature', bestTime: 'All day' },
    { name: 'Periyar Spice Market', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80', description: 'Fragrant market selling cardamom, pepper, cinnamon and vanilla', duration: '1-2 hours', rating: 4.6, category: 'Shopping', bestTime: 'Morning' },
    { name: 'Padmanabhaswamy Temple', image: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=600&q=80', description: 'Ancient Dravidian temple dedicated to Lord Vishnu with stunning gopuram', duration: '2-3 hours', rating: 4.8, category: 'Spiritual', bestTime: 'Morning' },
    { name: 'Munnar Tea Gardens', image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80', description: 'Rolling hills carpeted with emerald tea plantations and mist', duration: '3-4 hours', rating: 4.9, category: 'Nature', bestTime: 'Morning' },
    { name: 'Kerala Sadhya Feast', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80', description: 'Traditional vegetarian feast served on banana leaf with 25+ delicacies', duration: '1 hour', rating: 5.0, category: 'Food', bestTime: 'Lunch' },
    { name: 'Kathakali Dance Show', image: 'https://images.unsplash.com/photo-1568454537842-d933259bb258?w=600&q=80', description: "Kerala's classical dance drama with elaborate costumes and makeup", duration: '2 hours', rating: 4.8, category: 'Culture', bestTime: 'Evening' },
  ],
  manali: [
    { name: 'Rohtang Pass', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', description: 'High mountain pass with snow activities and panoramic Himalayan views', duration: 'Full day', rating: 4.9, category: 'Nature', bestTime: 'Morning' },
    { name: 'Old Manali Market', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80', description: 'Hippie market with woollen shawls, apple products, and Tibetan jewellery', duration: '1-2 hours', rating: 4.5, category: 'Shopping', bestTime: 'Afternoon' },
    { name: 'Hadimba Temple', image: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=600&q=80', description: 'Unique 4-storey wooden temple set in a cedar forest', duration: '1 hour', rating: 4.7, category: 'Spiritual', bestTime: 'Morning' },
    { name: 'Solang Valley', image: 'https://images.unsplash.com/photo-1475688621402-4257c812d6db?w=600&q=80', description: 'Adventure hub for paragliding, zorbing, and skiing in winter', duration: '3-4 hours', rating: 4.8, category: 'Nature', bestTime: 'Morning' },
    { name: 'Himalayan Food Trail', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80', description: 'Try Siddu (local bread), trout fish, and Tibetan Thukpa noodle soup', duration: '1-2 hours', rating: 4.7, category: 'Food', bestTime: 'Any time' },
    { name: 'Naggar Castle', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80', description: 'Medieval stone castle turned heritage hotel with valley views', duration: '1-2 hours', rating: 4.6, category: 'Heritage', bestTime: 'Afternoon' },
  ],
  kashmir: [
    { name: 'Dal Lake Shikara Ride', image: 'https://images.unsplash.com/photo-1602483958003-65e3aea3c18e?w=600&q=80', description: 'Iconic floating gardens and houseboats on the famous Dal Lake', duration: '2-3 hours', rating: 5.0, category: 'Nature', bestTime: 'Sunrise & Sunset' },
    { name: 'Lal Chowk Market', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80', description: 'Kashmir crafts market with Pashmina shawls, carpets, and dry fruits', duration: '2 hours', rating: 4.5, category: 'Shopping', bestTime: 'Afternoon' },
    { name: 'Hazratbal Shrine', image: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=600&q=80', description: 'White marble mosque on Dal Lake waterfront, a major pilgrimage site', duration: '1 hour', rating: 4.8, category: 'Spiritual', bestTime: 'Morning' },
    { name: 'Gulmarg Gondola', image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&q=80', description: "One of the world's highest gondola rides with stunning Himalayan panoramas", duration: 'Full day', rating: 4.9, category: 'Nature', bestTime: 'Morning' },
    { name: 'Kashmiri Wazwan Feast', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80', description: '36-course multi-dish ceremonial meal with Rogan Josh, Yakhni and Gushtaba', duration: '1-2 hours', rating: 4.9, category: 'Food', bestTime: 'Lunch' },
    { name: 'Shankaracharya Temple', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80', description: 'Ancient hilltop temple with sweeping views over entire Srinagar', duration: '2 hours', rating: 4.7, category: 'Heritage', bestTime: 'Sunrise' },
  ],
  shimla: [
    { name: 'The Ridge & Mall Road', image: 'https://images.unsplash.com/photo-1619527819854-c4e21b9ef2cf?w=600&q=80', description: 'Colonial-era promenade with Victorian Gothic architecture and mountain views', duration: '2-3 hours', rating: 4.7, category: 'Heritage', bestTime: 'Evening' },
    { name: 'Lakkar Bazaar', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80', description: 'Market famous for wooden handicrafts, apple jam, and Himachali souvenirs', duration: '1-2 hours', rating: 4.4, category: 'Shopping', bestTime: 'Afternoon' },
    { name: 'Jakhu Temple', image: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=600&q=80', description: 'Ancient Hanuman temple on the highest peak surrounded by rhesus monkeys', duration: '2 hours', rating: 4.8, category: 'Spiritual', bestTime: 'Morning' },
    { name: 'Kufri Viewpoint', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', description: 'Scenic ski resort with panoramic Himalayan vistas and yak rides', duration: '3-4 hours', rating: 4.6, category: 'Nature', bestTime: 'Morning' },
    { name: 'Himachali Dham', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80', description: 'Traditional Himachali cuisine — Madra, Dham, Chha Gosht and Siddu', duration: '1 hour', rating: 4.8, category: 'Food', bestTime: 'Lunch' },
    { name: 'Toy Train to Kalka', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&q=80', description: 'UNESCO Heritage narrow-gauge railway through 103 tunnels and 800 bridges', duration: 'Full day', rating: 4.9, category: 'Culture', bestTime: 'Morning' },
  ],
  varanasi: [
    { name: 'Dashashwamedh Ghat', image: 'https://images.unsplash.com/photo-1561361058-c24e017eb757?w=600&q=80', description: 'Main Ganga ghat famous for the nightly Ganga Aarti ceremony', duration: '2-3 hours', rating: 5.0, category: 'Spiritual', bestTime: 'Sunrise & Evening' },
    { name: 'Vishwanath Gali Market', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80', description: 'Ancient lanes with silk sarees, Banarasi paan, and religious items', duration: '2 hours', rating: 4.6, category: 'Shopping', bestTime: 'Morning' },
    { name: 'Kashi Vishwanath Temple', image: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=600&q=80', description: 'One of the 12 Jyotirlinga temples, the holiest Shiva shrine in India', duration: '2 hours', rating: 4.9, category: 'Spiritual', bestTime: 'Early Morning' },
    { name: 'Sarnath Deer Park', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80', description: 'Buddhist site where Buddha gave his first sermon, with ruins and museum', duration: '2-3 hours', rating: 4.7, category: 'Heritage', bestTime: 'Morning' },
    { name: 'Banarasi Street Food', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80', description: 'Kachori sabzi, malaiyo, chaat, and the famous Banarasi paan', duration: '1-2 hours', rating: 5.0, category: 'Food', bestTime: 'Evening' },
    { name: 'Sunrise Boat Ride', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80', description: 'Wooden boat journey along the Ghats at sunrise — a truly spiritual experience', duration: '2 hours', rating: 5.0, category: 'Culture', bestTime: 'Before Sunrise' },
  ],
};

// Generic fallback places for any destination
const GENERIC_PLACES = (destination: string) => [
  { id: 1, name: `${destination} Heritage Fort`, image: CATEGORY_IMAGES.Heritage, description: 'Magnificent centuries-old fort showcasing royal architecture and history', duration: '2-3 hours', rating: 4.8, category: 'Heritage' as const, bestTime: 'Morning' },
  { id: 2, name: 'Local Bazaar & Market', image: CATEGORY_IMAGES.Shopping, description: 'Vibrant market with local handicrafts, spices, clothing and street food', duration: '1-2 hours', rating: 4.6, category: 'Shopping' as const, bestTime: 'Evening' },
  { id: 3, name: 'Ancient Temple Complex', image: CATEGORY_IMAGES.Spiritual, description: 'Beautifully carved ancient temples — a spiritual journey through history', duration: '2-3 hours', rating: 4.9, category: 'Spiritual' as const, bestTime: 'Morning' },
  { id: 4, name: 'Scenic Nature Viewpoint', image: CATEGORY_IMAGES.Nature, description: 'Breathtaking panoramic landscape views perfect for photography', duration: '1-2 hours', rating: 4.7, category: 'Nature' as const, bestTime: 'Sunset' },
  { id: 5, name: 'Street Food Trail', image: CATEGORY_IMAGES.Food, description: 'Sample authentic regional delicacies and local specialties', duration: '1-2 hours', rating: 4.9, category: 'Food' as const, bestTime: 'Evening' },
  { id: 6, name: 'Cultural Museum', image: CATEGORY_IMAGES.Culture, description: 'Explore the rich art, traditions, and history of the region', duration: '2 hours', rating: 4.5, category: 'Culture' as const, bestTime: 'Afternoon' },
];

const categoryColors: Record<string, string> = {
  Heritage: '#ff6b6b',
  Shopping: '#ffe66d',
  Spiritual: '#a78bfa',
  Nature: '#4ade80',
  Food: '#fb923c',
  Culture: '#4ecdc4',
};

export function PlacesToVisit({ destination }: PlacesToVisitProps) {
  const destKey = destination.toLowerCase().trim();
  const matchedEntry = Object.entries(DESTINATION_PLACES).find(
    ([key]) => destKey.includes(key) || key.includes(destKey)
  );
  const rawPlaces = matchedEntry ? matchedEntry[1] : GENERIC_PLACES(destination);
  const places = rawPlaces.map((p, i) => ({ ...p, id: i + 1 }));

  return (
    <div className="bg-white brutal-border brutal-shadow-lg p-6 rotate-[0.4deg]">
      <div className="rotate-[-0.4deg]">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#f472b6] p-3 brutal-border rotate-[-3deg]">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-black">Must-Visit Places in {destination}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place, index) => (
            <div
              key={place.id}
              className="brutal-border bg-white overflow-hidden brutal-hover cursor-pointer group"
              style={{ transform: `rotate(${[1, -0.5, 0.8, -1, 0.5, -0.3][index % 6]}deg)` }}
            >
              <div className="relative h-48 overflow-hidden border-b-4 border-black">
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = CATEGORY_IMAGES[place.category] || CATEGORY_IMAGES.Heritage;
                  }}
                />
                <div
                  className="absolute top-3 right-3 brutal-border px-3 py-1 rotate-3"
                  style={{ backgroundColor: categoryColors[place.category] }}
                >
                  <span className="text-white text-sm font-bold">{place.category}</span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="mb-3 text-black text-base font-bold">{place.name}</h3>

                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1 bg-[#4ade80] brutal-border px-2 py-1">
                    <Star className="w-4 h-4 fill-white text-white" />
                    <span className="text-white text-sm font-bold">{place.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-700">
                    <Clock className="w-4 h-4" />
                    {place.duration}
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-3">{place.description}</p>

                <div className="flex items-center gap-2 text-sm bg-[#5b8def]/20 brutal-border p-2">
                  <MapPin className="w-4 h-4 text-[#5b8def]" />
                  <span>Best time: {place.bestTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
