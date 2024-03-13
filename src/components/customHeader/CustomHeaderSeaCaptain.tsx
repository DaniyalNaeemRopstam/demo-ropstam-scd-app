import { Image, StyleSheet } from "react-native";
import React from "react";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

export default function CustomHeaderSeaCaptain() {
  return (
    <Image
      source={require("../../assets/Logo2.png")}
      style={styles.imgStyle}
      resizeMode="contain"
    />
  );
}
const styles = StyleSheet.create({
  imgStyle: {
    width: widthPercentageToDP(33),
    height: heightPercentageToDP(5),
    bottom: 3,
  },
});
