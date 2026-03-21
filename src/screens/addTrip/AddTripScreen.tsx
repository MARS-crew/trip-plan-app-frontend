import React, { useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
    CameraIcon,
    RightArrowIcon,
    BackArrow
} from '@/assets/icons';


type AddTripNavigation = NativeStackNavigationProp<RootStackParamList,'AddTripScreen'>;

const AddTripScreen: React.FC = () => {
  const navigation = useNavigation<AddTripNavigation>();
  const [tripName, setTripName] = useState('');

  return (
      <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
          <View className="flex-row items-center h-14 pl-6">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <BackArrow className='w-5 h-5'/>
            </TouchableOpacity>
            <Text numberOfLines={1} className="ml-4 text-h font-bold text-black">여행지 추가</Text>
          </View>

        <View className="flex-1 bg-screenBackground px-8">
          <View className="flex-1 items-center pt-[140px]">
            <View className="relative">
              <Image
                source={require('../../assets/images/thumnail3.png')}
                className="h-[140px] w-[140px] rounded-[20px]"
                resizeMode="cover"
              />

              <TouchableOpacity
                activeOpacity={0.8}
                className="absolute bottom-2 right-2 h-[32px] w-[32px] items-center justify-center rounded-full">
              <CameraIcon width={32} height={32}/>
              </TouchableOpacity>
            </View>

            <Text className="mt-[24px] text-h1 font-bold text-black">
              어디로 여행을 떠나시나요?
            </Text>

            <View className="mt-7 w-[322px] flex-row items-center border-b-2 border-main">
              <TextInput
                placeholder="여행명을 입력하세요"
                placeholderTextColor="#8C7B73"
                value={tripName}
                onChangeText={setTripName}
                className="flex-1 pr-4 text-p1 text-black"
              />
              <TouchableOpacity
                activeOpacity={0.8}
                className={`ml-4 h-[32px] w-[32px] items-center justify-center rounded-full ${tripName.length > 0 ? 'bg-[#DF6C20]' : 'bg-[#F1D6C5]'}`}>
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