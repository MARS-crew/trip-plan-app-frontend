export type SearchStackParamList = {
  SearchMain: undefined;
  SearchResult: { query: string };
  DestinationDetail: { destinationId: string };
  SelectTrip: undefined;
  ReviewWrite: undefined;
};

export type RootTabParamList = {
  Home: undefined;
  Search: undefined;
  Map: undefined;
  Bookmark: undefined;
  MyPage: undefined;
};
export type RootStackParamList = {
  Login: undefined;
  MainTabs: { screen?: keyof RootTabParamList } | undefined;
  PrivacyPolicyScreen: undefined;
  NightMarketingScreen: undefined;
  MarketingConsentScreen: undefined;
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
};


export type HomeStackParamList = {
  HomeMain: undefined;
  Alert: undefined;
};


