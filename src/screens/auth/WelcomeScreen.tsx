import {
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import Theme from "../../utils/theme";
import CustomButton from "../../components/buttons/CutomButton";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import fonts from "../../utils/fonts";

export default function WelcomeScreen(props: any) {
  return (
    <View style={styles.mainCont}>
      <StatusBar
        backgroundColor={Theme.APP_BACKGROUND_COLOR}
        barStyle={"dark-content"}
      />
      <Image
        source={require("../../assets/Logo.png")}
        style={styles.logoStyle}
      />
      <Image
        source={require("../../assets/Mascot.png")}
        style={styles.mascotStyle}
        resizeMode="contain"
      />
      <View style={styles.btnCont}>
        <CustomButton
          BtnContstyle={styles.customBtnStyle1}
          text="Sign Up"
          textStyle={styles.btnTxt1}
          onPress={() => props?.navigation?.navigate("SIGNUPSCREEN")}
        />
        <CustomButton
          BtnContstyle={styles.customBtnStyle2}
          text="Log In"
          textStyle={styles.btnTxt2}
          onPress={() => props?.navigation?.navigate("LOGINSCREEN")}
        />

        <Text style={styles.bottomTxt1}>
          You must be 18+ years of age to join
        </Text>
        <Text style={styles.bottomTxt2}>
          (Boat ownership is recommended but not required)
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainCont: {
    flex: 1,
    marginTop:
      Platform.OS == "ios" ? heightPercentageToDP(5) : heightPercentageToDP(1),
    alignItems: "center",
  },
  logoStyle: {
    height: widthPercentageToDP(25),
    width: widthPercentageToDP(90),
  },
  mascotStyle: {
    marginTop: heightPercentageToDP(2),
    height: heightPercentageToDP(44),
    right: 10,
  },
  btnCont: {
    position: "absolute",
    bottom:
      Platform.OS == "ios"
        ? heightPercentageToDP(3.5)
        : heightPercentageToDP(5),
    alignItems: "center",
  },
  customBtnStyle1: {
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
  },
  btnTxt1: {
    color: Theme.APP_WHITE_COLOR,
    fontFamily: fonts.VarelaRoundRegular,
    fontSize: 24,
  },
  customBtnStyle2: {
    marginTop: 15,
    backgroundColor: Theme.APP_WHITE_COLOR,
    borderWidth: 2,
    borderColor: Theme.APP_RED_COLOR,
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
  },
  btnTxt2: {
    color: Theme.APP_RED_COLOR,
    fontFamily: fonts.VarelaRoundRegular,
    fontSize: 24,
  },
  bottomTxt1: {
    marginTop: heightPercentageToDP(2.5),
    color: Theme.APP_TEXT_GREY,
    fontFamily: fonts.RobotoRegular,
    fontSize: 14,
  },
  bottomTxt2: {
    fontFamily: fonts.RobotoRegular,
    color: Theme.APP_TEXT_GREY,
    fontSize: 14,
  },
});
