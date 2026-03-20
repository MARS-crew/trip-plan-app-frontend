import React from 'react';
import { Pressable, Text, View } from 'react-native';

export interface SocialLoginButtonProps {
	label: string;
	bgClassName: string;
	textClassName: string;
	icon: React.ReactElement;
	outlined?: boolean;
}

export const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
	label,
	bgClassName,
	textClassName,
	icon,
	outlined = false,
}) => {
	return (
		<Pressable
			className={`flex-row items-center justify-center w-full h-11 mt-3 px-5 rounded-lg ${bgClassName} ${outlined ? 'border border-borderGray' : ''}`}
			accessibilityRole="button"
			accessibilityLabel={label}>
			<View className="flex-row items-center justify-center">
				<View className="mr-3">{icon}</View>
				<Text className={`text-p1 font-medium fontfamily-No ${textClassName}`}>{label}</Text>
			</View>
		</Pressable>
	);
};

SocialLoginButton.displayName = 'SocialLoginButton';

export default SocialLoginButton;
