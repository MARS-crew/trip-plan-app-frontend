import React from 'react';
import { Text, View } from 'react-native';

import { RobotIcon } from '@/assets/icons';
import type { ChatMessage } from '@/types/chat';

export interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export const ChatMessageBubble = React.memo<ChatMessageBubbleProps>(({ message }) => {
  if (message.role === 'user') {
    return (
      <View className="mb-3 items-end px-4">
        <View className="max-w-[80%] bg-main px-4 py-3" style={{ borderRadius: 16 }}>
          <Text className="font-pretendardMedium text-p1 text-white">{message.content}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mb-3 flex-row items-start px-4">
      <View
        className="items-center justify-center rounded-full bg-chatHeaderCircleBackground"
        style={{ width: 28, height: 28, marginTop: 2 }}>
        <RobotIcon width={14} height={14} />
      </View>
      <View
        className="ml-2 max-w-[75%] bg-chatHeaderCircleBackground px-3 py-3"
        style={{ borderRadius: 16 }}>
        <Text className="font-pretendardMedium text-p1 text-black">{message.content}</Text>
      </View>
    </View>
  );
});

ChatMessageBubble.displayName = 'ChatMessageBubble';

export default ChatMessageBubble;
