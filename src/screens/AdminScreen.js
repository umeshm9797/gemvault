// ============================================================
//  GemVault — Admin Panel Screen (INR Edition)
// ============================================================
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { Card, Badge, Button, StatCard, EmptyState } from '../components/UI';
import { Colors, Spacing, Radius, FontSize, formatINR } from '../theme';

const TABS = ['Dashboard', 'Submissions', 'Users', 'Listings', 'Settings'];

export function AdminScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('Dashboard');

  if (!state.currentUser || state.currentUser.role !== 'admin') {
    return (
      <SafeAreaView style={s.safe} edges={['top']}>
        <EmptyState icon="🔒" title="Admin Access Required"
          subtitle="Sign in with an admin account"
          action="Go to Profile" onAction={() => navigation.navigate('Profile')} />
      </SafeAreaView>
    );
  }

  const approve = (id) => {
    Alert.alert('Approve Listing', 'Approve this submission and make it live?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Approve ✅', onPress: () => dispatch({ type: 'APPROVE_SUBMISSION', payload: id }) },
    ]);
  };

  const reject = (id) => {
    Alert.alert('Reject Listing', 'Reject and remove this submission?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reject ❌', style: 'destructive', onPress: () => dispatch({ type: 'REJECT_SUBMISSION', payload: id }) },
    ]);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={{ color: Colors.amethyst, fontSize: 16 }}>← Back</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>🛡️ Admin Panel</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Tab bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: Spacing.lg, gap: 8, paddingVertical: Spacing.sm }}>
        {TABS.map(tab => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}
            style={[s.tab, activeTab === tab && s.tabActive]}>
            <Text style={[s.tabText, activeTab === tab && s.tabTextActive]}>{tab}</Text>
            {tab === 'Submissions' && state.pendingSubmissions.length > 0 && (
              <View style={s.tabBadge}>
                <Text style={{ fontSize: 9, color: '#fff', fontWeight: '800' }}>
                  {state.pendingSubmissions.length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: Spacing.lg, paddingBottom: 40 }}>

        {/* ── DASHBOARD ── */}
        {activeTab === 'Dashboard' && (
          <View style={{ gap: Spacing.md }}>
            <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
              <StatCard value={state.listings.length} label="Listings"  change="↑ 8 this week" changeUp icon="💎" />
              <StatCard value={state.pendingSubmissions.length} label="Pending" change="Needs review" icon="⏳" />
            </View>
            <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
              <StatCard value="148"     label="Users"   change="↑ 12 this week" changeUp icon="👥" />
              <StatCard value="₹15.3L"  label="Revenue" change="↑ 22% month"    changeUp icon="💰" />
            </View>
            <Text style={s.sectionLabel}>Recent Activity</Text>
            {state.activityFeed.slice(0, 6).map(item => (
              <View key={item.id} style={s.activityItem}>
                <Text style={{ fontSize: 22, width: 36 }}>{item.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: FontSize.sm, color: Colors.text }}>{item.text}</Text>
                  <Text style={{ fontSize: FontSize.xs, color: Colors.text3, marginTop: 2 }}>{item.time}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ── SUBMISSIONS ── */}
        {activeTab === 'Submissions' && (
          <View style={{ gap: Spacing.md }}>
            <Text style={s.sectionLabel}>Pending Review ({state.pendingSubmissions.length})</Text>
            {state.pendingSubmissions.length === 0
              ? <EmptyState icon="✅" title="All caught up!" subtitle="No pending submissions" />
              : state.pendingSubmissions.map(sub => (
                  <Card key={sub.id} style={{ gap: Spacing.sm }}>
                    <View style={{ flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start' }}>
                      <View style={s.subEmoji}>
                        <Text style={{ fontSize: 28 }}>{sub.emoji}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: FontSize.md, fontWeight: '600', color: Colors.text }}>{sub.name}</Text>
                        <Text style={{ fontSize: FontSize.xs, color: Colors.text3 }}>by {sub.user} · {sub.email}</Text>
                      </View>
                      <Text style={{ fontSize: FontSize.lg, fontWeight: '700', color: Colors.text }}>
                        {formatINR(sub.price)}
                      </Text>
                    </View>

                    {/* Stone badges */}
                    <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                      <Badge label={`${sub.weight}ct`} color="gold" />
                      <Badge label={sub.clarity || '—'} color="gray" />
                      <Badge label={sub.cert !== 'None' ? sub.cert : 'No Cert'} color={sub.cert && sub.cert !== 'None' ? 'emerald' : 'gray'} />
                    </View>

                    {/* GST & Bill info */}
                    {(sub.gstNumber || sub.billNumber) && (
                      <View style={s.gstInfoBox}>
                        <Text style={{ fontSize: FontSize.xs, fontWeight: '700', color: '#FF9933', marginBottom: 4 }}>
                          🧾 Tax Details Provided
                        </Text>
                        {sub.gstNumber ? (
                          <Text style={{ fontSize: FontSize.xs, color: Colors.text2 }}>
                            GST: <Text style={{ fontFamily: 'monospace', color: '#FF9933' }}>{sub.gstNumber}</Text>
                          </Text>
                        ) : null}
                        {sub.billNumber ? (
                          <Text style={{ fontSize: FontSize.xs, color: Colors.text2, marginTop: 2 }}>
                            Bill No: <Text style={{ fontFamily: 'monospace', color: Colors.text }}>{sub.billNumber}</Text>
                          </Text>
                        ) : null}
                      </View>
                    )}

                    {!sub.gstNumber && !sub.billNumber && (
                      <View style={[s.gstInfoBox, { borderColor: 'rgba(231,76,60,0.2)', backgroundColor: 'rgba(231,76,60,0.05)' }]}>
                        <Text style={{ fontSize: FontSize.xs, color: Colors.rubyLight }}>
                          ⚠️ No GST/Bill details provided — individual seller
                        </Text>
                      </View>
                    )}

                    <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
                      <Button title="✅ Approve" onPress={() => approve(sub.id)} style={{ flex: 1 }} size="sm" />
                      <Button title="❌ Reject" variant="danger" onPress={() => reject(sub.id)} style={{ flex: 1 }} size="sm" />
                    </View>
                  </Card>
                ))
            }
          </View>
        )}

        {/* ── USERS ── */}
        {activeTab === 'Users' && (
          <View style={{ gap: Spacing.sm }}>
            <Text style={s.sectionLabel}>All Users</Text>
            {[
              { id: 'u1', name: 'Maria K.',   email: 'maria@email.com',  role: 'seller', listings: 4, verified: true,  gst: true },
              { id: 'u2', name: 'James T.',   email: 'james@email.com',  role: 'seller', listings: 2, verified: true,  gst: true },
              { id: 'u3', name: 'Priya S.',   email: 'priya@email.com',  role: 'seller', listings: 1, verified: false, gst: false },
              { id: 'u4', name: 'Robert A.',  email: 'robert@email.com', role: 'buyer',  listings: 0, verified: true,  gst: false },
              { id: 'u5', name: 'Sofia M.',   email: 'sofia@email.com',  role: 'seller', listings: 3, verified: true,  gst: true },
              { id: 'u6', name: 'Anna L.',    email: 'anna@email.com',   role: 'seller', listings: 1, verified: false, gst: false },
            ].map(user => (
              <View key={user.id} style={s.userRow}>
                <View style={s.userAvatar}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>{user.name.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: FontSize.md, fontWeight: '600', color: Colors.text }}>{user.name}</Text>
                  <Text style={{ fontSize: FontSize.xs, color: Colors.text3 }}>{user.email}</Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                  <Badge label={user.verified ? 'verified' : 'unverified'} color={user.verified ? 'emerald' : 'gold'} />
                  {user.gst ? <Badge label="GST ✓" color="emerald" /> : null}
                  <Text style={{ fontSize: FontSize.xs, color: Colors.text3 }}>{user.listings} listings</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ── LISTINGS ── */}
        {activeTab === 'Listings' && (
          <View style={{ gap: Spacing.sm }}>
            <Text style={s.sectionLabel}>All Listings ({state.listings.length})</Text>
            {state.listings.map(listing => (
              <View key={listing.id} style={s.listingRow}>
                <Text style={{ fontSize: 28, width: 44 }}>{listing.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: FontSize.sm, fontWeight: '600', color: Colors.text }} numberOfLines={1}>
                    {listing.name}
                  </Text>
                  <Text style={{ fontSize: FontSize.xs, color: Colors.text3 }}>{listing.weight}ct · {listing.seller}</Text>
                  {listing.gstNumber ? (
                    <Text style={{ fontSize: FontSize.xs, color: '#FF9933' }}>🧾 GST ✓</Text>
                  ) : null}
                </View>
                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                  <Text style={{ fontSize: FontSize.md, fontWeight: '700', color: Colors.text }}>
                    {formatINR(listing.price)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => Alert.alert('Remove', `Remove "${listing.name}"?`, [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Remove', style: 'destructive', onPress: () => dispatch({ type: 'REMOVE_LISTING', payload: listing.id }) },
                    ])}
                    style={s.removeBtn}>
                    <Text style={{ fontSize: 11, color: Colors.ruby, fontWeight: '600' }}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ── SETTINGS ── */}
        {activeTab === 'Settings' && (
          <View style={{ gap: Spacing.md }}>
            <Card>
              <Text style={{ fontSize: FontSize.md, fontWeight: '600', color: Colors.text, marginBottom: Spacing.md }}>
                💎 Platform Settings
              </Text>
              {[
                { label: 'Commission Rate (%)',        value: '8',                    type: 'numeric' },
                { label: 'GST on Commission (%)',      value: '18',                   type: 'numeric' },
                { label: 'Min Listing Price (₹)',      value: '5000',                 type: 'numeric' },
                { label: 'Review Window (hours)',      value: '2',                    type: 'numeric' },
                { label: 'Gemstone GST Rate (%)',      value: '3',                    type: 'numeric' },
                { label: 'Support Email',              value: 'support@gemvault.in',  type: 'email-address' },
              ].map(field => (
                <View key={field.label} style={{ marginBottom: Spacing.md }}>
                  <Text style={s.settingLabel}>{field.label}</Text>
                  <TextInput defaultValue={field.value} keyboardType={field.type}
                    style={s.settingInput} placeholderTextColor={Colors.text3} />
                </View>
              ))}
              <Button title="Save Settings"
                onPress={() => Alert.alert('✅ Saved', 'Settings updated successfully')} />
            </Card>

            <Card style={{ borderColor: 'rgba(255,153,51,0.3)', backgroundColor: 'rgba(255,153,51,0.04)' }}>
              <Text style={{ fontSize: FontSize.md, fontWeight: '600', color: '#FF9933', marginBottom: Spacing.md }}>
                🧾 GST Compliance
              </Text>
              <Text style={{ fontSize: FontSize.xs, color: Colors.text3, lineHeight: 18, marginBottom: Spacing.md }}>
                Platform GSTIN: <Text style={{ color: '#FF9933', fontFamily: 'monospace' }}>27GEMVT0000G1Z5</Text>
              </Text>
              <Button title="Download GST Report" variant="outline"
                onPress={() => Alert.alert('Coming Soon', 'GST report export coming soon')} />
            </Card>

            <Card style={{ borderColor: 'rgba(231,76,60,0.3)', backgroundColor: 'rgba(231,76,60,0.05)' }}>
              <Text style={{ fontSize: FontSize.md, fontWeight: '600', color: Colors.ruby, marginBottom: Spacing.md }}>
                ⚠️ Danger Zone
              </Text>
              <Button title="Suspend All New Listings" variant="danger"
                onPress={() => Alert.alert('⚠️ Confirm', 'Suspend all new listing submissions?', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Suspend', style: 'destructive', onPress: () => Alert.alert('Done', 'New submissions suspended') },
                ])} />
            </Card>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: Colors.obsidian },
  header:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerTitle:   { fontSize: FontSize.lg, fontWeight: '600', color: Colors.text },
  backBtn:       { width: 60 },
  tab:           { paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.round, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, position: 'relative' },
  tabActive:     { backgroundColor: Colors.amethyst, borderColor: Colors.amethyst },
  tabText:       { fontSize: 12, fontWeight: '700', color: Colors.text3, textTransform: 'uppercase', letterSpacing: 0.6 },
  tabTextActive: { color: '#fff' },
  tabBadge:      { position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: 8, backgroundColor: Colors.ruby, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: Colors.obsidian },
  sectionLabel:  { fontSize: FontSize.xs, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, color: Colors.text3 },
  activityItem:  { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, padding: Spacing.md },
  subEmoji:      { width: 50, height: 50, borderRadius: Radius.sm, backgroundColor: Colors.surface2, alignItems: 'center', justifyContent: 'center' },
  gstInfoBox:    { backgroundColor: 'rgba(255,153,51,0.06)', borderWidth: 1, borderColor: 'rgba(255,153,51,0.25)', borderRadius: Radius.sm, padding: Spacing.sm },
  userRow:       { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, padding: Spacing.md },
  userAvatar:    { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.amethyst2, alignItems: 'center', justifyContent: 'center' },
  listingRow:    { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, padding: Spacing.md },
  removeBtn:     { paddingHorizontal: 10, paddingVertical: 4, backgroundColor: 'rgba(231,76,60,0.15)', borderRadius: Radius.sm, borderWidth: 1, borderColor: 'rgba(231,76,60,0.3)' },
  settingLabel:  { fontSize: FontSize.xs, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, color: Colors.text2, marginBottom: 6 },
  settingInput:  { backgroundColor: Colors.surface2, borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.sm, color: Colors.text, fontSize: FontSize.md, paddingVertical: 11, paddingHorizontal: 14 },
});
