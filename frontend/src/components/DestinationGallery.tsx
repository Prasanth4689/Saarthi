import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react';

interface DestinationGalleryProps {
  destination: string;
}

const GALLERY_PHOTOS: Record<string, { url: string; caption: string }[]> = {
  goa: [
    { url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=85', caption: 'Baga Beach at Sunset' },
    { url: 'https://images.unsplash.com/photo-1598500020721-e5fa8b25f36c?w=800&q=85', caption: 'Old Goa Churches' },
    { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85', caption: 'Dudhsagar Waterfall' },
    { url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=85', caption: 'Colourful Mapusa Market' },
    { url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=85', caption: 'Fresh Goan Seafood' },
    { url: 'https://images.unsplash.com/photo-1600679272175-a2ac1a26de41?w=800&q=85', caption: 'Tropical Palms & Lagoons' },
  ],
  jaipur: [
    { url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=85', caption: 'Amber Fort at Dawn' },
    { url: 'https://images.unsplash.com/photo-1598492753607-88ee0c5c4e80?w=800&q=85', caption: 'Hawa Mahal — Palace of Winds' },
    { url: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&q=85', caption: 'Bustling Johari Bazaar' },
    { url: 'https://images.unsplash.com/photo-1477587458883-47145ed6979c?w=800&q=85', caption: 'City Palace Complex' },
    { url: 'https://images.unsplash.com/photo-1567528785094-2f05cef87d9a?w=800&q=85', caption: 'Dal Baati Churma' },
    { url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=85', caption: 'Jantar Mantar Observatory' },
  ],
  kerala: [
    { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=85', caption: 'Alleppey Backwaters' },
    { url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=85', caption: 'Munnar Tea Gardens' },
    { url: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=800&q=85', caption: 'Ancient Temples' },
    { url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=85', caption: 'Kerala Spice Markets' },
    { url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=85', caption: 'Traditional Kerala Sadhya' },
    { url: 'https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?w=800&q=85', caption: 'Beach Resorts' },
  ],
  manali: [
    { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85', caption: 'Rohtang Pass Snow Fields' },
    { url: 'https://images.unsplash.com/photo-1475688621402-4257c812d6db?w=800&q=85', caption: 'Himalayan Peaks' },
    { url: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=800&q=85', caption: 'Hadimba Temple Forest' },
    { url: 'https://images.unsplash.com/photo-1501786223405-6d024d7e3da7?w=800&q=85', caption: 'Old Manali Pine Forests' },
    { url: 'https://images.unsplash.com/photo-1542359087-c18efc8e3b01?w=800&q=85', caption: 'Adventure Sports' },
    { url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=85', caption: 'Himalayan Cuisine' },
  ],
  kashmir: [
    { url: 'https://images.unsplash.com/photo-1602483958003-65e3aea3c18e?w=800&q=85', caption: 'Dal Lake Shikara Ride' },
    { url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=85', caption: 'Gulmarg Snow Peaks' },
    { url: 'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=800&q=85', caption: 'Saffron Fields of Pampore' },
    { url: 'https://images.unsplash.com/photo-1540541338187-41ffd4b6e302?w=800&q=85', caption: 'Pahalgam Valley' },
    { url: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=800&q=85', caption: 'Hazratbal Shrine' },
    { url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=85', caption: 'Wazwan Feast' },
  ],
  rajasthan: [
    { url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=85', caption: 'Majestic Amber Fort' },
    { url: 'https://images.unsplash.com/photo-1670687174580-c003b4716959?w=800&q=85', caption: 'Thar Desert Dunes' },
    { url: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&q=85', caption: 'Rajasthani Markets' },
    { url: 'https://images.unsplash.com/photo-1477587458883-47145ed6979c?w=800&q=85', caption: 'Jodhpur Blue City' },
    { url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=85', caption: 'Mehrangarh Fort' },
    { url: 'https://images.unsplash.com/photo-1567528785094-2f05cef87d9a?w=800&q=85', caption: 'Rajasthani Thali' },
  ],
};

const GENERIC_PHOTOS = (destination: string) => [
  { url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=85', caption: `${destination} Heritage` },
  { url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=85', caption: `${destination} Landscape` },
  { url: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=800&q=85', caption: `${destination} Temple` },
  { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=85', caption: `${destination} Market` },
  { url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=85', caption: `${destination} Cuisine` },
  { url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=85', caption: `${destination} Stay` },
];

export function DestinationGallery({ destination }: DestinationGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const destKey = destination.toLowerCase().trim();
  const matchedPhotos = Object.entries(GALLERY_PHOTOS).find(
    ([key]) => destKey.includes(key) || key.includes(destKey)
  )?.[1];
  const photos = matchedPhotos || GENERIC_PHOTOS(destination);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex(i => (i !== null ? (i - 1 + photos.length) % photos.length : 0));
  const next = () => setLightboxIndex(i => (i !== null ? (i + 1) % photos.length : 0));

  return (
    <div className="bg-white brutal-border brutal-shadow-lg p-6 rotate-[0.2deg]">
      <div className="rotate-[-0.2deg]">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#f472b6] p-3 brutal-border rotate-[2deg]">
            <Images className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-black">{destination} Photo Gallery</h2>
        </div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-3 gap-3">
          {/* Large featured image */}
          <div
            className="col-span-2 row-span-2 relative overflow-hidden brutal-border cursor-pointer group"
            style={{ height: '300px' }}
            onClick={() => openLightbox(0)}
          >
            <img
              src={photos[0].url}
              alt={photos[0].caption}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80'; }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-end">
              <div className="p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="font-bold text-sm">{photos[0].caption}</p>
              </div>
            </div>
          </div>

          {/* Right column — 2 stacked */}
          {[1, 2].map(i => (
            <div
              key={i}
              className="relative overflow-hidden brutal-border cursor-pointer group"
              style={{ height: '144px' }}
              onClick={() => openLightbox(i)}
            >
              <img
                src={photos[i]?.url}
                alt={photos[i]?.caption}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80'; }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-end">
                <div className="p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="font-bold text-xs">{photos[i]?.caption}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Bottom row — 3 equal */}
          {[3, 4, 5].map(i => (
            <div
              key={i}
              className="relative overflow-hidden brutal-border cursor-pointer group"
              style={{ height: '130px' }}
              onClick={() => openLightbox(i)}
            >
              <img
                src={photos[i]?.url}
                alt={photos[i]?.caption}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=800&q=80'; }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-end">
                <div className="p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="font-bold text-xs">{photos[i]?.caption}</p>
                </div>
              </div>
              {i === 5 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <p className="text-white font-black text-lg">View All</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-500 mt-3 text-center">📷 Click any photo to view fullscreen · All photos from Unsplash</p>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button onClick={(e) => { e.stopPropagation(); closeLightbox(); }} className="absolute top-4 right-4 text-white bg-black brutal-border p-2 hover:bg-white hover:text-black transition-colors">
            <X className="w-6 h-6" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 text-white bg-black brutal-border p-2 hover:bg-white hover:text-black transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div onClick={e => e.stopPropagation()} className="max-w-4xl max-h-[85vh] brutal-border overflow-hidden">
            <img
              src={photos[lightboxIndex].url}
              alt={photos[lightboxIndex].caption}
              className="max-h-[80vh] w-auto object-contain"
            />
            <div className="bg-black p-3 text-center">
              <p className="text-white font-bold">{photos[lightboxIndex].caption}</p>
              <p className="text-white/50 text-xs">{lightboxIndex + 1} / {photos.length}</p>
            </div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 text-white bg-black brutal-border p-2 hover:bg-white hover:text-black transition-colors">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}
