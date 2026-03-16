import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomTabNavigator from './BottomTabNavigator';
import { FindIdScreen, LoginScreen } from '@/screens';
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
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen name="EmptyMapScreen" component={EmptyMapScreen} />
      <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
      <Stack.Screen name="AddTripScreen" component={AddTripScreen} />
      <Stack.Screen name="FindId" component={FindIdScreen} />
    </Stack.Navigator>
  );
};
