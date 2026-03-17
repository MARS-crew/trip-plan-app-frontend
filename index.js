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

// Text 컴포넌트에 기본 폰트 적용
const originalTextRender = Text.render;
Text.render = function (...args) {
  const origin = originalTextRender.call(this, ...args);
  const style = origin.props.style || [];
  const flatStyle = Array.isArray(style) ? style.flat() : [style];
  const fontWeight = flatStyle.find((s) => s?.fontWeight)?.fontWeight || '400';
  const fontFamily = flatStyle.find((s) => s?.fontFamily)?.fontFamily || getFontFamily(String(fontWeight));
  
  return React.cloneElement(origin, {
    style: [{ fontFamily }, ...flatStyle],
  });
};

// TextInput 컴포넌트에 기본 폰트 적용
const originalTextInputRender = TextInput.render;
TextInput.render = function (...args) {
  const origin = originalTextInputRender.call(this, ...args);
  const style = origin.props.style || [];
  const flatStyle = Array.isArray(style) ? style.flat() : [style];
  const fontWeight = flatStyle.find((s) => s?.fontWeight)?.fontWeight || '400';
  const fontFamily = flatStyle.find((s) => s?.fontFamily)?.fontFamily || getFontFamily(String(fontWeight));
  
  return React.cloneElement(origin, {
    style: [{ fontFamily }, ...flatStyle],
  });
};

AppRegistry.registerComponent(appName, () => App);
