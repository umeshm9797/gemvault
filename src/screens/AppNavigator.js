// ============================================================
//  GemVault — Navigation
// ============================================================
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useApp } from '../context/AppContext';
import { Colors, Spacing } from '../theme';

import HomeScreen            from '../screens/HomeScreen';
import SellScreen            from '../screens/SellScreen';
import { MyStonesScreen }    from '../screens/MyStonesScreen';
import { ProfileScreen }     from '../screens/ProfileScreen';
import { AdminScreen }       from '../screens/AdminScreen';
import { ListingDetailScreen } from '../screens/ListingDetailScreen';

const Tab   = createBottomTabNavigator();
const Stack = createStackNavigator();

// ── Custom Tab Bar ──────────────────────────────────────────
function CustomTabBar({ state, descriptors, navigation }) {
  const { state: appState } = useApp();

  const tabs = [
    { name: 'Home',      icon: '🏠', label: 'Home' },
    { name: 'Sell',      icon: '💎', label: 'Sell', sell: true },
    { name: 'MyStones',  icon: '🪨', label: 'My Stones' },
    { name: 'Profile',   icon: '👤', label: 'Profile' },
  ];

  return (
    <View style={{
      flexDirection: 'row',
      backgroundColor: 'rgba(10,8,18,0.97)',
      borderTopWidth: 1,
      borderTopColor: Colors.border,
      paddingBottom: 20,
    }}>
      {state.routes.map((route, index) => {
        const tab     = tabs[index];
        const focused = state.index === index;
        if (!tab) return null;

        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            activeOpacity={0.7}
            style={{ flex: 1, alignItems: 'center', paddingTop: 10, position: 'relative' }}
          >
            {tab.sell ? (
              // Special sell button
              <View style={{
                width: 52, height: 52, borderRadius: 26,
                backgroundColor: focused ? Colors.gold : Colors.amethyst,
                alignItems: 'center', justifyContent: 'center',
                marginTop: -16,
                shadowColor: focused ? Colors.gold : Colors.amethyst,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.6, shadowRadius: 12, elevation: 12,
              }}>
                <Text style={{ fontSize: 24 }}>💎</Text>
              </View>
            ) : (
              <Text style={{
                fontSize: 24,
                transform: [{ scale: focused ? 1.15 : 1 }],
                ...(focused && { filter: 'drop-shadow(0 0 6px rgba(155,89,182,0.8))' }),
              }}>
                {tab.icon}
              </Text>
            )}
            <Text style={{
              fontSize: 10, fontWeight: '600', marginTop: tab.sell ? 4 : 3,
              color: focused ? Colors.amethyst : Colors.text3,
              textTransform: 'uppercase', letterSpacing: 0.4,
            }}>
              {tab.label}
            </Text>
            {/* Notification dot for My Stones */}
            {route.name === 'MyStones' && appState.myStones?.filter(s => s.offers > 0).length > 0 && (
              <View style={{
                position: 'absolute', top: 8, right: '20%',
                width: 8, height: 8, borderRadius: 4,
                backgroundColor: Colors.ruby,
                borderWidth: 1.5, borderColor: Colors.obsidian,
              }} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ── Tab Navigator ───────────────────────────────────────────
function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home"     component={HomeScreen} />
      <Tab.Screen name="Sell"     component={SellScreen} />
      <Tab.Screen name="MyStones" component={MyStonesScreen} />
      <Tab.Screen name="Profile"  component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// ── Root Stack Navigator ────────────────────────────────────
export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: Colors.obsidian } }}>
        <Stack.Screen name="Main"          component={TabNavigator} />
        <Stack.Screen name="ListingDetail" component={ListingDetailScreen}
          options={{ presentation: 'modal', cardStyle: { backgroundColor: Colors.obsidian } }} />
        <Stack.Screen name="Admin"         component={AdminScreen}
          options={{ presentation: 'modal', cardStyle: { backgroundColor: Colors.obsidian } }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
