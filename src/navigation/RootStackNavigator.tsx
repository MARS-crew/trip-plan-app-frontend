import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomTabNavigator from './BottomTabNavigator';

import { FindIdScreen } from '@/screens';
import LoginScreen from '@/screens/login';
import WishlistScreen from '@/screens/WishlistScreen';

import type { RootStackParamList } from './types';
import { FindPasswordScreen } from '@/screens';
import EmptyMapScreen from '@/screens/myTrip/EmptyMapScreen';

// ============ Constants ============
const Stack = createNativeStackNavigator<RootStackParamList>();

// ============ Component ============
export const RootStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen name="EmptyMapScreen" component={EmptyMapScreen} />
      <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
      <Stack.Screen name="FindId" component={FindIdScreen} />
      <Stack.Screen name="WishlistScreen" component={WishlistScreen} />
      <Stack.Screen name="FindId" component={FindIdScreen} />
      <Stack.Screen name="WishlistScreen" component={WishlistScreen} />
      <Stack.Screen name="FindPassword" component={FindPasswordScreen} />
    </Stack.Navigator>
  );
};
