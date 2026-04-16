import type { TermsAgreement } from './signup';

export interface TermsSectionProps {
  termsAgreement: TermsAgreement;
  onTermsChange: (field: keyof TermsAgreement, value: boolean) => void;
  onNavigatePrivacyPolicy: () => void;
  onNavigateMarketingConsent: () => void;
  onNavigateNightMarketing: () => void;
}
