/**
 * ARGUS Centralized Brand Color Palette & Theme Tokens
 *
 * Official Brand Colors:
 * - Primary Blue: #003E8F (Primary actions, CTAs, active nav, primary progress)
 * - Dark Navy: #14243A (Structure, sidebar, primary text, prominent headers)
 * - Dark Brown: #4F3B15 (Secondary headings, supporting accents, category indicators)
 * - Golden Brown: #8F5E01 (Financial metrics, tax indicators, warnings)
 * - Warm Gold / Highlight: #FFD482 (Cost highlights, attention badges, cluster markers)
 * - Light Blue: #ADD0FF (Info cards, inactive nav text, hover backgrounds)
 */

export const ARGUS_PALETTE = {
  primaryBlue: '#003E8F',
  primaryBlueHover: '#002F6C',
  darkNavy: '#14243A',
  darkBrown: '#4F3B15',
  goldenBrown: '#8F5E01',
  goldenBrownHover: '#724B01',
  warmGold: '#FFD482',
  warmGoldHover: '#F7C665',
  lightBlue: '#ADD0FF',
  lightBlueHover: '#98C2FF',

  // Semantic canvas backgrounds
  bgApp: '#F7F9FC',
  bgCard: '#FFFFFF',
  bgFinancialCard: '#FFF2D3',
  bgHighlightCard: '#FFD482',
  bgInfoCard: '#ADD0FF',
  bgSidebar: '#14243A',

  // Borders
  borderDefault: '#E2E8F0',
  borderNavy: '#14243A',
  borderBlue: '#003E8F',
  borderGold: '#8F5E01',

  // Typography
  textPrimary: '#14243A',
  textSecondary: '#526173',
  textMuted: '#718096',
  textWhite: '#FFFFFF',
  textLink: '#003E8F',

  // Status
  statusGood: '#003E8F',
  statusWarning: '#8F5E01',
  statusAttention: '#FFD482',
  statusInfo: '#ADD0FF',
  statusError: '#B91C1C',

  // Sidebar specific
  sidebar: {
    bg: '#14243A',
    textActive: '#FFFFFF',
    bgActive: '#003E8F',
    textInactive: '#ADD0FF',
    hoverBg: 'rgba(173, 208, 255, 0.12)',
  },

  // Map markers
  map: {
    userHub: '#003E8F',
    competitor: '#8F5E01',
    cluster: '#FFD482',
    selected: '#ADD0FF',
  },

  // Country card accent roles
  countryAccents: {
    SG: '#003E8F', // Singapore: Primary Blue
    AE: '#8F5E01', // UAE: Golden Brown
    DE: '#ADD0FF', // Germany: Light Blue
  },
} as const;

export type ArgusPalette = typeof ARGUS_PALETTE;
