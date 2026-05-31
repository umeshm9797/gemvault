// ============================================================
//  GemVault — Profile / Auth Screen
// ============================================================
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useApp } from '../context/AppContext';
import { Button, Card, Input } from '../components/UI';
import { Colors, Spacing, Radius, FontSize } from '../theme';

export function ProfileScreen({ navigation }) {
  const { state, login, register, logout } = useApp();
  const [tab, setTab]             = useState('signin');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [phone, setPhone]         = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [errors, setErrors]       = useState({});
  const [loading, setLoading]     = useState(false);

  const doSignIn = async () => {
    const e = {};
    if (!email.trim() || !email.includes('@')) e.email = 'Valid email required';
    if (!password) e.password = 'Password required';
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      await login(email.trim(), password);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setEmail(''); setPassword(''); setErrors({});
    } catch (err) {
      setErrors({ password: err.message });
    } finally { setLoading(false); }
  };

  const doSignUp = async () => {
    const e = {};
    if (!firstName.trim()) e.firstName = 'Required';
    if (!email.trim() || !email.includes('@')) e.email = 'Valid email required';
    if (!password || password.length < 8) e.password = 'Min 8 characters';
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      await register({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(), password, phone });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setFirstName(''); setLastName(''); setEmail(''); setPassword(''); setPhone(''); setErrors({});
    } catch (err) {
      setErrors({ email: err.message });
    } finally { setLoading(false); }
  };

  const doLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => { logout(); Haptics.selectionAsync(); } },
    ]);
  };

  // ── LOGGED IN VIEW ──────────────────────────────────────
  if (state.currentUser) {
    const user = state.currentUser;
    const initial = (user.firstName || 'U').charAt(0).toUpperCase();
    return (
      <SafeAreaView style={s.safe} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Profile Header */}
          <LinearGradient colors={['#1A1030', '#0D0A1A']} style={s.profileHeader}>
            <View style={s.profileGlow} />
            <View style={s.avatarWrap}>
              <Text style={s.avatarText}>{initial}</Text>
            </View>
            <Text style={s.profileName}>{user.firstName} {user.lastName}</Text>
            <Text style={s.profileEmail}>{user.email}</Text>
            {user.role === 'admin' && <View style={s.adminBadge}><Text style={{ fontSize: 11, fontWeight: '700', color: Colors.gold }}>🛡️ ADMIN</Text></View>}
            {/* Stats */}
            <View style={s.statsRow}>
              <View style={s.statItem}>
                <Text style={s.statVal}>{user.listings || 0}</Text>
                <Text style={s.statLbl}>Listings</Text>
              </View>
              <View style={[s.statItem, s.statBorder]}>
                <Text style={s.statVal}>{user.sold || 0}</Text>
                <Text style={s.statLbl}>Sold</Text>
              </View>
              <View style={s.statItem}>
                <Text style={s.statVal}>${(user.earned || 0).toLocaleString()}</Text>
                <Text style={s.statLbl}>Earned</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Menu */}
          <View style={{ padding: Spacing.lg, gap: Spacing.sm }}>
            <Text style={s.menuSection}>Account</Text>
            {[
              { icon: '✏️', label: 'Edit Profile',     onPress: () => Alert.alert('Coming Soon', 'Profile editing coming soon') },
              { icon: '🏦', label: 'Payment Details',  onPress: () => Alert.alert('Coming Soon', 'Payment settings coming soon') },
              { icon: '🔔', label: 'Notifications',    onPress: () => Alert.alert('Notifications', '3 new offers on your listings'), badge: '3' },
            ].map(item => <MenuItem key={item.label} {...item} />)}

            <Text style={[s.menuSection, { marginTop: Spacing.sm }]}>Selling</Text>
            {[
              { icon: '🪨', label: 'My Listings',        onPress: () => navigation.navigate('MyStones') },
              { icon: '💰', label: 'Earnings & Payouts', onPress: () => Alert.alert('Coming Soon', 'Earnings dashboard coming soon') },
              { icon: '⭐', label: 'My Reviews',         onPress: () => Alert.alert('Coming Soon', 'Reviews coming soon') },
            ].map(item => <MenuItem key={item.label} {...item} />)}

            {user.role === 'admin' && (
              <>
                <Text style={[s.menuSection, { marginTop: Spacing.sm }]}>Admin</Text>
                <MenuItem icon="🛡️" label="Admin Panel" onPress={() => navigation.navigate('Admin')} highlight />
              </>
            )}

            <Text style={[s.menuSection, { marginTop: Spacing.sm }]}>Support</Text>
            {[
              { icon: '❓', label: 'Help Center', onPress: () => Alert.alert('Help', 'Visit gemvault.com/help') },
              { icon: '⚙️', label: 'Settings',    onPress: () => Alert.alert('Coming Soon', 'Settings coming soon') },
            ].map(item => <MenuItem key={item.label} {...item} />)}

            <TouchableOpacity onPress={doLogout} style={[s.menuItem, { marginTop: Spacing.sm, borderColor: 'rgba(231,76,60,0.2)', backgroundColor: 'rgba(231,76,60,0.05)' }]}>
              <View style={[s.menuIcon, { backgroundColor: 'rgba(231,76,60,0.15)' }]}>
                <Text style={{ fontSize: 18 }}>🚪</Text>
              </View>
              <Text style={[s.menuLabel, { color: Colors.ruby }]}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── AUTH VIEW ────────────────────────────────────────────
  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: Spacing.lg, paddingBottom: 40 }}>
          {/* Logo */}
          <View style={{ alignItems: 'center', paddingVertical: Spacing.xl }}>
            <Text style={{ fontSize: 56, marginBottom: 12 }}>💎</Text>
            <Text style={{ fontSize: FontSize.xxxl, fontWeight: '700', color: Colors.text, marginBottom: 6 }}>GemVault</Text>
            <Text style={{ fontSize: FontSize.md, color: Colors.text3 }}>Sign in to sell your gems and track offers</Text>
          </View>

          {/* Tabs */}
          <View style={s.authTabs}>
            <TouchableOpacity onPress={() => setTab('signin')} style={[s.authTab, tab === 'signin' && s.authTabActive]}>
              <Text style={[s.authTabText, tab === 'signin' && s.authTabTextActive]}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTab('signup')} style={[s.authTab, tab === 'signup' && s.authTabActive]}>
              <Text style={[s.authTabText, tab === 'signup' && s.authTabTextActive]}>Create Account</Text>
            </TouchableOpacity>
          </View>

          {/* Social Buttons */}
          <View style={{ flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md }}>
            <TouchableOpacity style={s.socialBtn} onPress={() => Alert.alert('Google Sign In', 'Google OAuth coming soon')}>
              <Text style={s.socialBtnText}>🌐  Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.socialBtn} onPress={() => Alert.alert('Apple Sign In', 'Apple Sign In coming soon')}>
              <Text style={s.socialBtnText}>🍎  Apple</Text>
            </TouchableOpacity>
          </View>
          <View style={s.dividerRow}>
            <View style={s.dividerLine} />
            <Text style={s.dividerText}>or</Text>
            <View style={s.dividerLine} />
          </View>

          {/* Sign In Form */}
          {tab === 'signin' && (
            <View style={{ gap: Spacing.md }}>
              <Input label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com"
                keyboardType="email-address" autoCapitalize="none" error={errors.email} />
              <View>
                <Input label="Password" value={password} onChangeText={setPassword} placeholder="••••••••"
                  secureTextEntry={!showPw} error={errors.password} />
                <TouchableOpacity onPress={() => setShowPw(!showPw)} style={s.pwToggle}>
                  <Text style={{ fontSize: 18, color: Colors.text3 }}>{showPw ? '🙈' : '👁'}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => Alert.alert('Reset Password', 'Reset link will be sent to your email')}>
                <Text style={{ fontSize: FontSize.sm, color: Colors.amethyst, fontWeight: '600' }}>Forgot password?</Text>
              </TouchableOpacity>
              <Button title="Sign In" onPress={doSignIn} loading={loading} />
              <Card style={{ backgroundColor: 'rgba(155,89,182,0.06)', borderColor: 'rgba(155,89,182,0.2)' }}>
                <Text style={{ fontSize: FontSize.xs, color: Colors.text3, textAlign: 'center', marginBottom: 4 }}>Test credentials:</Text>
                <Text style={{ fontSize: FontSize.xs, color: Colors.amethyst, textAlign: 'center', fontWeight: '600' }}>admin@gemvault.com / admin123</Text>
                <Text style={{ fontSize: FontSize.xs, color: Colors.text2, textAlign: 'center', marginTop: 2 }}>demo@user.com / demo1234</Text>
              </Card>
            </View>
          )}

          {/* Sign Up Form */}
          {tab === 'signup' && (
            <View style={{ gap: Spacing.md }}>
              <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
                <View style={{ flex: 1 }}>
                  <Input label="First Name *" value={firstName} onChangeText={setFirstName} placeholder="Jane" error={errors.firstName} />
                </View>
                <View style={{ flex: 1 }}>
                  <Input label="Last Name" value={lastName} onChangeText={setLastName} placeholder="Doe" />
                </View>
              </View>
              <Input label="Email *" value={email} onChangeText={setEmail} placeholder="you@example.com"
                keyboardType="email-address" autoCapitalize="none" error={errors.email} />
              <View>
                <Input label="Password *" value={password} onChangeText={setPassword} placeholder="Min 8 characters"
                  secureTextEntry={!showPw} error={errors.password} hint="At least 8 characters" />
                <TouchableOpacity onPress={() => setShowPw(!showPw)} style={s.pwToggle}>
                  <Text style={{ fontSize: 18, color: Colors.text3 }}>{showPw ? '🙈' : '👁'}</Text>
                </TouchableOpacity>
              </View>
              <Input label="Phone (for offers)" value={phone} onChangeText={setPhone} placeholder="+1 555 000 0000" keyboardType="phone-pad" />
              <Button title="Create Account" onPress={doSignUp} loading={loading} />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function MenuItem({ icon, label, onPress, badge, highlight }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}
      style={[s.menuItem, highlight && { borderColor: 'rgba(155,89,182,0.3)', backgroundColor: 'rgba(155,89,182,0.06)' }]}>
      <View style={[s.menuIcon, highlight && { backgroundColor: 'rgba(155,89,182,0.15)' }]}>
        <Text style={{ fontSize: 18 }}>{icon}</Text>
      </View>
      <Text style={[s.menuLabel, highlight && { color: Colors.amethyst }]}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        {badge && (
          <View style={{ backgroundColor: Colors.ruby, borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2 }}>
            <Text style={{ fontSize: 10, fontWeight: '800', color: '#fff' }}>{badge}</Text>
          </View>
        )}
        <Text style={{ color: Colors.text3, fontSize: 18 }}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  safe:             { flex: 1, backgroundColor: Colors.obsidian },
  profileHeader:    { padding: Spacing.xl, paddingTop: Spacing.xxl, alignItems: 'center', position: 'relative', overflow: 'hidden' },
  profileGlow:      { position: 'absolute', top: -60, left: '50%', marginLeft: -100, width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(155,89,182,0.2)' },
  avatarWrap:       { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.amethyst2, alignItems: 'center', justifyContent: 'center', marginBottom: 14, borderWidth: 3, borderColor: 'rgba(195,155,211,0.4)' },
  avatarText:       { fontSize: 32, fontWeight: '800', color: '#fff' },
  profileName:      { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.text },
  profileEmail:     { fontSize: FontSize.sm, color: Colors.text2, marginTop: 4, marginBottom: 8 },
  adminBadge:       { backgroundColor: 'rgba(243,156,18,0.15)', borderWidth: 1, borderColor: 'rgba(243,156,18,0.3)', borderRadius: Radius.round, paddingHorizontal: 12, paddingVertical: 4, marginBottom: 8 },
  statsRow:         { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: Radius.lg, overflow: 'hidden', marginTop: Spacing.lg, width: '100%', borderWidth: 1, borderColor: Colors.border },
  statItem:         { flex: 1, paddingVertical: Spacing.md, alignItems: 'center' },
  statBorder:       { borderLeftWidth: 1, borderRightWidth: 1, borderColor: Colors.border },
  statVal:          { fontSize: FontSize.xl, fontWeight: '700', color: Colors.amethyst },
  statLbl:          { fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8, color: Colors.text3, marginTop: 2 },
  menuSection:      { fontSize: FontSize.xs, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, color: Colors.text3, paddingHorizontal: 4 },
  menuItem:         { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.lg, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md },
  menuIcon:         { width: 38, height: 38, borderRadius: 10, backgroundColor: Colors.surface2, alignItems: 'center', justifyContent: 'center' },
  menuLabel:        { flex: 1, fontSize: FontSize.md, fontWeight: '500', color: Colors.text },
  authTabs:         { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: Radius.md, padding: 4, marginBottom: Spacing.lg },
  authTab:          { flex: 1, paddingVertical: 10, borderRadius: Radius.sm, alignItems: 'center' },
  authTabActive:    { backgroundColor: Colors.amethyst },
  authTabText:      { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text3 },
  authTabTextActive:{ color: '#fff' },
  socialBtn:        { flex: 1, paddingVertical: 12, backgroundColor: Colors.surface2, borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.md, alignItems: 'center' },
  socialBtnText:    { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text },
  dividerRow:       { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.lg },
  dividerLine:      { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText:      { fontSize: FontSize.xs, color: Colors.text3, textTransform: 'uppercase', letterSpacing: 1 },
  pwToggle:         { position: 'absolute', right: 14, bottom: 14 },
});
