import { AppLogoIcon, GoogleIcon, KakaoIcon, NaverIcon } from '@/assets';
import { LabeledInput } from '@/components';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import React, { useState } from 'react';
import SocialLoginButton from './SocialLoginButton';
import {
	KeyboardAvoidingView,
	Pressable,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LoginScreen: React.FC = () => {
	const navigation = useNavigation<NavigationProp>();
	const [userId, setUserId] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [loginErrorMessage, setLoginErrorMessage] = useState<string>('');

	const hasLoginError = loginErrorMessage.length > 0;
	
	const handleChangeUserId = (value: string): void => {
		setUserId(value);
		if (hasLoginError) {
			setLoginErrorMessage('');
		}
	};

	const handleChangePassword = (value: string): void => {
		setPassword(value);
		if (hasLoginError) {
			setLoginErrorMessage('');
		}
	};

	const handleLogin = (): void => {
// 		if (userId.trim().length === 0 || password.trim().length === 0) {
// 			setLoginErrorMessage('아이디 및 비밀번호를 확인해주세요');
// 			return;
// 		}

		setLoginErrorMessage('');
		navigation.replace('MainTabs', { screen: 'Home' });
	};

	const handleFindId = (): void => {
		navigation.navigate('FindId');
	};

	const handleFindPassword = (): void => {
		navigation.navigate('FindPassword');
	};

	const handleSignUp = (): void => {
		// 회원가입 화면 이동
	};

	// 4. 렌더링
	return (
		<SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
			<KeyboardAvoidingView className="flex-1">
				<ScrollView>
					<View className="items-center px-5 pt-5 pb-8">
						<View className="mt-8 items-center">
							<AppLogoIcon width={64} height={96} />
							<Text className="mt-4 text-p1 font-medium text-gray">똑똑한 여행의 시작 여행추천 AI</Text>
						</View>

						<View 
							className="mt-8 w-full rounded-lg bg-white px-6 py-6"
							style={{
								shadowColor: '#000000',
								shadowOpacity: 0.25,
								shadowRadius: 5,
								shadowOffset: { width: 0, height: 0 },
								elevation: 5,
							}}>
							<LabeledInput
								label="아이디"
								required={false}
								containerClassName=""
								value={userId}
								onChangeText={handleChangeUserId}
								placeholder="아이디를 입력하세요"
								autoCapitalize="none"
								autoCorrect={false}
								returnKeyType="next"
							/>

							<LabeledInput
								label="비밀번호"
								required={false}
								containerClassName="mt-4"
								value={password}
								onChangeText={handleChangePassword}
								placeholder="비밀번호를 입력하세요"
								secureTextEntry
								autoCapitalize="none"
								autoCorrect={false}
								returnKeyType="done"
								onSubmitEditing={handleLogin}
							/>

							{hasLoginError && <Text className="mt-3 text-p text-errmassage">{loginErrorMessage}</Text>}

							<TouchableOpacity
								onPress={handleLogin}
								className="mt-4 h-11 w-full items-center justify-center rounded-lg bg-main"
								accessibilityRole="button"
								accessibilityLabel="로그인">
								<Text className="text-h3 text-white">로그인</Text>
							</TouchableOpacity>

							<View className="mt-4 flex-row items-center justify-center">
								<Pressable onPress={handleFindId} accessibilityRole="button" accessibilityLabel="아이디 찾기">
									<Text className="text-p text-gray">아이디 찾기</Text>
								</Pressable>
								<View className="mx-3 h-3 w-px bg-borderGray" />
								<Pressable onPress={handleFindPassword} accessibilityRole="button" accessibilityLabel="비밀번호 찾기">
									<Text className="text-p text-gray">비밀번호 찾기</Text>
								</Pressable>
								<View className="mx-3 h-3 w-px bg-borderGray" />
								<Pressable onPress={handleSignUp} accessibilityRole="button" accessibilityLabel="회원가입">
									<Text className="text-p text-main">회원가입</Text>
								</Pressable>
							</View>

							<View className="mt-6 flex-row items-center">
								<View className="h-px flex-1 bg-borderGray" />
								<Text className="mx-3 text-p text-gray">소셜 로그인</Text>
								<View className="h-px flex-1 bg-borderGray" />
							</View>
							<View className='mt-3'>
								<SocialLoginButton
									label="카카오로 시작하기"
									bgClassName="bg-kakaoYellow"
									textClassName="text-black"
									icon={<KakaoIcon width={18} height={18} />}
								/>
								<SocialLoginButton
									label="네이버로 시작하기"
									bgClassName="bg-naverGreen"
									textClassName="text-white"
									icon={<NaverIcon width={18} height={18} />}
								/>
								<SocialLoginButton
									label="Google로 시작하기"
									bgClassName="bg-white"
									textClassName="text-black"
									icon={<GoogleIcon width={18} height={18} />}
									outlined
								/>
							</View>	
						</View>

						<Text className="mt-6 text-p text-gray">
							로그인 시 이용약관 및 개인정보처리방침에 동의합니다.
						</Text>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

LoginScreen.displayName = 'LoginScreen';

export default LoginScreen;
export { LoginScreen };
