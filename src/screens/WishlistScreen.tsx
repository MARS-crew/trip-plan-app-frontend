import React, { useCallback, useRef } from 'react';
import { View, Image, TextInput, TouchableOpacity, Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SearchArrowIcon, SearchingIcon } from '@/assets/icons';
import BottomSheet from '@gorhom/bottom-sheet';
import CustomBottomSheet from '@/components/ui/CustomBottomSheet';
import { SearchContainer } from '@/components/ui';
import { Chip} from '@/components/ui';
import type { RootStackParamList } from '@/navigation/types';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

// ============ Types ============
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// ============ Component ============
const WishlistScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const bottomSheetRef = useRef<BottomSheet>(null);
  // 1. Hooks
  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleExpand = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const handleCollapse = useCallback(() => {
    bottomSheetRef.current?.collapse();
  }, []);

  // 2. 렌더링
  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <View className="flex-1">
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          //임시로 봉천동
          initialRegion={{
            latitude: 37.482476,
            longitude: 126.941574,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}></MapView>

        <View className="absolute top-[5px] left-4 right-4 z-10">
          <SearchContainer>
            {/* 왼쪽: 뒤로가기 버튼 */}
            <TouchableOpacity onPress={handleGoBack} className="ml-4 mr-2">
              <SearchArrowIcon />
            </TouchableOpacity>
            {/* 2. 검색 입력창 */}

            <TextInput
              className="flex-1  text-h3 font-regular pr-12 text-black"
              placeholder="희망하는 관광지를 검색하세요"
              placeholderTextColor="#8C7B73"
            />

            {/* 3. 검색 아이콘 */}
            <TouchableOpacity className="absolute right-4">
              <SearchingIcon />
            </TouchableOpacity>
          </SearchContainer>
        </View>
        <CustomBottomSheet>
          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
            
                      {/* 카테고리 Chip */}
                      <View className="mt-6 px-4 flex-row">
                        <Chip label="관광지" className="mr-2" />
                        <Chip label="문화" className="mr-2" />
                        <Chip label="역사" />
                      </View>
            </Text>
          </View>
        </CustomBottomSheet>
      </View>
    </SafeAreaView>
  );
};

WishlistScreen.displayName = 'WishlistScreen';

export default WishlistScreen;
export { WishlistScreen };
