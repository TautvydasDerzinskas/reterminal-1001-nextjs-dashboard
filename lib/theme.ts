// ─────────────────────────────────────────────────────────────────────────────
// Dashboard theme – all design tokens in one place.
// Only plain values are used (no CSS variables) because the JSX is rendered
// via next/og ImageResponse which only supports inline styles.
// ─────────────────────────────────────────────────────────────────────────────

export const theme = {
  // Canvas
  canvas: {
    width: '800px',
    height: '480px',
  },

  // Colors
  colors: {
    background: '#ffffff',
    text: '#000000',
    textInverted: '#ffffff',
    cardBackground: '#ffffff',
    cardBackgroundDark: '#000000',
    cardBorder: '#000000',
    badgeBackground: '#000000',
    badgeText: '#ffffff',
  },

  // Typography
  fontSizes: {
    sm: '14px',
    md: '16px',
    lg: '20px',
    xl: '24px',
  },

  fontWeights: {
    normal: 'normal' as const,
    bold: 'bold' as const,
  },

  // Spacing
  padding: {
    card: '16px',
    canvas: '20px',
    badge: '6px 20px',
    iconLabel: '5px',
  },

  // Shape
  radius: {
    card: '8px',
    badge: '8px',
  },

  // Gaps / margins
  gap: {
    cards: '16px',
    cardBottom: '16px',
    iconRow: '10px',
  },

  // Borders
  border: {
    card: '1px solid #000000',
  },

  // Icon sizes
  iconSize: {
    sm: 16,
    md: 22,
  },
} as const;
