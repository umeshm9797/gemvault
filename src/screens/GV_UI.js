// ============================================================
//  GemVault — Reusable Components
// ============================================================
import React, { useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, TextInput, StyleSheet,
  Animated, ActivityIndicator, Modal, ScrollView, Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../theme';

// ── Button ─────────────────────────────────────────────────
export function Button({ title, onPress, variant='primary', size='md', icon, loading, style, disabled }) {
  const gradients = {
    primary:  ['#9B59B6','#7D3C98'],
    sell:     ['#F39C12','#D68910'],
    outline:  null,
    danger:   null,
    ghost:    null,
  };
  const textColors = {
    primary: '#fff', sell: '#0A0812',
    outline: Colors.amethyst, danger: Colors.ruby, ghost: Colors.text2,
  };
  const sizes = {
    sm: { paddingVertical:8,  paddingHorizontal:16, fontSize:13 },
    md: { paddingVertical:14, paddingHorizontal:20, fontSize:15 },
    lg: { paddingVertical:16, paddingHorizontal:28, fontSize:16 },
  };

  const s = sizes[size];
  const inner = (
    <View style={[styles.btnInner, { paddingVertical:s.paddingVertical, paddingHorizontal:s.paddingHorizontal }]}>
      {loading ? <ActivityIndicator color={textColors[variant]} size="small" /> : (
        <>
          {icon && <Text style={{ fontSize:s.fontSize+2, marginRight:6 }}>{icon}</Text>}
          <Text style={[styles.btnText, { fontSize:s.fontSize, color:textColors[variant], fontWeight:'700' }]}>{title}</Text>
        </>
      )}
    </View>
  );

  const containerStyle = [
    styles.btn,
    variant === 'outline' && { borderWidth:1.5, borderColor:'rgba(155,89,182,0.5)' },
    variant === 'danger'  && { backgroundColor:'rgba(231,76,60,0.15)', borderWidth:1, borderColor:'rgba(231,76,60,0.3)' },
    variant === 'ghost'   && { backgroundColor:'transparent' },
    disabled && { opacity:0.5 },
    style,
  ];

  if (gradients[variant]) {
    return (
      <TouchableOpacity onPress={onPress} disabled={disabled || loading} activeOpacity={0.85} style={containerStyle}>
        <LinearGradient colors={gradients[variant]} start={{x:0,y:0}} end={{x:1,y:1}} style={[styles.btnGradient, { borderRadius:Radius.round }]}>
          {inner}
        </LinearGradient>
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled || loading} activeOpacity={0.85} style={[containerStyle, { borderRadius:Radius.round }]}>
      {inner}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn:        { borderRadius:Radius.round, overflow:'hidden' },
  btnGradient:{ borderRadius:Radius.round },
  btnInner:   { flexDirection:'row', alignItems:'center', justifyContent:'center' },
  btnText:    { letterSpacing:0.3 },
});

// ── Card ───────────────────────────────────────────────────
export function Card({ children, style, glow }) {
  return (
    <View style={[cardStyles.card, glow && cardStyles.glow, style]}>
      {children}
    </View>
  );
}
const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface, borderRadius:Radius.lg,
    padding:Spacing.lg, borderWidth:1, borderColor:Colors.border,
  },
  glow: { ...Shadow.glow },
});

// ── Input ──────────────────────────────────────────────────
export function Input({ label, error, hint, style, inputStyle, ...props }) {
  return (
    <View style={[inputStyles.wrap, style]}>
      {label && <Text style={inputStyles.label}>{label}</Text>}
      <TextInput
        style={[inputStyles.input, error && inputStyles.inputError, inputStyle]}
        placeholderTextColor={Colors.text3}
        {...props}
      />
      {error && <Text style={inputStyles.error}>{error}</Text>}
      {hint  && <Text style={inputStyles.hint}>{hint}</Text>}
    </View>
  );
}
const inputStyles = StyleSheet.create({
  wrap:       { gap:6 },
  label:      { fontSize:FontSize.xs, fontWeight:'700', textTransform:'uppercase', letterSpacing:1, color:Colors.text2 },
  input:      { backgroundColor:Colors.surface2, borderWidth:1.5, borderColor:Colors.border, borderRadius:Radius.md, color:Colors.text, fontSize:FontSize.md, paddingVertical:13, paddingHorizontal:16 },
  inputError: { borderColor:Colors.ruby },
  error:      { fontSize:FontSize.xs, color:Colors.ruby },
  hint:       { fontSize:FontSize.xs, color:Colors.text3 },
});

