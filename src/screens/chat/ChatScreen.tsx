import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { RobotIcon, SendIcon, X, AirplaneIcon } from '@/assets/icons';
import { COLORS } from '@/constants';
import { postChatMessage } from '@/services/chatService';
import type { ChatMessage } from '@/types/chat';

const PROFILE_SIZE = 28;
const PROFILE_ICON_SIZE = 14;
const BUBBLE_RADIUS = 16;
const INPUT_RADIUS = 25;
const SEND_BUTTON_SIZE = 48;

const generateSessionId = (): string =>
  Math.random().toString(36).substring(2) + Date.now().toString(36);

const UserBubble: React.FC<{ content: string }> = ({ content }) => (
  <View className="items-end px-4 mb-3">
    <View className="bg-main px-4 py-3 max-w-[80%]" style={{ borderRadius: BUBBLE_RADIUS }}>
      <Text className="text-p1 text-white font-pretendardMedium">{content}</Text>
    </View>
  </View>
);

const BotBubble: React.FC<{ content: string }> = ({ content }) => (
  <View className="flex-row items-start px-4 mb-3">
    <View
      className="rounded-full bg-chatHeaderCircleBackground items-center justify-center"
      style={{ width: PROFILE_SIZE, height: PROFILE_SIZE, marginTop: 2 }}>
      <RobotIcon width={PROFILE_ICON_SIZE} height={PROFILE_ICON_SIZE} />
    </View>
    <View
      className="ml-2 bg-chatHeaderCircleBackground px-3 py-3 max-w-[75%]"
      style={{ borderRadius: BUBBLE_RADIUS }}>
      <Text className="text-p1 text-black font-pretendardMedium">{content}</Text>
    </View>
  </View>
);

const TypingIndicator: React.FC = () => (
  <View className="flex-row items-start px-4 mb-3">
    <View
      className="rounded-full bg-chatHeaderCircleBackground items-center justify-center"
      style={{ width: PROFILE_SIZE, height: PROFILE_SIZE, marginTop: 2 }}>
      <RobotIcon width={PROFILE_ICON_SIZE} height={PROFILE_ICON_SIZE} />
    </View>
    <View
      className="ml-2 bg-chatHeaderCircleBackground px-4 py-3"
      style={{ borderRadius: BUBBLE_RADIUS }}>
      <ActivityIndicator size="small" color={COLORS.main} />
    </View>
  </View>
);

const EmptyState: React.FC = () => (
  <View className="flex-1 items-center justify-center pb-16">
    <View className="w-16 h-16 items-center justify-center" style={{ borderRadius: BUBBLE_RADIUS }}>
      <AirplaneIcon width={64} height={64} />
    </View>
    <Text className="mt-4 text-h1 font-pretendardBold">안녕하세요!</Text>
    <Text className="mt-[6px] text-p1 text-gray font-pretendardMedium">여행 계획을 도와드릴게요.</Text>
  </View>
);

const ChatScreen: React.FC = () => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const sessionId = useRef(generateSessionId());
  const flatListRef = useRef<FlatList<ChatMessage>>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const handleSend = useCallback(async () => {
    const text = inputText.trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    scrollToBottom();

    try {
      const result = await postChatMessage({
        session_id: sessionId.current,
        message: text,
      });

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'bot',
        content: result.answer,
        recommendedPlaceIds: result.recommended_place_ids,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: 'bot',
          content: '죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.',
        },
      ]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  }, [inputText, isLoading, scrollToBottom]);

  const renderItem = useCallback(({ item }: { item: ChatMessage }) => {
    if (item.role === 'user') {
      return <UserBubble content={item.content} />;
    }
    return <BotBubble content={item.content} />;
  }, []);

  const keyExtractor = useCallback((item: ChatMessage) => item.id, []);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 border-b border-borderGray" style={{ height: 60 }}>
        <View className="flex-row items-center">
          <View className="h-8 w-8 items-center justify-center rounded-full bg-chatHeaderCircleBackground">
            <RobotIcon width={20} height={20} />
          </View>
          <View className="ml-[7px]">
            <Text className="font-pretendardSemiBold text-h3 text-black">Pli AI</Text>
            <Text className="text-p text-gray">여행 계획을 도와드려요</Text>
          </View>
        </View>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          className="h-8 w-8 items-center justify-center rounded-full bg-chatHeaderCircleBackground">
          <X width={14} height={14} />
        </Pressable>
      </View>

      {/* Message List */}
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}>
        <View style={{ flex: 1 }}>
          {messages.length === 0 && !isLoading ? (
            <EmptyState />
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
              onContentSizeChange={scrollToBottom}
              showsVerticalScrollIndicator={false}
              style={{ flex: 1 }}
              ListFooterComponent={isLoading ? <TypingIndicator /> : null}
            />
          )}
        </View>

        {/* Input */}
        <View className="flex-row items-center px-4 py-3 border-t border-borderGray bg-white">
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            placeholder="AI에게 질문해보세요"
            placeholderTextColor={COLORS.gray}
            returnKeyType="send"
            editable={!isLoading}
            className="h-12 flex-1 border border-borderGray px-4 text-p1 text-black"
            style={{ borderRadius: INPUT_RADIUS }}
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!inputText.trim() || isLoading}
            className="ml-3 items-center justify-center rounded-full"
            style={{
              width: SEND_BUTTON_SIZE,
              height: SEND_BUTTON_SIZE,
              backgroundColor:
                inputText.trim() && !isLoading ? COLORS.main : COLORS.buttonDisabled,
            }}>
            <SendIcon width={24} height={24} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
export { ChatScreen };
