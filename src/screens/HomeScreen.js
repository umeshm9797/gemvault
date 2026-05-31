// ============================================================
//  GemVault — Home / Marketplace Screen (INR Edition)
// ============================================================
import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  RefreshControl, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { Button, Card, Badge, SectionHeader, StatCard, GemChip, EmptyState } from '../components/UI';
import { Colors, Spacing, Radius, FontSize, Shadow, GemEmojis, formatINR } from '../theme';

const { width } = Dimensions.get('window');

const GEM_FILTERS = [
  { key: 'all',      name: 'All',      emoji: '💎' },
  { key: 'Diamond',  name: 'Diamond',  emoji: '💍' },
  { key: 'Emerald',  name: 'Emerald',  emoji: '🟢' },
  { key: 'Ruby',     name: 'Ruby',     emoji: '🔴' },
  { key: 'Sapphire', name: 'Sapphire', emoji: '🔵' },
  { key: 'Amethyst', name: 'Amethyst', emoji: '🟣' },
  { key: 'Pearl',    name: 'Pearl',    emoji: '⚪' },
];

const BADGE_COLOR_MAP = { certified: 'emerald', premium: 'amethyst', new: 'sapphire', hot: 'gold' };

export default function HomeScreen({ navigation }) {
  const { state } = useApp();
  const [gemFilter, setGemFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const filtered = gemFilter === 'all'
    ? state.listings
    : state.listings.filter(l => l.type === gemFilter);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.logo}>GemVault 💎</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={s.iconBtn} onPress={() => {}}>
            <Text style={{ fontSize: 18 }}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.iconBtn}>
            <Text style={{ fontSize: 18 }}>🔔</Text>
            {state.notifications > 0 && (
              <View style={s.notifDot}>
                <Text style={{ fontSize: 9, color: '#fff', fontWeight: '800' }}>{state.notifications}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.amethyst} />}
        contentContainerStyle={{ paddingBottom: Spacing.xxxl }}
      >
        {/* Hero Banner */}
        <View style={{ paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg }}>
          <LinearGradient colors={['#1A1030', '#0D0A1A']} style={s.hero}>
            <View style={s.heroGlow} />
            <Text style={s.heroLabel}>✨ लाइव मार्केटप्लेस · Live Marketplace</Text>
            <Text style={s.heroTitle}>
              अपने रत्न बेचें और{'\n'}
              <Text style={{ color: Colors.amethystLight, fontStyle: 'italic' }}>
                सर्वोत्तम मूल्य पाएं
              </Text>
            </Text>
            <Text style={s.heroSub}>
              156 सक्रिय खरीदार · Free valuation in minutes
            </Text>
            <Button
              title="💎 अपना पत्थर बेचें"
              variant="sell"
              onPress={() => navigation.navigate('Sell')}
            />
          </LinearGradient>
        </View>

        {/* Stats */}
        <View style={{ flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg }}>
          <StatCard value="₹2.4Cr" label="Paid Out"   change="↑ 18% this month" changeUp icon="💰" />
          <StatCard value="4,821"  label="Sold"        change="↑ 42 this week"   changeUp icon="💎" />
          <StatCard value="98%"    label="Satisfied"   change="↑ 1.2%"           changeUp icon="⭐" />
        </View>

        {/* Gem Filters */}
        <View style={{ paddingTop: Spacing.xl }}>
          <View style={{ paddingHorizontal: Spacing.lg, marginBottom: Spacing.md }}>
            <Text style={s.sectionLabel}>Type से Browse करें</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: Spacing.lg, gap: Spacing.sm }}>
            {GEM_FILTERS.map(g => (
              <GemChip
                key={g.key}
                emoji={g.emoji}
                name={g.name}
                active={gemFilter === g.key}
                onPress={() => setGemFilter(g.key)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Listings */}
        <View style={{ paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl }}>
          <SectionHeader title={`Recent Listings (${filtered.length})`} action="See all" />
          {filtered.length === 0
            ? <EmptyState icon="🔍" title="No listings found" subtitle="Try a different filter" />
            : filtered.map(listing => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onPress={() => navigation.navigate('ListingDetail', { listing })}
                />
              ))
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ListingCard({ listing, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={s.listingCard}>
      <View style={s.listingImg}>
        <View style={{ position: 'absolute', top: 8, left: 8 }}>
          <Badge label={listing.badge} color={BADGE_COLOR_MAP[listing.badge] || 'gray'} />
        </View>
        {/* GST verified badge */}
        {listing.gstNumber ? (
          <View style={{ position: 'absolute', top: 8, right: 8 }}>
            <Badge label="GST ✓" color="emerald" />
          </View>
        ) : null}
        <Text style={{ fontSize: 52 }}>{listing.emoji}</Text>
      </View>
      <View style={s.listingInfo}>
        <Text style={s.listingName} numberOfLines={1}>{listing.name}</Text>
        <Text style={s.listingMeta}>{listing.weight}ct · {listing.clarity} · {listing.seller}</Text>
        {listing.billNumber ? (
          <Text style={s.listingBill}>🧾 {listing.billNumber}</Text>
        ) : null}
        <View style={s.listingFooter}>
          <View>
            <Text style={s.listingPrice}>{formatINR(listing.price)}</Text>
            <Text style={{ fontSize: FontSize.xs, color: Colors.text3 }}>भारतीय रुपया (INR)</Text>
          </View>
          {listing.offers > 0 && (
            <Badge label={`${listing.offers} offers`} color="gold" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: Colors.obsidian },
  header:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  logo:          { fontSize: 20, fontWeight: '700', color: Colors.amethyst, letterSpacing: 0.5 },
  iconBtn:       { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border2, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  notifDot:      { position: 'absolute', top: -2, right: -2, width: 16, height: 16, borderRadius: 8, backgroundColor: Colors.ruby, borderWidth: 1.5, borderColor: Colors.obsidian, alignItems: 'center', justifyContent: 'center' },
  hero:          { borderRadius: 20, padding: Spacing.xl, borderWidth: 1, borderColor: 'rgba(155,89,182,0.2)', overflow: 'hidden', position: 'relative' },
  heroGlow:      { position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(155,89,182,0.15)' },
  heroLabel:     { fontSize: FontSize.xs, fontWeight: '700', color: Colors.amethyst, marginBottom: 8, letterSpacing: 0.8 },
  heroTitle:     { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.text, lineHeight: 30, marginBottom: 10 },
  heroSub:       { fontSize: FontSize.sm, color: Colors.text2, marginBottom: Spacing.lg, lineHeight: 20 },
  sectionLabel:  { fontSize: FontSize.xs, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, color: Colors.text3 },
  listingCard:   { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg, overflow: 'hidden', flexDirection: 'row', marginBottom: Spacing.md },
  listingImg:    { width: 110, backgroundColor: Colors.surface2, alignItems: 'center', justifyContent: 'center', position: 'relative', paddingVertical: Spacing.lg },
  listingInfo:   { flex: 1, padding: Spacing.md, justifyContent: 'space-between' },
  listingName:   { fontSize: FontSize.md, fontWeight: '600', color: Colors.text, marginBottom: 3 },
  listingMeta:   { fontSize: FontSize.xs, color: Colors.text3, marginBottom: 4 },
  listingBill:   { fontSize: FontSize.xs, color: Colors.saffron || '#FF9933', marginBottom: 6, fontWeight: '600' },
  listingFooter: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  listingPrice:  { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text },
});

