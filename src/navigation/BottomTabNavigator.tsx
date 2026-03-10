import React, { useCallback } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigationState } from '@react-navigation/native';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';

import {
  HomeScreen,
  SearchScreen,
  MapScreen,
  BookmarkScreen,
  MyPageScreen,
} from '@/screens';
import { HomeIcon, SearchIcon, MapIcon, BookmarkIcon, MyPageIcon } from '@/assets/icons';
import { COLORS } from '@/constants';

import type { RootTabParamList } from './types';

// ============ Constants ============
const Tab = createBottomTabNavigator<RootTabParamList>();

const ICON_SIZE = 24;
const TAB_BAR_HORIZONTAL_PADDING = 0;

// ============ Sub Components ============
interface CustomTabBarButtonProps extends BottomTabBarButtonProps {
  children: React.ReactNode;
  routeName: keyof RootTabParamList;
  label: string;
}

const CustomTabBarButton: React.FC<CustomTabBarButtonProps> = ({
  children,
  onPress,
  routeName,
  label,
}) => {
  
  const currentRoute = useNavigationState(
    (state) => state.routes[state.index]?.name as keyof RootTabParamList,
  );

  const isActive = currentRoute === routeName;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-1 items-center justify-center">
      {/* 상단 인디케이터 */}
      <View
        className={`w-6 h-[2px] rounded-[1.5px] mt-1 mb-2 self-center ${
          isActive ? 'bg-main' : 'bg-transparent'
        }`}
      />

      {/* 아이콘 */}
      <View className="items-center justify-center">
        {children}
      </View>

      {/* 라벨 */}
      <View className="items-center justify-center mt-[9px]">
        <Text
          numberOfLines={1}
          className={`text-[10px] font-medium text-center ${isActive ? 'text-main' : 'text-gray'}`}
          style={{
            includeFontPadding: false,
            textAlignVertical: 'center',
          }}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

CustomTabBarButton.displayName = 'CustomTabBarButton';

// ============ Main Component ============
const BottomTabNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();

  // Tab Bar Icon 렌더링 함수
  const getTabBarIcon = useCallback(
    (routeName: keyof RootTabParamList, focused: boolean): React.ReactElement => {
      const iconColor = focused ? COLORS.main : COLORS.gray;
      const iconProps = {
        width: ICON_SIZE,
        height: ICON_SIZE,
        fill: iconColor,
        color: iconColor,
      };

      switch (routeName) {
        case 'Home':
          return <HomeIcon {...iconProps} />;
        case 'Search':
          return <SearchIcon {...iconProps} />;
        case 'Map':
          return <MapIcon {...iconProps} />;
        case 'Bookmark':
          return <BookmarkIcon {...iconProps} />;
        case 'MyPage':
          return <MyPageIcon {...iconProps} />;
      }
    },
    [],
  );

  // Screen Options 함수
  const getScreenOptions = useCallback(
    ({ route }: { route: { name: keyof RootTabParamList } }): BottomTabNavigationOptions => ({
      headerShown: false,
      tabBarIcon: ({ focused }) => getTabBarIcon(route.name, focused),
      tabBarActiveTintColor: COLORS.main,
      tabBarInactiveTintColor: COLORS.gray,
      tabBarShowLabel: false,
      tabBarStyle: {
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.borderGray,
        paddingTop: 0,
        paddingBottom: insets.bottom,
        paddingHorizontal: TAB_BAR_HORIZONTAL_PADDING,
        height: 58 + insets.bottom,
        elevation: 0,
        shadowOpacity: 0,
      },
      tabBarItemStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
    }),
    [getTabBarIcon, insets.bottom],
  );

  // TabBarButton을 래핑하는 함수
  const createTabBarButton = useCallback(
    (routeName: keyof RootTabParamList, label: string) =>
      (props: BottomTabBarButtonProps) => (
        <CustomTabBarButton {...props} routeName={routeName} label={label} />
      ),
    [],
  );

  return (
    <Tab.Navigator screenOptions={getScreenOptions}>
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ tabBarButton: createTabBarButton('Search', '검색') }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{ tabBarButton: createTabBarButton('Map', '내여행') }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarButton: createTabBarButton('Home', '홈') }}
      />
      <Tab.Screen
        name="Bookmark"
        component={BookmarkScreen}
        options={{ tabBarButton: createTabBarButton('Bookmark', '저장') }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPageScreen}
        options={{ tabBarButton: createTabBarButton('MyPage', '마이페이지') }}
      />
    </Tab.Navigator>
  );
};

BottomTabNavigator.displayName = 'BottomTabNavigator';

export default BottomTabNavigator;
export { BottomTabNavigator };