// ── Badge ──────────────────────────────────────────────────
export function Badge({ label, color='amethyst' }) {
  const colorMap = {
    amethyst: { bg:'rgba(155,89,182,0.2)', border:'rgba(155,89,182,0.3)', text:'#C39BD3' },
    emerald:  { bg:'rgba(39,174,96,0.2)',  border:'rgba(39,174,96,0.3)',  text:'#58D68D' },
    ruby:     { bg:'rgba(231,76,60,0.2)',  border:'rgba(231,76,60,0.3)',  text:'#F1948A' },
    gold:     { bg:'rgba(243,156,18,0.2)', border:'rgba(243,156,18,0.3)', text:'#F8C471' },
    sapphire: { bg:'rgba(41,128,185,0.2)', border:'rgba(41,128,185,0.3)', text:'#7FB3D3' },
    gray:     { bg:'rgba(255,255,255,0.08)',border:Colors.border,         text:Colors.text3 },
  };
  const c = colorMap[color] || colorMap.gray;
  return (
    <View style={{ backgroundColor:c.bg, borderWidth:1, borderColor:c.border, borderRadius:Radius.round, paddingHorizontal:10, paddingVertical:3 }}>
      <Text style={{ fontSize:FontSize.xs, fontWeight:'700', color:c.text, textTransform:'uppercase', letterSpacing:0.6 }}>{label}</Text>
    </View>
  );
}

// ── Section Header ─────────────────────────────────────────
export function SectionHeader({ title, action, onAction }) {
  return (
    <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:Spacing.md }}>
      <Text style={{ fontSize:FontSize.xs, fontWeight:'700', textTransform:'uppercase', letterSpacing:1, color:Colors.text3 }}>{title}</Text>
      {action && <TouchableOpacity onPress={onAction}><Text style={{ fontSize:FontSize.sm, color:Colors.amethyst, fontWeight:'600' }}>{action}</Text></TouchableOpacity>}
    </View>
  );
}

// ── Stat Card ──────────────────────────────────────────────
export function StatCard({ value, label, change, changeUp, icon }) {
  return (
    <Card style={{ flex:1 }}>
      {icon && <Text style={{ position:'absolute', right:12, top:12, fontSize:24, opacity:0.2 }}>{icon}</Text>}
      <Text style={{ fontFamily:'serif', fontSize:FontSize.xxl, fontWeight:'700', color:Colors.text }}>{value}</Text>
      <Text style={{ fontSize:FontSize.xs, fontWeight:'600', textTransform:'uppercase', letterSpacing:0.8, color:Colors.text3, marginTop:2 }}>{label}</Text>
      {change && <Text style={{ fontSize:FontSize.xs, marginTop:6, color:changeUp ? Colors.emerald : Colors.ruby }}>{change}</Text>}
    </Card>
  );
}

// ── Gem Chip ───────────────────────────────────────────────
export function GemChip({ emoji, name, active, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[chipStyles.chip, active && chipStyles.chipActive]}>
      <Text style={{ fontSize:22 }}>{emoji}</Text>
      <Text style={[chipStyles.label, active && chipStyles.labelActive]}>{name}</Text>
    </TouchableOpacity>
  );
}
const chipStyles = StyleSheet.create({
  chip:        { alignItems:'center', gap:4, paddingVertical:12, paddingHorizontal:14, backgroundColor:Colors.surface, borderWidth:1.5, borderColor:Colors.border, borderRadius:14, minWidth:70 },
  chipActive:  { borderColor:Colors.amethyst, backgroundColor:'rgba(155,89,182,0.12)' },
  label:       { fontSize:11, fontWeight:'600', color:Colors.text2 },
  labelActive: { color:Colors.amethyst },
});

