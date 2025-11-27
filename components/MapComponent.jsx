'use client';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState, useRef } from 'react';
import L from 'leaflet';

export default function MapComponent({ onFeatureClick, onMapReady }) {
  const [geoData, setGeoData] = useState(null);
  const mapRef = useRef();

  useEffect(() => {
    fetch('/nagpur.geojson')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error('Failed to load geojson', err));
  }, []);

  useEffect(() => {
    if (mapRef.current && onMapReady) {
      onMapReady(mapRef.current);
    }
  }, [mapRef.current, onMapReady]);

  const getColor = (f) => {
    if (f >= 5.0) return '#8b0000'; // Critical - Dark Red
    if (f > 1.5) return '#d73027'; // High - Red
    if (f > 1.0) return '#fc8d59'; // Moderate - Orange
    return '#1a9850'; // Safe - Green
  };

  const pointToLayer = (feature, latlng) => {
    const flu = feature.properties.fluoride;
    return L.circleMarker(latlng, {
      radius: 8,
      weight: 1,
      opacity: 1,
      fillOpacity: 0.85,
      color: '#333',
      fillColor: getColor(flu)
    });
  };

  const onEachFeature = (feature, layer) => {
    const p = feature.properties;
    const popup = `
      <div style="min-width: 200px;">
        <strong style="font-size: 14px;">${p.village}</strong><br/>
        <strong>Location:</strong> ${p.location}<br/>
        <strong>Source:</strong> ${p.sourceType}<br/>
        <strong>Fluoride:</strong> <span style="color: ${getColor(p.fluoride)}; font-weight: bold;">${p.fluoride} mg/L</span><br/>
        <strong>Category:</strong> ${p.category}<br/>
        <strong>Sample Received:</strong> ${p.sampleReceiving}<br/>
        <strong>Sample Tested:</strong> ${p.sampleTesting}
      </div>
    `;
    layer.bindPopup(popup);
    layer.on('click', () => onFeatureClick && onFeatureClick(feature));
  };

  return (
    <div style={{ height: '75vh', width: '100%' }}>
      <MapContainer 
        center={[21.15, 79.08]} 
        zoom={10} 
        style={{ height: '100%', width: '100%' }} 
        ref={mapRef}
        zoomControl={true}
      >
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {geoData && <GeoJSON data={geoData} pointToLayer={pointToLayer} onEachFeature={onEachFeature} />}
      </MapContainer>
    </div>
  );
}
