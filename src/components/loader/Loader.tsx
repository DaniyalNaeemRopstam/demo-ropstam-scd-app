import { Image, Modal, StyleSheet, View } from "react-native";
import React from "react";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Theme from "../../utils/theme";

interface LoaderProps {
  isVisible: boolean;
}

export default function Loader({ isVisible }: LoaderProps) {
  return (
    <Modal visible={isVisible} transparent={true} statusBarTranslucent={true}>
      <View style={styles.modalCont}>
        {/* <ActivityIndicator size="large" style={styles.loader} /> */}
        <Image
          source={require("../../assets/gameLoading.gif")}
          style={styles.loader}
        />
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  modalCont: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.APP_BLACK_COLOR_OPACITY,
  },
  loader: {
    bottom: heightPercentageToDP(5),
    width: widthPercentageToDP(30),
    height: heightPercentageToDP(30),
    resizeMode: "contain",
  },
});
