import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/navigation/types';

export type FindPasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type EmailStatus = 'none' | 'sent' | 'error';
export type CodeStatus = 'none' | 'success' | 'error';
export type TempPasswordStatus = 'none' | 'sent';
