import React, { useCallback } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  HomeScreen,
  SearchScreen,
  MapScreen,
  BookmarkScreen,
  MyPageScreen,
} from '@/screens';
import { HomeIcon, SearchIcon, MapIcon, BookmarkIcon, MyPageIcon } from '@/assets/icons';
import { COLORS, TEXT_SIZES } from '@/constants';

import type { RootTabParamList } from './types';

// ============ Constants ============
const Tab = createBottomTabNavigator<RootTabParamList>();

const ICON_SIZE = 24;

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

      const iconMap: Record<keyof RootTabParamList, React.ReactElement> = {
        Home: <HomeIcon {...iconProps} />,
        Search: <SearchIcon {...iconProps} />,
        Map: <MapIcon {...iconProps} />,
        Bookmark: <BookmarkIcon {...iconProps} />,
        MyPage: <MyPageIcon {...iconProps} />,
      };

      return iconMap[routeName];
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
      tabBarStyle: {
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.borderGray,
        paddingTop: 8,
        paddingBottom: Math.max(insets.bottom, 8),
        height: 58 + Math.max(insets.bottom - 8, 0),
      },
      tabBarLabelStyle: {
        fontSize: TEXT_SIZES.tabBarLabel.fontSize,
        fontWeight: TEXT_SIZES.tabBarLabel.fontWeight,
      },
    }),
    [getTabBarIcon, insets.bottom],
  );

  return (
    <Tab.Navigator screenOptions={getScreenOptions}>
      <Tab.Screen name="Search" component={SearchScreen} options={{ tabBarLabel: '검색' }} />
      <Tab.Screen name="Map" component={MapScreen} options={{ tabBarLabel: '내여행' }} />
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: '홈' }} />
      <Tab.Screen name="Bookmark" component={BookmarkScreen} options={{ tabBarLabel: '저장' }} />
      <Tab.Screen name="MyPage" component={MyPageScreen} options={{ tabBarLabel: '마이페이지' }} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
