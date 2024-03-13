import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Animated,
  Easing,
  Image,
  Dimensions,
} from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Theme from "../../utils/theme";

const { height } = Dimensions.get("window");

export default function Splash() {
  const rotateValue = new Animated.Value(0);

  useEffect(() => {
    startImageRotate();
  }, []);

  const startImageRotate = () => {
    rotateValue.setValue(0);
    Animated.timing(rotateValue, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => startImageRotate());
  };

  const RotateData = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles().mainCont}>
      <View style={styles().logo_contain}>
        <Animated.Image
          style={[styles().image, { transform: [{ rotate: RotateData }] }]}
          source={require("../../assets/splashWheel.png")}
        />
        <Image
          source={require("../../assets/splashHeart.png")}
          style={styles().heart}
        />
      </View>
    </View>
  );
}

const styles = () =>
  StyleSheet.create({
    mainCont: {
      flex: 1,
      backgroundColor: Theme.APP_WHITE_COLOR,
      alignItems: "center",
    },
    logo_contain: {
      marginTop: heightPercentageToDP(20),
      height: 210,
      width: "90%",
      justifyContent: "center",
      alignItems: "center",
    },
    heart: {
      width: 64,
      height: 61,
      position: "absolute",
      left: widthPercentageToDP(height < 850 ? 36 : 36.5),
      alignSelf: "center",
    },
    image: {
      width: 200,
      height: 200,
    },
  });
