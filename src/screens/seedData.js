// ============================================================
//  GemVault — Seed Data (INR / Indian Market)
// ============================================================
import { GemEmojis } from '../theme';

// 1 USD ≈ 83 INR (approximate conversion)
export const LISTINGS = [
  {
    id: '1', name: 'Natural Burmese Ruby', type: 'Ruby',
    emoji: '🔴', weight: '3.2', clarity: 'VS',
    price: 1278200, seller: 'Maria K.', badge: 'certified',
    origin: 'Burma (Myanmar)', cut: 'Oval Cut',
    cert: 'GIA Certified', status: 'active',
    description: 'Exceptional unheated Burmese ruby with vivid pigeon blood color. Rich saturation with natural silk inclusions confirming origin.',
    createdAt: '2026-05-20', offers: 4,
    gstNumber: 'GST27AAAAA0000A1Z5', billNumber: 'BILL-2026-001',
  },
  {
    id: '2', name: 'Colombian Emerald', type: 'Emerald',
    emoji: '🟢', weight: '2.8', clarity: 'VVS',
    price: 738700, seller: 'James T.', badge: 'premium',
    origin: 'Colombia', cut: 'Emerald Cut',
    cert: 'Gubelin Certified', status: 'active',
    description: 'Fine Colombian emerald with strong vivid green color and minor clarity characteristics typical of the finest Colombian material.',
    createdAt: '2026-05-21', offers: 2,
    gstNumber: 'GST07BBBBB1111B2Z6', billNumber: 'BILL-2026-002',
  },
  {
    id: '3', name: 'Ceylon Sapphire', type: 'Sapphire',
    emoji: '🔵', weight: '4.1', clarity: 'FL',
    price: 1826000, seller: 'Priya S.', badge: 'certified',
    origin: 'Sri Lanka', cut: 'Cushion Cut',
    cert: 'AGL Certified', status: 'active',
    description: 'Magnificent unheated Ceylon sapphire with royal blue color and exceptional clarity. One of the finest examples of Sri Lankan origin.',
    createdAt: '2026-05-22', offers: 7,
    gstNumber: '', billNumber: '',
  },
  {
    id: '4', name: 'Round Brilliant Diamond', type: 'Diamond',
    emoji: '💍', weight: '1.5', clarity: 'IF',
    price: 1535500, seller: 'Robert A.', badge: 'new',
    origin: 'South Africa', cut: 'Round Brilliant',
    cert: 'GIA Certified', status: 'active',
    description: 'Exceptional D-color Internally Flawless round brilliant diamond with extraordinary brilliance. Triple excellent cut grade.',
    createdAt: '2026-05-23', offers: 3,
    gstNumber: 'GST29CCCCC2222C3Z7', billNumber: 'BILL-2026-004',
  },
  {
    id: '5', name: 'Purple Amethyst Cluster', type: 'Amethyst',
    emoji: '🟣', weight: '12', clarity: 'SI',
    price: 73870, seller: 'Sofia M.', badge: 'hot',
    origin: 'Brazil', cut: 'Rough / Uncut',
    cert: 'None', status: 'active',
    description: 'Beautiful natural amethyst crystal cluster with deep violet color. Perfect for collectors and crystal enthusiasts.',
    createdAt: '2026-05-24', offers: 1,
    gstNumber: '', billNumber: '',
  },
  {
    id: '6', name: 'South Sea Pearl Set', type: 'Pearl',
    emoji: '⚪', weight: '—', clarity: 'AAA',
    price: 265600, seller: 'Anna L.', badge: 'new',
    origin: 'Australia', cut: '—',
    cert: 'None', status: 'active',
    description: 'Matched set of 3 South Sea pearls with exceptional luster and overtone. 13-14mm diameter with minimal blemishes.',
    createdAt: '2026-05-25', offers: 0,
    gstNumber: '', billNumber: '',
  },
];

export const MY_STONES = [
  {
    id: '101', name: 'Unheated Ruby Rough', type: 'Ruby',
    emoji: '🔴', weight: '5', price: 664000,
    status: 'active', offers: 3, createdAt: '2026-05-18',
    clarity: 'VS', cert: 'None', origin: 'Burma (Myanmar)',
    cut: 'Rough / Uncut', description: 'Natural unheated ruby rough from Burma.',
    gstNumber: 'GST27DDDDD3333D4Z8', billNumber: 'BILL-2026-101',
  },
  {
    id: '102', name: 'Blue Sapphire Oval', type: 'Sapphire',
    emoji: '🔵', weight: '2.2', price: 373500,
    status: 'pending', offers: 0, createdAt: '2026-05-24',
    clarity: 'VVS', cert: 'GIA Certified', origin: 'Sri Lanka',
    cut: 'Oval Cut', description: 'Beautiful heated blue sapphire.',
    gstNumber: '', billNumber: 'BILL-2026-102',
  },
  {
    id: '103', name: 'Diamond Solitaire', type: 'Diamond',
    emoji: '💍', weight: '0.9', price: 514600,
    status: 'sold', offers: 0, soldPrice: 481400, createdAt: '2026-05-10',
    clarity: 'FL', cert: 'GIA Certified', origin: 'South Africa',
    cut: 'Round Brilliant', description: 'Excellent cut G-color diamond.',
    gstNumber: 'GST33EEEEE4444E5Z9', billNumber: 'BILL-2026-103',
  },
];

