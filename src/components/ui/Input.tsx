import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  variant?: 'default' | 'filled' | 'outlined';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  variant = 'outlined',
  ...textInputProps
}) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.md,
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 48,
      paddingHorizontal: theme.spacing[3],
    };

    switch (variant) {
      case 'filled':
        baseStyle.backgroundColor = theme.colors.neutral.gray100;
        if (isFocused) {
          baseStyle.backgroundColor = theme.colors.neutral.gray50;
          baseStyle.borderWidth = 2;
          baseStyle.borderColor = theme.colors.primary.orange;
        }
        break;
      case 'outlined':
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = error 
          ? theme.colors.semantic.error 
          : isFocused 
            ? theme.colors.primary.orange 
            : theme.colors.border.primary;
        baseStyle.backgroundColor = theme.colors.background.secondary;
        break;
      default:
        baseStyle.backgroundColor = theme.colors.background.secondary;
        baseStyle.borderBottomWidth = 1;
        baseStyle.borderBottomColor = error 
          ? theme.colors.semantic.error 
          : isFocused 
            ? theme.colors.primary.orange 
            : theme.colors.border.primary;
    }

    return baseStyle;
  };

  const getInputStyle = (): TextStyle => {
    return {
      flex: 1,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.text.primary,
      paddingVertical: theme.spacing[2],
    };
  };

  return (
    <View style={containerStyle}>
      {label && (
        <Text
          style={{
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.text.primary,
            marginBottom: theme.spacing[2],
          }}
        >
          {label}
        </Text>
      )}
      
      <View style={getContainerStyle()}>
        {leftIcon && (
          <View style={{ marginRight: theme.spacing[2] }}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          {...textInputProps}
          style={[getInputStyle(), inputStyle]}
          onFocus={(e) => {
            setIsFocused(true);
            textInputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            textInputProps.onBlur?.(e);
          }}
          placeholderTextColor={theme.colors.text.light}
        />
        
        {rightIcon && (
          <View style={{ marginLeft: theme.spacing[2] }}>
            {rightIcon}
          </View>
        )}
      </View>
      
      {(error || helperText) && (
        <Text
          style={{
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.fontSize.sm,
            color: error ? theme.colors.semantic.error : theme.colors.text.secondary,
            marginTop: theme.spacing[1],
          }}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
};