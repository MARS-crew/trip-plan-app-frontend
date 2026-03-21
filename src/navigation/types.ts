export type SearchStackParamList = {
  SearchMain: undefined;
  SearchResult: { query: string };
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

export type HomeStackParamList = {
  HomeMain: undefined;
  Alert: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  MainTabs: { screen?: keyof RootTabParamList } | undefined;

  DestinationDetail: { destinationId: string };
  WishlistScreen: undefined;

};
