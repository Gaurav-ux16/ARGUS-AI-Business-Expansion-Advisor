export interface BusinessCluster {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  description: string;
  companiesCount: number;
}

export interface CompetitorLocation {
  id: string;
  name: string;
  industry: string;
  area: string;
  lat: number;
  lng: number;
  distanceKm: number;
  sourceType: string;
  densityLevel: 'High' | 'Medium' | 'Emerging';
  notes: string;
}

export interface CountryCompetitorLandscape {
  countryCode: string;
  countryName: string;
  centerLat: number;
  centerLng: number;
  defaultZoom: number;
  intendedHub: {
    name: string;
    lat: number;
    lng: number;
    area: string;
  };
  clusters: BusinessCluster[];
  competitors: CompetitorLocation[];
}

export const COMPETITOR_DATA: Record<string, CountryCompetitorLandscape> = {
  SG: {
    countryCode: 'SG',
    countryName: 'Singapore',
    centerLat: 1.32,
    centerLng: 103.82,
    defaultZoom: 12,
    intendedHub: {
      name: 'Proposed Singapore Entity Hub',
      lat: 1.2795,
      lng: 103.8545,
      area: 'Marina Bay Financial Centre (CBD)',
    },
    clusters: [
      {
        id: 'sg_c1',
        name: 'Central Business District (CBD)',
        lat: 1.283,
        lng: 103.851,
        radiusMeters: 1800,
        description: 'Global banking, fintech, regional enterprise SaaS headquarters, and VC funds.',
        companiesCount: 420,
      },
      {
        id: 'sg_c2',
        name: 'One-North Innovation District',
        lat: 1.2995,
        lng: 103.7875,
        radiusMeters: 1500,
        description: 'Biopolis, Fusionopolis & LaunchPad @ one-north. Deep tech, AI, and biotech hub.',
        companiesCount: 285,
      },
      {
        id: 'sg_c3',
        name: 'Changi Business Park',
        lat: 1.334,
        lng: 103.963,
        radiusMeters: 1600,
        description: 'Enterprise technology centers, logistics platforms, and financial software back-ends.',
        companiesCount: 160,
      },
    ],
    competitors: [
      {
        id: 'sg_cmp_1',
        name: 'CloudSync APAC Hub',
        industry: 'Software / SaaS',
        area: 'Raffles Place, Downtown Core',
        lat: 1.2845,
        lng: 103.8515,
        distanceKm: 0.8,
        sourceType: 'Prototype competitor data',
        densityLevel: 'High',
        notes: 'Regional B2B workflow and metrics optimization peer.',
      },
      {
        id: 'sg_cmp_2',
        name: 'OmniData Singapore',
        industry: 'FinTech',
        area: 'Marina Bay Financial Centre Tower 2',
        lat: 1.2805,
        lng: 103.8535,
        distanceKm: 0.2,
        sourceType: 'Prototype competitor data',
        densityLevel: 'High',
        notes: 'Enterprise payment aggregation and cross-border API infrastructure.',
      },
      {
        id: 'sg_cmp_3',
        name: 'VentureScale AI',
        industry: 'AI / Software',
        area: 'LaunchPad @ one-north',
        lat: 1.298,
        lng: 103.7865,
        distanceKm: 8.4,
        sourceType: 'Prototype competitor data',
        densityLevel: 'High',
        notes: 'Specialized enterprise machine-learning pipeline provider.',
      },
      {
        id: 'sg_cmp_4',
        name: 'Nexus Trade Systems',
        industry: 'Logistics',
        area: 'Changi Business Park Crescent',
        lat: 1.3325,
        lng: 103.964,
        distanceKm: 14.1,
        sourceType: 'Prototype competitor data',
        densityLevel: 'Medium',
        notes: 'Regional supply chain visibility and customs clearing software.',
      },
      {
        id: 'sg_cmp_5',
        name: 'Straits Advisory Labs',
        industry: 'Consulting / Professional Services',
        area: 'Tanjong Pagar',
        lat: 1.2755,
        lng: 103.8445,
        distanceKm: 1.3,
        sourceType: 'Prototype competitor data',
        densityLevel: 'High',
        notes: 'ASEAN expansion corporate secretarial & advisory firm.',
      },
    ],
  },

  AE: {
    countryCode: 'AE',
    countryName: 'United Arab Emirates',
    centerLat: 25.17,
    centerLng: 55.27,
    defaultZoom: 12,
    intendedHub: {
      name: 'Proposed UAE Freezone Office',
      lat: 25.2048,
      lng: 55.2708,
      area: 'DIFC (Dubai International Financial Centre)',
    },
    clusters: [
      {
        id: 'ae_c1',
        name: 'DIFC & Downtown Dubai',
        lat: 25.2048,
        lng: 55.2708,
        radiusMeters: 2000,
        description: 'Fintech hive, investment banks, enterprise software, common law regulatory sandbox.',
        companiesCount: 390,
      },
      {
        id: 'ae_c2',
        name: 'DMCC (Jumeirah Lakes Towers)',
        lat: 25.074,
        lng: 55.143,
        radiusMeters: 2200,
        description: 'Global commodities, tech crypto centre, international trade companies.',
        companiesCount: 520,
      },
      {
        id: 'ae_c3',
        name: 'Dubai Internet City (DIC)',
        lat: 25.097,
        lng: 55.168,
        radiusMeters: 1700,
        description: 'Regional EMEA headquarters for software, cloud, and digital platforms.',
        companiesCount: 310,
      },
    ],
    competitors: [
      {
        id: 'ae_cmp_1',
        name: 'DesertCloud MENA',
        industry: 'Software / SaaS',
        area: 'Dubai Internet City Building 3',
        lat: 25.099,
        lng: 25.171,
        distanceKm: 16.2,
        sourceType: 'Prototype competitor data',
        densityLevel: 'High',
        notes: 'Regional cloud management and ERP software provider.',
      },
      {
        id: 'ae_cmp_2',
        name: 'PayOasis FinTech',
        industry: 'FinTech',
        area: 'DIFC Gate Precinct 4',
        lat: 25.207,
        lng: 55.273,
        distanceKm: 0.4,
        sourceType: 'Prototype competitor data',
        densityLevel: 'High',
        notes: 'Payment gateway and multi-currency business accounts.',
      },
      {
        id: 'ae_cmp_3',
        name: 'GulfFlow Logistics Digital',
        industry: 'Logistics',
        area: 'JAFZA Freezone North',
        lat: 24.998,
        lng: 55.087,
        distanceKm: 28.5,
        sourceType: 'Prototype competitor data',
        densityLevel: 'Medium',
        notes: 'Freight forwarding and automated customs compliance.',
      },
      {
        id: 'ae_cmp_4',
        name: 'FalconTrade Solutions',
        industry: 'E-commerce',
        area: 'DMCC Silver Tower JLT',
        lat: 25.072,
        lng: 55.142,
        distanceKm: 18.0,
        sourceType: 'Prototype competitor data',
        densityLevel: 'High',
        notes: 'B2B cross-border marketplace and wholesale supply platform.',
      },
    ],
  },

  DE: {
    countryCode: 'DE',
    countryName: 'Germany',
    centerLat: 52.515,
    centerLng: 13.4,
    defaultZoom: 12,
    intendedHub: {
      name: 'Proposed Germany GmbH Office',
      lat: 52.52,
      lng: 13.405,
      area: 'Berlin Mitte (Central Tech District)',
    },
    clusters: [
      {
        id: 'de_c1',
        name: 'Berlin Mitte / Silicon Allee',
        lat: 52.525,
        lng: 13.395,
        radiusMeters: 2200,
        description: 'Vibrant startup corridor, European SaaS hubs, AI labs, and VC incubators.',
        companiesCount: 460,
      },
      {
        id: 'de_c2',
        name: 'Kreuzberg / Factory Berlin',
        lat: 52.498,
        lng: 13.44,
        radiusMeters: 1800,
        description: 'Digital creator economy, tech co-working spaces, and international engineering talent.',
        companiesCount: 320,
      },
      {
        id: 'de_c3',
        name: 'Adlershof Technology Park',
        lat: 52.433,
        lng: 13.535,
        radiusMeters: 2000,
        description: 'WISTA science and technology cluster, photonics, renewable energy, and robotics.',
        companiesCount: 210,
      },
    ],
    competitors: [
      {
        id: 'de_cmp_1',
        name: 'BavariaMetrics GmbH',
        industry: 'Software / SaaS',
        area: 'Berlin Mitte, Friedrichstraße',
        lat: 52.518,
        lng: 13.388,
        distanceKm: 1.2,
        sourceType: 'Prototype competitor data',
        densityLevel: 'High',
        notes: 'Enterprise reporting software compliant with German GoBD and EU GDPR.',
      },
      {
        id: 'de_cmp_2',
        name: 'KreditFlow Digital',
        industry: 'FinTech',
        area: 'Unter den Linden, Mitte',
        lat: 52.517,
        lng: 13.392,
        distanceKm: 0.9,
        sourceType: 'Prototype competitor data',
        densityLevel: 'High',
        notes: 'BaFin-regulated corporate treasury and factoring automation.',
      },
      {
        id: 'de_cmp_3',
        name: 'RheinLogistik Systems',
        industry: 'Logistics',
        area: 'Westhafen Logistics Hub',
        lat: 52.535,
        lng: 13.338,
        distanceKm: 4.8,
        sourceType: 'Prototype competitor data',
        densityLevel: 'Medium',
        notes: 'Central Europe intermodal cargo tracking and warehousing software.',
      },
      {
        id: 'de_cmp_4',
        name: 'Factory AI Labs',
        industry: 'AI / Software',
        area: 'Lohmühlenstraße, Kreuzberg',
        lat: 52.493,
        lng: 13.445,
        distanceKm: 4.1,
        sourceType: 'Prototype competitor data',
        densityLevel: 'High',
        notes: 'Deep learning models for industrial engineering applications.',
      },
    ],
  },
};
