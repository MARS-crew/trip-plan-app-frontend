export interface GetMyPageData {
  nickname: string;
  email: string;
  tripCount: number;
  savedPlaceCount: number;
  visitedPlaceCount: number;
}

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface GetProfileData {
  birth: string;
  countryCode: string;
  gender: Gender;
  name: string;
  nickname: string;
}
