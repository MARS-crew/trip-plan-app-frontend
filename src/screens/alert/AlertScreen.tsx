import { TopBar } from '@/components';
import AlertContainer from '@/components/ui/alertContainer';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface AlertProps { 
    title : string;
    time : string;
    weatherInfo : string;
}

const alertData = [
    {title : '일정 안내' , time : '10:30' , weatherInfo : '2시간뒤 도톤보리 방문 일정이 있습니다.'},
    {title : '날씨 안내' , time : '10:30' , weatherInfo : '오늘 구름이 많아 흐릴거 같아요. 조금 따뜻하게 입어 봐요'},
    {title : '날씨 안내' , time : '10:30'  , weatherInfo : '오늘은 비가 올거 같아요 우산을 챙기는게 어떨까요?'}
]

const AlertScreen: React.FC = () => {
    const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <TopBar title="상세 페이지" onPress={() => navigation.goBack()} />
      <View className="flex-1 items-center">
        {alertData.map((item, index) => (
          <AlertContainer key={index} {...item} />
        ))}
      </View>
    </SafeAreaView>
  );
};

AlertScreen.displayName = 'AlertScreen';

export default AlertScreen;
export { AlertScreen };