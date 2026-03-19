/**
 * @format
 */

import React from 'react';
import { AppRegistry, Text, TextInput } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

// 전역 폰트 설정 - Pretendard 폰트를 기본 폰트로 설정
// 각 fontWeight에 맞는 폰트 파일 매핑
const getFontFamily = (fontWeight) => {
  switch (fontWeight) {
    case '100':
    case '200':
    case '300':
    case '400':
    case 'normal':
      return 'Pretendard-Regular';
    case '500':
      return 'Pretendard-Medium';
    case '600':
      return 'Pretendard-SemiBold';
    case '700':
    case '800':
    case '900':
    case 'bold':
      return 'Pretendard-Bold';
    default:
      return 'Pretendard-Regular';
  }
};

// Text / TextInput 기본 폰트 적용
const defaultFontFamily = getFontFamily('400');

if (Text.defaultProps == null) {
  Text.defaultProps = {};
}
const existingTextStyle = Text.defaultProps.style ?? [];
Text.defaultProps.style = [existingTextStyle, { fontFamily: defaultFontFamily }].flat().filter(Boolean);

if (TextInput.defaultProps == null) {
  TextInput.defaultProps = {};
}
const existingTextInputStyle = TextInput.defaultProps.style ?? [];
TextInput.defaultProps.style = [existingTextInputStyle, { fontFamily: defaultFontFamily }].flat().filter(Boolean);

AppRegistry.registerComponent(appName, () => App);
