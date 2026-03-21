import React from 'react';
import { View, Text, Image, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { ContentContainer } from '@/components/ui';
import { CategoryChip, WishContentContainer } from '@/screens/wishList/components';
import { PlaceIcon, HeartIcon, ActiveHeartIcon, VectorIcon } from '@/assets/icons';


export interface PlaceCardProps {
    place: {
        id: string;
        title: string;
        location?: string;
        description: string;
        image: ImageSourcePropType;
        categories?: string[];
    };

    isLiked: boolean;
    onToggleLike: (id: string) => void;
    isTrending?: boolean;
}

export const PlaceCard = React.memo<PlaceCardProps>(
    ({
        place,
        isLiked,
        onToggleLike,
        isTrending = false,
    }) => {


        if (isTrending) {
            return (
                <View className="mb-3 mr-[1px]">
                    <WishContentContainer >
                        <View className="flex-row items-center">
                            <View className="w-28 h-28 rounded-l-lg overflow-hidden shrink-0">
                                <Image
                                    source={place.image}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                            </View>
                            <View className="flex-1 ml-3 pr-5">
                                <Text className="text-h3 text-black font-semibold">{place.title}</Text>
                                <View className="mt-[2px]">
                                    <Text className="text-p text-gray" numberOfLines={2}>{place.description}</Text>
                                </View>
                                {/* 카테고리 칩 */}
                                {place.categories && (
                                    <View className="mt-[6px] flex-row">
                                        {place.categories.map((cat, idx) => (
                                            <CategoryChip key={idx} label={cat} className="mr-2 px-2 py-[2px] rounded-2xl" />
                                        ))}
                                    </View>
                                )}
                            </View>
                            <TouchableOpacity className="mr-4 " onPress={() => onToggleLike(place.id)}>
                                <VectorIcon />
                            </TouchableOpacity>
                        </View>
                    </WishContentContainer>
                </View>
            );
        }
        return (
            <View className=" pb-3 mr-[1px]">
                <WishContentContainer>
                    <View className="flex-row items-center">
                        <View className="w-28 h-28 rounded-l-lg overflow-hidden shrink-0">
                            <Image
                                source={place.image}
                                className="w-full h-full"
                                resizeMode="cover"
                            />
                        </View>
                        <View className="flex-1 ml-3 pr-8">
                            <Text className="text-h3 text-black font-semibold">{place.title}</Text>
                            <View className="flex-row mt-1">
                                <View className="w-3 h-3 top-[3px] mr-1">
                                    <PlaceIcon />
                                </View>
                                <Text className="text-p text-gray font-regular">{place.location}</Text>
                            </View>
                            <View className="mt-2">
                                <Text className="text-p text-gray font-regular" numberOfLines={2}>{place.description}</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            className="mr-4 self-start mt-4 shrink-0"
                            onPress={() => onToggleLike(place.id)}
                        >
                            {isLiked ? <ActiveHeartIcon /> : <HeartIcon />}
                        </TouchableOpacity>
                    </View>
                </WishContentContainer>
            </View>
        );
    },
);

PlaceCard.displayName = 'PlaceCard';
export default PlaceCard;