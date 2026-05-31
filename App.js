import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './GV_AppContext';
import { AppNavigator } from './GV_AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="light" backgroundColor="#0A0812" translucent />
        <AppNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}
