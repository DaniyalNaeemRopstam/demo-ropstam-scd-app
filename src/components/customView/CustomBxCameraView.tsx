import { Image, StyleSheet, View } from "react-native";
import React from "react";
import Theme from "../../utils/theme";

interface CustomBxCameraViewprops {
  index: number;
}

export default function CustomBxCameraView({ index }: CustomBxCameraViewprops) {
  return (
    <View style={styles(index).boxView}>
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
    boxView: {
      width: 60,
      height: 50,
      backgroundColor: Theme.APP_BORDER_GREY,
      borderRadius: 10,
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
