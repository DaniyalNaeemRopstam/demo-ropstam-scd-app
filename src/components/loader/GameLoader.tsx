import { Image, StyleSheet, View } from "react-native";
import React from "react";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Theme from "../../utils/theme";

interface GameLoaderProps {
  isVisible: boolean;
}

export default function GameLoader({ isVisible }: GameLoaderProps) {
  return isVisible ? (
    <View style={styles.container}>
      <Image
        source={require("../../assets/scd-radar2.gif")}
        style={styles.loader}
      />
    </View>
  ) : null;
}
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Theme.APP_BLACK_COLOR_OPACITY,
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loader: {
    bottom: heightPercentageToDP(5),
    width: widthPercentageToDP(70),
    height: heightPercentageToDP(70),
    resizeMode: "contain",
  },
});
