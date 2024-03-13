import { Image, Pressable, StyleSheet, Text } from "react-native";
import React from "react";
import fonts from "../../utils/fonts";
import Theme from "../../utils/theme";

interface SkipButtonProps {
  onPress?: any;
}

export default function SkipButton({ onPress }: SkipButtonProps) {
  return (
    <Pressable style={styles.btnCont} onPress={onPress}>
      <Text style={styles.btnTxt}>Skip</Text>
      <Image
        source={require("../../assets/skipIcon.png")}
        style={styles.img}
        resizeMode="contain"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btnCont: { flexDirection: "row", alignItems: "center" },
  btnTxt: {
    fontSize: 19,
    fontFamily: fonts.VarelaRoundRegular,
    color: Theme.APP_RED_COLOR,
    marginRight: 10,
  },
  img: { width: 17, height: 17 },
});
