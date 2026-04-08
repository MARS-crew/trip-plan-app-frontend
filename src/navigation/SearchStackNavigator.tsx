import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SearchScreen from '@/screens/SearchScreen';
import SearchResultScreen from '@/screens/SearchResultScreen';
import DestinationDetailScreen from '@/screens/DestinationDetailScreen';
import SelectTripScreen from '@/screens/SelectTripScreen';
import ReviewWriteScreen from '@/screens/reviewWrite/ReviewWriteScreen';
import type { SearchStackParamList } from '@/navigation/types';

// ============ Constants ============
const Stack = createNativeStackNavigator<SearchStackParamList>();

// ============ Component ============
const SearchStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SearchMain" component={SearchScreen} />
      <Stack.Screen name="SearchResult" component={SearchResultScreen} />
      <Stack.Screen name="DestinationDetail" component={DestinationDetailScreen} />
      <Stack.Screen name="SelectTrip" component={SelectTripScreen} />
      <Stack.Screen name="ReviewWrite" component={ReviewWriteScreen} />
    </Stack.Navigator>
  );
};

SearchStackNavigator.displayName = 'SearchStackNavigator';

export default SearchStackNavigator;
export { SearchStackNavigator };
