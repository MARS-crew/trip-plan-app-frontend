export type SearchStackParamList = {
  SearchMain: undefined;
  DestinationDetail: { destinationId: string };
  SelectTrip: undefined;
};

export type RootTabParamList = {
  Home: undefined;
  Search: undefined;
  Map: undefined;
  Bookmark: undefined;
  MyPage: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  Alert: undefined;
};

export type RootStackParamList = {
  MainTabs: { screen?: keyof RootTabParamList } | undefined;
  AccountSettings: undefined;
  NotificationSettings: undefined;
  FindId: undefined;
};


export type HomeStackParamList = {
  HomeMain: undefined;
  Alert: undefined;

  DestinationDetail: { destinationId: string };
  WishlistScreen: undefined;

};
