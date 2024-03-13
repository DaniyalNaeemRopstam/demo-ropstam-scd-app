import { Image, Platform, StyleSheet, Text, View } from "react-native";
import React from "react";
import Theme from "../../utils/theme";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import fonts from "../../utils/fonts";
import CustomButton from "../buttons/CutomButton";

interface ErrorProp {
  onPress: (e: any) => void;
}

export default function Error({ onPress }: ErrorProp) {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/ErrorWheel.png")}
        style={styles.img}
        resizeMode="contain"
      />
      <Text style={styles.text}>{`Oops!\nSomething went wrong...`}</Text>
      <CustomButton
        onPress={onPress}
        BtnContstyle={styles.customBtnStyle}
        text="Refresh"
        textStyle={styles.btnTxt}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Theme.APP_BACKGROUND_COLOR,
  },
  img: { width: 132, height: 132, marginTop: heightPercentageToDP(20) },
  text: {
    marginTop: 26,
    color: Theme.APP_TEXT_GREY,
    fontSize: 26,
    fontFamily: fonts.Questrail,
    width: widthPercentageToDP(80),
    textAlign: "center",
  },
  customBtnStyle: {
    backgroundColor: Theme.APP_RED_COLOR,
    width: widthPercentageToDP(80),
    height: 63,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Theme.APP_BLACK_COLOR,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: "absolute",
    bottom:
      Platform.OS == "android"
        ? heightPercentageToDP(5)
        : heightPercentageToDP(7),
  },
  btnTxt: {
    color: Theme.APP_WHITE_COLOR,
    fontFamily: fonts.VarelaRoundRegular,
    fontSize: 24,
    textAlign: "center",
  },
});
