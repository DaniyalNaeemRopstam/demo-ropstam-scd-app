import { Image, Modal, Pressable, StyleSheet, View } from "react-native";
import React from "react";
import Theme from "../../utils/theme";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

interface ImageViewProp {
  isVisible: boolean;
  onClose: (e: any) => void;
  image: string;
}

export default function ImageView({
  isVisible,
  image,
  onClose,
}: ImageViewProp) {
  return (
    <Modal transparent={true} visible={isVisible} animationType="fade">
      <View style={styles().container}>
        <Pressable onPress={onClose} style={styles().closeCont}>
          <Image
            source={require("../../assets/crossCircleIcon.png")}
            style={styles().closeImg}
            resizeMode="contain"
          />
        </Pressable>
        <Image
          source={{ uri: image }}
          style={styles().imageStyle}
          resizeMode="stretch"
        />
      </View>
    </Modal>
  );
}

const styles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Theme.APP_BLACK_COLOR_OPACITY,
    },
    closeCont: {
      position: "absolute",
      top: heightPercentageToDP(20),
      right: widthPercentageToDP(2.5),
      zIndex: 1,
    },
    closeImg: {
      tintColor: Theme.APP_WHITE_COLOR,
      width: 50,
      height: 50,
    },
    imageStyle: {
      width: widthPercentageToDP(95),
      height: heightPercentageToDP(60),
    },
  });
