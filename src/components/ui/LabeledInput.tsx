import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

// ============ Types ============
export interface LabeledInputProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  required?: boolean;
  containerClassName?: string;
}

// ============ Component ============
export const LabeledInput: React.FC<LabeledInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  required = true,
  containerClassName = 'mb-4',
  ...textInputProps
}) => {
  return (
    <View className={containerClassName}>
      <View className="flex-row mb-2">
        <Text className="text-h3 font-semibold text-black">{label} </Text>
        {required && <Text className="text-p1 text-statusError">*</Text>}
      </View>
      <TextInput
        className="w-full h-[46px] bg-inputBackground rounded-xl px-3 text-p1 textstyle-Regular border border-borderGray"
        placeholder={placeholder}
        placeholderTextColor="#8C7B73"
        value={value}
        onChangeText={onChangeText}
        {...textInputProps}
      />
    </View>
  );
};

LabeledInput.displayName = 'LabeledInput';

export default LabeledInput;
