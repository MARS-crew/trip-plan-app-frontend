import { useState, useCallback } from 'react';
import type { IdCheckStatus } from '@/types/signup';
import { checkDuplicateUserId } from '@/services';
import { showToastMessage } from '@/utils';
import { handleError } from '@/utils/error';

export const useIdVerification = () => {
  const [idCheckStatus, setIdCheckStatus] = useState<IdCheckStatus>('idle');

  const handleCheckId = useCallback(async (accountId: string) => {
    const normalizedAccountId = accountId.trim();

    if (normalizedAccountId.length === 0) {
      setIdCheckStatus('idle');
      return;
    }

    try {
      const isDuplicate = await checkDuplicateUserId(normalizedAccountId);
      setIdCheckStatus(isDuplicate ? 'duplicate' : 'available');
    } catch (error) {
      setIdCheckStatus('error');
      const errMessage = handleError(error);
      showToastMessage(errMessage);
    }
  }, []);

  const resetIdCheckStatus = useCallback(() => {
    setIdCheckStatus('idle');
  }, []);

  return {
    idCheckStatus,
    setIdCheckStatus,
    handleCheckId,
    resetIdCheckStatus,
  };
};
