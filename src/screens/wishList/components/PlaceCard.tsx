import React from 'react';
import { View, Text, Image, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { ContentContainer } from '@/components/ui';
import { CategoryChip } from '@/screens/wishList/components';
import { PlaceIcon, HeartIcon, ActiveHeartIcon, VectorIcon } from '@/assets/icons';

// 프롭스(Props) 타입 정의
export interface PlaceCardProps {
    place: {
        id: string;
        title: string;
        location?: string;
        description: string;
        image: ImageSourcePropType;
    };
    isLiked: boolean;
    onToggleLike: (id: string) => void;

}


export const PlaceCard = React.memo<PlaceCardProps>(
    ({
        place,
        isLiked,
        onToggleLike,
    }) => {
        return (
            <View className="px-4 pt-3 mr-[1px]">
                <ContentContainer>
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
                            <View className="flex-row mt-1"><PlaceIcon /><Text className="text-p text-gray">{place.location}</Text></View>
                            <View className="mt-2"><Text className="text-p text-gray" numberOfLines={2}>{place.description}</Text></View>
                        </View>
                        <TouchableOpacity
                            className="mr-4 self-start mt-4 shrink-0"
                            onPress={() => onToggleLike(place.id)}
                        >
                            {isLiked ? (
                                <ActiveHeartIcon />
                            ) : (
                                <HeartIcon />
                            )}
                        </TouchableOpacity>
                    </View>
                </ContentContainer>
            </View>

        );
    },
);

PlaceCard.displayName = 'PlaceCard';
export default PlaceCard;
