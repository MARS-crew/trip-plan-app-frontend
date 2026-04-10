import React from 'react';
import { Image, Pressable, Text, View, type ImageSourcePropType } from 'react-native';

import { TripStatusChip } from '@/components/ui';
import { PlaceIcon, CalendarWhiteIcon, ChevronDownIcon, ChevronUpIcon } from '@/assets/icons';
import type { TripCardProps } from '@/screens/myTrip/type';

const FALLBACK_IMAGE: ImageSourcePropType = require('@/assets/images/thumnail2.png');

const TripCard = ({
  city,
  dateText,
  scheduleCountText,
  scheduleText,
  imageSource,
  status,
  isOpen,
  onToggle,
  onImagePress,
  children,
}: TripCardProps) => {
  const [resolvedImageSource, setResolvedImageSource] = React.useState<ImageSourcePropType>(
    imageSource || FALLBACK_IMAGE,
  );
  React.useEffect(() => {
    setResolvedImageSource(imageSource || FALLBACK_IMAGE);
  }, [imageSource]);

  const hasDetails = React.Children.count(children) > 0;

  return (
    <View
      className="mt-6 rounded-[8px] bg-white shadow-sm shadow-black/10"
      style={{
        shadowColor: '#000000',
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      }}>
      <View className="overflow-hidden rounded-[8px]">
        <Pressable onPress={onImagePress}>
          <View className="relative">
            <Image
              source={resolvedImageSource}
              className="h-[144px] w-full"
              resizeMode="cover"
              onError={() => setResolvedImageSource(FALLBACK_IMAGE)}
            />

            <View pointerEvents="none" />

            {/*TripStatusChip*/}
            <View className="absolute left-[15px] top-[13px]">
              <TripStatusChip status={status} />
            </View>

            {/*City*/}
            <View className="absolute bottom-3 left-3">
              <Text className="font-pretendardBold text-h1 text-white">{city}</Text>

              {/*Date*/}
              <View className="flex-row items-center">
                <CalendarWhiteIcon width={14} height={14} />
                <Text className="px-1 text-p1 text-white">{dateText}</Text>
              </View>
            </View>
          </View>
        </Pressable>

        {/*schedule*/}
        <Pressable onPress={onToggle} disabled={!hasDetails}>
          <View className="flex-row items-center justify-between px-4 py-3">
            <View className="flex-row items-center">
              <PlaceIcon width={14} height={14} />
              <Text className="ml-1 text-p text-gray">{scheduleText}개의 일정</Text>
              <Text className="ml-3 text-p text-gray">{scheduleCountText}일간</Text>
            </View>

            {/*Toggle*/}
            {hasDetails ? (
              <View className="flex-row items-center">
                <Text className="text-p text-main">{isOpen ? '일정 접기 ' : '전체 보기 '}</Text>

                {isOpen ? (
                  <ChevronUpIcon width={14} height={14} />
                ) : (
                  <ChevronDownIcon width={14} height={14} />
                )}
              </View>
            ) : null}
          </View>
        </Pressable>

        {isOpen && hasDetails && <View className="border-t border-chip px-4 py-4">{children}</View>}
      </View>
    </View>
  );
};

export default TripCard;
