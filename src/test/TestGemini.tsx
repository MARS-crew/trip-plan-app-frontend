import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const TestGemini = (): React.JSX.Element => {
  const [count, setCount] = useState(0);

  const isLoaded = count > 0;

  const handleClick = () => {
    setCount(prev => prev + 1);
  };

  return (
    <View className="flex-1 p-3">
      {isLoaded && <Text className="text-locationTeal">로드됨</Text>}
      <Text className="text-statusError">count: {count}</Text>
      <TouchableOpacity onPress={handleClick} className="bg-main p-2">
        <Text className="text-white">증가</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TestGemini;
