import { useState, useRef, useCallback } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import type { RequiredFieldKey, SectionKey, SignUpFormData } from '@/types/signup';
import { isValidPassword, isPasswordMatching } from '@/utils/validators';

export const useFormValidation = () => {
  const [showFieldErrors, setShowFieldErrors] = useState<boolean>(false);
  const fieldPositionsRef = useRef<Partial<Record<RequiredFieldKey, number>>>({});
  const sectionYRef = useRef<Record<SectionKey, number>>({
    account: 0,
    profile: 0,
    email: 0,
  });

  const registerSectionY = useCallback(
    (section: SectionKey) => (event: LayoutChangeEvent) => {
      sectionYRef.current[section] = event.nativeEvent.layout.y;
    },
    [],
  );

  const registerFieldPosition = useCallback(
    (field: RequiredFieldKey, section: SectionKey) => (event: LayoutChangeEvent) => {
      const sectionY = sectionYRef.current[section] ?? 0;
      fieldPositionsRef.current[field] = sectionY + event.nativeEvent.layout.y;
    },
    [],
  );

  const getFirstInvalidField = useCallback(
    (
      formData: SignUpFormData,
      isIdVerified: boolean,
      isPasswordValid: boolean,
      isPasswordMatched: boolean,
      isEmailVerified: boolean,
    ): RequiredFieldKey | null => {
      if (formData.accountId.trim().length === 0 || !isIdVerified) return 'accountId';
      if (formData.nickname.trim().length === 0) return 'nickname';
      if (formData.password.trim().length === 0 || !isPasswordValid) return 'password';
      if (formData.passwordConfirm.trim().length === 0 || !isPasswordMatched)
        return 'passwordConfirm';
      if (formData.name.trim().length === 0) return 'name';
      if (formData.birthDate.trim().length === 0) return 'birthDate';
      if (formData.gender.length === 0) return 'gender';
      if (formData.country.length === 0) return 'country';
      if (formData.email.trim().length === 0 || !isEmailVerified) return 'email';
      return null;
    },
    [],
  );

  const handleIsPasswordValid = useCallback((password: string): boolean => {
    if (password.length === 0) return true;
    return isValidPassword(password);
  }, []);

  const handleIsPasswordMatched = useCallback(
    (password: string, passwordConfirm: string): boolean => {
      if (!password || !passwordConfirm) return true;
      return isPasswordMatching(password, passwordConfirm);
    },
    [],
  );

  return {
    showFieldErrors,
    setShowFieldErrors,
    fieldPositionsRef,
    sectionYRef,
    registerSectionY,
    registerFieldPosition,
    getFirstInvalidField,
    isPasswordValid: handleIsPasswordValid,
    isPasswordMatched: handleIsPasswordMatched,
  };
};
