import type { ReactElement } from 'react';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';

export type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export interface SocialLoginButtonProps {
  label: string;
  bgClassName: string;
  textClassName: string;
  icon: ReactElement;
  outlined?: boolean;
}
