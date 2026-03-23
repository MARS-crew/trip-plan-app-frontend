import React from 'react';
import { Image, ScrollView, TouchableOpacity, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { COLORS } from '@/constants';
import BackArrow from '@/assets/icons/backArrow.svg';
import MarkerGrayIcon from '@/assets/icons/marker-gray.svg';
import VectorGrayIcon from '@/assets/icons/vectorgray.svg';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface VisitedPlaceItem {
	id: string;
	date: string;
	title: string;
	location: string;
	tags: string[];
	reviewCta: string;
	imageSource: number;
}

const visitedPlaces: VisitedPlaceItem[] = [
	{
		id: 'visited-1',
		date: '2026.02.05',
		title: '센소지 아사쿠사',
		location: '도쿄, 일본',
		tags: ['관광지', '문화', '역사'],
		reviewCta: '리뷰 확인하기',
		imageSource: require('@/assets/images/thumnail.png'),
	},
	{
		id: 'visited-2',
		date: '2026.02.05',
		title: '센소지 아사쿠사',
		location: '도쿄, 일본',
		tags: ['관광지', '문화', '역사'],
		reviewCta: '리뷰 쓰기',
		imageSource: require('@/assets/images/thumnail.png'),
	},
	{
		id: 'visited-3',
		date: '2026.02.03',
		title: '센소지 아사쿠사',
		location: '도쿄, 일본',
		tags: ['관광지', '문화', '역사'],
		reviewCta: '리뷰 쓰기',
		imageSource: require('@/assets/images/thumnail.png'),
	},
];

const cardStyle = {
	shadowColor: COLORS.black,
	shadowOffset: { width: 0, height: 0 },
	shadowOpacity: 0.25,
	shadowRadius: 2,
	elevation: 1,
};

const VisitedPlaceListScreen: React.FC = () => {
	const navigation = useNavigation<NavigationProp>();

	const groupedByDate = React.useMemo(() => {
		const map = new Map<string, VisitedPlaceItem[]>();

		visitedPlaces.forEach(item => {
			const items = map.get(item.date);
			if (items) {
				items.push(item);
			} else {
				map.set(item.date, [item]);
			}
		});

		return Array.from(map.entries());
	}, []);

	return (
		<SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
			<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
				<View className="px-4 pb-8">
					<View className="h-14 flex-row items-center">
						<TouchableOpacity
							activeOpacity={0.8}
							onPress={navigation.goBack}
							className="mr-1 ml-2 h-10 w-10 items-start justify-center">
							<BackArrow width={20} height={20} />
						</TouchableOpacity>
						<Text className="text-h font-bold text-black">방문한 장소 리스트</Text>
					</View>

					{groupedByDate.map(([date, items]) => (
						<View key={date} className="mt-4">
							<Text className="mb-2 text-p1 font-medium text-gray">{date}</Text>

							<View className="gap-3">
								{items.map(item => (
									<View
										key={item.id}
										className="overflow-hidden rounded-lg bg-white"
										style={cardStyle}>
										<View className="flex-row px-3 pb-3 pt-3">
											<Image source={item.imageSource} className="h-28 w-28 rounded-lg" resizeMode="cover" />

											<View className="ml-3 flex-1 pt-5">
												<View className="flex-row items-start justify-between">
													<View className="flex-1 pr-2">
														<Text className="text-h3 font-semibold text-black">{item.title}</Text>
														<View className="mt-1 flex-row items-center">
															<MarkerGrayIcon width={12} height={12} />
															<Text className="ml-1 mt-1 mb-2 text-p text-gray">{item.location}</Text>
														</View>
														<View className="mt-2 flex-row gap-1.5">
															{item.tags.map(tag => (
																<View key={`${item.id}-${tag}`} className="rounded-2xl bg-chip px-2 py-0.5">
																	<Text className="text-p text-gray">{tag}</Text>
																</View>
															))}
														</View>
													</View>

													<View className="pt-[21px]">
														<VectorGrayIcon width={14} height={14} />
													</View>
												</View>
											</View>
										</View>

										<View className="h-px bg-chip" />

										<View className="p-3 pt-2.5">
											<TouchableOpacity
												activeOpacity={0.85}
												className="h-11 items-center justify-center rounded-lg border border-borderGray bg-inputBackground">
												<Text className="text-center text-p1 font-semibold text-black">{item.reviewCta}</Text>
											</TouchableOpacity>
										</View>
									</View>
								))}
							</View>
						</View>
					))}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

VisitedPlaceListScreen.displayName = 'VisitedPlaceListScreen';

export default VisitedPlaceListScreen;
export { VisitedPlaceListScreen };
