import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';

const TestGemini = (): React.JSX.Element => {
  const [count, setCount] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (count > 0) {
      setLoaded(true);
    }
  }, []);

  const onClick = () => {
    setCount(count + 1);
  };

  return (
    <View style={styles.container}>
      {loaded && <Text style={{ color: '#30A69A' }}>로드됨</Text>}
      <Text style={{ color: '#FF0000' }}>count: {count}</Text>
      <TouchableOpacity onPress={onClick} style={styles.button}>
        <Text style={{ color: COLORS.white }}>증가</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 13,
  },
  button: {
    backgroundColor: '#3B82F6',
    padding: 8,
  },
});

export default TestGemini;
