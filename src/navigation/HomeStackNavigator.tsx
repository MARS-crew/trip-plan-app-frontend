import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { HomeStackParamList } from './types';
import { HomeScreen } from '@/screens';
import AlertScreen from '@/screens/alert';

// ============ Constants ============
const Stack = createNativeStackNavigator<HomeStackParamList>();

// ============ Component ============
export const HomeStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Alert" component={AlertScreen} />
    </Stack.Navigator>
  );
};

HomeStackNavigator.displayName = 'HomeStackNavigator';

export default HomeStackNavigator;
