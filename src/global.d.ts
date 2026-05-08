/// <reference types="nativewind/types" />

declare module 'react-native-config' {
  interface NativeConfig {
    API_BASE_URL: string;
    TEMP_TOKEN: string;
    GOOGLE_MAP_API_KEY: string;
  }
  const Config: NativeConfig;
  export default Config;
}
