import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { ExchangeRateResponse } from '../../types';

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  currencyInfo: {
    flex: 1,
  },
  currencyCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  currencyName: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 2,
  },
  rateBox: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  rateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
  rateGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  rateColumn: {
    flex: 0.48,
  },
  rateLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  rateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  rateDivider: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    marginTop: 8,
    paddingTop: 8,
  },
  rateDividerGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  rateDividerSmall: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  rateDividerValue: {
    fontSize: 12,
    color: '#374151',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#4b5563',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  errorText: {
    color: '#dc2626',
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
  },
  headerContainer: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#4b5563',
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: '#4b5563',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingRight: 8,
  },
  headerTitleContainer: {
    flex: 1,
  },
  refreshButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  refreshButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },
  lastUpdateText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
});

interface ExchangeRateItemProps {
  rate: ExchangeRateResponse;
  onPress?: () => void;
}

export const ExchangeRateItem: React.FC<ExchangeRateItemProps> = ({
  rate,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.itemContainer}
    >
      <View style={styles.itemHeader}>
        <View style={styles.currencyInfo}>
          <Text style={styles.currencyCode}>{rate.CUR_UNIT}</Text>
          <Text style={styles.currencyName}>{rate.CUR_NM}</Text>
        </View>
        <View style={styles.rateBox}>
          <Text style={styles.rateText}>
            {rate.DEAL_BAS_R}
          </Text>
        </View>
      </View>

      <View style={styles.rateGrid}>
        <View style={styles.rateColumn}>
          <Text style={styles.rateLabel}>송금 (TTS)</Text>
          <Text style={styles.rateValue}>{rate.TTS}</Text>
        </View>
        <View style={styles.rateColumn}>
          <Text style={styles.rateLabel}>수취 (TTB)</Text>
          <Text style={styles.rateValue}>{rate.ITB}</Text>
        </View>
      </View>

      <View style={styles.rateDivider}>
        <View style={styles.rateDividerGrid}>
          <View>
            <Text style={styles.rateDividerSmall}>장부가격</Text>
            <Text style={styles.rateDividerValue}>{rate.BKPR}</Text>
          </View>
          <View>
            <Text style={styles.rateDividerSmall}>외국환중개 기준율</Text>
            <Text style={styles.rateDividerValue}>{rate.KFTC_DEAL_BAS_R}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

interface ExchangeRateListProps {
  rates: ExchangeRateResponse[];
  isLoading: boolean;
  error: string | null;
  onRefresh?: () => void;
  onRetry?: () => void;
}

export const ExchangeRateList: React.FC<ExchangeRateListProps> = ({
  rates,
  isLoading,
  error,
  onRefresh,
  onRetry,
}) => {
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = React.useCallback(async () => {
    setRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    }
    setRefreshing(false);
  }, [onRefresh]);

  if (isLoading && rates.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>환율 정보를 불러오는 중...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        {onRetry && (
          <TouchableOpacity
            onPress={onRetry}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>다시 시도</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <ScrollView
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        ) : undefined
      }
      style={styles.contentContainer}
    >
      <View style={{ padding: 16 }}>
        <View style={styles.headerRow}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>
              환율 정보
            </Text>
            <Text style={styles.headerSubtitle}>
              {rates.length}개 통화
            </Text>
            <Text style={styles.lastUpdateText}>
              {new Date().toLocaleDateString('ko-KR')}
            </Text>
          </View>
          {onRefresh && (
            <TouchableOpacity
              onPress={handleRefresh}
              style={[
                styles.refreshButton,
                isLoading && styles.refreshButtonDisabled,
              ]}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.refreshButtonText}>로딩 중</Text>
                </>
              ) : (
                <Text style={styles.refreshButtonText}>🔄 새로고침</Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        {rates.length > 0 ? (
          <View>
            {rates.map((rate, index) => (
              <ExchangeRateItem
                key={`${rate.CUR_UNIT}-${index}`}
                rate={rate}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>조회 가능한 환율 정보가 없습니다.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};
