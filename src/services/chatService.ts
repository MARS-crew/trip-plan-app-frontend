import { getEnvConfig } from '@/config/env';
import { useAuthStore } from '@/store';
import type { ChatRequest, ChatResponse } from '@/types/chat';

const buildChatUrl = (endpoint: string): string => `${getEnvConfig().apiBaseUrl ?? ''}${endpoint}`;

export const postChatMessage = async (payload: ChatRequest): Promise<ChatResponse> => {
  const { accessToken } = useAuthStore.getState();

  const response = await fetch(buildChatUrl('/api/v1/chat'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('채팅 메시지 전송 실패');
  }

  return response.json() as Promise<ChatResponse>;
};
