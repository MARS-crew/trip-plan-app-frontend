import Config from 'react-native-config';

import { useAuthStore } from '@/store';
import type { BaseResponse } from '@/types';

interface AddWishlistPlacePayload {
	placeId: number;
	sourceType?: 'RECOMMEND' | 'SEARCH' | 'SAVED' | string;
	scheduleDate?: string;
	dayNo?: number;
}

interface AddWishlistPlaceData {
	wishlistPlaceId?: number;
	tripId?: number;
	placeId?: number;
	placeName?: string;
	scheduleDate?: string;
	dayNo?: number;
	sourceType?: 'RECOMMEND' | 'SEARCH' | 'SAVED' | string;
	added: boolean;
}

const getAccessToken = (): string => {
	return useAuthStore.getState().accessToken ?? '';
};

export const addWishlistPlace = async (
	tripId: number,
	payload: AddWishlistPlacePayload,
): Promise<AddWishlistPlaceData> => {
	try {
		const response = await fetch(`${Config.API_BASE_URL}/api/v1/trips/${tripId}/wishlist-places`, {
			method: 'POST',
			headers: {
				Accept: '*/*',
				Authorization: `Bearer ${getAccessToken()}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		});

		if (!response.ok) {
			let detailMessage = '';
			let errorData: Partial<AddWishlistPlaceData> | undefined;

			try {
				const errorJson: { message?: string; data?: Partial<AddWishlistPlaceData> } =
					await response.json();
				detailMessage = errorJson?.message?.trim() ?? '';
				errorData = errorJson?.data;
			} catch {
				// ignore
			}

			if (response.status === 409 && detailMessage.includes('이미 위시리스트에 추가한 장소')) {
				return {
					...errorData,
					tripId: errorData?.tripId ?? tripId,
					placeId: errorData?.placeId ?? payload.placeId,
					sourceType: errorData?.sourceType ?? payload.sourceType,
					added: true,
				};
			}

			const reason = detailMessage || response.statusText || '알 수 없는 오류';
			throw new Error(`위시리스트 장소 추가 실패 (${response.status}): ${reason}`);
		}

		const json: BaseResponse<AddWishlistPlaceData> = await response.json();
		return json.data;
	} catch (error) {
		console.error('addWishlistPlace Error:', error);
		throw error;
	}
};

export type { AddWishlistPlacePayload, AddWishlistPlaceData };
