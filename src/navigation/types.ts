export type SearchStackParamList = {
  SearchMain: undefined;
  DestinationDetail: { destinationId: string };
  SelectTrip: undefined;
  ReviewWrite : undefined;
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
  AccountSettings: undefined;
  NotificationSettings: undefined;
  FindId: undefined;
  DestinationDetail: { destinationId: string };
  WishlistScreen: undefined;
  FindPassword: undefined;
};


export type HomeStackParamList = {
  HomeMain: undefined;
  Alert: undefined;
};
