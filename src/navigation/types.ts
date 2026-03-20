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

export type RootStackParamList = {
  Login: undefined;
  MainTabs: { screen?: keyof RootTabParamList } | undefined;

  DestinationDetail: { destinationId: string };
  WishlistScreen: undefined;

};
