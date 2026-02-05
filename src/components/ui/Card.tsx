import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  padding = 'medium',
}) => {
  const theme = useTheme();

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
    };

    // Variant styles
    switch (variant) {
      case 'elevated':
        Object.assign(baseStyle, theme.shadows.md);
        break;
      case 'outlined':
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = theme.colors.border.primary;
        break;
      default:
        Object.assign(baseStyle, theme.shadows.sm);
    }

    // Padding styles
    switch (padding) {
      case 'none':
        // No padding
        break;
      case 'small':
        baseStyle.padding = theme.spacing[3];
        break;
      case 'large':
        baseStyle.padding = theme.spacing[6];
        break;
      default:
        baseStyle.padding = theme.spacing[4];
    }

    return baseStyle;
  };

  return <View style={[getCardStyle(), style]}>{children}</View>;
};