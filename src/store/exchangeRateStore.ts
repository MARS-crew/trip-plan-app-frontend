import { create } from 'zustand';
import { ExchangeRateResponse } from '../types';
import { fetchAllExchangeRates, fetchExchangeRateByCurrency } from '../services/exchangeRateService';

interface ExchangeRateStore {
  // State
  exchangeRates: ExchangeRateResponse[];
  isLoading: boolean;
  error: string | null;
  lastFetchedAt: string | null;

  // Actions
  fetchRates: () => Promise<void>;
  fetchRateByCurrency: (currencyCode: string) => Promise<ExchangeRateResponse | null>;
  clearError: () => void;
  reset: () => void;
}

export const useExchangeRateStore = create<ExchangeRateStore>((set) => ({
  // Initial state
  exchangeRates: [],
  isLoading: false,
  error: null,
  lastFetchedAt: null,

  // Actions
  fetchRates: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchAllExchangeRates();
      set({
        exchangeRates: data,
        isLoading: false,
        lastFetchedAt: new Date().toISOString(),
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '환율 정보 조회에 실패했습니다.';
      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  fetchRateByCurrency: async (currencyCode: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchExchangeRateByCurrency(currencyCode);
      set({ isLoading: false });
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '환율 정보 조회에 실패했습니다.';
      set({
        isLoading: false,
        error: errorMessage,
      });
      return null;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set({
      exchangeRates: [],
      isLoading: false,
      error: null,
      lastFetchedAt: null,
    });
  },
}));
