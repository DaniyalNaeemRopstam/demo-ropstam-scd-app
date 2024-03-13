import { StyleSheet, View, TextInput, Platform } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { widthPercentageToDP } from "react-native-responsive-screen";
import Theme from "../../utils/theme";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import fonts from "../../utils/fonts";

interface InputRangeProps {
  min?: number;
  max?: number;
  steps?: number;
  onChangeValue?: (e: any) => void;
  initialValue?: { min: number; max: number };
}
Animated.addWhitelistedNativeProps({ text: true });
const THUMB_RADIUS = 15;
const MAXWIDTH = widthPercentageToDP(85);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function InputRange({
  min = 0,
  max = 0,
  steps = 1,
  onChangeValue,
  initialValue,
}: InputRangeProps) {
  const xKnob1 = useSharedValue(0);
  const xKnob2 = useSharedValue(MAXWIDTH);

  useEffect(() => {
    if (initialValue) {
      (xKnob1.value = ((initialValue.min - min) / (max - min)) * MAXWIDTH), // Set duration to 0 for an immediate change
        (xKnob2.value = ((initialValue.max - min) / (max - min)) * MAXWIDTH); // Set duration to 0 for an immediate change
    }
  }, []);

  const gestureHandler1 = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = xKnob1.value;
    },
    onActive: (event, ctx: any) => {
      xKnob1.value =
        ctx.startX + event.translationX < 0
          ? 0
          : ctx.startX + event.translationX > xKnob2.value
          ? xKnob2.value
          : ctx.startX + event.translationX;
    },
    onEnd: () => {
      runOnJS(onChangeValue)({
        min: `${
          Math.round((min + (xKnob1.value / MAXWIDTH) * (max - min)) / steps) *
          steps
        }`,
        max: `${
          Math.round((min + (xKnob2.value / MAXWIDTH) * (max - min)) / steps) *
          steps
        }`,
      });
    },
  });

  const gestureHandler2 = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = xKnob2.value;
    },
    onActive: (event, ctx: any) => {
      xKnob2.value =
        ctx.startX + event.translationX < xKnob1.value
          ? xKnob1.value
          : ctx.startX + event.translationX > MAXWIDTH
          ? MAXWIDTH
          : ctx.startX + event.translationX;
    },
    onEnd: () => {
      runOnJS(onChangeValue)({
        min: `${
          Math.round((min + (xKnob1.value / MAXWIDTH) * (max - min)) / steps) *
          steps
        }`,
        max: `${
          Math.round((min + (xKnob2.value / MAXWIDTH) * (max - min)) / steps) *
          steps
        }`,
      });
    },
  });

  const styleLine = useAnimatedStyle(() => {
    return {
      backgroundColor: Theme.APP_RED_COLOR,
      height: 5,
      width: xKnob2.value - xKnob1.value,
      transform: [{ translateX: xKnob1.value }],
    };
  });

  const styleKnob1 = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: xKnob1.value }],
    };
  });
  const styleKnob2 = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: xKnob2.value - 2 }],
    };
  });

  const propsLabel1 = useAnimatedProps<any>(() => {
    return {
      text: `${
        Math.round((min + (xKnob1.value / MAXWIDTH) * (max - min)) / steps) *
        steps
      }`,
    };
  });
  const propsLabel2 = useAnimatedProps<any>(() => {
    return {
      text: `${
        Math.round((min + (xKnob2.value / MAXWIDTH) * (max - min)) / steps) *
        steps
      }`,
    };
  });

  return (
    <View style={styles.track}>
      <Animated.View style={styleLine} />
      <GestureHandlerRootView>
        <PanGestureHandler onGestureEvent={gestureHandler1}>
          <Animated.View style={[styles.knob, styleKnob1]}>
            <AnimatedTextInput
              style={styles.text}
              animatedProps={propsLabel1}
              editable={false}
              value={min.toString()}
            />
          </Animated.View>
        </PanGestureHandler>
        <PanGestureHandler onGestureEvent={gestureHandler1}>
          <Animated.View style={[styles.notch, styleKnob1]} />
        </PanGestureHandler>
      </GestureHandlerRootView>

      <GestureHandlerRootView>
        <PanGestureHandler onGestureEvent={gestureHandler2}>
          <Animated.View style={[styles.knob, styleKnob2]}>
            <AnimatedTextInput
              style={styles.text}
              animatedProps={propsLabel2}
              editable={false}
              value={max.toString()}
            />
          </Animated.View>
        </PanGestureHandler>
        <PanGestureHandler onGestureEvent={gestureHandler2}>
          <Animated.View style={[styles.notch, styleKnob2]} />
        </PanGestureHandler>
      </GestureHandlerRootView>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: widthPercentageToDP(85),
    backgroundColor: Theme.APP_BORDER_GREY,
    height: 5,
    borderRadius: 5,
    alignSelf: "center",
    shadowColor: Theme.APP_BLACK_COLOR,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 5,
  },
  knob: {
    width: Platform.OS == "ios" ? THUMB_RADIUS * 2 : THUMB_RADIUS * 2.6,
    height: Platform.OS == "ios" ? THUMB_RADIUS * 2 : THUMB_RADIUS * 2.6,
    borderRadius: Platform.OS == "ios" ? THUMB_RADIUS : THUMB_RADIUS * 2.6,
    backgroundColor: Theme.APP_RED_COLOR,
    shadowColor: Theme.APP_RED_COLOR,
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.16,
    shadowRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    bottom: 11.5,
    position: "absolute",
    left: Platform.OS == "ios" ? -14 : -17,
  },
  notch: {
    width: 10,
    height: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: Theme.APP_RED_COLOR,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 8,
    bottom: 3,
    position: "absolute",
    left: -4,
  },
  text: {
    color: Theme.APP_WHITE_COLOR,
    fontSize: 16,
    fontFamily: fonts.RobotoRegular,
  },
});
