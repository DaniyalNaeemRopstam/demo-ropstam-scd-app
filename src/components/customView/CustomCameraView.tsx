import { Image, StyleSheet, View } from "react-native";
import React from "react";
import Theme from "../../utils/theme";

interface CustomCameraViewProps {
  index: number;
}
export default function CustomCameraView({ index }: CustomCameraViewProps) {
  return (
    <View style={styles(index).circleView}>
      <Image
        source={require("../../assets/camera.png")}
        style={styles().smallCmera}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = (props?: any) =>
  StyleSheet.create({
    circleView: {
      width: 60,
      height: 60,
      backgroundColor: Theme.APP_BORDER_GREY,
      borderRadius: 60 / 2,
      borderWidth: props ? 0 : 3,
      borderColor: Theme.APP_YELLOW,
      alignItems: "center",
      justifyContent: "center",
    },
    smallCmera: {
      width: 27,
      height: 21,
    },
  });