// ── Toast ──────────────────────────────────────────────────
export function Toast({ visible, icon, message }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(opacity,     { toValue:1, useNativeDriver:true }),
        Animated.spring(translateY,  { toValue:0, useNativeDriver:true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity,    { toValue:0, duration:200, useNativeDriver:true }),
        Animated.timing(translateY, { toValue:20, duration:200, useNativeDriver:true }),
      ]).start();
    }
  }, [visible]);

  return (
    <Animated.View style={[toastStyles.toast, { opacity, transform:[{ translateY }] }]}>
      <Text style={{ fontSize:18 }}>{icon}</Text>
      <Text style={{ fontSize:14, color:Colors.text, fontWeight:'500' }}>{message}</Text>
    </Animated.View>
  );
}
const toastStyles = StyleSheet.create({
  toast: {
    position:'absolute', bottom:90, alignSelf:'center',
    flexDirection:'row', alignItems:'center', gap:10,
    backgroundColor:Colors.surface2, paddingHorizontal:20, paddingVertical:12,
    borderRadius:Radius.round, borderWidth:1, borderColor:Colors.border2,
    ...Shadow.soft, zIndex:9999,
  },
});

// ── Empty State ────────────────────────────────────────────
export function EmptyState({ icon, title, subtitle, action, onAction }) {
  return (
    <View style={{ alignItems:'center', paddingVertical:48, paddingHorizontal:24 }}>
      <Text style={{ fontSize:56, marginBottom:16, opacity:0.4 }}>{icon}</Text>
      <Text style={{ fontSize:FontSize.lg, fontWeight:'600', color:Colors.text2, marginBottom:8, textAlign:'center' }}>{title}</Text>
      {subtitle && <Text style={{ fontSize:FontSize.md, color:Colors.text3, lineHeight:22, textAlign:'center' }}>{subtitle}</Text>}
      {action && <Button title={action} onPress={onAction} style={{ marginTop:20 }} />}
    </View>
  );
}

// ── Select Picker (simple) ─────────────────────────────────
export function SelectPicker({ label, options, value, onChange }) {
  const [open, setOpen] = React.useState(false);
  return (
    <View style={{ gap:6 }}>
      {label && <Text style={inputStyles.label}>{label}</Text>}
      <TouchableOpacity onPress={() => setOpen(true)} style={[inputStyles.input, { flexDirection:'row', justifyContent:'space-between', alignItems:'center' }]}>
        <Text style={{ color: value ? Colors.text : Colors.text3, fontSize:FontSize.md }}>{value || 'Select…'}</Text>
        <Text style={{ color:Colors.text3 }}>▼</Text>
      </TouchableOpacity>
      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={{ flex:1, backgroundColor:'rgba(0,0,0,0.7)', justifyContent:'flex-end' }} onPress={() => setOpen(false)}>
          <View style={{ backgroundColor:Colors.surface, borderRadius:20, maxHeight:'60%' }}>
            <View style={{ width:36, height:4, backgroundColor:Colors.border2, borderRadius:2, alignSelf:'center', marginTop:14, marginBottom:10 }} />
            <ScrollView>
              {options.map(opt => (
                <TouchableOpacity key={opt} onPress={() => { onChange(opt); setOpen(false); }} style={{ paddingVertical:15, paddingHorizontal:20, borderBottomWidth:1, borderBottomColor:Colors.border }}>
                  <Text style={{ fontSize:FontSize.md, color: value===opt ? Colors.amethyst : Colors.text, fontWeight: value===opt ? '600' : '400' }}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
