import Config from 'react-native-config';

interface EnvConfig {
  apiBaseUrl?: string;
  googleMapsApiKey?: string;
}

const sanitizeBaseUrl = (value: string): string => value.trim().replace(/\/+$/g, '');

export const getEnvConfig = (): EnvConfig => {
  const apiBaseUrl = Config.API_BASE_URL?.trim();
  const googleMapsApiKey = Config.GOOGLE_MAP_API_KEY?.trim();

  return {
    apiBaseUrl: apiBaseUrl ? sanitizeBaseUrl(apiBaseUrl) : undefined,
    googleMapsApiKey,
  };
};
