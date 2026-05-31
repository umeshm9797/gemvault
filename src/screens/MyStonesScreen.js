// ============================================================
//  GemVault — My Stones Screen (INR Edition)
// ============================================================
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { Badge, Button, EmptyState } from '../components/UI';
import { Colors, Spacing, Radius, FontSize, formatINR } from '../theme';

const FILTERS = ['All', 'Pending', 'Active', 'Sold', 'Offers'];
const STATUS_COLORS = { active: 'emerald', pending: 'gold', sold: 'sapphire' };

export function MyStonesScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const [filter, setFilter] = useState('All');

  const filtered = state.myStones.filter(s => {
    if (filter === 'All')    return true;
    if (filter === 'Offers') return s.offers > 0;
    return s.status.toLowerCase() === filter.toLowerCase();
  });

  const removeStone = (id) => {
    Alert.alert('Remove Listing', 'Are you sure you want to remove this listing?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => dispatch({ type: 'REMOVE_MY_STONE', payload: id }) },
    ]);
  };

  if (!state.currentUser) {
    return (
      <SafeAreaView style={s.safe} edges={['top']}>
        <View style={s.header}><Text style={s.logo}>My Stones</Text></View>
        <EmptyState icon="🔒" title="Sign in to view your stones"
          subtitle="Create an account to start selling gemstones"
          action="Sign In" onAction={() => navigation.navigate('Profile')} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <Text style={s.logo}>My Stones 🪨</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Sell')} style={s.addBtn}>
          <Text style={{ fontSize: 20, color: Colors.amethyst }}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Filter tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: Spacing.lg, gap: 8, paddingVertical: Spacing.md }}>
        {FILTERS.map(f => (
          <TouchableOpacity key={f} onPress={() => setFilter(f)}
            style={[s.filterTab, filter === f && s.filterTabActive]}>
            <Text style={[s.filterTabText, filter === f && s.filterTabTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.md, paddingBottom: 40 }}>
        {filtered.length === 0
          ? <EmptyState icon="🪨" title="No stones here" subtitle="Tap + to add a new listing"
              action="Sell a Stone" onAction={() => navigation.navigate('Sell')} />
          : filtered.map(stone => (
              <View key={stone.id} style={s.stoneCard}>
                <View style={s.stoneEmoji}>
                  <Text style={{ fontSize: 32 }}>{stone.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.stoneName}>{stone.name}</Text>
                  <Text style={s.stoneMeta}>{stone.weight}ct · Listed {stone.createdAt}</Text>
                  {/* GST / Bill info */}
                  {stone.gstNumber ? (
                    <Text style={s.stoneGST}>🧾 GST: {stone.gstNumber}</Text>
                  ) : null}
                  {stone.billNumber ? (
                    <Text style={s.stoneBill}>📄 Bill: {stone.billNumber}</Text>
                  ) : null}
                  <Text style={s.stonePrice}>
                    {stone.status === 'sold'
                      ? `${formatINR(stone.soldPrice)} sold`
                      : formatINR(stone.price)}
                  </Text>
                </View>
                <View style={{ gap: 8, alignItems: 'flex-end' }}>
                  <Badge label={stone.status} color={STATUS_COLORS[stone.status] || 'gray'} />
                  {stone.offers > 0 && (
                    <Badge label={`${stone.offers} offers`} color="ruby" />
                  )}
                  {stone.gstNumber ? <Badge label="GST ✓" color="emerald" /> : null}
                  {stone.status !== 'sold' && (
                    <TouchableOpacity onPress={() => removeStone(stone.id)} style={s.removeBtn}>
                      <Text style={{ fontSize: 11, color: Colors.ruby, fontWeight: '600' }}>Remove</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))
        }
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:               { flex: 1, backgroundColor: Colors.obsidian },
  header:             { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  logo:               { fontSize: 20, fontWeight: '700', color: Colors.amethyst },
  addBtn:             { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border2, alignItems: 'center', justifyContent: 'center' },
  filterTab:          { paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.round, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  filterTabActive:    { backgroundColor: Colors.amethyst, borderColor: Colors.amethyst },
  filterTabText:      { fontSize: 13, fontWeight: '600', color: Colors.text2 },
  filterTabTextActive:{ color: '#fff' },
  stoneCard:          { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg, padding: Spacing.lg, flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  stoneEmoji:         { width: 56, height: 56, borderRadius: 12, backgroundColor: Colors.surface2, alignItems: 'center', justifyContent: 'center' },
  stoneName:          { fontSize: FontSize.md, fontWeight: '600', color: Colors.text, marginBottom: 3 },
  stoneMeta:          { fontSize: FontSize.xs, color: Colors.text3, marginBottom: 3 },
  stoneGST:           { fontSize: FontSize.xs, color: '#FF9933', fontWeight: '600', marginBottom: 2 },
  stoneBill:          { fontSize: FontSize.xs, color: Colors.text2, marginBottom: 4 },
  stonePrice:         { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text },
  removeBtn:          { paddingHorizontal: 10, paddingVertical: 5, backgroundColor: 'rgba(231,76,60,0.15)', borderRadius: Radius.sm, borderWidth: 1, borderColor: 'rgba(231,76,60,0.3)' },
});
