import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useMapModalContext } from "@/context";

import "leaflet/dist/leaflet.css";
import "./MapModal.css";
import type { LatLngExpression } from "leaflet";

export default function MapModal() {
  const { selectedMessage, closeModal } = useMapModalContext();

  if (!selectedMessage) return null;

  const position: LatLngExpression = [
    selectedMessage.location.latitude,
    selectedMessage.location.longitude,
  ];

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button onClick={closeModal}>Закрити</button>
        </div>

        <div className="modal-body">
          <MapContainer
            center={position}
            zoom={15}
            className="map-container"
            zoomControl
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>
                {position[0]}, {position[1]}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
