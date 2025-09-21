import Icon from "@thedev132/hackclub-icons-rn";
import * as Haptics from "expo-haptics";
import { PropsWithChildren, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewProps,
  Animated,
} from "react-native";

import { palette } from "../styles/theme";

export interface ButtonProps {
  onPress?: () => void;
  color?: string;
  iconColor?: string;
  fontSize?: number;
  fontWeight?:
    | "normal"
    | "bold"
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900";
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ComponentProps<typeof Icon>["glyph"];
  iconSize?: number;
  iconOffset?: number;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  hapticFeedback?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: palette.primary,
    borderColor: "#e85d6f",
    color: "white",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    minHeight: 44, // Minimum touch target size
    borderWidth: 1,
  },
  buttonText: {
    color: "white",
    fontSize: 17,
    textAlign: "center",
    fontWeight: "600",
  },
});

const getVariantStyles = (variant: ButtonProps["variant"] = "primary") => {
  switch (variant) {
    case "secondary":
      return {
        backgroundColor: palette.slate,
        borderColor: palette.slate,
      };
    case "outline":
      return {
        backgroundColor: "transparent",
        borderColor: palette.primary,
      };
    case "ghost":
      return {
        backgroundColor: "transparent",
        borderColor: "transparent",
      };
    default:
      return {
        backgroundColor: palette.primary,
        borderColor: "#e85d6f",
      };
  }
};

const getSizeStyles = (size: ButtonProps["size"] = "medium") => {
  switch (size) {
    case "small":
      return {
        paddingVertical: 6,
        paddingHorizontal: 12,
        minHeight: 36,
      };
    case "large":
      return {
        paddingVertical: 14,
        paddingHorizontal: 20,
        minHeight: 52,
      };
    default:
      return {
        paddingVertical: 10,
        paddingHorizontal: 16,
        minHeight: 44,
      };
  }
};

export default function Button(
  props: PropsWithChildren<ViewProps & ButtonProps>,
) {
  const [scaleValue] = useState(new Animated.Value(1));

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const variantStyles = getVariantStyles(props.variant);
  const sizeStyles = getSizeStyles(props.size);

  const textColor =
    props.variant === "outline" || props.variant === "ghost"
      ? palette.primary
      : "white";

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <Pressable
        style={{
          ...styles.button,
          ...variantStyles,
          ...sizeStyles,
          ...(props.style as object),
          ...(props.disabled
            ? {
                backgroundColor: palette.muted,
                borderColor: palette.muted,
                opacity: 0.6,
              }
            : {}),
        }}
        onPress={() => {
          if (props.hapticFeedback !== false) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          animatePress();
          props.onPress && props.onPress();
        }}
        onPressIn={() => {
          Animated.timing(scaleValue, {
            toValue: 0.95,
            duration: 100,
            useNativeDriver: true,
          }).start();
        }}
        onPressOut={() => {
          Animated.timing(scaleValue, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }).start();
        }}
        disabled={props.loading || props.disabled}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={
          props.accessibilityLabel ||
          (typeof props.children === "string" ? props.children : "Button")
        }
        accessibilityHint={props.accessibilityHint}
        accessibilityState={{
          disabled: props.disabled || props.loading,
          busy: props.loading,
        }}
      >
        {props.loading && (
          <ActivityIndicator
            size="small"
            color={textColor}
            style={{ marginRight: props.icon || props.children ? 6 : 0 }}
          />
        )}

        {props.icon && !props.loading && (
          <View
            style={{
              width: 24,
              height: 24,
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              paddingBottom: props.iconOffset || 0,
            }}
          >
            <Icon
              size={props.iconSize || 24}
              glyph={props.icon}
              style={{
                color: props.iconColor || props.color || textColor,
              }}
            />
          </View>
        )}

        {props.children && (
          <Text
            style={{
              ...styles.buttonText,
              color: textColor,
              fontSize: props.fontSize || styles.buttonText.fontSize,
              fontWeight: props.fontWeight || styles.buttonText.fontWeight,
              opacity: props.loading ? 0.7 : 1,
            }}
          >
            {props.children}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
}
