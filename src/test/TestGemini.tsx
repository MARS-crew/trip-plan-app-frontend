import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const TestGemini = (): React.JSX.Element => {
  const [count, setCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (count > 0) {
      setIsLoaded(true);
    }
  }, [count]);

  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <View className="flex-1 p-3">
      {isLoaded && <Text className="text-teal-500">로드됨</Text>}
      <Text className="text-red-500">count: {count}</Text>
      <TouchableOpacity onPress={handleClick} className="bg-blue-500 p-2">
        <Text className="text-white">증가</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TestGemini;
