import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../context/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "./Button";
import { useUrl } from "../hooks/useUrl";
function Map() {
  const navigate = useNavigate();
  const { cities } = useCities();
  const [mapPosition, setMapPostion] = useState([40, 0]);
  const {
    isLoading: isLoadingPositon,
    position: geolocation,
    getPosition,
  } = useGeolocation();
  const [lat, lng] = useUrl();
  useEffect(
    function () {
      if (lat & lng) setMapPostion([lat, lng]);
    },
    [lat, lng]
  );

  useEffect(
    function () {
      if (geolocation) setMapPostion([geolocation.lat, geolocation.lng]);
    },
    [geolocation]
  );
  return (
    <div className={styles.mapContainer}>
      {" "}
      {!geolocation && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPositon ? "Loading..." : "Use your position"}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        zoom={13}
        scrollWheelZoom={false}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
}

export default Map;
