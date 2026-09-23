import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { usePlan } from '../../context/PlanContext';
import { COMPETITOR_DATA } from '../../data/competitorData';
import { COUNTRIES_DATA } from '../../data/countriesData';
import { Info } from 'lucide-react';

export const CompetitorLandscapeView: React.FC = () => {
  const { selectedCountryCode, setSelectedCountryCode, activePlan } = usePlan();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [activeMarkerInfo, setActiveMarkerInfo] = useState<{
    name: string;
    industry: string;
    area: string;
    sourceType: string;
    type: 'user' | 'competitor' | 'cluster';
  } | null>(null);

  const country = COUNTRIES_DATA[selectedCountryCode] || COUNTRIES_DATA['SG'];
  const landscape = COMPETITOR_DATA[selectedCountryCode] || COMPETITOR_DATA['SG'];

  const filteredCompetitors = selectedIndustry === 'All'
    ? landscape.competitors
    : landscape.competitors.filter((c) =>
        c.industry.toLowerCase().includes(selectedIndustry.toLowerCase())
      );

  // Initialize Leaflet Map (Dark Navy Style: CartoDB Dark Matter)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: false,
      }).setView([landscape.centerLat, landscape.centerLng], landscape.defaultZoom);

      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        {
          maxZoom: 19,
          subdomains: 'abcd',
        }
      ).addTo(map);

      const layers = L.layerGroup().addTo(map);
      layerGroupRef.current = layers;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        layerGroupRef.current = null;
      }
    };
  }, []);

  // Update map when country or filter changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layers = layerGroupRef.current;
    if (!map || !layers) return;

    layers.clearLayers();

    // Pan map to selected country
    map.flyTo([landscape.centerLat, landscape.centerLng], landscape.defaultZoom, {
      duration: 1.2,
      easeLinearity: 0.25,
    });

    // 1. Draw Business Clusters with Warm Gold (#FFD482)
    landscape.clusters.forEach((cluster) => {
      const circle = L.circle([cluster.lat, cluster.lng], {
        radius: cluster.radiusMeters,
        color: '#FFD482',
        weight: 2,
        fillColor: '#FFD482',
        fillOpacity: 0.18,
        dashArray: '5, 5',
      });

      circle.bindTooltip(
        `<div style="font-size: 11px; font-weight: 700; color: #FFD482;">${cluster.name}</div><div style="font-size: 10px; color: #E2E8F0;">${cluster.companiesCount}+ Companies</div>`,
        { permanent: false, direction: 'center', className: 'dark-tooltip' }
      );

      circle.on('click', () => {
        setActiveMarkerInfo({
          name: cluster.name,
          industry: 'Multi-industry Cluster',
          area: cluster.description,
          sourceType: 'Official Innovation Zone',
          type: 'cluster',
        });
      });

      circle.addTo(layers);
    });

    // 2. Draw Primary Blue (#003E8F) User Proposed Hub
    const userIcon = L.divIcon({
      className: 'user-hub-pin',
      html: `
        <div style="position: relative; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background: rgba(0, 62, 143, 0.35); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 15px; height: 15px; border-radius: 50%; background: #003E8F; border: 2.5px solid #FFFFFF; box-shadow: 0 0 10px rgba(0, 62, 143, 0.9);"></div>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    const userMarker = L.marker([landscape.intendedHub.lat, landscape.intendedHub.lng], {
      icon: userIcon,
      zIndexOffset: 1000,
    });

    userMarker.bindPopup(`
      <div style="font-size: 12px; font-family: sans-serif; padding: 4px;">
        <div style="color: #ADD0FF; font-weight: 800; font-size: 10px; text-transform: uppercase;">YOUR INTENDED EXPANSION HUB</div>
        <div style="font-weight: 800; font-size: 13px; color: #FFFFFF; margin-top: 2px;">${activePlan.profile.name}</div>
        <div style="color: #E2E8F0; font-size: 11px; margin-top: 2px;">${landscape.intendedHub.area}</div>
      </div>
    `);

    userMarker.on('click', () => {
      setActiveMarkerInfo({
        name: activePlan.profile.name,
        industry: activePlan.profile.industry,
        area: landscape.intendedHub.area,
        sourceType: 'Intended Expansion Location',
        type: 'user',
      });
    });

    userMarker.addTo(layers);

    // 3. Draw Golden Brown (#8F5E01) Competitor / Peer Pins
    filteredCompetitors.forEach((comp) => {
      const compIcon = L.divIcon({
        className: 'competitor-pin',
        html: `
          <div style="width: 18px; height: 18px; display: flex; align-items: center; justify-content: center;">
            <div style="width: 11px; height: 11px; border-radius: 50%; background: #8F5E01; border: 1.5px solid #FFFFFF; box-shadow: 0 0 8px rgba(143, 94, 1, 0.7);"></div>
          </div>
        `,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      const compMarker = L.marker([comp.lat, comp.lng], { icon: compIcon });

      compMarker.bindPopup(`
        <div style="font-size: 12px; font-family: sans-serif; padding: 4px;">
          <div style="color: #FFD482; font-weight: 800; font-size: 10px; text-transform: uppercase;">COMPETITOR / PEER ENTITY</div>
          <div style="font-weight: 800; font-size: 13px; color: #FFFFFF; margin-top: 2px;">${comp.name}</div>
          <div style="color: #CBD5E1; font-size: 11px; margin-top: 2px;">${comp.area}</div>
          <div style="color: #ADD0FF; font-size: 10px; margin-top: 4px;">Distance: ${comp.distanceKm} km from hub</div>
          <div style="color: #FFD482; font-size: 10px; margin-top: 4px; font-style: italic;">Prototype competitor data</div>
        </div>
      `);

      compMarker.on('click', () => {
        setActiveMarkerInfo({
          name: comp.name,
          industry: comp.industry,
          area: comp.area,
          sourceType: comp.sourceType,
          type: 'competitor',
        });
      });

      compMarker.addTo(layers);
    });
  }, [selectedCountryCode, selectedIndustry, landscape]);

  return (
    <div>
      {/* Top Header Bar */}
      <div className="flex-between" style={{ marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-dark-navy)' }}>
            Competitor & Ecosystem Landscape
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Spatial mapping of business clusters, regional tech hubs, and industry density in <strong>{country.name}</strong>.
          </p>
        </div>

        {/* Country & Industry Fast Filter Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['SG', 'AE', 'DE'].map((code) => {
              const c = COUNTRIES_DATA[code];
              const isSelected = selectedCountryCode === code;
              return (
                <button
                  key={code}
                  type="button"
                  style={{
                    padding: '7px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: isSelected ? '1px solid var(--color-primary-blue)' : '1px solid var(--border-color)',
                    backgroundColor: isSelected ? 'var(--color-primary-blue)' : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                    fontWeight: isSelected ? 800 : 500,
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                  onClick={() => setSelectedCountryCode(code)}
                >
                  <span>{c.flag}</span>
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>

          <select
            className="form-select"
            style={{ width: 'auto', padding: '7px 14px', fontSize: '12px', backgroundColor: '#FFFFFF', color: 'var(--text-primary)' }}
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
          >
            <option value="All">All Industries</option>
            <option value="SaaS">Software / SaaS</option>
            <option value="FinTech">FinTech</option>
            <option value="Logistics">Logistics</option>
            <option value="E-commerce">E-commerce</option>
          </select>
        </div>
      </div>

      {/* Main Grid: 68% Interactive Map + 32% Intelligence Panel */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 68%) minmax(0, 32%)',
          gap: '20px',
          height: '660px',
        }}
      >
        {/* Left: 68% Dark Navy Map Viewport */}
        <div
          className="argus-card"
          style={{
            padding: 0,
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#14243A',
            border: '1px solid var(--border-color)',
          }}
        >
          {/* Map Legend Overlay */}
          <div
            style={{
              position: 'absolute',
              top: '14px',
              left: '14px',
              zIndex: 1000,
              backgroundColor: 'rgba(20, 36, 58, 0.92)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(173, 208, 255, 0.25)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              fontSize: '11px',
              fontWeight: 600,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#003E8F', border: '1.5px solid #FFFFFF' }}></div>
              <span style={{ color: '#FFFFFF' }}>Your Hub</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#8F5E01', border: '1px solid #FFFFFF' }}></div>
              <span style={{ color: '#FFFFFF' }}>Competitor</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '1.5px dashed #FFD482', backgroundColor: 'rgba(255, 212, 130, 0.25)' }}></div>
              <span style={{ color: '#FFFFFF' }}>Business Cluster</span>
            </div>
          </div>

          {/* Interactive Leaflet Map Div */}
          <div ref={mapContainerRef} style={{ width: '100%', height: '100%', minHeight: '500px' }} />

          {/* Selected Marker Floating Card */}
          {activeMarkerInfo && (
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                right: '16px',
                zIndex: 1000,
                backgroundColor: '#FFFFFF',
                border: '2px solid var(--color-light-blue)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--color-dark-navy)' }}>{activeMarkerInfo.name}</strong>
                  <span className="tag-chip" style={{ fontSize: '10px', backgroundColor: 'var(--color-light-blue)', color: 'var(--color-dark-navy)' }}>
                    {activeMarkerInfo.industry}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Location: {activeMarkerInfo.area}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    fontSize: '10px',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    backgroundColor: activeMarkerInfo.type === 'user' ? 'rgba(0, 62, 143, 0.1)' : 'var(--color-financial-bg)',
                    color: activeMarkerInfo.type === 'user' ? 'var(--color-primary-blue)' : 'var(--color-golden-brown)',
                    fontWeight: 700,
                  }}
                >
                  {activeMarkerInfo.sourceType}
                </span>
                <button
                  type="button"
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    marginTop: '2px',
                    marginLeft: 'auto',
                  }}
                  onClick={() => setActiveMarkerInfo(null)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: 32% Intelligence Panel */}
        <div
          className="argus-card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflowY: 'auto',
            backgroundColor: '#FFFFFF',
          }}
        >
          <div>
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', marginBottom: '14px' }}>
              <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-primary-blue)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                LOCAL CLUSTER METRICS
              </div>
              <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-dark-navy)', marginTop: '2px' }}>
                {country.flag} {country.name} Density
              </h2>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid-2" style={{ gap: '10px', marginBottom: '16px' }}>
              <div style={{ backgroundColor: 'var(--bg-card-subtle)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Hubs</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-dark-navy)', marginTop: '2px' }}>
                  {landscape.clusters.length} Districts
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-card-subtle)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Market Density</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary-blue)', marginTop: '2px' }}>
                  High
                </div>
              </div>
            </div>

            {/* Major Business Clusters List */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Major Business Clusters
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {landscape.clusters.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--bg-card-subtle)',
                      border: '1px solid var(--border-color)',
                      fontSize: '12px',
                    }}
                  >
                    <div className="flex-between">
                      <strong style={{ color: 'var(--color-primary-blue)' }}>{c.name}</strong>
                      <span className="tag-chip" style={{ fontSize: '10px' }}>{c.companiesCount}+ Cos</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {c.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Competitor / Business Locations */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Nearby Competitors & Peers ({filteredCompetitors.length})
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {filteredCompetitors.map((comp) => (
                  <div
                    key={comp.id}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '6px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--border-color)',
                      fontSize: '12px',
                    }}
                  >
                    <div className="flex-between">
                      <strong style={{ color: 'var(--text-primary)' }}>{comp.name}</strong>
                      <span className="text-mono" style={{ fontSize: '11px', color: 'var(--color-golden-brown)', fontWeight: 700 }}>
                        {comp.distanceKm} km
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {comp.area} • {comp.industry}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mandatory Prototype Label & Disclaimer in Financial Tint */}
          <div
            className="card-financial"
            style={{
              padding: '10px 12px',
              borderRadius: '6px',
              fontSize: '11px',
              marginTop: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Info size={14} color="var(--color-golden-brown)" style={{ flexShrink: 0 }} />
            <span>
              <strong>Transparency Note:</strong> Competitor pins display <em>Prototype competitor data</em> for strategic simulation and clustering analysis.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
