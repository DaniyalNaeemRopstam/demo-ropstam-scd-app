import { Platform, StyleSheet, Text, View } from "react-native";
import React from "react";
import fonts from "../../utils/fonts";
import Theme from "../../utils/theme";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import CustomButton from "../../components/buttons/CutomButton";

export default function ThankyouPage(props?: any) {
  return (
    <View style={styles.mainCont}>
      <Text style={styles.txt1}>Thank you for contacting support</Text>

      <Text style={styles.txt2}>
        {`Our crew will get in touch with you by e-mail.\n\nYou can keep track of your support tickets in\n'My Tickets' found in the Help menu.`}
      </Text>
      <CustomButton
        BtnContstyle={styles.customBtnStyle}
        text="Return Home"
        textStyle={styles.btnTxt}
        onPress={() => props?.navigation?.replace("HOMESCREEN")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainCont: { flex: 1, alignItems: "center" },
  txt1: {
    fontFamily: fonts.VarelaRoundRegular,
    fontSize: 20,
    marginTop: 17,
    color: Theme.APP_BLACK_COLOR,
  },
  txt2: {
    fontFamily: fonts.RobotoRegular,
    fontSize: 14,
    marginTop: 10,
    color: Theme.APP_TEXT_GREY,
    textAlign: "center",
    width: widthPercentageToDP(90),
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
    position: "absolute",
    bottom:
      Platform.OS == "ios" ? heightPercentageToDP(7) : heightPercentageToDP(5),
  },
  btnTxt: {
    color: Theme.APP_WHITE_COLOR,
    fontFamily: fonts.VarelaRoundRegular,
    fontSize: 24,
    textAlign: "center",
  },
});
