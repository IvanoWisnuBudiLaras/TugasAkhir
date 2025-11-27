"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapSection() {
  const position: [number, number] = [-6.804543, 110.840393];

  return (
    <section className="py-16 px-4">
      <h2 className="text-center text-3xl font-bold mb-8">
        Temukan Smoethievibes
      </h2>

      <div className="rounded-3xl overflow-hidden shadow-xl max-w-5xl mx-auto h-[500px]">
        <MapContainer
          center={position}
          zoom={17}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <Marker position={position}>
            <Popup>
              Smoethievibes Cafe <br />
              Klik marker ini untuk melihat lokasi.
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </section>
  );
}
