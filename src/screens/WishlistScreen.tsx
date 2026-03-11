import React, { useCallback } from 'react';
import { View, Image, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LeftArrowIcon, SaveIcon, ShareIcon, StarIcon, ScheduleIcon, MarkerIcon, SearchArrowIcon } from '@/assets/icons';
import { SearchContainer } from '@/components/ui';
import type { RootStackParamList } from '@/navigation/types';
import MapView, {
 
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import { IconButton } from '@/screens/destinationDetail/components';
// ============ Types ============
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// ============ Component ============
const WishlistScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  // 1. Hooks
  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSave = useCallback(() => {
    // TODO: 저장 기능 구현
  }, []);

  const handleShare = useCallback(() => {
    // TODO: 공유 기능 구현
  }, []);

  // 2. 렌더링
  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <View className="flex-1">
      <MapView provider={PROVIDER_GOOGLE} style={{ flex: 1 }}initialRegion={{
          latitude: 37.482476,
          longitude:126.941574,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
            </MapView> 
         
                    <View  className="absolute top-4 left-4 right-4 z-10" >  
                  <SearchContainer>
                      {/* 왼쪽: 뒤로가기 버튼 */}
      <TouchableOpacity  onPress={handleGoBack}><View className="top-3">
   <SearchArrowIcon/>
  </View>
  </TouchableOpacity>
  {/* 2. 검색 입력창 */}
  <TextInput
    className="flex-1  px-2 text-base"
    placeholder="희망하는 관광지를 검색하세요"
    placeholderTextColor="#999"
  />

  {/* 3. 검색 아이콘 (필요시) */}

</SearchContainer>
</View>
</View>
             
 
    </SafeAreaView>
  );
};

WishlistScreen.displayName = 'WishlistScreen';

export default WishlistScreen;
export { WishlistScreen };