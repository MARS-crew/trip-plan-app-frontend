import React from 'react';
import { View, ViewProps } from 'react-native';

export interface SearchContainerProps extends ViewProps {
  children: React.ReactNode;
}

export const SearchContainer: React.FC<SearchContainerProps> = ({ children,  ...props }) => {
  return (
    <View 
      // absolute 위치와 기본 디자인 레이아웃 설정
   
    
      {...props}
    >
      <View 
        // 흰색 배경, 둥근 모서리, 가로 정렬, 그림자 설정
        className="flex-row items-center bg-white px-4 py-1 border-[1px] rounded-xl  border-borderGray "
      >
        {children}
      </View>
    </View>
  );
};
SearchContainer.displayName = 'SearchContainer';

export default SearchContainer;