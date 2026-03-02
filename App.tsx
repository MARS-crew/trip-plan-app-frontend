import React, { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import MapView, {
  LatLng,
  MapPressEvent,
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';

const App = (): JSX.Element => {
  const [start, setStart] = useState<LatLng | null>(null);
  const [end, setEnd] = useState<LatLng | null>(null);

  const routeCoordinates = useMemo<LatLng[]>(() => {
    if (!start || !end) return [];
    return [start, end];
  }, [start, end]);

  const handleMapPress = useCallback((event: MapPressEvent): void => {
    const point = event.nativeEvent.coordinate;

    if (!start) {
      setStart(point);
      return;
    }

    if (!end) {
      setEnd(point);
      return;
    }

    setStart(point);
    setEnd(null);
  }, [start, end]);

  return (
    <View style={{flex: 1}}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 37.541,
          longitude: 126.986,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={handleMapPress}
      >
        {start && <Marker coordinate={start} title="Start" />}
        {end && <Marker coordinate={end} title="End" />}
        {routeCoordinates.length === 2 && (
          <Polyline coordinates={routeCoordinates} strokeWidth={5} />
        )}
      </MapView>
    </View>
  );
};

export default App;