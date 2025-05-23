"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Coordinates, DEFAULT_COORDINATES } from "@/lib/utils/geolocation";
import { Doctor } from "@/lib/api/types";
import "leaflet/dist/leaflet.css";

// Fix for Leaflet marker icons in Next.js
useEffect(() => {
  // This is needed to fix the marker icon issue with Leaflet in Next.js
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "/images/map/marker-icon-2x.png",
    iconUrl: "/images/map/marker-icon.png",
    shadowUrl: "/images/map/marker-shadow.png",
  });
}, []);

interface LocationMapProps {
  doctors?: Doctor[];
  center?: Coordinates;
  zoom?: number;
  height?: string;
  width?: string;
  showUserLocation?: boolean;
  onDoctorSelect?: (doctor: Doctor) => void;
  selectedDoctorId?: string;
}

// Component to recenter the map when center prop changes
function ChangeMapView({ center }: { center: Coordinates }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView([center.latitude, center.longitude], map.getZoom());
  }, [center, map]);
  
  return null;
}

// Custom marker icon for selected doctor
const selectedIcon = new L.Icon({
  iconUrl: "/images/map/marker-icon-selected.png",
  iconRetinaUrl: "/images/map/marker-icon-selected-2x.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "/images/map/marker-shadow.png",
  shadowSize: [41, 41],
});

// Custom marker icon for user location
const userLocationIcon = new L.Icon({
  iconUrl: "/images/map/user-location.png",
  iconRetinaUrl: "/images/map/user-location-2x.png",
  iconSize: [22, 22],
  iconAnchor: [11, 11],
  popupAnchor: [0, -11],
});

export default function LocationMap({
  doctors = [],
  center = DEFAULT_COORDINATES,
  zoom = 13,
  height = "400px",
  width = "100%",
  showUserLocation = true,
  onDoctorSelect,
  selectedDoctorId,
}: LocationMapProps) {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Get user location if showUserLocation is true
  useEffect(() => {
    if (showUserLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  }, [showUserLocation]);

  // Set mapLoaded to true after component mounts
  useEffect(() => {
    setMapLoaded(true);
  }, []);

  if (!mapLoaded) {
    return (
      <div
        style={{ height, width }}
        className="bg-gray-100 flex items-center justify-center rounded-lg"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div style={{ height, width }} className="rounded-lg overflow-hidden">
      <MapContainer
        center={[center.latitude, center.longitude]}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Render doctor markers */}
        {doctors.map((doctor) => (
          <Marker
            key={doctor.id}
            position={[
              doctor.location.coordinates.latitude,
              doctor.location.coordinates.longitude,
            ]}
            icon={doctor.id === selectedDoctorId ? selectedIcon : new L.Icon.Default()}
            eventHandlers={{
              click: () => {
                if (onDoctorSelect) {
                  onDoctorSelect(doctor);
                }
              },
            }}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-semibold">{doctor.name}</h3>
                <p className="text-sm text-gray-600">{doctor.specialty}</p>
                <p className="text-xs text-gray-500">{doctor.location.address}</p>
                {onDoctorSelect && (
                  <button
                    className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                    onClick={() => onDoctorSelect(doctor)}
                  >
                    View Profile
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Render user location marker */}
        {userLocation && (
          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
            icon={userLocationIcon}
          >
            <Popup>
              <div className="p-1">
                <p className="font-semibold">Your Location</p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Update map view when center changes */}
        <ChangeMapView center={center} />
      </MapContainer>
    </div>
  );
}
