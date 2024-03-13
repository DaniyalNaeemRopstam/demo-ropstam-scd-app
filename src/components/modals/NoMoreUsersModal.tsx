import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import Theme from "../../utils/theme";
import { widthPercentageToDP } from "react-native-responsive-screen";
import fonts from "../../utils/fonts";
import CustomButton from "../buttons/CutomButton";

interface NoMoreUsersModalProps {
  visible: boolean;
  onClose: (e: any) => void;
  onPress: (e: any) => void;
}

export default function NoMoreUsersModal({
  visible,
  onClose,
  onPress,
}: NoMoreUsersModalProps) {
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

          <Text style={styles().cardHeader}>
            No more users near you at the moment.
          </Text>
          <Text style={styles().cardText}>Try again later!</Text>

          <CustomButton
            BtnContstyle={styles().customBtnStyle}
            text="Search Again"
            textStyle={styles().btnTxt}
            onPress={onPress}
          />
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
      width: widthPercentageToDP(95),
      paddingTop: 5,
      paddingBottom: 30,
      borderRadius: 30,
    },
    closeCont: {
      alignSelf: "flex-end",
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
    cardText: {
      marginVertical: 15,
      textAlign: "center",
      fontSize: 20,
      fontFamily: fonts.VarelaRoundRegular,
      color: Theme.APP_TEXT_GREY,
    },
    customBtnStyle: {
      backgroundColor: Theme.APP_RED_COLOR,
      width: widthPercentageToDP(70),
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
  });
