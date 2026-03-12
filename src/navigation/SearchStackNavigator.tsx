import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SearchScreen from '@/screens/SearchScreen';
import DestinationDetailScreen from '@/screens/DestinationDetailScreen';
import SelectTripScreen from '@/screens/SelectTripScreen';

// ============ Types ============
export type SearchStackParamList = {
  SearchMain: undefined;
  DestinationDetail: { destinationId: string };
  SelectTrip: undefined;
};

// ============ Constants ============
const Stack = createNativeStackNavigator<SearchStackParamList>();

// ============ Component ============
const SearchStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SearchMain" component={SearchScreen} />
      <Stack.Screen name="DestinationDetail" component={DestinationDetailScreen} />
      <Stack.Screen name="SelectTrip" component={SelectTripScreen} />
    </Stack.Navigator>
  );
};

SearchStackNavigator.displayName = 'SearchStackNavigator';

export default SearchStackNavigator;
export { SearchStackNavigator };
