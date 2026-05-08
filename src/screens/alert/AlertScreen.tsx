import { BellIcon } from '@/assets';
import { TopBar } from '@/components';
import AlertContainer from '@/components/ui/alertContainer';
import { getAlerts } from '@/services/alertService';
import { AlertItemProps } from '@/types/alert';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AlertScreen: React.FC = () => {
  const navigation = useNavigation();
  const [alertDataList, setAlertDataList] = useState<AlertItemProps[]>([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const alerts = await getAlerts();
        setAlertDataList(alerts);
      } catch {
        setAlertDataList([]);
      }
    };

    fetchAlerts();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <TopBar title="알림" onPress={() => navigation.goBack()} />
      {alertDataList.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-3">
          <BellIcon className="h-12 w-12 text-gray" />
          <Text className="text-h1 text-gray">알림이 없습니다</Text>
        </View>
      ) : (
        <View className="flex-1 items-center">
          {alertDataList.map((item, index) => (
            <AlertContainer key={index} {...item} />
          ))}
        </View>
      )}
    </SafeAreaView>
  );
};

AlertScreen.displayName = 'AlertScreen';

export default AlertScreen;
export { AlertScreen };
