import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRef } from "react";
import {
  Animated,
  View,
  Text,
  StyleSheet,
  PanGestureHandler,
  State,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { palette } from "../styles/theme";

interface EnhancedScrollViewProps {
  children: React.ReactNode;
  onRefresh?: () => Promise<void> | void;
  refreshing?: boolean;
  showsVerticalScrollIndicator?: boolean;
  contentContainerStyle?: any;
  style?: any;
}

export default function EnhancedScrollView({
  children,
  onRefresh,
  refreshing = false,
  showsVerticalScrollIndicator = true,
  contentContainerStyle,
  style,
}: EnhancedScrollViewProps) {
  const translateY = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  const pullDistance = useRef(0);
  const threshold = 80;

  const rotateInterpolate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const handleRefresh = async () => {
    if (!onRefresh) return;

    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Animation for refresh state
    Animated.parallel([
      Animated.timing(rotate, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      await onRefresh();
    } finally {
      // Reset animations
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    {
      useNativeDriver: true,
      listener: (event: any) => {
        const { translationY } = event.nativeEvent;
        pullDistance.current = Math.max(0, translationY);

        if (pullDistance.current > threshold && !refreshing) {
          // Light haptic when threshold is reached
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        // Update scale based on pull distance
        const scaleValue = Math.min(pullDistance.current / threshold, 1);
        scale.setValue(scaleValue);
      },
    }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      if (pullDistance.current > threshold && !refreshing) {
        handleRefresh();
      } else {
        // Snap back
        Animated.parallel([
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }
  };

  return (
    <View style={[{ flex: 1 }, style]}>
      {onRefresh && (
        <Animated.View
          style={[
            styles.refreshIndicator,
            {
              transform: [
                { translateY: Animated.add(translateY, -60) },
                { scale },
              ],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.refreshIcon,
              { transform: [{ rotate: rotateInterpolate }] },
            ]}
          >
            <Ionicons
              name={refreshing ? "sync" : "arrow-down"}
              size={20}
              color={palette.primary}
            />
          </Animated.View>
          <Text style={styles.refreshText}>
            {refreshing ? "Refreshing..." : "Pull to refresh"}
          </Text>
        </Animated.View>
      )}

      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        enabled={!!onRefresh && !refreshing}
      >
        <Animated.View style={{ flex: 1 }}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={[
              { paddingTop: onRefresh ? 60 : 0 },
              contentContainerStyle,
            ]}
            showsVerticalScrollIndicator={showsVerticalScrollIndicator}
            scrollEventThrottle={16}
          >
            {children}
          </ScrollView>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  refreshIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    flexDirection: "row",
    gap: 8,
  },
  refreshIcon: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  refreshText: {
    color: palette.muted,
    fontSize: 14,
    fontWeight: "500",
  },
});
