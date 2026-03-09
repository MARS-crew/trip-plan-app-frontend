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
import { COLORS, TEXT_SIZES } from '@/constants';

import type { RootTabParamList } from './types';

// ============ Constants ============
const Tab = createBottomTabNavigator<RootTabParamList>();

const ICON_SIZE = 24;
const INDICATOR_HEIGHT = 2;
const INDICATOR_BORDER_RADIUS = 1.5;
const SPACING = 4;
const TAB_BAR_HORIZONTAL_PADDING = 0;
const TRANSPARENT = 'transparent';

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
  const textColor = isActive ? COLORS.main : COLORS.gray;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{ flex: 1 }}
      className="items-center justify-center">
      {/* 상단 인디케이터 */}
      <View
        style={{
          width: ICON_SIZE,
          height: INDICATOR_HEIGHT,
          borderRadius: INDICATOR_BORDER_RADIUS,
          backgroundColor: isActive ? COLORS.main : TRANSPARENT,
          marginBottom: SPACING,
          alignSelf: 'center',
        }}
      />

      {/* 아이콘 */}
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </View>

      {/* 라벨 */}
      <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: SPACING }}>
        <Text
          numberOfLines={1}
          style={{
            fontSize: TEXT_SIZES.tabBarLabel.fontSize,
            fontWeight: TEXT_SIZES.tabBarLabel.fontWeight,
            color: textColor,
            textAlign: 'center',
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
      tabBarShowLabel: false,
      tabBarStyle: {
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.borderGray,
        paddingTop: 0,
        paddingBottom: Math.max(insets.bottom, 8),
        paddingHorizontal: TAB_BAR_HORIZONTAL_PADDING,
        height: 58 + Math.max(insets.bottom - 8, 0),
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

export default BottomTabNavigator;
