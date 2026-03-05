import { create } from 'zustand';
import { DEFAULT_SEARCH_RADIUS_METER } from '../constants';
import type { LatLng, PlaceDetail, PlaceSummary } from '../types';

interface PlaceSearchState {
  center: LatLng;
  radiusMeter: number;
  places: PlaceSummary[];
  selectedPlaceDetail: PlaceDetail | null;
  isSearching: boolean;
  isLoadingDetail: boolean;
  error: string | null;
  setCenter: (center: LatLng) => void;
  setRadiusMeter: (radiusMeter: number) => void;
  setPlaces: (places: PlaceSummary[]) => void;
  setSelectedPlaceDetail: (placeDetail: PlaceDetail | null) => void;
  setIsSearching: (isSearching: boolean) => void;
  setIsLoadingDetail: (isLoadingDetail: boolean) => void;
  setError: (error: string | null) => void;
}

const DEFAULT_CENTER: LatLng = {
  latitude: 37.5665,
  longitude: 126.978,
};

export const usePlaceSearchStore = create<PlaceSearchState>(set => ({
  center: DEFAULT_CENTER,
  radiusMeter: DEFAULT_SEARCH_RADIUS_METER,
  places: [],
  selectedPlaceDetail: null,
  isSearching: false,
  isLoadingDetail: false,
  error: null,
  setCenter: center => set({ center }),
  setRadiusMeter: radiusMeter => set({ radiusMeter }),
  setPlaces: places => set({ places }),
  setSelectedPlaceDetail: selectedPlaceDetail => set({ selectedPlaceDetail }),
  setIsSearching: isSearching => set({ isSearching }),
  setIsLoadingDetail: isLoadingDetail => set({ isLoadingDetail }),
  setError: error => set({ error }),
}));
