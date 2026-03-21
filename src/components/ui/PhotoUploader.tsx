import { DeletButton, PhotoCamera } from '@/assets';
import { memo, useCallback } from 'react';
import { Alert, Image, Pressable, Text, View } from 'react-native';
import { Platform } from 'react-native';

const launchImageLibrary = async (options: any): Promise<any> => {
  // 더미 이미지 목록
  const mockAssets = [
    {
      uri: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300&q=80',
      fileName: 'mock_photo_1.jpg',
      type: 'image/jpeg',
    },
    {
      uri: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=300&q=80',
      fileName: 'mock_photo_2.jpg',
      type: 'image/jpeg',
    },
    {
      uri: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=300&q=80',
      fileName: 'mock_photo_3.jpg',
      type: 'image/jpeg',
    },
  ];

  const limit = options?.selectionLimit ?? 1;

  return {
    didCancel: false,
    errorCode: undefined,
    assets: mockAssets.slice(0, limit),
  };
};

// 타입도 임시로 선언
type Asset = {
  uri?: string;
  fileName?: string;
  type?: string;
};

type ImageLibraryOptions = {
  mediaType?: string;
  selectionLimit?: number;
  quality?: number;
};





const IMAGE_LIBRARY_OPTIONS: ImageLibraryOptions = {
  mediaType: 'photo',
  selectionLimit: 0,
  quality: 0.8,
};

export interface ReviewPhoto {
  id: string;
  uri: string;
  fileName?: string;
  type?: string;
}

interface PhotoUploaderProps {
  photos: ReviewPhoto[];
  maxPhotos?: number;
  onChangePhotos: (photos: ReviewPhoto[]) => void;
}

interface ReviewPhotoItemProps {
  photo: ReviewPhoto;
  onRemove: (photoId: string) => void;
}

const createPhotoId = (asset: Asset, index: number): string => {
  const assetKey = asset.fileName ?? asset.uri ?? `photo-${index}`;
  return `${assetKey}-${Date.now()}-${index}`;
};

const mapAssetsToPhotos = (assets: Asset[]): ReviewPhoto[] => {
  return assets
    .filter((asset): asset is Asset & { uri: string } => Boolean(asset.uri))
    .map((asset, index) => ({
      id: createPhotoId(asset, index),
      uri: asset.uri,
      fileName: asset.fileName,
      type: asset.type,
    }));
};

const ReviewPhotoItem = memo(
  ({ photo, onRemove }: ReviewPhotoItemProps) => {
    return (
      <View className="relative h-[72px] w-[72px] mr-3 mb-3">
        <Image
          source={{ uri: photo.uri }}
          className="h-[72px] w-[72px] rounded-xl"
          resizeMode="cover"
        />

        <Pressable
          className="items-center justify-center absolute -right-2 -top-2 h-5 w-5 rounded-full bg-gray"
          onPress={() => onRemove(photo.id)}
          accessibilityRole="button"
          accessibilityLabel="사진 삭제"
        >
          <DeletButton className="w-5 h-5" />
        </Pressable>
      </View>
    );
  },
);

ReviewPhotoItem.displayName = 'ReviewPhotoItem';

const PhotoUploader = ({
  photos,
  maxPhotos = 3,
  onChangePhotos,
}: PhotoUploaderProps) => {
  const isPhotoLimitReached = photos.length >= maxPhotos;

  const handleRemovePhoto = useCallback(
    (photoId: string): void => {
      const nextPhotos = photos.filter((photo) => photo.id !== photoId);
      onChangePhotos(nextPhotos);
    },
    [onChangePhotos, photos],
  );

  const handleAddPhoto = useCallback(async (): Promise<void> => {
    if (isPhotoLimitReached) {
      Alert.alert('안내', `사진은 ${maxPhotos}장까지 첨부할 수 있어요.`);
      return;
    }

    const remainingPhotoCount = maxPhotos - photos.length;

    const result = await launchImageLibrary({
      ...IMAGE_LIBRARY_OPTIONS,
      selectionLimit: remainingPhotoCount,
    });

    if (result.didCancel) {
      return;
    }

    if (result.errorCode) {
      Alert.alert('오류', '사진을 불러오지 못했어요.');
      return;
    }

    const nextPhotos = mapAssetsToPhotos(result.assets ?? []);

    if (nextPhotos.length === 0) {
      return;
    }

    onChangePhotos([...photos, ...nextPhotos].slice(0, maxPhotos));
  }, [isPhotoLimitReached, maxPhotos, onChangePhotos, photos]);

  const addButtonBackgroundClass = isPhotoLimitReached ? 'bg-gray-50' : 'bg-white';

  return (
    <View>
      <View className="mb-2 flex-row flex-wrap items-start">
        <Pressable
          className={`mr-3 mb-3 h-[72px] w-[72px] items-center justify-center rounded-lg border border-borderGray ${
            addButtonBackgroundClass
          }`}
          onPress={handleAddPhoto}
          accessibilityRole="button"
          accessibilityLabel="사진 추가"
        >
          <PhotoCamera />
          <Text className="mt-1 text-p text-black">
            사진 {photos.length}/{maxPhotos}
          </Text>
        </Pressable>

        {photos.map((photo) => (
          <ReviewPhotoItem
            key={photo.id}
            photo={photo}
            onRemove={handleRemovePhoto}
          />
        ))}
      </View>

      {isPhotoLimitReached && (
        <Text className="mt-1 text-xs text-red-500">
          사진은 {maxPhotos}장까지 첨부가 가능합니다
        </Text>
      )}
    </View>
  );
};

export { PhotoUploader };
export default PhotoUploader;

