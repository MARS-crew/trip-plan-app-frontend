import Config from 'react-native-config';

import type { BaseResponse } from '@/types';
import type { GetRecentSearch, GetRecentSearchData } from '@/types/research';

// 임시 하드 코딩 토큰, 로그인 구현 후 변경 필요 (token 시간 지날 시 이용 불가)
const TEMP_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJoeWVyaW0iLCJlbWFpbCI6ImNoaGFyaTA3MDhAbmF2ZXIuY29tIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3NzU2NDkxMzYsImV4cCI6MTc3NTY1MjczNn0.82uAVZGAijwubAEXpWqS8gYgQ3LADeeaCvFEG-sC1Vs';

export const getRecentSearches = async (): Promise<GetRecentSearch[]> => {
  const response = await fetch(`${Config.API_BASE_URL}/api/v1/search/recent-searches`, {
    headers: { Authorization: `Bearer ${TEMP_TOKEN}` },
  });
  const json: BaseResponse<GetRecentSearchData> = await response.json();
  return json.data.recentSearches;
};
