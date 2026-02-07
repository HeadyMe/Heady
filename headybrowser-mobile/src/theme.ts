/**
 * HeadyBrowser Mobile — Sacred Geometry Design Tokens
 * Matches headybuddy/DESIGN.md brand tokens
 */

export const COLORS = {
  bg: '#0a0e17',
  surface: '#111827',
  border: '#1e293b',
  cyan: '#22d3ee',
  emerald: '#34d399',
  amber: '#fbbf24',
  magenta: '#c084fc',
  text: '#e2e8f0',
  muted: '#64748b',
  red: '#f87171',
  white: '#ffffff',
  black: '#000000',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  sacred: 20, // 1.25rem sacred radius
};

export const RADIUS = {
  sm: 8,
  md: 12,
  sacred: 20, // 1.25rem
  pill: 9999,
};

export const FONTS = {
  regular: 'System',
  bold: 'System',
  mono: 'monospace',
  sizes: {
    caption: 11,
    body: 13,
    header: 14,
    title: 18,
    large: 24,
  },
};

export const SHADOWS = {
  card: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  glow: {
    shadowColor: COLORS.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
};
