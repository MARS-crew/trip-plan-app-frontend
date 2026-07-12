import type { NavigatorScreenParams } from '@react-navigation/native';

import type { NaverSignUpData } from '@/types/auth';

export type SearchStackParamList = {
  SearchMain: undefined;
  SearchResult: { query: string };
  DestinationDetail: {
    destinationId: string;
    origin?: 'search' | 'bookmark';
    initialTab?: 'info' | 'review';
  };
  SelectTrip:
    | { placeId: number; placeName: string; address: string; latitude: number; longitude: number }
    | undefined;
  ReviewWrite: { visitedPlaceId: number; placeName: string; visitedDate: string };
};

export type RootTabParamList = {
  Home: undefined;
  Search: NavigatorScreenParams<SearchStackParamList> | undefined;
  MyTrip: undefined;
  Bookmark: undefined;
  MyPage: undefined;
};
export type RootStackParamList = {
  Login: undefined;
  SignUp: { socialSignUpData?: NaverSignUpData } | undefined;
  MainTabs: { screen?: keyof RootTabParamList } | undefined;
  PrivacyPolicyScreen: undefined;
  NightMarketingScreen: undefined;
  MarketingConsentScreen: undefined;
  TermsScreen: undefined;
  ProfileEditScreen: undefined;
  ProfileEditDetailScreen: undefined;
  DestinationDetail: { destinationId: string };
  EmptyMapScreen: undefined;
  AccountSettings: undefined;
  NotificationSettings: undefined;
  AddTripScreen: undefined;
  AddTripCalendar: {
    title: string;
    imageUrl: string;
    mode?: 'create' | 'editDate';
    tripId?: number;
    startDate?: string;
    endDate?: string;
  };
  VisitedPlaceListScreen: undefined;
  FindId: undefined;
  WishlistScreen: { tripId: number };
  FindPassword: undefined;
  TripShare: { tripId: number } | undefined;
  TripDetail: { tripId: number; initialImageUrl?: string } | undefined;
  AddSchedule:
    | {
        mode?: 'create' | 'edit';
        tripId: number;
        tripTitle: string;
        tripImageUrl?: string;
        date: string;
        tripStartDate?: string;
        tripEndDate?: string;
        tripScheduleId?: number;
        placeId?: number;
        placeName?: string;
        address?: string;
        latitude?: number;
        longitude?: number;
        title?: string;
        startTime?: string;
        endTime?: string;
        memo?: string;
      }
    | undefined;
  AddCalendarMapScreen:
    | {
        tripId?: number;
        tripTitle?: string;
        tripImageUrl?: string;
        date?: string;
        tripStartDate?: string;
        tripEndDate?: string;
        tripScheduleId?: number;
        title?: string;
        startTime?: string;
        endTime?: string;
        memo?: string;
      }
    | undefined;
  ScheduleMap: { tripId: number; tripScheduleId?: number };
  ChatScreen: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  Alert: undefined;
};
