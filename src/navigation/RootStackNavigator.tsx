import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomTabNavigator from './BottomTabNavigator';
import type { RootStackParamList } from './types';
import EmptyMapScreen from '@/screens/EmptyMapScreen';
import AccountSettingsScreen from '@/screens/accountSettings/AccountSettingsScreen';
import NotificationSettingsScreen from '@/screens/notificationSettings/NotificationSettingsScreen';
import AddTripScreen from '@/screens/addTrip/AddTripScreen';

// ============ Constants ============
const Stack = createNativeStackNavigator<RootStackParamList>();

// ============ Component ============
export const RootStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen name="EmptyMapScreen" component={EmptyMapScreen} />
      <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
      <Stack.Screen name="AddTripScreen" component={AddTripScreen} />
    </Stack.Navigator>
  );
};
