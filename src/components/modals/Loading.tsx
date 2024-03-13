import { Image, Modal, StyleSheet, Text, View } from "react-native";
import React from "react";
import Theme from "../../utils/theme";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import fonts from "../../utils/fonts";

interface LoadingProp {
  visible: boolean;
}

export default function Loading({ visible }: LoadingProp) {
  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.container}>
        <Image
          source={require("../../assets/scd-radar.gif")}
          resizeMode="contain"
          style={styles.img}
        />
        <Text style={styles.text}>Locating Sea Captains near you...</Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Theme.APP_BACKGROUND_COLOR,
  },
  img: { width: widthPercentageToDP(90), height: heightPercentageToDP(45) },
  text: {
    color: Theme.APP_TEXT_GREY,
    fontSize: 26,
    fontFamily: fonts.Questrail,
    width: widthPercentageToDP(80),
    textAlign: "center",
  },
});
