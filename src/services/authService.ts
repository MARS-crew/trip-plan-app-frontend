import Config from 'react-native-config';

import type { BaseResponse } from '@/types';
import type { EmailRequestData, EmailVerifyData } from '@/types/auth';

export const requestEmailVerification = async (email: string): Promise<EmailRequestData> => {
  try {
    const response = await fetch(`${Config.API_BASE_URL}/api/v1/auth/email-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Config.TEMP_TOKEN}`,
      },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      throw new Error('이메일 인증번호 발송 실패');
    }
    const json: BaseResponse<EmailRequestData> = await response.json();
    return json.data;
  } catch (error) {
    console.error('requestEmailVerification Error:', error);
    throw error;
  }
};

export const verifyEmailCode = async (email: string, code: string): Promise<EmailVerifyData> => {
  try {
    const response = await fetch(`${Config.API_BASE_URL}/api/v1/auth/email-verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Config.TEMP_TOKEN}`,
      },
      body: JSON.stringify({ email, code }),
    });
    if (!response.ok) {
      throw new Error('이메일 인증번호 확인 실패');
    }
    const json: BaseResponse<EmailVerifyData> = await response.json();
    return json.data;
  } catch (error) {
    console.error('verifyEmailCode Error:', error);
    throw error;
  }
};
