import { useEffect, useRef } from "react";
import { Animated, View, ViewStyle } from "react-native";

import { palette } from "../styles/theme";

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export default function Skeleton({
  width = "100%",
  height = 20,
  borderRadius = 4,
  style,
}: SkeletonProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: false,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [palette.slate, palette.muted],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor,
        },
        style,
      ]}
    />
  );
}

// Preset skeleton components for common use cases
export function TextSkeleton({ lines = 1 }: { lines?: number }) {
  return (
    <View style={{ gap: 8 }}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          height={16}
          width={index === lines - 1 ? "75%" : "100%"}
        />
      ))}
    </View>
  );
}

export function TransactionSkeleton() {
  return (
    <View
      style={{
        padding: 16,
        backgroundColor: palette.darkless,
        borderRadius: 12,
        gap: 12,
        marginBottom: 8,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Skeleton width={40} height={40} borderRadius={20} />
        <View style={{ flex: 1 }}>
          <Skeleton height={18} width="70%" />
          <View style={{ height: 6 }} />
          <Skeleton height={14} width="45%" />
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Skeleton height={18} width={80} />
          <View style={{ height: 6 }} />
          <Skeleton height={14} width={60} />
        </View>
      </View>
    </View>
  );
}

export function CardSkeleton() {
  return (
    <View
      style={{
        width: 280,
        height: 180,
        backgroundColor: palette.darkless,
        borderRadius: 16,
        padding: 20,
        marginRight: 16,
        justifyContent: "space-between",
      }}
    >
      <View>
        <Skeleton height={16} width="60%" />
        <View style={{ height: 8 }} />
        <Skeleton height={14} width="40%" />
      </View>

      <View>
        <Skeleton height={20} width="80%" />
        <View style={{ height: 12 }} />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Skeleton height={14} width="30%" />
          <Skeleton height={14} width="25%" />
        </View>
      </View>
    </View>
  );
}

export function OrganizationSkeleton() {
  return (
    <View
      style={{
        padding: 16,
        backgroundColor: palette.darkless,
        borderRadius: 12,
        marginBottom: 12,
        gap: 12,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Skeleton width={50} height={50} borderRadius={8} />
        <View style={{ flex: 1 }}>
          <Skeleton height={18} width="65%" />
          <View style={{ height: 6 }} />
          <Skeleton height={14} width="40%" />
        </View>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flex: 1 }}>
          <Skeleton height={14} width="50%" />
          <View style={{ height: 4 }} />
          <Skeleton height={20} width="70%" />
        </View>
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <Skeleton height={14} width="40%" />
          <View style={{ height: 4 }} />
          <Skeleton height={20} width="60%" />
        </View>
      </View>
    </View>
  );
}
