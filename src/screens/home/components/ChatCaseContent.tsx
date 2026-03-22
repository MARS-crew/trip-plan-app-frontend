import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

import { AirplaneIcon, RobotIcon } from '@/assets/icons';
import {
  CHAT_CASE_CARD_RADIUS,
  CHAT_CASE_DEFAULT_TOP_SPACING,
  CHAT_CASE_VERTICAL_GAP,
  CHAT_PROFILE_ICON_SIZE,
  CHAT_PROFILE_SIZE,
  CHAT_PROFILE_TO_BUBBLE_GAP,
  CHAT_USER_BUBBLE_TOP_SPACING,
} from '@/screens/home/constants';

const AI_CHAT_IMAGE = require('@/assets/images/aichat.png');

interface ChatCaseContentProps {
  currentCaseIndex: number;
}

export const ChatCaseContent: React.FC<ChatCaseContentProps> = ({ currentCaseIndex }) => {
  if (currentCaseIndex === 1) {
    return (
      <View className="flex-1">
        <View className="items-end pr-4" style={{ marginTop: CHAT_USER_BUBBLE_TOP_SPACING }}>
          <View
            className="bg-main px-4 py-3"
            style={{ borderRadius: CHAT_CASE_CARD_RADIUS }}
          >
            <Text className="text-p1 text-white font-medium">겨울에 가기 좋은 여행지 추천해줘</Text>
          </View>
        </View>

        <View className="px-4 flex-row items-start" style={{ marginTop: CHAT_CASE_VERTICAL_GAP }}>
          <View
            className="rounded-full bg-chatHeaderCircleBackground items-center justify-center"
            style={{ width: CHAT_PROFILE_SIZE, height: CHAT_PROFILE_SIZE }}
          >
            <RobotIcon width={CHAT_PROFILE_ICON_SIZE} height={CHAT_PROFILE_ICON_SIZE} />
          </View>

          <View
            className="mr-[91px] flex-1 bg-chatHeaderCircleBackground px-3"
            style={{ marginLeft: CHAT_PROFILE_TO_BUBBLE_GAP, borderRadius: CHAT_CASE_CARD_RADIUS }}
          >
            <Image source={AI_CHAT_IMAGE} resizeMode="cover" className="mt-3 mb-2 w-full rounded-[16px]" />

            <Text className="text-p1 text-black font-medium">
              겨울에 가기 좋은 여행지를 찾는다면 삿포로를 추천해요.
              {'\n'}
              도시 전체가 새하얀 설경으로 변해 로맨틱한 분위기를 즐길 수 있고, 2월에는 세계적으로
              유명한 눈축제도 열립니다.
              {'\n\n'}
              따뜻한 온천과 미소라멘 같은 겨울 음식까지 더해져 추운 계절에 가장 매력적인
              여행지예요.
            </Text>

            <TouchableOpacity
              className="mt-4 mb-3 h-12 bg-main items-center justify-center"
              style={{ borderRadius: CHAT_CASE_CARD_RADIUS }}
            >
              <Text className="text-h3 text-white font-semibold">상세보기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  if (currentCaseIndex === 2) {
    return (
      <View className="flex-1">
        <View className="items-end pr-4" style={{ marginTop: CHAT_USER_BUBBLE_TOP_SPACING }}>
          <View
            className="bg-main px-4 py-3"
            style={{ borderRadius: CHAT_CASE_CARD_RADIUS }}
          >
            <Text className="text-p1 text-white font-medium">겨울에 가기 좋은 여행지 추천해줘</Text>
          </View>
        </View>

        <View className="px-4 flex-row items-start" style={{ marginTop: CHAT_CASE_VERTICAL_GAP }}>
          <View
            className="rounded-full bg-chatHeaderCircleBackground items-center justify-center"
            style={{ width: CHAT_PROFILE_SIZE, height: CHAT_PROFILE_SIZE }}
          >
            <RobotIcon width={CHAT_PROFILE_ICON_SIZE} height={CHAT_PROFILE_ICON_SIZE} />
          </View>

          <View
            className="self-start max-w-[80%] bg-chatHeaderCircleBackground px-3 py-3"
            style={{ marginLeft: CHAT_PROFILE_TO_BUBBLE_GAP, borderRadius: CHAT_CASE_CARD_RADIUS }}
          >
            <Text className="text-p1 text-black font-medium">삿포로를 추천해요.</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="items-center" style={{ marginTop: CHAT_CASE_DEFAULT_TOP_SPACING }}>
      <View
        className="w-16 h-16 items-center justify-center"
        style={{ borderRadius: CHAT_CASE_CARD_RADIUS }}
      >
        <AirplaneIcon width={64} height={64} />
      </View>
      <Text className="mt-4 text-h1 font-bold">안녕하세요!</Text>
      <Text className="mt-[6px] text-p1 text-gray font-medium">여행 계획을 도와드릴게요.</Text>
    </View>
  );
};