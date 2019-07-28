import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const mapStyle = {
  width: '400px',
  height: '320px',
};

function LeafletMap({ lat, lng, zoom, name }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // add map
  useEffect(() => {
    mapRef.current = L.map('map', {
      center: [lat, lng],
      zoom,
      layers: [
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        }),
      ],
    });
  }, [lat, lng, zoom]);

  // add marker
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = L.marker({ lat, lng }).addTo(mapRef.current);
    }
  }, [lat, lng]);

  // tooltip
  useEffect(() => {
    const popupText = `<b>${name}</b>'s home`;

    markerRef.current.bindPopup(popupText);
    markerRef.current.on('mouseover', function(e) {
      this.openPopup();
    });
    markerRef.current.on('mouseout', function(e) {
      this.closePopup();
    });
  }, [name]);

  return <div id='map' style={mapStyle} />;
}

export default LeafletMap;
