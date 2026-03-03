/**
 * 환율 기능 테스트 (기본 테스트)
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import ExchangeRateScreen from '../src/screens/ExchangeRateScreen';

test('ExchangeRateScreen renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<ExchangeRateScreen />);
  });
});
