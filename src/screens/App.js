// ============================================================
//  GemVault — App Entry Point
// ============================================================
import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, Animated } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Font from 'expo-font';
import {
  CormorantGaramond_400Regular,
  CormorantGaramond_700Bold,
  CormorantGaramond_400Regular_Italic,
} from '@expo-google-fonts/cormorant-garamond';
import {
  Outfit_300Light,
  Outfit_400Regular,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';
import { AppProvider } from './src/context/AppContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { Colors } from './src/theme';

// ── Splash Screen ───────────────────────────────────────────
function SplashScreen({ onDone }) {
  const fadeAnim  = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, tension: 100, friction: 8, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
    ]).start();
    const timer = setTimeout(onDone, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient colors={[Colors.obsidian, '#1A0D30', Colors.obsidian]}
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {/* Glow orbs */}
      <View style={{ position: 'absolute', top: '15%', right: '10%', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(155,89,182,0.15)' }} />
      <View style={{ position: 'absolute', bottom: '20%', left: '5%',  width: 160, height: 160, borderRadius: 80,  backgroundColor: 'rgba(39,174,96,0.08)' }} />

      <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }], alignItems: 'center' }}>
        <Text style={{ fontSize: 80, marginBottom: 20 }}>💎</Text>
        <Text style={{ fontSize: 48, fontWeight: '700', color: Colors.amethystLight, letterSpacing: 2, marginBottom: 8 }}>GemVault</Text>
        <Text style={{ fontSize: 16, color: Colors.text2, letterSpacing: 1 }}>Sell Your Precious Stones</Text>
      </Animated.View>

      <View style={{ position: 'absolute', bottom: 60, flexDirection: 'row', gap: 8 }}>
        {[0, 1, 2].map(i => (
          <Animated.View key={i} style={{ width: i === 1 ? 24 : 8, height: 8, borderRadius: 4, backgroundColor: i === 1 ? Colors.amethyst : Colors.surface2 }} />
        ))}
      </View>
    </LinearGradient>
  );
}

// ── Root App ────────────────────────────────────────────────
export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [showSplash, setShowSplash]   = useState(true);

  useEffect(() => {
    (async () => {
      await Font.loadAsync({
        CormorantGaramond_400Regular,
        CormorantGaramond_700Bold,
        CormorantGaramond_400Regular_Italic,
        Outfit_300Light,
        Outfit_400Regular,
        Outfit_600SemiBold,
        Outfit_700Bold,
      });
      setFontsLoaded(true);
    })();
  }, []);

  if (!fontsLoaded || showSplash) {
    return (
      <SplashScreen onDone={() => { if (fontsLoaded) setShowSplash(false); }} />
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor={Colors.obsidian} />
        <AppProvider>
          <AppNavigator />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
