import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import Theme from "../../utils/theme";
import { widthPercentageToDP } from "react-native-responsive-screen";
import fonts from "../../utils/fonts";
import CustomButton from "../buttons/CutomButton";

interface SoundProp {
  visible: boolean;
  onSoundOn?: (e: any) => void;
  onSoundOff?: (e: any) => void;
  onClose: (e: any) => void;
  routeFrom?: string;
}

export default function Sound({
  visible,
  onClose,
  onSoundOn,
  onSoundOff,
  routeFrom,
}: SoundProp) {
  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles().container}>
        <View style={styles().cardCont}>
          {routeFrom != "SIGNUP" && (
            <Pressable onPress={onClose} style={styles().closeCont}>
              <Image
                source={require("../../assets/crossCircleIcon.png")}
                style={styles().closeImg}
                resizeMode="contain"
              />
            </Pressable>
          )}

          <Text style={styles().cardHeader}>This app features sound!</Text>

          <Image
            source={require("../../assets/Ship_bell.png")}
            style={styles().bellImg}
            resizeMode="contain"
          />

          <Text
            style={styles().text1}
          >{`Would you like to\ncontinue with sound?`}</Text>

          <Text
            style={styles().text2}
          >{`This can be changed at any time\nin the app’s Settings menu`}</Text>

          <View style={styles().btnCont}>
            <CustomButton
              leftImage={true}
              leftImageSrc={require("../../assets/sound_off.png")}
              leftImgStyle={styles().btnImg}
              BtnContstyle={styles().offBtnCont}
              text="Sound Off"
              textStyle={styles().btnTxt}
              onPress={onSoundOff}
            />

            <CustomButton
              leftImage={true}
              leftImageSrc={require("../../assets/sound_on.png")}
              leftImgStyle={styles().btnImg}
              BtnContstyle={styles().onBtnCont}
              text="Sound On"
              textStyle={styles().btnTxt}
              onPress={onSoundOn}
            />
          </View>

          <Text style={styles().recommendedTxt}>(Recommended)</Text>
        </View>
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
    cardCont: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Theme.APP_WHITE_COLOR,
      width: widthPercentageToDP(90),
      paddingTop: 50,
      paddingBottom: 30,
      borderRadius: 30,
    },
    closeCont: {
      padding: 5,
      position: "absolute",
      top: 0,
      right: 0,
    },
    closeImg: {
      tintColor: Theme.APP_DISABLED,
      width: 50,
      height: 50,
    },
    cardHeader: {
      fontSize: 22,
      fontFamily: fonts.VarelaRoundRegular,
      color: Theme.APP_BLACK_COLOR,
    },

    bellImg: {
      width: 90,
      height: 90,
      tintColor: Theme.APP_LIGHT_BLUE,
      marginTop: 32,
    },
    text1: {
      marginTop: 22,
      color: Theme.APP_BLACK_COLOR,
      fontSize: 19,
      textAlign: "center",
    },
    text2: {
      marginTop: 18,
      textAlign: "center",
      fontSize: 14,
      fontFamily: fonts.VarelaRoundRegular,
      color: Theme.APP_TEXT_GREY,
    },
    btnCont: {
      marginTop: 25,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
      width: widthPercentageToDP(90),
    },
    btnImg: { width: 28, height: 20 },
    btnTxt: {
      fontSize: 20,
      fontFamily: fonts.VarelaRoundRegular,
      color: Theme.APP_WHITE_COLOR,
    },
    offBtnCont: {
      // backgroundColor: props ? Theme.APP_DISABLED : Theme.APP_LIGHT_BLUE,
      backgroundColor: Theme.APP_DISABLED,
      width: widthPercentageToDP(35),
      paddingVertical: 10,
      alignItems: "center",
      borderRadius: 10,
      shadowColor: Theme.APP_BLACK_COLOR,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    onBtnCont: {
      // backgroundColor: props ? Theme.APP_LIGHT_BLUE : Theme.APP_DISABLED,
      backgroundColor: Theme.APP_LIGHT_BLUE,
      width: widthPercentageToDP(35),
      paddingVertical: 10,
      alignItems: "center",
      borderRadius: 10,
      shadowColor: Theme.APP_BLACK_COLOR,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    recommendedTxt: {
      marginTop: 8,
      alignSelf: "flex-end",
      textAlign: "right",
      fontSize: 14,
      color: Theme.APP_TEXT_GREY,
      right: widthPercentageToDP(10),
      fontFamily: fonts.VarelaRoundRegular,
    },
  });
