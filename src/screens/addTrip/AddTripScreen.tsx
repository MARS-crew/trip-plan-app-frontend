import React, { useState } from 'react';
import { Image, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { launchImageLibrary } from 'react-native-image-picker';

import { TopBar } from '@/components';
import { COLORS } from '@/constants';
import type { RootStackParamList } from '@/navigation/types';
import { CameraIcon, RightArrowIcon } from '@/assets/icons';

type AddTripNavigation = NativeStackNavigationProp<RootStackParamList, 'AddTripScreen'>;

const AddTripScreen: React.FC = () => {
  const navigation = useNavigation<AddTripNavigation>();
  const [tripName, setTripName] = useState('');
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

  const handlePickTripImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 0.9,
    });

    setSelectedImageUri(result.assets?.[0]?.uri ?? null);
  };

  const handleNavigateToCalendar = (): void => {
    if (!tripName.trim()) {
      ToastAndroid.show('여행명을 입력해주세요.', ToastAndroid.SHORT);
      return;
    }

    navigation.navigate('AddTripCalendar', {
      title: tripName.trim(),
      imageUrl: selectedImageUri ?? 'https://cdn.lets-trip.com/trips/default.jpg',
    });
  };


  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <TopBar title="일정 추가" onPress={() => navigation.goBack()} />

      <View className="flex-1 bg-screenBackground px-8">
        <View className="flex-1 items-center pt-[140px]">
          <View className="relative">
            <Image
              source={
                selectedImageUri ? { uri: selectedImageUri } : require('../../assets/images/thumnail3.png')
              }
              className="h-[140px] w-[140px] rounded-[20px]"
              resizeMode="cover"
            />

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handlePickTripImage}
              className="absolute bottom-[6px] right-[6px] h-[32px] w-[32px] items-center justify-center rounded-full"
              style={{ backgroundColor: '#251D18CC' }}>
              <CameraIcon width={16} height={16} />
            </TouchableOpacity>
          </View>

          <Text className="mt-[24px] text-h1 font-pretendardBold text-black">
            어디로 여행을 떠나시나요?
          </Text>

          <View className="mt-7 w-[322px] flex-row items-center border-b-2 border-main">
            <TextInput
              placeholder="여행명을 입력하세요"
              placeholderTextColor={COLORS.gray}
              value={tripName}
              onChangeText={setTripName}
              className="flex-1 pr-4 text-p1 text-black"
            />
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleNavigateToCalendar}
              className="ml-4 h-[32px] w-[32px] items-center justify-center rounded-full"
              style={{
                backgroundColor: tripName.length > 0 ? COLORS.main : COLORS.buttonDisabled,
              }}>
              <RightArrowIcon width={16} height={16} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

AddTripScreen.displayName = 'AddTripScreen';

export default AddTripScreen;
export { AddTripScreen };
