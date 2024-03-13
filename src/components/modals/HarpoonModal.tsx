import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import Theme from "../../utils/theme";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import fonts from "../../utils/fonts";
import CustomButton from "../buttons/CutomButton";

interface HarpoonModalProps {
  visible: boolean;
  onClose: (e: any) => void;
  onPress: (e: any) => void;
  harpoons: number;
}

export default function HarpoonModal({
  visible,
  onClose,
  onPress,
  harpoons,
}: HarpoonModalProps) {
  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles().container}>
        <View style={styles().cardCont}>
          <Pressable onPress={onClose} style={styles().closeCont}>
            <Image
              source={require("../../assets/crossCircleIcon.png")}
              style={styles().closeImg}
              resizeMode="contain"
            />
          </Pressable>

          <Text style={styles().cardHeader}>Your Harpoons</Text>

          <View style={styles().harpoonImgCont}>
            <Image
              source={require("../../assets/harpoonModalIcon.png")}
              style={styles().harpoonImg}
              resizeMode="cover"
            />
          </View>

          <Text style={styles().text1}>
            {`You have \n`}
            <Text style={styles().text2}>{`${harpoons} Harpoons\n`}</Text>
            {"remaining!"}
          </Text>

          <CustomButton
            BtnContstyle={styles().btnCont}
            text="Buy Harpoon Bundle"
            textStyle={styles().btnTxt}
            onPress={onPress}
          />

          <Text style={styles().recommendedTxt}>(In-app purchase)</Text>
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
      paddingTop: 20,
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
      textAlign: "center",
      fontSize: 22,
      fontFamily: fonts.VarelaRoundRegular,
      color: Theme.APP_BLACK_COLOR,
    },
    harpoonImgCont: {
      width: widthPercentageToDP(65),
      height: heightPercentageToDP(30),
    },
    harpoonImg: {
      width: "100%",
      height: "100%",
      tintColor: Theme.APP_HARPOON_BLUE,
    },
    text1: {
      color: Theme.APP_BLACK_COLOR,
      fontSize: 19,
      textAlign: "center",
      fontFamily: fonts.Questrail,
    },
    text2: {
      marginTop: 18,
      textAlign: "center",
      fontSize: 19,
      fontFamily: fonts.Questrail,
      color: Theme.APP_HARPOON_BLUE,
    },
    btnTxt: {
      fontSize: 20,
      fontFamily: fonts.VarelaRoundRegular,
      color: Theme.APP_WHITE_COLOR,
    },
    btnCont: {
      backgroundColor: Theme.APP_SKY_BLUE,
      paddingVertical: 15,
      paddingHorizontal: 15,
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
      marginTop: 15,
    },
    recommendedTxt: {
      marginTop: 8,
      fontSize: 14,
      color: Theme.APP_TEXT_GREY,
      fontFamily: fonts.VarelaRoundRegular,
    },
  });
