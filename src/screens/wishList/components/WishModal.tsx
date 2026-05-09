import { X } from '@/assets/icons';
import React from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import type { WishModalProps } from '@/types/wishlist';

// ============ Component ============
export const WishModal = React.memo<WishModalProps>(
  ({
    isVisible,
    onClose,
    showCloseButton,
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
    primaryTitleTextClass,
  }) => {
    return (
      <Modal transparent visible={isVisible} animationType="fade" onRequestClose={onClose}>
        <Pressable
          className="flex-1 items-center justify-center bg-black/20 px-4"
          onPress={onClose}>
          <Pressable onPress={(e) => e.stopPropagation()} className="w-full">
            <View className={`w-full items-center rounded-xl bg-white p-4 ${ModalContainer}`}>
              {/* 아이콘 영역 */}
              {icon && <View className={`${ModalIcon}`}>{icon}</View>}

              {/* X 버튼 */}
              {showCloseButton ? (
                <Pressable onPress={onClose} className="absolute right-4 top-4 h-6 w-6">
                  <X width={24} height={24} />
                </Pressable>
              ) : null}
              {/* 타이틀 영역 */}
              <Text
                className={`text-center font-pretendardSemiBold text-h2 text-black ${primaryTitleTextClass}`}>
                {title}
              </Text>

              {/* 버튼 영역: 외부에서 주입한 클래스에 따라 가로/세로 결정 */}
              <View className={`w-full ${buttonContainerClass}`}>
                {/* Primary 버튼 */}
                <Pressable
                  onPress={onPrimaryPress}
                  className={`flex-row items-center justify-center rounded-lg ${primaryBtnClass}`}>
                  {primaryIcon && <View className="mr-2">{primaryIcon}</View>}
                  <Text
                    className={`text-center font-pretendardSemiBold text-p1 ${primaryTextClass}`}>
                    {primaryLabel}
                  </Text>
                </Pressable>

                {/* Secondary 버튼 */}
                <Pressable onPress={onSecondaryPress} className={`rounded-lg ${secondaryBtnClass}`}>
                  <Text
                    className={`text-center font-pretendardSemiBold text-p1 ${secondaryTextClass}`}>
                    {secondaryLabel}
                  </Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    );
  },
);

WishModal.displayName = 'WishModal';
export default WishModal;
