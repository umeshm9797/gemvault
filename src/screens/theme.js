// ============================================================
//  GemVault — Theme & Design Tokens (INR Edition)
// ============================================================
export const Colors = {
  obsidian:      '#0A0812',
  deep:          '#100D20',
  surface:       '#16122A',
  surface2:      '#1E1A34',
  surface3:      '#252040',
  border:        'rgba(255,255,255,0.08)',
  border2:       'rgba(255,255,255,0.14)',
  amethyst:      '#9B59B6',
  amethyst2:     '#7D3C98',
  amethystLight: '#C39BD3',
  emerald:       '#27AE60',
  emeraldLight:  '#58D68D',
  sapphire:      '#2980B9',
  ruby:          '#E74C3C',
  rubyLight:     '#F1948A',
  gold:          '#F39C12',
  goldLight:     '#F8C471',
  saffron:       '#FF9933',   // Indian saffron accent
  diamond:       '#ECF0F1',
  text:          '#E8E3F5',
  text2:         '#9E97B8',
  text3:         '#5A5375',
  white:         '#FFFFFF',
  black:         '#000000',
};

export const GemColors = {
  Diamond:  Colors.diamond,
  Emerald:  Colors.emerald,
  Ruby:     Colors.ruby,
  Sapphire: Colors.sapphire,
  Amethyst: Colors.amethyst,
  Pearl:    '#F0EAD6',
  Topaz:    Colors.gold,
  Opal:     '#FF6B9D',
  Other:    Colors.amethyst,
};

export const GemEmojis = {
  Diamond: '💍', Emerald: '🟢', Ruby: '🔴',
  Sapphire: '🔵', Amethyst: '🟣', Pearl: '⚪',
  Topaz: '🟡', Opal: '🌈', Other: '💎',
};

// Prices in INR (approx 1 USD = 83 INR)
export const GemPrices = {
  Diamond: 705500, Emerald: 265600, Ruby: 398400,
  Sapphire: 240700, Amethyst: 37350, Pearl: 23240,
  Topaz: 26560, Opal: 56440, Other: 41500,
};

export const Spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32,
};

export const Radius = {
  sm: 8, md: 12, lg: 16, xl: 20, round: 100,
};

export const FontSize = {
  xs: 10, sm: 12, md: 14, lg: 16, xl: 18, xxl: 22, xxxl: 28, display: 36,
};

export const Shadow = {
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  glow: {
    shadowColor: '#9B59B6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
};

// ── Currency formatter (Indian Rupee) ───────────────────────
export const formatINR = (amount) => {
  if (!amount && amount !== 0) return '—';
  const num = Math.round(parseFloat(amount));
  if (isNaN(num)) return '—';
  // Indian number system: last 3 digits, then groups of 2
  const str = num.toString();
  if (str.length <= 3) return '₹' + str;
  const last3 = str.slice(-3);
  const rest   = str.slice(0, -3);
  const formatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return '₹' + formatted + ',' + last3;
};

// GST validation helper
export const validateGST = (gst) => {
  if (!gst) return true; // optional
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstRegex.test(gst.toUpperCase());
};

export const BADGE_COLORS = {
  certified: '#27AE60', premium: '#9B59B6', new: '#2980B9', hot: '#F39C12'
};
