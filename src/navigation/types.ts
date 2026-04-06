import type { NavigatorScreenParams } from '@react-navigation/native';

export type SearchStackParamList = {
  SearchMain: undefined;
  SearchResult: { query: string };
  DestinationDetail: { destinationId: string; origin?: 'search' | 'bookmark'; initialTab?: 'info' | 'review' };
  SelectTrip: undefined;
  ReviewWrite: undefined;
};

export type RootTabParamList = {
  Home: undefined;
  Search: NavigatorScreenParams<SearchStackParamList> | undefined;
  Map: undefined;
  Bookmark: undefined;
  MyPage: undefined;
};
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  MainTabs: { screen?: keyof RootTabParamList } | undefined;
  PrivacyPolicyScreen: undefined;
  NightMarketingScreen: undefined;
  MarketingConsentScreen: undefined;
  ProfileEditScreen: undefined;
  ProfileEditDetailScreen: undefined;
  DestinationDetail: { destinationId: string };
  EmptyMapScreen: undefined;
  AccountSettings: undefined;
  NotificationSettings: undefined;
  AddTripScreen: undefined;
  AddTripCalendar: undefined;
  VisitedPlaceListScreen: undefined;
  FindId: undefined;
  WishlistScreen: undefined;
  FindPassword: undefined;
  TripDetail: undefined;
  AddSchedule: undefined;
  AddCalendarMapScreen: undefined;
};


export type HomeStackParamList = {
  HomeMain: undefined;
  Alert: undefined;
};


