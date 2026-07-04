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

    if (!/^[a-z0-9]+$/.test(normalizedAccountId)) {
      setIdCheckStatus('invalidFormat');
      return;
    }

    if (normalizedAccountId.length < 4 || normalizedAccountId.length > 12) {
      setIdCheckStatus('invalid');
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
