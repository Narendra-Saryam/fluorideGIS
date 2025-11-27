"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";

const MapComponent = dynamic(() => import("../components/MapComponent"), { ssr: false });

export default function Page() {
  const [geojson, setGeojson] = useState(null);
  const [selected, setSelected] = useState(null);
  const [mapRef, setMapRef] = useState(null);

  useEffect(() => {
    fetch("/nagpur.geojson").then(r => r.json()).then(data => setGeojson(data));
  }, []);

  const handleSelect = (feature) => {
    setSelected(feature.properties);
  };

  const handleSearch = (feature) => {
    if (feature && mapRef) {
      const coords = feature.geometry.coordinates;
      mapRef.flyTo([coords[1], coords[0]], 15, { duration: 1.5 });
      handleSelect(feature);
    }
  };

  return (
    <main style={{ 
      minHeight: '100vh', 
      width: '100vw', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: 0,
      margin: 0
    }}>
      {/* Header */}
      <header style={{
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
        padding: '20px 32px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: '700', 
            margin: '0 0 8px 0',
            background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Nagpur Fluoride GIS Monitoring System
          </h1>
          <p style={{ 
            margin: 0, 
            color: '#94a3b8',
            fontSize: '14px'
          }}>
            Real-time fluoride contamination tracking across Nagpur district | 602 testing locations
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ 
        padding: '24px 32px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Search Bar */}
        <div style={{
          marginBottom: '24px',
          background: 'rgba(30, 41, 59, 0.8)',
          backdropFilter: 'blur(10px)',
          padding: '20px',
          borderRadius: '16px',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
        }}>
          {geojson && <SearchBar geojson={geojson} onSelect={handleSearch} />}
        </div>

        {/* Map Container */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.6)',
          backdropFilter: 'blur(10px)',
          padding: '16px',
          borderRadius: '20px',
          border: '2px solid rgba(148, 163, 184, 0.2)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden'
        }}>
          <div style={{
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid rgba(148, 163, 184, 0.1)'
          }}>
            {geojson && <MapComponent onFeatureClick={handleSelect} onMapReady={setMapRef} />}
          </div>
        </div>

        {/* Legend */}
        <div style={{
          marginTop: '24px',
          background: 'rgba(30, 41, 59, 0.8)',
          backdropFilter: 'blur(10px)',
          padding: '20px',
          borderRadius: '16px',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          display: 'flex',
          gap: '24px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#cbd5e1' }}>Fluoride Levels:</div>
          {[
            { color: '#1a9850', label: 'Safe (<1.0 mg/L)' },
            { color: '#fc8d59', label: 'Moderate (1.0-1.5 mg/L)' },
            { color: '#d73027', label: 'High (1.5-5.0 mg/L)' },
            { color: '#8b0000', label: 'Critical (≥5.0 mg/L)' }
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: item.color,
                border: '2px solid rgba(255, 255, 255, 0.3)'
              }} />
              <span style={{ fontSize: '13px', color: '#cbd5e1' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
