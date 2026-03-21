import React from 'react';

import MyTripScreen from './myTrip/MyTripScreen';

const MapScreen: React.FC = () => {
  return <MyTripScreen />;
};

MapScreen.displayName = 'MapScreen';

export default MapScreen;
export { MapScreen };