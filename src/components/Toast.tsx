import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useEffect, useRef } from "react";
import {
  Animated,
  Text,
  View,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";

import { palette } from "../styles/theme";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onHide: () => void;
  actionText?: string;
  onAction?: () => void;
}

const { width: screenWidth } = Dimensions.get("window");

const getToastConfig = (type: ToastType) => {
  switch (type) {
    case "success":
      return {
        backgroundColor: palette.success,
        icon: "checkmark-circle" as const,
        haptic: Haptics.ImpactFeedbackStyle.Light,
      };
    case "error":
      return {
        backgroundColor: "#ff4757",
        icon: "alert-circle" as const,
        haptic: Haptics.ImpactFeedbackStyle.Heavy,
      };
    case "warning":
      return {
        backgroundColor: palette.warning,
        icon: "warning" as const,
        haptic: Haptics.ImpactFeedbackStyle.Medium,
      };
    case "info":
    default:
      return {
        backgroundColor: palette.info,
        icon: "information-circle" as const,
        haptic: Haptics.ImpactFeedbackStyle.Light,
      };
  }
};

export default function Toast({
  visible,
  message,
  type = "info",
  duration = 4000,
  onHide,
  actionText,
  onAction,
}: ToastProps) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const config = getToastConfig(type);

  useEffect(() => {
    if (visible) {
      // Trigger haptic feedback
      Haptics.impactAsync(config.haptic);

      // Show animation
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      hideToast();
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: config.backgroundColor,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <Pressable
        style={styles.content}
        onPress={actionText && onAction ? onAction : hideToast}
        accessible={true}
        accessibilityRole="alert"
        accessibilityLabel={message}
      >
        <View style={styles.messageContainer}>
          <Ionicons name={config.icon} size={20} color="white" />
          <Text style={styles.message} numberOfLines={2}>
            {message}
          </Text>
        </View>

        {actionText && onAction && (
          <Pressable
            style={styles.actionButton}
            onPress={onAction}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={actionText}
          >
            <Text style={styles.actionText}>{actionText}</Text>
          </Pressable>
        )}

        <Pressable
          style={styles.closeButton}
          onPress={hideToast}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Close notification"
        >
          <Ionicons name="close" size={18} color="white" />
        </Pressable>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 16,
    right: 16,
    zIndex: 9999,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    minHeight: 56,
  },
  messageContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  message: {
    flex: 1,
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 20,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 6,
    marginLeft: 12,
  },
  actionText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
});
