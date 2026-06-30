/// <reference types="nativewind/types" />

declare module 'react-native-config' {
  interface NativeConfig {
    API_BASE_URL: string;
    NAVER_CLIENT_ID: string;
    NAVER_CLIENT_SECRET: string;
    TEMP_TOKEN: string;
    GOOGLE_MAP_API_KEY: string;
    GOOGLE_WEB_CLIENT_ID: string;
    CHOTTU_LINK_BASE_URL?: string;
  }
  const Config: NativeConfig;
  export default Config;
}
