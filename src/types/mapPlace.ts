export type FetchAddressResult = {
  address: string;
  error: string | null;
};

export type FetchPlaceNameResult = {
  name: string;
  types: string[];
  placeId: string | null;
  photoUrl: string | null;
  error: string | null;
};
