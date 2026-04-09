import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { SearchArrowIcon, SearchingIcon } from '@/assets/icons';
import { SearchContainer } from '@/components/ui';
import { COLORS } from '@/constants';
import type { WishlistSearchBarProps } from '@/screens/wishList/types';

export const WishlistSearchBar = React.memo<WishlistSearchBarProps>(
  ({ searchInputRef, searchQuery, onChangeText, onFocus, onBlur, onFocusInput, onPressBack }) => {
    return (
      <SearchContainer className="absolute left-4 right-4 top-[5px] z-50">
        <TouchableOpacity
          onPress={onPressBack}
          className="ml-4 mr-2"
          accessibilityRole="button"
          accessibilityLabel="검색 종료">
          <SearchArrowIcon />
        </TouchableOpacity>
        <TextInput
          ref={searchInputRef}
          className="flex-1 pr-12 font-pretendardRegular text-h3 text-black"
          placeholder="희망하는 관광지를 검색하세요"
          placeholderTextColor={COLORS.gray}
          value={searchQuery}
          onChangeText={onChangeText}
          onPressIn={onFocusInput}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <TouchableOpacity className="absolute right-4">
          <SearchingIcon />
        </TouchableOpacity>
      </SearchContainer>
    );
  },
);

WishlistSearchBar.displayName = 'WishlistSearchBar';
