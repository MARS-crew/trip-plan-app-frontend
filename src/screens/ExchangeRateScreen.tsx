import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useExchangeRateStore } from '../store/exchangeRateStore';
import { ExchangeRateList } from '../components/ui/ExchangeRateList';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
});

/**
 * 환율 정보 화면
 * API에서 환율 데이터를 가져와서 표시합니다.
 */
export const ExchangeRateScreen: React.FC = () => {
  const {
    exchangeRates,
    isLoading,
    error,
    fetchRates,
    clearError,
  } = useExchangeRateStore();

  // 화면 마운트 시 환율 정보 가져오기
  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  const handleRetry = () => {
    clearError();
    fetchRates();
  };

  const handleRefresh = async () => {
    await fetchRates();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ExchangeRateList
        rates={exchangeRates}
        isLoading={isLoading}
        error={error}
        onRefresh={handleRefresh}
        onRetry={handleRetry}
      />
    </SafeAreaView>
  );
};

export default ExchangeRateScreen;
