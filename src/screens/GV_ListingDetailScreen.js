// ============================================================
//  GemVault — Listing Detail Screen (INR Edition)
// ============================================================
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert, TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useApp } from '../context/AppContext';
import { Button, Card, Badge } from '../components/UI';
import { Colors, Spacing, Radius, FontSize, Shadow, formatINR } from '../theme';

const BADGE_COLOR_MAP = { certified:'emerald', premium:'amethyst', new:'sapphire', hot:'gold' };

export function ListingDetailScreen({ route, navigation }) {
  const { listing } = route.params;
  const { state }   = useApp();
  const [offerAmount, setOfferAmount] = useState('');
  const [showOffer,   setShowOffer]   = useState(false);

  const sendOffer = () => {
    if (!state.currentUser) {
      Alert.alert('Sign In Required', 'Please sign in to make offers', [
        { text: 'Sign In', onPress: () => navigation.navigate('Profile') },
        { text: 'Cancel' },
      ]);
      return;
    }
    const amt = parseFloat(offerAmount);
    if (!amt || amt < 1) {
      Alert.alert('Invalid Offer', 'Please enter a valid offer amount in ₹');
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      '💬 Offer Sent!',
      `Your offer of ${formatINR(amt)} has been sent to ${listing.seller}. You will be notified when they respond.`,
      [{ text: 'Great!', onPress: () => { setShowOffer(false); setOfferAmount(''); } }]
    );
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={{ color: Colors.amethyst, fontSize: 16 }}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.shareBtn}
          onPress={() => Alert.alert('Share', 'Sharing coming soon')}>
          <Text style={{ fontSize: 18 }}>🔗</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        {/* Gem Display */}
        <LinearGradient colors={['#1A1030', '#0D0A1A']} style={s.gemDisplay}>
          <View style={s.gemGlow} />
          <Text style={s.gemEmoji}>{listing.emoji}</Text>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Badge label={listing.badge} color={BADGE_COLOR_MAP[listing.badge] || 'gray'} />
            {listing.gstNumber ? <Badge label="GST Verified ✓" color="emerald" /> : null}
            {listing.billNumber ? <Badge label="Bill Available" color="gold" /> : null}
          </View>
        </LinearGradient>

        <View style={{ padding: Spacing.lg, gap: Spacing.lg }}>
          {/* Title & Price */}
          <View>
            <Text style={s.gemName}>{listing.name}</Text>
            <Text style={s.gemPrice}>{formatINR(listing.price)}</Text>
            <Text style={{ fontSize: FontSize.sm, color: Colors.text3, marginTop: 2 }}>
              भारतीय रुपया (Indian Rupee)
            </Text>
            {listing.offers > 0 && (
              <Text style={{ fontSize: FontSize.sm, color: Colors.gold, marginTop: 6 }}>
                🔥 {listing.offers} active offers
              </Text>
            )}
          </View>

          {/* Details Grid */}
          <Card>
            <Text style={s.cardTitle}>Gem Details</Text>
            <View style={s.detailGrid}>
              {[
                ['Type',    listing.type],
                ['Weight',  `${listing.weight} ct`],
                ['Clarity', listing.clarity],
                ['Cut',     listing.cut || '—'],
                ['Origin',  listing.origin || '—'],
                ['Cert',    listing.cert || 'None'],
                ['Seller',  listing.seller],
                ['Listed',  listing.createdAt],
              ].map(([label, value]) => (
                <View key={label} style={s.detailItem}>
                  <Text style={s.detailLabel}>{label}</Text>
                  <Text style={s.detailValue}>{value}</Text>
                </View>
              ))}
            </View>
          </Card>

          {/* GST & Bill Information */}
          {(listing.gstNumber || listing.billNumber) && (
            <Card style={{ borderColor: 'rgba(255,153,51,0.3)', backgroundColor: 'rgba(255,153,51,0.05)' }}>
              <Text style={[s.cardTitle, { color: '#FF9933' }]}>🧾 Tax & Billing Info</Text>
              {listing.gstNumber ? (
                <View style={s.taxRow}>
                  <Text style={s.taxLabel}>GST Number</Text>
                  <Text style={[s.taxValue, { color: '#FF9933', fontFamily: 'monospace' }]}>
                    {listing.gstNumber}
                  </Text>
                </View>
              ) : null}
              {listing.billNumber ? (
                <View style={s.taxRow}>
                  <Text style={s.taxLabel}>Bill / Invoice No.</Text>
                  <Text style={[s.taxValue, { fontFamily: 'monospace' }]}>
                    {listing.billNumber}
                  </Text>
                </View>
              ) : null}
              <View style={s.taxRow}>
                <Text style={s.taxLabel}>GST on Purchase</Text>
                <Text style={s.taxValue}>3% (as per GOI)</Text>
              </View>
              <View style={{ marginTop: Spacing.sm, padding: Spacing.sm, backgroundColor: 'rgba(255,153,51,0.08)', borderRadius: Radius.sm }}>
                <Text style={{ fontSize: FontSize.xs, color: Colors.text3, lineHeight: 16 }}>
                  ✅ This seller has provided valid GST/billing details in compliance with Indian tax regulations.
                </Text>
              </View>
            </Card>
          )}

          {/* Description */}
          {listing.description ? (
            <Card>
              <Text style={s.cardTitle}>Description</Text>
              <Text style={{ fontSize: FontSize.md, color: Colors.text2, lineHeight: 22 }}>
                {listing.description}
              </Text>
            </Card>
          ) : null}

          {/* Trust Badges */}
          <Card style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
            {[
              '🔒 Secure Payment',
              '↩️ 7-Day Returns',
              '🛡️ Buyer Protection',
              '✅ Verified Seller',
            ].map(item => (
              <View key={item} style={s.trustItem}>
                <Text style={{ fontSize: FontSize.xs, color: Colors.text2, fontWeight: '600' }}>{item}</Text>
              </View>
            ))}
          </Card>

          {/* Offer Form */}
          {showOffer && (
            <Card style={{ gap: Spacing.md }}>
              <Text style={s.cardTitle}>Make an Offer (₹)</Text>
              <Text style={{ fontSize: FontSize.sm, color: Colors.text3 }}>
                Asking price:{' '}
                <Text style={{ color: Colors.text, fontWeight: '600' }}>{formatINR(listing.price)}</Text>
              </Text>
              <View style={{ flexDirection: 'row', gap: Spacing.sm, alignItems: 'center' }}>
                <Text style={{ fontSize: FontSize.xxl, color: Colors.text3, fontWeight: '700' }}>₹</Text>
                <TextInput
                  value={offerAmount}
                  onChangeText={setOfferAmount}
                  placeholder="अपना ऑफर दर्ज करें"
                  placeholderTextColor={Colors.text3}
                  keyboardType="decimal-pad"
                  style={s.offerInput}
                />
              </View>
              <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
                <Button title="Cancel" variant="outline" onPress={() => setShowOffer(false)} style={{ flex: 1 }} size="sm" />
                <Button title="Send Offer 💬" onPress={sendOffer} style={{ flex: 1 }} size="sm" />
              </View>
            </Card>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={s.bottomBar}>
        <TouchableOpacity
          style={s.watchlistBtn}
          onPress={() => { Haptics.selectionAsync(); Alert.alert('🔖 Saved', 'Added to your watchlist'); }}>
          <Text style={{ fontSize: 20 }}>🔖</Text>
        </TouchableOpacity>
        <Button
          title={showOffer ? 'Cancel' : '💬 Offer'}
          variant={showOffer ? 'outline' : 'primary'}
          onPress={() => setShowOffer(!showOffer)}
          style={{ flex: 1 }}
        />
        <Button
          title="Buy Now"
          variant="sell"
          style={{ flex: 1 }}
          onPress={() => {
            if (!state.currentUser) {
              Alert.alert('Sign In Required', 'Please sign in to purchase', [
                { text: 'Sign In', onPress: () => navigation.navigate('Profile') },
                { text: 'Cancel' },
              ]);
            } else {
              Alert.alert(
                '🛒 Purchase',
                `Proceed to buy ${listing.name} for ${formatINR(listing.price)}?`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Purchase',
                    onPress: () => {
                      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                      Alert.alert('✅ Order Placed!', 'Payment processing. Confirmation coming shortly.');
                    },
                  },
                ]
              );
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: Colors.obsidian },
  header:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  backBtn:      { width: 60 },
  shareBtn:     { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border2, alignItems: 'center', justifyContent: 'center' },
  gemDisplay:   { marginHorizontal: Spacing.lg, borderRadius: 20, padding: Spacing.xxxl, alignItems: 'center', gap: Spacing.md, borderWidth: 1, borderColor: 'rgba(155,89,182,0.2)', position: 'relative', overflow: 'hidden' },
  gemGlow:      { position: 'absolute', top: -40, left: '50%', marginLeft: -80, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(155,89,182,0.2)' },
  gemEmoji:     { fontSize: 90 },
  gemName:      { fontSize: FontSize.xxxl, fontWeight: '700', color: Colors.text, marginBottom: 6 },
  gemPrice:     { fontSize: 34, fontWeight: '700', color: Colors.text },
  cardTitle:    { fontSize: FontSize.md, fontWeight: '700', color: Colors.text, marginBottom: Spacing.md },
  detailGrid:   { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  detailItem:   { width: '48%', backgroundColor: Colors.surface2, borderRadius: Radius.sm, padding: Spacing.md },
  detailLabel:  { fontSize: FontSize.xs, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8, color: Colors.text3, marginBottom: 3 },
  detailValue:  { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text },
  taxRow:       { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border },
  taxLabel:     { fontSize: FontSize.sm, color: Colors.text3 },
  taxValue:     { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text },
  trustItem:    { backgroundColor: Colors.surface2, borderRadius: Radius.sm, paddingHorizontal: 10, paddingVertical: 6 },
  offerInput:   { flex: 1, backgroundColor: Colors.surface2, borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.sm, color: Colors.text, fontSize: FontSize.lg, paddingVertical: 12, paddingHorizontal: 14 },
  bottomBar:    { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', gap: Spacing.sm, padding: Spacing.lg, paddingBottom: Spacing.xl, backgroundColor: 'rgba(10,8,18,0.97)', borderTopWidth: 1, borderTopColor: Colors.border },
  watchlistBtn: { width: 50, height: 50, borderRadius: Radius.md, backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border2, alignItems: 'center', justifyContent: 'center' },
});
