import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import Theme from "../../utils/theme";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import fonts from "../../utils/fonts";
import CustomButton from "../buttons/CutomButton";

interface UnmatchModalProps {
  visible: boolean;
  onClose: (e: any) => void;
  onPress: any;
}

export default function UnmatchModal({
  visible,
  onClose,
  onPress,
}: UnmatchModalProps) {
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

          <Text style={styles().cardHeader}>Unmatch Member</Text>

          <Text style={styles().text1}>
            Are you sure you want to{"\n"} unmatch this member?
          </Text>

          <Text style={styles().text2}>
            {`This action will permanently\nremove this member from your\ncatches and remove you from\ntheirs. They will not be visible\nanymore and will not be able to\nsee or message you. `}
          </Text>

          <View style={styles().btnsCont}>
            <CustomButton
              BtnContstyle={styles().btnCont}
              text="Unmatch"
              textStyle={styles().btnTxt}
              onPress={onPress}
            />

            <CustomButton
              BtnContstyle={styles("cancel").btnCont}
              text="Cancel"
              textStyle={styles().btnTxt}
              onPress={onClose}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = (props?: any) =>
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
      paddingVertical: heightPercentageToDP(3.5),
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
    text1: {
      marginTop: 15,
      color: Theme.APP_BLACK_COLOR,
      fontSize: 19,
      textAlign: "center",
      fontFamily: fonts.VarelaRoundRegular,
    },
    text2: {
      marginTop: 15,
      color: Theme.APP_BLACK_COLOR,
      fontSize: 17,
      textAlign: "center",
      fontFamily: fonts.VarelaRoundRegular,
    },
    btnTxt: {
      fontSize: 20,
      fontFamily: fonts.VarelaRoundRegular,
      color: Theme.APP_WHITE_COLOR,
    },
    btnsCont: {
      flexDirection: "row",
      marginTop: heightPercentageToDP(3),
      width: widthPercentageToDP(90),
      alignItems: "center",
      justifyContent: "space-evenly",
    },
    btnCont: {
      backgroundColor:
        props == "cancel" ? Theme.APP_DARK_GREY : Theme.APP_RED_COLOR,
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
      width: widthPercentageToDP(35),
    },
  });
