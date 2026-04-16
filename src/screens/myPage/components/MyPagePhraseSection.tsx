import React from 'react';
import { View, Text } from 'react-native';

import JapanLanguageIcon from '@/assets/icons/japan_language.svg';
import { CARD_SHADOW } from '@/constants';
import type { GetPapagoPhrase } from '@/types/mypage';

interface MyPagePhraseSectionProps {
  title: string;
  phrases: GetPapagoPhrase[];
}

const MyPagePhraseSection: React.FC<MyPagePhraseSectionProps> = ({ title, phrases }) => {
  return (
    <>
      <View className="ml-1 mt-5 flex-row items-center">
        <JapanLanguageIcon width={16} height={16} />
        <Text className="ml-1.5 font-pretendardSemiBold text-h3 text-black">{title}</Text>
      </View>

      {phrases.length > 0 && (
        <View className="mt-2 overflow-hidden rounded-lg border border-white bg-white" style={CARD_SHADOW}>
          {phrases.map((phrase, index) => (
            <View
              key={`${phrase.targetLang}-${index}`}
              className={`px-4 py-3 ${index !== phrases.length - 1 ? 'border-b border-borderGray' : ''}`}>
              <Text className="font-pretendardBold text-h2 text-black">{phrase.translatedText}</Text>
              <Text className="mt-0.5 text-p text-gray">{phrase.originalText}</Text>
            </View>
          ))}
        </View>
      )}
    </>
  );
};

MyPagePhraseSection.displayName = 'MyPagePhraseSection';

export default MyPagePhraseSection;
export { MyPagePhraseSection };
