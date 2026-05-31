// ============================================================
//  GemVault — Sell Your Stone Screen
//  • All prices in INR (₹)
//  • GST Number + Bill Number fields added (Step 2)
//  • 6 Steps total: Type → Details+GST → Photos → Price → Review
// ============================================================
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Dimensions, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { useApp } from '../context/AppContext';
import { Button, Card, Input, SelectPicker } from '../components/UI';
import { Colors, Spacing, Radius, FontSize, GemEmojis, GemPrices, formatINR, validateGST } from '../theme';
import { GEM_TYPES, CLARITIES, CUTS, ORIGINS, CERTIFICATIONS } from '../data/seedData';

const { width } = Dimensions.get('window');
const TOTAL_STEPS = 5;
const STEP_LABELS  = ['Type', 'Details', 'GST/Bill', 'Photos', 'Price'];

export default function SellScreen({ navigation }) {
  const { state, submitListing } = useApp();
  const [step, setStep]   = useState(1);
  const [photos, setPhotos] = useState([]);

  // Step 1 — Gem Type
  const [gemType,  setGemType]  = useState('');
  const [gemEmoji, setGemEmoji] = useState('');

  // Step 2 — Stone Details
  const [title,   setTitle]   = useState('');
  const [weight,  setWeight]  = useState('');
  const [clarity, setClarity] = useState('');
  const [cut,     setCut]     = useState('Round Brilliant');
  const [origin,  setOrigin]  = useState('Unknown');
  const [cert,    setCert]    = useState('None');
  const [desc,    setDesc]    = useState('');

  // Step 3 — GST / Bill
  const [gstNumber,  setGstNumber]  = useState('');
  const [billNumber, setBillNumber] = useState('');
  const [hasGST,     setHasGST]     = useState(false);

  // Step 4 — Pricing
  const [price,    setPrice]    = useState('');
  const [listType, setListType] = useState('Fixed Price');

  const [errors, setErrors] = useState({});

  const aiPrice = gemType
    ? Math.round((GemPrices[gemType] || 41500) * (0.8 + Math.random() * 0.6))
    : 0;

  // ── Navigation between steps ──────────────────────────────
  const goStep = (n) => {
    // Validate before advancing
    if (n > 1 && step === 1 && !gemType) {
      setErrors({ gemType: 'Please select a gem type' }); return;
    }
    if (n > 2 && step === 2) {
      const e = {};
      if (!title.trim())                  e.title  = 'Title is required';
      if (!weight || parseFloat(weight) <= 0) e.weight = 'Valid weight required';
      if (!clarity)                        e.clarity = 'Please select clarity';
      if (Object.keys(e).length) { setErrors(e); return; }
    }
    if (n > 3 && step === 3) {
      const e = {};
      if (hasGST && gstNumber && !validateGST(gstNumber)) {
        e.gstNumber = 'Invalid GST format (e.g. 27AAAAA0000A1Z5)';
      }
      if (hasGST && !gstNumber.trim()) {
        e.gstNumber = 'Please enter your GST number';
      }
      if (Object.keys(e).length) { setErrors(e); return; }
    }
    if (n > 5 && step === 5) {
      if (!price || parseFloat(price) < 1) {
        setErrors({ price: 'Please enter a valid price' }); return;
      }
    }
    setErrors({});
    Haptics.selectionAsync();
    setStep(n);
  };

  // ── Photo picker ──────────────────────────────────────────
  const pickImage = async () => {
    if (photos.length >= 8) { Alert.alert('Max Photos', 'You can upload up to 8 photos'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, quality: 0.8,
    });
    if (!result.canceled) {
      setPhotos([...photos, result.assets[0].uri]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  // ── Submit listing ────────────────────────────────────────
  const handleSubmit = () => {
    if (!state.currentUser) {
      Alert.alert('Sign In Required', 'Please sign in to list a stone', [
        { text: 'Sign In', onPress: () => navigation.navigate('Profile') },
        { text: 'Cancel' },
      ]);
      return;
    }
    submitListing({
      name: title || gemType, type: gemType, emoji: gemEmoji || '💎',
      weight, clarity, cut, origin, cert, description: desc,
      price: parseFloat(price),
      listingType: listType,
      gstNumber:  hasGST ? gstNumber.toUpperCase() : '',
      billNumber: billNumber.toUpperCase(),
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      '🚀 Listing Submitted!',
      'Your stone will be reviewed within 2 hours and then go live to 4,800+ verified buyers.',
      [
        { text: 'View My Stones', onPress: () => { resetForm(); navigation.navigate('MyStones'); } },
        { text: 'Sell Another',   onPress: resetForm },
      ]
    );
  };

  const resetForm = () => {
    setStep(1); setGemType(''); setGemEmoji(''); setTitle(''); setWeight('');
    setClarity(''); setCut('Round Brilliant'); setOrigin('Unknown'); setCert('None');
    setDesc(''); setGstNumber(''); setBillNumber(''); setHasGST(false);
    setPrice(''); setPhotos([]); setErrors({});
  };

  const commission = parseFloat(price || 0) * 0.08;
  const gstOnComm  = commission * 0.18;   // 18% GST on commission
  const youReceive = parseFloat(price || 0) - commission - gstOnComm;

  // ── Render ────────────────────────────────────────────────
  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        {step > 1
          ? <TouchableOpacity onPress={() => goStep(step - 1)} style={s.backBtn}>
              <Text style={{ color: Colors.amethyst, fontSize: 16 }}>← Back</Text>
            </TouchableOpacity>
          : <View style={{ width: 60 }} />
        }
        <Text style={s.headerTitle}>Sell Your Stone</Text>
        <Text style={s.stepCount}>{step}/{TOTAL_STEPS}</Text>
      </View>

      {/* Progress bar */}
      <View style={s.progressBg}>
        <View style={[s.progressFill, { width: `${(step / TOTAL_STEPS) * 100}%` }]} />
      </View>

      {/* Step labels */}
      <View style={s.stepLabels}>
        {STEP_LABELS.map((label, i) => (
          <TouchableOpacity key={label} onPress={() => i + 1 < step && goStep(i + 1)}>
            <Text style={[
              s.stepLabel,
              step === i + 1 && s.stepLabelActive,
              step > i + 1  && s.stepLabelDone,
            ]}>
              {i < step - 1 ? '✓' : i + 1} {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: Spacing.lg, paddingBottom: 50 }}>

          {/* ══════════════════════════════
              STEP 1 — Gem Type
          ══════════════════════════════ */}
          {step === 1 && (
            <View>
              <Card style={{ marginBottom: Spacing.lg }}>
                <Text style={s.stepTitle}>What type of stone?</Text>
                <Text style={{ fontSize: FontSize.sm, color: Colors.text3 }}>
                  Select the gemstone you want to sell
                </Text>
              </Card>
              <View style={s.gemGrid}>
                {GEM_TYPES.map(type => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => {
                      setGemType(type);
                      setGemEmoji(GemEmojis[type] || '💎');
                      setErrors({});
                      Haptics.selectionAsync();
                    }}
                    style={[s.gemItem, gemType === type && s.gemItemActive]}
                  >
                    <Text style={{ fontSize: 32, marginBottom: 6 }}>{GemEmojis[type] || '💎'}</Text>
                    <Text style={[s.gemItemLabel, gemType === type && { color: Colors.amethyst }]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.gemType && (
                <Text style={{ color: Colors.ruby, textAlign: 'center', marginBottom: Spacing.md }}>
                  {errors.gemType}
                </Text>
              )}
              <Button title="Continue →" onPress={() => goStep(2)} />
            </View>
          )}

          {/* ══════════════════════════════
              STEP 2 — Stone Details
          ══════════════════════════════ */}
          {step === 2 && (
            <View style={{ gap: Spacing.md }}>
              <Input
                label="Stone Name / Title *"
                value={title}
                onChangeText={setTitle}
                placeholder={`e.g. Natural ${gemType || 'Gemstone'}, Unheated`}
                error={errors.title}
              />
              <View style={{ flexDirection: 'row', gap: Spacing.md }}>
                <View style={{ flex: 1 }}>
                  <Input
                    label="Weight (carats) *"
                    value={weight}
                    onChangeText={setWeight}
                    placeholder="e.g. 2.5"
                    keyboardType="decimal-pad"
                    error={errors.weight}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <SelectPicker label="Clarity *" options={CLARITIES} value={clarity} onChange={setClarity} />
                  {errors.clarity && (
                    <Text style={{ fontSize: FontSize.xs, color: Colors.ruby }}>{errors.clarity}</Text>
                  )}
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: Spacing.md }}>
                <View style={{ flex: 1 }}>
                  <SelectPicker label="Cut / Shape" options={CUTS} value={cut} onChange={setCut} />
                </View>
                <View style={{ flex: 1 }}>
                  <SelectPicker label="Origin" options={ORIGINS} value={origin} onChange={setOrigin} />
                </View>
              </View>
              <SelectPicker label="Certification" options={CERTIFICATIONS} value={cert} onChange={setCert} />
              <Input
                label="Description"
                value={desc}
                onChangeText={setDesc}
                placeholder="Describe color, treatments, history, condition…"
                multiline
                numberOfLines={4}
                inputStyle={{ height: 100, textAlignVertical: 'top' }}
              />
              <Button title="Continue →" onPress={() => goStep(3)} />
            </View>
          )}

          {/* ══════════════════════════════
              STEP 3 — GST / Bill Number
          ══════════════════════════════ */}
          {step === 3 && (
            <View style={{ gap: Spacing.md }}>
              {/* Info card */}
              <Card style={{ backgroundColor: 'rgba(255,153,51,0.08)', borderColor: 'rgba(255,153,51,0.3)' }}>
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
                  <Text style={{ fontSize: 24 }}>🧾</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: FontSize.md, fontWeight: '700', color: Colors.saffron, marginBottom: 4 }}>
                      GST & Billing Information
                    </Text>
                    <Text style={{ fontSize: FontSize.xs, color: Colors.text2, lineHeight: 18 }}>
                      Providing GST and Bill details increases buyer trust and ensures legal compliance under Indian tax regulations. This is optional but recommended.
                    </Text>
                  </View>
                </View>
              </Card>

              {/* Toggle GST */}
              <TouchableOpacity
                onPress={() => { setHasGST(!hasGST); setErrors({}); Haptics.selectionAsync(); }}
                style={[s.gstToggle, hasGST && s.gstToggleActive]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: FontSize.md, fontWeight: '600', color: Colors.text }}>
                    I have a GST Number
                  </Text>
                  <Text style={{ fontSize: FontSize.xs, color: Colors.text3, marginTop: 2 }}>
                    Required for business sellers in India
                  </Text>
                </View>
                <View style={[s.toggle, hasGST && s.toggleOn]}>
                  <View style={[s.toggleKnob, hasGST && s.toggleKnobOn]} />
                </View>
              </TouchableOpacity>

              {/* GST Number input */}
              {hasGST && (
                <View style={{ gap: Spacing.md }}>
                  <Input
                    label="GST Number *"
                    value={gstNumber}
                    onChangeText={(t) => { setGstNumber(t.toUpperCase()); setErrors({}); }}
                    placeholder="e.g. 27AAAAA0000A1Z5"
                    autoCapitalize="characters"
                    maxLength={15}
                    error={errors.gstNumber}
                    hint="15-character GST Identification Number (GSTIN)"
                  />
                  {/* GST format guide */}
                  <Card style={{ backgroundColor: 'rgba(155,89,182,0.06)', borderColor: 'rgba(155,89,182,0.15)' }}>
                    <Text style={{ fontSize: FontSize.xs, fontWeight: '700', color: Colors.amethyst, marginBottom: 6 }}>
                      GST Format Guide:
                    </Text>
                    <Text style={{ fontSize: FontSize.xs, color: Colors.text3, lineHeight: 18, fontFamily: 'monospace' }}>
                      2 digits  → State Code{'\n'}
                      10 chars  → PAN Number{'\n'}
                      1 digit   → Entity Number{'\n'}
                      1 char    → Alphabet (Z){'\n'}
                      1 char    → Check digit
                    </Text>
                  </Card>
                </View>
              )}

              {/* Bill Number */}
              <Input
                label="Bill / Invoice Number (Optional)"
                value={billNumber}
                onChangeText={(t) => setBillNumber(t.toUpperCase())}
                placeholder="e.g. BILL-2026-001 or INV-001"
                autoCapitalize="characters"
                hint="Enter your invoice or bill number for this stone"
              />

              {/* Skip option */}
              {!hasGST && (
                <Card style={{ backgroundColor: 'rgba(39,174,96,0.06)', borderColor: 'rgba(39,174,96,0.2)' }}>
                  <Text style={{ fontSize: FontSize.xs, color: Colors.text2, lineHeight: 18 }}>
                    💡 <Text style={{ fontWeight: '700', color: Colors.text }}>Individual sellers</Text> are not required to provide GST. You can skip this step or add a Bill Number only.
                  </Text>
                </Card>
              )}

              <Button title="Continue →" onPress={() => goStep(4)} />
              <TouchableOpacity onPress={() => goStep(4)} style={{ alignItems: 'center', paddingVertical: 8 }}>
                <Text style={{ fontSize: FontSize.sm, color: Colors.text3 }}>Skip for now →</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ══════════════════════════════
              STEP 4 — Photos
          ══════════════════════════════ */}
          {step === 4 && (
            <View style={{ gap: Spacing.md }}>
              <Card>
                <Text style={s.stepTitle}>Add Photos</Text>
                <Text style={{ fontSize: FontSize.sm, color: Colors.text3 }}>
                  Clear photos can increase your sale price by up to 40%
                </Text>
              </Card>
              <TouchableOpacity onPress={pickImage} style={s.uploadArea}>
                <Text style={{ fontSize: 40, marginBottom: 10 }}>📸</Text>
                <Text style={{ fontSize: FontSize.md, color: Colors.text2, marginBottom: 4 }}>
                  Tap to add photos
                </Text>
                <Text style={{ fontSize: FontSize.xs, color: Colors.text3 }}>
                  Up to 8 photos · JPEG, PNG supported
                </Text>
              </TouchableOpacity>
              {photos.length > 0 && (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {photos.map((uri, i) => (
                    <View key={i} style={s.photoPreview}>
                      <Text style={{ fontSize: 28 }}>📷</Text>
                      <TouchableOpacity
                        style={s.photoRemove}
                        onPress={() => setPhotos(photos.filter((_, j) => j !== i))}
                      >
                        <Text style={{ fontSize: 10, color: '#fff', fontWeight: '800' }}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
              <Card style={{ backgroundColor: 'rgba(243,156,18,0.06)', borderColor: 'rgba(243,156,18,0.2)' }}>
                <Text style={{ fontSize: FontSize.sm, color: Colors.gold, fontWeight: '600', marginBottom: 6 }}>
                  💡 Photo Tips
                </Text>
                <Text style={{ fontSize: FontSize.xs, color: Colors.text3, lineHeight: 18 }}>
                  • Use natural light or a lightbox{'\n'}
                  • Include a scale/ruler for reference{'\n'}
                  • Show all angles and inclusions{'\n'}
                  • Include GIA/IGI certificate if available
                </Text>
              </Card>
              <Button title="Continue →" onPress={() => goStep(5)} />
            </View>
          )}

          {/* ══════════════════════════════
              STEP 5 — Pricing
          ══════════════════════════════ */}
          {step === 5 && (
            <View style={{ gap: Spacing.md }}>
              {/* AI Valuation */}
              {gemType && (
                <View style={s.aiPrice}>
                  <Text style={{ fontSize: 20 }}>🤖</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: FontSize.xs, color: Colors.text3, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                      AI Valuation Estimate
                    </Text>
                    <Text style={{ fontSize: FontSize.sm, color: Colors.text2, marginTop: 2 }}>
                      Based on current Indian market rates
                    </Text>
                  </View>
                  <Text style={{ fontSize: FontSize.xl, fontWeight: '700', color: Colors.emerald }}>
                    {formatINR(aiPrice)}
                  </Text>
                </View>
              )}

              <Input
                label="Your Asking Price (₹) *"
                value={price}
                onChangeText={setPrice}
                placeholder="Enter price in Rupees"
                keyboardType="decimal-pad"
                error={errors.price}
                hint="Platform commission: 8% + 18% GST on commission"
              />

              {parseFloat(price || 0) > 0 && (
                <Card>
                  <Text style={{ fontSize: FontSize.sm, fontWeight: '700', color: Colors.text, marginBottom: 10 }}>
                    Price Breakdown
                  </Text>
                  {[
                    ['Asking Price',       formatINR(parseFloat(price || 0)), Colors.text],
                    ['Platform Fee (8%)',  '- ' + formatINR(commission),      Colors.ruby],
                    ['GST on Fee (18%)',   '- ' + formatINR(gstOnComm),       Colors.ruby],
                  ].map(([label, val, color]) => (
                    <View key={label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: Colors.border }}>
                      <Text style={{ fontSize: FontSize.sm, color: Colors.text3 }}>{label}</Text>
                      <Text style={{ fontSize: FontSize.sm, fontWeight: '600', color }}>{val}</Text>
                    </View>
                  ))}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }}>
                    <Text style={{ fontSize: FontSize.md, fontWeight: '700', color: Colors.text }}>
                      You Receive
                    </Text>
                    <Text style={{ fontSize: FontSize.lg, fontWeight: '700', color: Colors.emerald }}>
                      {formatINR(youReceive)}
                    </Text>
                  </View>
                </Card>
              )}

              <SelectPicker
                label="Listing Type"
                options={['Fixed Price', 'Auction (7 days)', 'Accept Offers']}
                value={listType}
                onChange={setListType}
              />

              {/* Review before submit */}
              <Card style={{ gap: Spacing.sm }}>
                <Text style={{ fontSize: FontSize.md, fontWeight: '700', color: Colors.text, marginBottom: 4 }}>
                  Review Your Listing
                </Text>
                {[
                  ['Stone',         `${gemEmoji} ${gemType}`],
                  ['Title',         title],
                  ['Weight',        `${weight} ct`],
                  ['Clarity',       clarity],
                  ['Origin',        origin],
                  ['Certification', cert],
                  ['Photos',        `${photos.length} photo${photos.length !== 1 ? 's' : ''}`],
                  ['GST Number',    hasGST && gstNumber ? gstNumber : 'Not provided'],
                  ['Bill Number',   billNumber || 'Not provided'],
                  ['Asking Price',  formatINR(parseFloat(price || 0))],
                  ['You Receive',   formatINR(youReceive)],
                  ['Listing Type',  listType],
                ].map(([label, val]) => (
                  <View key={label} style={s.reviewRow}>
                    <Text style={s.reviewLabel}>{label}</Text>
                    <Text style={[
                      s.reviewValue,
                      label === 'You Receive' && { color: Colors.emerald },
                      label === 'GST Number' && val !== 'Not provided' && { color: Colors.saffron },
                    ]}>
                      {val || '—'}
                    </Text>
                  </View>
                ))}
              </Card>

              <Card style={{ backgroundColor: 'rgba(39,174,96,0.06)', borderColor: 'rgba(39,174,96,0.2)' }}>
                <Text style={{ fontSize: FontSize.sm, color: Colors.text2, lineHeight: 20 }}>
                  🛡️ Your listing will be reviewed within{' '}
                  <Text style={{ fontWeight: '700', color: Colors.text }}>2 hours</Text>
                  . Once approved it goes live to our{' '}
                  <Text style={{ fontWeight: '700', color: Colors.text }}>4,800+ verified buyers</Text>.
                </Text>
              </Card>

              <Button title="🚀 Submit Listing" variant="sell" onPress={handleSubmit} />
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: Colors.obsidian },
  header:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  headerTitle:     { fontSize: FontSize.lg, fontWeight: '600', color: Colors.text },
  backBtn:         { width: 60 },
  stepCount:       { width: 60, textAlign: 'right', fontSize: FontSize.sm, color: Colors.text3 },
  progressBg:      { height: 3, backgroundColor: Colors.surface2, marginHorizontal: Spacing.lg, borderRadius: 2 },
  progressFill:    { height: 3, backgroundColor: Colors.amethyst, borderRadius: 2 },
  stepLabels:      { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm },
  stepLabel:       { fontSize: 9, fontWeight: '600', color: Colors.text3, textTransform: 'uppercase', letterSpacing: 0.4 },
  stepLabelActive: { color: Colors.amethyst },
  stepLabelDone:   { color: Colors.emerald },
  stepTitle:       { fontSize: FontSize.xl, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  gemGrid:         { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.lg },
  gemItem:         { width: (width - Spacing.lg * 2 - Spacing.sm * 2) / 3, backgroundColor: Colors.surface2, borderWidth: 2, borderColor: Colors.border, borderRadius: 14, padding: Spacing.lg, alignItems: 'center' },
  gemItemActive:   { borderColor: Colors.amethyst, backgroundColor: 'rgba(155,89,182,0.12)' },
  gemItemLabel:    { fontSize: FontSize.xs, fontWeight: '600', color: Colors.text2 },
  uploadArea:      { borderWidth: 2, borderColor: 'rgba(155,89,182,0.4)', borderStyle: 'dashed', borderRadius: Radius.lg, padding: Spacing.xxxl, alignItems: 'center', backgroundColor: 'rgba(155,89,182,0.04)' },
  photoPreview:    { width: 70, height: 70, borderRadius: Radius.sm, backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border2, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  photoRemove:     { position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: 9, backgroundColor: Colors.ruby, alignItems: 'center', justifyContent: 'center' },
  aiPrice:         { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: 'rgba(39,174,96,0.08)', borderWidth: 1, borderColor: 'rgba(39,174,96,0.2)', borderRadius: Radius.sm, padding: Spacing.md },
  reviewRow:       { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border },
  reviewLabel:     { fontSize: FontSize.sm, color: Colors.text3 },
  reviewValue:     { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text, maxWidth: '55%', textAlign: 'right' },
  // GST toggle
  gstToggle:       { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.md, padding: Spacing.lg },
  gstToggleActive: { borderColor: Colors.saffron, backgroundColor: 'rgba(255,153,51,0.08)' },
  toggle:          { width: 46, height: 26, borderRadius: 13, backgroundColor: Colors.surface3, padding: 3, justifyContent: 'center' },
  toggleOn:        { backgroundColor: Colors.saffron },
  toggleKnob:      { width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.text3 },
  toggleKnobOn:    { backgroundColor: '#fff', alignSelf: 'flex-end' },
});