export const ADMIN_USERS = [
  { id: 'u1', name: 'Maria K.',  email: 'maria@email.com',  role: 'seller', listings: 4, joined: 'Mar 2026', verified: true,  totalEarned: 2357200 },
  { id: 'u2', name: 'James T.',  email: 'james@email.com',  role: 'seller', listings: 2, joined: 'Apr 2026', verified: true,  totalEarned: 1020900 },
  { id: 'u3', name: 'Priya S.',  email: 'priya@email.com',  role: 'seller', listings: 1, joined: 'May 2026', verified: false, totalEarned: 0 },
  { id: 'u4', name: 'Robert A.', email: 'robert@email.com', role: 'buyer',  listings: 0, joined: 'Feb 2026', verified: true,  totalEarned: 0 },
  { id: 'u5', name: 'Sofia M.',  email: 'sofia@email.com',  role: 'seller', listings: 3, joined: 'Jan 2026', verified: true,  totalEarned: 647400 },
  { id: 'u6', name: 'Anna L.',   email: 'anna@email.com',   role: 'seller', listings: 1, joined: 'May 2026', verified: false, totalEarned: 0 },
];

export const PENDING_SUBMISSIONS = [
  {
    id: 'p1', name: 'Kashmir Sapphire', type: 'Sapphire', emoji: '🔵',
    weight: '3.5', price: 2905000, clarity: 'FL', cert: 'GIA Certified',
    user: 'Priya S.', email: 'priya@email.com',
    origin: 'India', cut: 'Cushion Cut',
    description: 'Extremely rare Kashmir sapphire with cornflower blue color.',
    submitted: '2026-05-27',
    gstNumber: 'GST06FFFFF5555F6Z1', billNumber: 'BILL-2026-P01',
  },
  {
    id: 'p2', name: 'Pigeon Blood Ruby', type: 'Ruby', emoji: '🔴',
    weight: '1.8', price: 996000, clarity: 'VS', cert: 'None',
    user: 'New Seller', email: 'newseller@email.com',
    origin: 'Burma (Myanmar)', cut: 'Oval Cut',
    description: 'Natural pigeon blood ruby with vivid red color.',
    submitted: '2026-05-27',
    gstNumber: '', billNumber: '',
  },
];

export const ACTIVITY_FEED = [
  { id: 1, icon: '💎', text: 'New listing: Kashmir Sapphire by Priya S.', time: '2 min ago', type: 'new_listing' },
  { id: 2, icon: '✅', text: 'Colombian Emerald approved and live', time: '1 hr ago', type: 'approved' },
  { id: 3, icon: '👤', text: 'New user registered: newuser@email.com', time: '3 hr ago', type: 'new_user' },
  { id: 4, icon: '💰', text: 'Sale completed: Ceylon Sapphire — ₹18,26,000', time: '5 hr ago', type: 'sale' },
  { id: 5, icon: '⭐', text: '5-star review from buyer Robert A.', time: '8 hr ago', type: 'review' },
  { id: 6, icon: '💎', text: 'New listing: Pigeon Blood Ruby by New Seller', time: '2 hr ago', type: 'new_listing' },
];

export const MOCK_USERS = [
  { id: 'admin1', email: 'admin@gemvault.com', password: 'admin123', firstName: 'Admin', lastName: 'GemVault', role: 'admin', listings: 0, sold: 0, earned: 0, phone: '' },
  { id: 'demo1',  email: 'demo@user.com', password: 'demo1234', firstName: 'Demo', lastName: 'User', role: 'seller', listings: 2, sold: 1, earned: 481400, phone: '+91 98765 43210' },
];

export const GEM_TYPES = ['Diamond','Emerald','Ruby','Sapphire','Amethyst','Pearl','Topaz','Opal','Other'];
export const CLARITIES = ['Flawless (FL)','Internally Flawless (IF)','VVS','VS','SI','Included (I)'];
export const CUTS = ['Round Brilliant','Princess Cut','Oval Cut','Cushion Cut','Emerald Cut','Pear Shaped','Marquise','Rough / Uncut'];
export const ORIGINS = ['Unknown','Burma (Myanmar)','Colombia','Sri Lanka','Brazil','India','Africa','Australia','Russia'];
export const CERTIFICATIONS = ['None','GIA Certified','IGI Certified','AGL Certified','Gubelin Certified','Other'];
export const BADGE_COLORS = { certified: '#27AE60', premium: '#9B59B6', new: '#2980B9', hot: '#F39C12' };

// ── Currency helper ─────────────────────────────────────────
export const formatINR = (amount) => {
  if (!amount && amount !== 0) return '—';
  const num = parseFloat(amount);
  if (isNaN(num)) return '—';
  // Indian number format: 1,00,000
  const parts = num.toFixed(0).split('');
  if (parts.length <= 3) return '₹' + parts.join('');
  const last3 = parts.splice(parts.length - 3);
  const remaining = parts.join('');
  let formatted = '';
  for (let i = remaining.length - 1, count = 0; i >= 0; i--, count++) {
    if (count > 0 && count % 2 === 0) formatted = ',' + formatted;
    formatted = remaining[i] + formatted;
  }
  return '₹' + formatted + ',' + last3.join('');
};
