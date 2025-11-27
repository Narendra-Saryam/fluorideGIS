'use client';
import { useState } from 'react';

export default function SearchBar({ geojson, onSelect }) {
  const [q, setQ] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQ(value);
    
    if (value.trim() && geojson) {
      const matches = geojson.features
        .filter(f => 
          f.properties.village?.toLowerCase().includes(value.toLowerCase()) ||
          f.properties.block?.toLowerCase().includes(value.toLowerCase()) ||
          f.properties.location?.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 8);
      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = () => {
    if (!geojson) return alert('GeoJSON not loaded');
    const match = geojson.features.find(f => 
      f.properties.village?.toLowerCase() === q.trim().toLowerCase() ||
      f.properties.location?.toLowerCase().includes(q.trim().toLowerCase())
    );
    if (!match) return alert('Location not found. Try searching by village or block name.');
    onSelect(match);
    setShowSuggestions(false);
  };

  const handleSelectSuggestion = (feature) => {
    setQ(feature.properties.village || feature.properties.location);
    onSelect(feature);
    setShowSuggestions(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input 
            value={q} 
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search by village, block, or location..." 
            style={{ 
              width: '100%',
              padding: '14px 20px',
              fontSize: '15px',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '2px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '12px',
              color: '#e2e8f0',
              outline: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#60a5fa';
              e.target.style.boxShadow = '0 0 0 3px rgba(96, 165, 250, 0.1)';
            }}
            onBlur={(e) => {
              setTimeout(() => setShowSuggestions(false), 200);
              e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)';
              e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.2)';
            }}
          />
          
          {showSuggestions && suggestions.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '8px',
              background: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
              maxHeight: '300px',
              overflowY: 'auto',
              zIndex: 1000
            }}>
              {suggestions.map((feature, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectSuggestion(feature)}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    borderBottom: idx < suggestions.length - 1 ? '1px solid rgba(148, 163, 184, 0.1)' : 'none',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(96, 165, 250, 0.1)'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  <div style={{ fontWeight: '600', color: '#e2e8f0', marginBottom: '4px' }}>
                    {feature.properties.village}
                  </div>
                  <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                    {feature.properties.location} • {feature.properties.block}
                  </div>
                  <div style={{ fontSize: '12px', color: '#60a5fa', marginTop: '4px' }}>
                    Fluoride: {feature.properties.fluoride} mg/L
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <button 
          onClick={handleSearch}
          style={{
            padding: '14px 32px',
            fontSize: '15px',
            fontWeight: '600',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.4)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 10px 15px -3px rgba(59, 130, 246, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 6px -1px rgba(59, 130, 246, 0.4)';
          }}
        >
          🔍 Search Location
        </button>
      </div>
    </div>
  );
}
