import Config from 'react-native-config';

interface EnvConfig {
  apiBaseUrl?: string;
}

const sanitizeBaseUrl = (value: string): string => value.trim().replace(/\/+$/g, '');

export const getEnvConfig = (): EnvConfig => {
  const apiBaseUrl = Config.API_BASE_URL?.trim();

  return {
    apiBaseUrl: apiBaseUrl ? sanitizeBaseUrl(apiBaseUrl) : undefined,
  };
};
