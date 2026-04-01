import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';

import {
  SearchIcon,
  MyTripIcon,
  HomeIcon,
  BookmarkIcon,
  MyPageIcon,
} from '@/assets/icons';
import { COLOR_VALUES } from '@/constants';

// ============ Types ============
interface NavItem {
  id: string;
  icon: React.ComponentType<{ fill?: string; width?: number; height?: number }>;
  label: string;
}

export interface NavigationBarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

// ============ Constants ============
const NAV_ITEMS: NavItem[] = [
  { id: 'search', icon: SearchIcon, label: '검색' },
  { id: 'mytravel', icon: MyTripIcon, label: '내여행' },
  { id: 'home', icon: HomeIcon, label: '홈' },
  { id: 'bookmark', icon: BookmarkIcon, label: '저장' },
  { id: 'mypage', icon: MyPageIcon, label: '마이페이지' },
];

const ICON_SIZE = 24;

// ============ Component ============
export const NavigationBar = React.memo<NavigationBarProps>(
  ({ activeTab, onTabChange }) => {
    // Hooks
    const handleTabPress = useCallback(
      (tabId: string): void => {
        onTabChange(tabId);
      },
      [onTabChange],
    );

    // 렌더링
    return (
      <View className="relative flex-row items-center justify-around w-full h-[58px] bg-white border-t border-borderGray">
        {/* 네비게이션 아이템 */}
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          const IconComponent = item.icon;

          return (
            <NavItem
              key={item.id}
              item={item}
              isActive={isActive}
              IconComponent={IconComponent}
              onPress={handleTabPress}
            />
          );
        })}
      </View>
    );
  },
);

NavigationBar.displayName = 'NavigationBar';

// ============ Sub Components ============
interface NavItemProps {
  item: NavItem;
  isActive: boolean;
  IconComponent: React.ComponentType<{ fill?: string; width?: number; height?: number }>;
  onPress: (tabId: string) => void;
}

const NavItem = React.memo<NavItemProps>(({ item, isActive, IconComponent, onPress }) => {
  const textColor = isActive ? 'text-main' : 'text-gray';
  const iconColor = isActive ? COLOR_VALUES.main : COLOR_VALUES.gray;

  const handlePress = useCallback(() => {
    onPress(item.id);
  }, [item.id, onPress]);

  return (
    <Pressable
      className="flex-1 items-center justify-center h-full py-2"
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={item.label}
      accessibilityState={{ selected: isActive }}>
      <View className="items-center justify-center mb-1">
        <IconComponent fill={iconColor} width={ICON_SIZE} height={ICON_SIZE} />
      </View>
      <Text
        className={`text-[10px] font-pretendardMedium tracking-[0] leading-[13px] ${textColor}`}
        numberOfLines={1}>
        {item.label}
      </Text>
    </Pressable>
  );
});

NavItem.displayName = 'NavItem';