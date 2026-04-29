export type MyPageStatType = 'map' | 'bookmark' | 'marker';

export interface MyPageStatItem {
  id: string;
  label: string;
  value: number;
  type: MyPageStatType;
}

export type MyPageSettingType = 'account' | 'notification';

export interface MyPageSettingItem {
  id: string;
  title: string;
  description: string;
  type: MyPageSettingType;
}
