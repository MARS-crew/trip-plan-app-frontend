import React from 'react';
import { Pressable, TextInput, TouchableOpacity } from 'react-native';
import { SearchArrowIcon, SearchingIcon } from '@/assets/icons';
import { SearchContainer } from '@/components/ui';
import { COLORS } from '@/constants';
import type { WishlistSearchBarProps } from '@/screens/wishList/types';

export const WishlistSearchBar = React.memo<WishlistSearchBarProps>(
  ({ searchInputRef, searchQuery, onChangeText, onFocus, onBlur, onFocusInput, onPressBack }) => {
    return (
      <Pressable className="absolute top-[5px] left-4 right-4 z-50" onPress={onFocusInput}>
        <SearchContainer>
          <TouchableOpacity onPress={onPressBack} className="ml-4 mr-2">
            <SearchArrowIcon />
          </TouchableOpacity>
          <TextInput
            ref={searchInputRef}
            className="flex-1 text-h3 font-pretendardRegular pr-12 text-black"
            placeholder="희망하는 관광지를 검색하세요"
            placeholderTextColor={COLORS.gray}
            value={searchQuery}
            onChangeText={onChangeText}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          <TouchableOpacity className="absolute right-4">
            <SearchingIcon />
          </TouchableOpacity>
        </SearchContainer>
      </Pressable>
    );
  },
);

WishlistSearchBar.displayName = 'WishlistSearchBar';
