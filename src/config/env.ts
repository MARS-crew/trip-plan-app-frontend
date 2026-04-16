import Config from 'react-native-config';

interface EnvConfig {
  apiBaseUrl?: string;
  tempToken?: string;
}

const sanitizeBaseUrl = (value: string): string => value.trim().replace(/\/+$/g, '');
const sanitizeToken = (value: string): string => value.replace(/^Bearer\s+/i, '').trim();

export const getEnvConfig = (): EnvConfig => {
  const apiBaseUrl = Config.API_BASE_URL?.trim();
  const tempToken = Config.TEMP_TOKEN?.trim();

  return {
    apiBaseUrl: apiBaseUrl ? sanitizeBaseUrl(apiBaseUrl) : undefined,
    tempToken: tempToken ? sanitizeToken(tempToken) : undefined,
  };
};
