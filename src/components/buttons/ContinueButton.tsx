import { Platform, StyleSheet, View } from "react-native";
import React from "react";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Theme from "../../utils/theme";
import fonts from "../../utils/fonts";
import CustomButton from "./CutomButton";

interface ContinueButtonProps {
  onPress?: any;
  btnStyle?: any;
}

export default function ContinueButton({
  onPress,
  btnStyle,
}: ContinueButtonProps) {
  return (
    <View style={btnStyle ? btnStyle : styles.btnCont}>
      <CustomButton
        BtnContstyle={styles.customBtnStyle}
        text="Continue"
        textStyle={styles.btnTxt}
        onPress={onPress}
        rightImage={true}
        rightImageSrc={require("../../assets/BackArrow.png")}
        rightImgStyle={styles.btnImg}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  btnCont: {
    position: "absolute",
    bottom:
      Platform.OS == "android"
        ? heightPercentageToDP(5)
        : heightPercentageToDP(8),
    alignItems: "center",
  },
  customBtnStyle: {
    backgroundColor: Theme.APP_RED_COLOR,
    width: widthPercentageToDP(90),
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
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  btnTxt: {
    color: Theme.APP_WHITE_COLOR,
    fontFamily: fonts.VarelaRoundRegular,
    fontSize: 24,
    flex: 1,
    textAlign: "center",
  },
  btnImg: {
    tintColor: Theme.APP_WHITE_COLOR,
    width: 16,
    height: 34,
    transform: [{ rotate: "180deg" }],
  },
});
