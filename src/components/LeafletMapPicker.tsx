import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Search, MapPin, Loader2 } from 'lucide-react';

interface LeafletMapPickerProps {
  lat: number | '';
  lng: number | '';
  onChange: (lat: number, lng: number) => void;
}

export const LeafletMapPicker: React.FC<LeafletMapPickerProps> = ({
  lat,
  lng,
  onChange,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Default initial coordinates: Thailand Center (Bangkok)
  const defaultLat = lat !== '' ? Number(lat) : 13.7563;
  const defaultLng = lng !== '' ? Number(lng) : 100.5018;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Fix standard Leaflet default marker icons path issues in React
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
      }).setView([defaultLat, defaultLng], lat !== '' ? 13 : 6);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
      }).addTo(map);

      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat: clickLat, lng: clickLng } = e.latlng;
        updateMarkerPosition(clickLat, clickLng, map);
        onChange(clickLat, clickLng);
      });

      mapInstanceRef.current = map;

      if (lat !== '' && lng !== '') {
        updateMarkerPosition(Number(lat), Number(lng), map);
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  // Update marker position if external lat/lng changes
  useEffect(() => {
    if (mapInstanceRef.current && lat !== '' && lng !== '') {
      updateMarkerPosition(Number(lat), Number(lng), mapInstanceRef.current);
    }
  }, [lat, lng]);

  const updateMarkerPosition = (latitude: number, longitude: number, map: L.Map) => {
    if (markerRef.current) {
      markerRef.current.setLatLng([latitude, longitude]);
    } else {
      const marker = L.marker([latitude, longitude], { draggable: true }).addTo(map);
      marker.on('dragend', () => {
        const position = marker.getLatLng();
        onChange(position.lat, position.lng);
      });
      markerRef.current = marker;
    }
    map.panTo([latitude, longitude]);
  };

  const handleSearchLocation = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery.trim() + ' Thailand'
        )}&limit=1`
      );
      const results = await response.json();
      if (results && results.length > 0) {
        const newLat = parseFloat(results[0].lat);
        const newLng = parseFloat(results[0].lon);
        if (mapInstanceRef.current) {
          updateMarkerPosition(newLat, newLng, mapInstanceRef.current);
          mapInstanceRef.current.setView([newLat, newLng], 13);
        }
        onChange(newLat, newLng);
      }
    } catch (err) {
      console.warn("Location search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-2">
      {/* Search Input Box */}
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-emerald-600" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearchLocation();
              }
            }}
            placeholder="พิมพ์ชื่อตำบล อำเภอ หรือจังหวัดเพื่อปักหมุด..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <button
          type="button"
          onClick={handleSearchLocation}
          disabled={isSearching}
          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors"
        >
          {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
          <span>ค้นหา</span>
        </button>
      </div>

      {/* Map Element */}
      <div className="relative w-full h-52 rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
        <div ref={mapContainerRef} className="w-full h-full z-10" />
      </div>

      {/* Lat/Lng display badge */}
      <div className="flex justify-between items-center text-[11px] text-slate-500 px-1 font-mono">
        <span>* แตะบนแผนที่หรือลากหมุดเพื่อระบุตำแหน่งที่ดิน</span>
        <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-bold text-slate-700">
          {lat !== '' && lng !== '' ? `${Number(lat).toFixed(5)}, ${Number(lng).toFixed(5)}` : 'ยังไม่ได้ปักหมุด'}
        </span>
      </div>
    </div>
  );
};
