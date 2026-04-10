import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { LoginData, LoginUserDetails } from '@/types/auth';

const AUTH_STORAGE_KEY = 'auth-storage';
const AUTH_PERSIST_VERSION = 2;
const AUTH_TOKEN_SERVICE = 'trip-plan-auth-token';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const saveTokensSecurely = async (tokens: AuthTokens): Promise<void> => {
  await Keychain.setGenericPassword('token', JSON.stringify(tokens), {
    service: AUTH_TOKEN_SERVICE,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
};

const readTokensSecurely = async (): Promise<AuthTokens | null> => {
  const credentials = await Keychain.getGenericPassword({ service: AUTH_TOKEN_SERVICE });

  if (!credentials) {
    return null;
  }

  const parsed = JSON.parse(credentials.password) as Partial<AuthTokens>;

  if (!parsed.accessToken || !parsed.refreshToken) {
    return null;
  }

  return {
    accessToken: parsed.accessToken,
    refreshToken: parsed.refreshToken,
  };
};

const clearTokensSecurely = async (): Promise<void> => {
  await Keychain.resetGenericPassword({ service: AUTH_TOKEN_SERVICE });
};

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: LoginUserDetails | null;
  isAuthenticated: boolean;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setAuthFromLoginData: (loginData: LoginData) => void;
  clearTokens: () => void;
  hydrateAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      setTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken, user: null, isAuthenticated: true });
        void saveTokensSecurely({ accessToken, refreshToken });
      },

      setAuthFromLoginData: (loginData) => {
        set({
          accessToken: loginData.accessToken,
          refreshToken: loginData.refreshToken,
          user: loginData.userDetails,
          isAuthenticated: true,
        });
        void saveTokensSecurely({
          accessToken: loginData.accessToken,
          refreshToken: loginData.refreshToken,
        });
      },

      clearTokens: () => {
        set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false });
        void clearTokensSecurely();
      },

      hydrateAuth: async () => {
        const tokens = await readTokensSecurely();

        if (!tokens) {
          set({ accessToken: null, refreshToken: null, isAuthenticated: false });
          return;
        }

        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          isAuthenticated: true,
        });
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      version: AUTH_PERSIST_VERSION,
      storage: createJSONStorage(() => AsyncStorage),
      migrate: (persistedState) => {
        const state = persistedState as Partial<AuthState> | undefined;

        return {
          user: state?.user ?? null,
        };
      },
      partialize: (state) => ({
        user: state.user,
      }),
    },
  ),
);

void useAuthStore.getState().hydrateAuth();
