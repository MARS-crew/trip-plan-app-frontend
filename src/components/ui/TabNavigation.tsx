import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import type { IconProps } from '@/assets/icons';

// ============ Types ============
export interface TabItem {
  id: string;
  icon: React.ComponentType<IconProps>;
  activeIcon: React.ComponentType<IconProps>;
  label: string;
}

export interface TabNavigationProps {
  tabs: TabItem[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

// ============ Component ============
export const TabNavigation = React.memo<TabNavigationProps>(
  ({ tabs, activeTabId, onTabChange, className }) => {
    // Hooks
    const handleTabPress = useCallback(
      (tabId: string) => {
        onTabChange(tabId);
      },
      [onTabChange],
    );

    // 렌더링
    return (
      <View className={`flex-row ${className ?? ''}`}>
        {tabs.map((tab) => {
          const isActive = activeTabId === tab.id;
          const IconComponent = isActive ? tab.activeIcon : tab.icon;
          const textColor = isActive ? 'text-main' : 'text-gray';
          const borderColor = isActive ? 'bg-main' : 'bg-borderGray';

          return (
            <TabItem
              key={tab.id}
              tab={tab}
              IconComponent={IconComponent}
              isActive={isActive}
              textColor={textColor}
              borderColor={borderColor}
              onPress={handleTabPress}
            />
          );
        })}
      </View>
    );
  },
);

TabNavigation.displayName = 'TabNavigation';

// ============ Sub Components ============
interface TabItemProps {
  tab: TabItem;
  IconComponent: React.ComponentType<IconProps>;
  isActive: boolean;
  textColor: string;
  borderColor: string;
  onPress: (tabId: string) => void;
}

const TabItem = React.memo<TabItemProps>(
  ({ tab, IconComponent, isActive, textColor, borderColor, onPress }) => {
    const handlePress = useCallback(() => {
      onPress(tab.id);
    }, [tab.id, onPress]);

    return (
      <Pressable
        onPress={handlePress}
        className="flex-1 items-center justify-between"
        accessibilityRole="button"
        accessibilityLabel={tab.label}
        accessibilityState={{ selected: isActive }}>
        {/* 아이콘과 텍스트 */}
        <View className="flex-row items-center mb-[15px]">
          <IconComponent />
          <Text className={`text-p font-medium ml-[6px] ${textColor}`}>
            {tab.label}
          </Text>
        </View>

        {/* 밑 선 */}
        <View className={`w-full ${isActive ? 'h-[2px] -mt-[1px]' : 'h-[1px]'} ${borderColor}`} />
      </Pressable>
    );
  },
);

TabItem.displayName = 'TabItem';

export default TabNavigation;
