import { DeletButton, PhotoCamera } from '@/assets';
import { Asset, PhotoUploaderProps, ReviewPhoto, ReviewPhotoItemProps } from '@/types/review';
import { memo, useCallback } from 'react';
import { Alert, Image, Pressable, Text, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const ALLOWED_TYPES = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const IMAGE_LIBRARY_OPTIONS = {
  mediaType: 'photo' as const,
  selectionLimit: 0,
  quality: 0.8 as const,
  includeExtra: true,
};

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

const validatePhoto = (asset: Asset): string | null => {
  if (asset.type && !ALLOWED_TYPES.includes(asset.type)) {
    return `${asset.fileName}: png, jpg, jpeg, webp만 업로드 가능해요.`;
  }
  if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE_BYTES) {
    return `${asset.fileName}: 10MB 이하 파일만 업로드 가능해요.`;
  }
  return null;
};

const ReviewPhotoItem = memo(({ photo, onRemove }: ReviewPhotoItemProps) => {
  return (
    <View className="relative mb-3 mr-3 h-[72px] w-[72px]">
      <Image
        source={{ uri: photo.uri }}
        className="h-[72px] w-[72px] rounded-xl"
        resizeMode="cover"
      />
      <Pressable
        className="absolute -right-2 -top-2 h-5 w-5 items-center justify-center rounded-full bg-gray"
        onPress={() => onRemove(photo.id)}
        accessibilityRole="button"
        accessibilityLabel="사진 삭제">
        <DeletButton className="h-5 w-5" />
      </Pressable>
    </View>
  );
});

ReviewPhotoItem.displayName = 'ReviewPhotoItem';

const PhotoUploader = ({ photos, maxPhotos = 3, onChangePhotos }: PhotoUploaderProps) => {
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

    if (result.didCancel) return;
    if (result.errorCode) {
      Alert.alert('오류', '사진을 불러오지 못했어요.');
      return;
    }

    const assets = result.assets ?? [];

    const errors = assets.map(validatePhoto).filter(Boolean);
    if (errors.length > 0) {
      Alert.alert('업로드 불가', errors.join('\n'));
      return;
    }

    const nextPhotos = mapAssetsToPhotos(assets);
    if (nextPhotos.length === 0) return;

    onChangePhotos([...photos, ...nextPhotos].slice(0, maxPhotos));
  }, [isPhotoLimitReached, maxPhotos, onChangePhotos, photos]);

  const addButtonBackgroundClass = isPhotoLimitReached ? 'bg-gray-50' : 'bg-white';

  return (
    <View>
      <View className="mb-2 flex-row flex-wrap items-start">
        <Pressable
          className={`mb-3 mr-3 h-[72px] w-[72px] items-center justify-center rounded-lg border border-borderGray ${addButtonBackgroundClass}`}
          onPress={handleAddPhoto}
          accessibilityRole="button"
          accessibilityLabel="사진 추가">
          <PhotoCamera />
          <Text className="mt-1 text-p text-black">
            사진 {photos.length}/{maxPhotos}
          </Text>
        </Pressable>

        {photos.map((photo) => (
          <ReviewPhotoItem key={photo.id} photo={photo} onRemove={handleRemovePhoto} />
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
