import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomTabNavigator from './BottomTabNavigator';


import WishlistScreen from '@/screens/WishlistScreen';

import type { RootStackParamList } from './types';

// ============ Constants ============
const Stack = createNativeStackNavigator<RootStackParamList>();

// ============ Component ============
export const RootStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />


      <Stack.Screen name="WishlistScreen" component={WishlistScreen} />

    </Stack.Navigator>
  );
};
