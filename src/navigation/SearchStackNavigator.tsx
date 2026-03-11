import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SearchScreen from '@/screens/SearchScreen';
import DestinationDetailScreen from '@/screens/DestinationDetailScreen';

// ============ Types ============
export type SearchStackParamList = {
  SearchMain: undefined;
  DestinationDetail: { destinationId: string };
};

// ============ Constants ============
const Stack = createNativeStackNavigator<SearchStackParamList>();

// ============ Component ============
const SearchStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SearchMain" component={SearchScreen} />
      <Stack.Screen name="DestinationDetail" component={DestinationDetailScreen} />
    </Stack.Navigator>
  );
};

SearchStackNavigator.displayName = 'SearchStackNavigator';

export default SearchStackNavigator;
export { SearchStackNavigator };
