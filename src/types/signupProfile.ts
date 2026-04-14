import type { LayoutChangeEvent } from 'react-native';

import type { SignUpFormData } from './signup';

export interface ProfileSectionProps {
  formData: SignUpFormData;
  countries: readonly string[];
  showCountryPicker: boolean;
  showFieldErrors: boolean;
  onChangeName: (text: string) => void;
  onChangeBirthDate: (text: string) => void;
  onSelectGender: (gender: 'male' | 'female' | 'other') => void;
  onToggleCountryPicker: () => void;
  onSelectCountry: (country: string) => void;
  onNameLayout: (event: LayoutChangeEvent) => void;
  onBirthDateLayout: (event: LayoutChangeEvent) => void;
  onGenderLayout: (event: LayoutChangeEvent) => void;
  onCountryLayout: (event: LayoutChangeEvent) => void;
}
