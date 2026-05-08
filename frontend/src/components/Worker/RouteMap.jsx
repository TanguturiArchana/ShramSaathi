import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
import "./RouteMap.css";

const blueIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});


const redIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const RouteMap = ({ origin = [17.385, 78.4867], destination, originInfo = null, destinationInfo = null, onClose }) => {
  const mapRef = useRef(null);
  const [originState, setOriginState] = useState(origin);

  
  useEffect(() => {
    setOriginState(origin);
  }, [origin]);


  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    try {
      if (destination) {
        const bounds = L.latLngBounds([originState, destination]);
        map.fitBounds(bounds, { padding: [40, 40] });
      } else {
        map.setView(originState, 13);
      }
    } catch (e) {
      
    }
  }, [originState, destination]);

  const positions = destination ? [originState, destination] : [originState];

  return (
    <div className="route-map-shell">
      <div className="route-map-header">
        <button className="close-map" onClick={onClose}>Close</button>
      </div>
      <MapContainer
        whenCreated={(m) => (mapRef.current = m)}
        center={originState}
        zoom={13}
        className="route-map-container"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        
        <Marker position={originState} icon={blueIcon}>
          <Popup>
            <strong>Worker</strong>
            <br />
            {originInfo && (
              <>
                {originInfo.area && <>{originInfo.area}<br /></>}
                {originInfo.colony && <>{originInfo.colony}<br /></>}
                {originInfo.state && <>{originInfo.state}<br /></>}
                {originInfo.pincode && <>PIN: {originInfo.pincode}<br /></>}
              </>
            )}
          </Popup>
        </Marker>

        
        {destination && (
          <Marker position={destination} icon={redIcon}>
            <Popup>
              <strong>Owner / Destination</strong>
              <br />
              {destinationInfo && (
                <>
                  {destinationInfo.area && <>{destinationInfo.area}<br /></>}
                  {destinationInfo.colony && <>{destinationInfo.colony}<br /></>}
                  {destinationInfo.state && <>{destinationInfo.state}<br /></>}
                  {destinationInfo.pincode && <>PIN: {destinationInfo.pincode}<br /></>}
                </>
              )}
              <button onClick={() => {
                
                const url = `https://www.google.com/maps/dir/?api=1&origin=${originState[0]},${originState[1]}&destination=${destination[0]},${destination[1]}`;
                window.open(url, "_blank");
              }}>Open Directions</button>
            </Popup>
          </Marker>
        )}

       
        {destination && <Polyline positions={positions} pathOptions={{ color: "#2563eb", weight: 5 }} />}
      </MapContainer>
    </div>
  );
};

export default RouteMap;
