import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomTabNavigator from './BottomTabNavigator';
import { FindIdScreen, LoginScreen, WishlistScreen } from '@/screens';

import type { RootStackParamList } from './types';
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
      <Stack.Screen name="FindId" component={FindIdScreen} />
      <Stack.Screen name="WishlistScreen" component={WishlistScreen} />
    </Stack.Navigator>
  );
};
