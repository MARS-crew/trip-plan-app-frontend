import Config from 'react-native-config';

import type { ChatRequest, ChatResponse } from '@/types/chat';

export const postChatMessage = async (payload: ChatRequest): Promise<ChatResponse> => {
  const response = await fetch(`${Config.API_BASE_URL}/swagger-ui-ai/api/v1/chat/`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error('채팅 메시지 전송 실패');

  const json = await response.json();
  return (json.data ?? json) as ChatResponse;
};
