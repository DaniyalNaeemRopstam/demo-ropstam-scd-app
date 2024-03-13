import React, { useEffect } from "react";
import { View, Animated, StyleSheet, Dimensions } from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

export default function Octopus() {
  const { width, height } = Dimensions.get("window");
  const imageSize = 800; // Adjust this based on your image size
  const imagePosition = new Animated.ValueXY({ x: 0, y: 0 });

  const startAnimation = () => {
    const maxX = width - imageSize + 300;
    const maxY = height - imageSize + 100;
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    Animated.timing(imagePosition, {
      toValue: { x: randomX, y: randomY },
      duration: 1500,
      useNativeDriver: false,
    }).start(() => startAnimation());
  };

  useEffect(() => {
    startAnimation();
  }, []);
  return (
    <View style={styles.cont}>
      <Animated.Image
        source={require("../../assets/sea-monster.gif")} // Replace with your image path
        // source={{
        //   uri: "https://gifdb.com/images/high/octopus-cartoon-looking-from-side-to-side-lqlp011uanw5me6z.gif",
        // }} // Replace with your image path
        style={{
          // width: imageSize,
          // height: imageSize,
          width: widthPercentageToDP(100),
          height: heightPercentageToDP(100),
          // transform: imagePosition.getTranslateTransform(),
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  cont: { flex: 1, justifyContent: "center", alignItems: "center" },
});
