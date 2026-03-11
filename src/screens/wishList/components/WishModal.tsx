import React from 'react';
import { View, Text, Pressable, Modal } from 'react-native';

// ============ Types ============
export interface WishModalProps {
    isVisible: boolean;
    onClose: () => void;
    icon?: React.ReactNode;
    ModalIcon?: string;
    title: string;

    // 버튼 레이아웃 스타일
    buttonContainerClass?: string;

    // 메인 버튼 스타일
    primaryLabel: string;
    ModalContainer: string;
    onPrimaryPress: () => void;
    primaryBtnClass?: string;
    primaryIcon?: React.ReactNode;
    primaryTextClass?: string;
    primaryTitleTextClass?: string;
    // 서브 버튼 스타일
    secondaryLabel: string;
    onSecondaryPress: () => void;
    secondaryBtnClass?: string;
    secondaryTextClass?: string;
}

// ============ Component ============
export const WishModal = React.memo<WishModalProps>(
    ({
        isVisible,
        onClose,
        icon,
        ModalIcon,
        ModalContainer,
        title,
        buttonContainerClass,
        primaryLabel,
        onPrimaryPress,
        primaryIcon,
        primaryBtnClass,
        primaryTextClass,
        secondaryLabel,
        onSecondaryPress,
        secondaryBtnClass,
        secondaryTextClass,
        primaryTitleTextClass
    }) => {
        return (
            <Modal transparent visible={isVisible} animationType="fade" onRequestClose={onClose}>
                <View className="flex-1 justify-center  items-center bg-[#251D18]/20 px-4">
                    <View className={`w-full bg-white rounded-xl p-4 items-center ${ModalContainer}`}>

                        {/* 아이콘 영역 */}
                        {icon && <View className={`${ModalIcon}`}>{icon}</View>}

                        {/* 타이틀 영역 */}
                        <Text className={`text-h2 font-semibold text-center text-black ${primaryTitleTextClass}`}>
                            {title}
                        </Text>

                        {/* 버튼 영역: 외부에서 주입한 클래스에 따라 가로/세로 결정 */}
                        <View className={`w-full ${buttonContainerClass}`}>

                            {/* Primary 버튼 */}
                            <Pressable
                                onPress={onPrimaryPress}
                                className={` flex-row justify-center items-center rounded-lg  ${primaryBtnClass}`}
                            >{primaryIcon && <View className="mr-2">{primaryIcon}</View>}
                                <Text className={`text-center font-semibold text-p1 ${primaryTextClass}`}>
                                    {primaryLabel}
                                </Text>
                            </Pressable>

                            {/* Secondary 버튼 */}
                            <Pressable
                                onPress={onSecondaryPress}
                                className={` rounded-lg  ${secondaryBtnClass}`}
                            >
                                <Text className={`text-center font-semibold text-p1 ${secondaryTextClass}`}>
                                    {secondaryLabel}
                                </Text>
                            </Pressable>

                        </View>
                    </View>
                </View>
            </Modal >
        );
    }
);

WishModal.displayName = 'WishModal';
export default WishModal;