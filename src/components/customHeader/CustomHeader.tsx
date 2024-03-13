import { Image, StyleSheet } from "react-native";
import React from "react";

export default function CustomHeader() {
  return (
    <Image
      source={require("../../assets/wheelIcon.png")}
      style={styles.imgStyle}
      resizeMode="contain"
    />
  );
}
const styles = StyleSheet.create({
  imgStyle: { width: 40, height: 40 },
});
