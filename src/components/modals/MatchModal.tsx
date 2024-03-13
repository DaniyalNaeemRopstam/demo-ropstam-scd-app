import { Image, Modal, StyleSheet, Text, View } from "react-native";
import React from "react";
import Theme from "../../utils/theme";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import fonts from "../../utils/fonts";
import CustomButton from "../buttons/CutomButton";
import { useSelector } from "react-redux";

interface SwipsModalProp {
  visible: boolean;
  onPress?: (e: any) => void;
  onClose: (e: any) => void;
  userProfile?: any;
}

export default function MatchModal({
  visible,
  onClose,
  onPress,
  userProfile,
}: SwipsModalProp) {
  const { userName, images } = useSelector((state: any) => state?.login);

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.mainCont}>
        <View style={styles.imagesCont}>
          <View style={styles.profileMainCont}>
            <View style={styles.ImgCont}>
              <Image
                source={{ uri: images[0] }}
                style={styles.Img}
                resizeMode="cover"
              />
            </View>
            <View style={styles.nameCont}>
              <Text style={styles.nameTxt}>{userName}</Text>
            </View>
          </View>

          <View style={styles.profileMainCont}>
            <View style={styles.ImgCont}>
              <Image
                source={{ uri: userProfile?.images[0] }}
                style={styles.Img}
                resizeMode="cover"
              />
            </View>
            <View style={styles.nameCont}>
              <Text style={styles.nameTxt}>{userProfile?.userName}</Text>
            </View>
          </View>
        </View>

        <Image
          style={styles.mascot}
          resizeMode="contain"
          source={require("../../assets/mascotkissfish.png")}
        />
        <Text style={styles.itsACatch}>It’s a Catch!</Text>

        <CustomButton
          BtnContstyle={styles.customBtnStyle1}
          text="Keep Fishing"
          textStyle={styles.btnTxt}
          onPress={onClose}
          leftImage={true}
          leftImageSrc={require("../../assets/fishingRod.png")}
          leftImgStyle={styles.leftLogoStyle}
        />
        <CustomButton
          BtnContstyle={styles.customBtnStyle2}
          text="Send Message"
          textStyle={styles.btnTxt}
          onPress={onPress}
          leftImage={true}
          leftImageSrc={require("../../assets/bottle.png")}
          leftImgStyle={styles.leftLogoStyle2}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  mainCont: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.APP_BLACK_COLOR_OPACITY2,
  },
  imagesCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: widthPercentageToDP(100),
  },
  profileMainCont: {
    alignItems: "center",
    justifyContent: "center",
  },
  ImgCont: {
    borderWidth: 4,
    borderColor: Theme.APP_YELLOW,
    shadowColor: Theme.APP_BLACK_COLOR,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: widthPercentageToDP(35) / 2,
    backgroundColor: Theme.APP_BACKGROUND_COLOR,
    alignItems: "center",
    justifyContent: "center",
    width: widthPercentageToDP(35),
    height: widthPercentageToDP(35),
  },
  Img: {
    width: widthPercentageToDP(33),
    height: widthPercentageToDP(33),
    borderRadius: widthPercentageToDP(33) / 2,
  },
  nameCont: {
    marginTop: 8,
    width: "100%",
    marginBottom: 15,
    paddingVertical: 3,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.APP_YELLOW,
    shadowColor: Theme.APP_BLACK_COLOR,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 5,
  },
  nameTxt: {
    fontSize: 14,
    textShadowRadius: 1,
    color: Theme.APP_WHITE_COLOR,
    fontFamily: fonts.RobotoBold,
    textShadowColor: Theme.APP_BLACK_COLOR,
    textShadowOffset: { width: 0, height: 1 },
  },
  mascot: {
    marginTop: heightPercentageToDP(5),
    width: widthPercentageToDP(40),
    height: heightPercentageToDP(20),
  },
  itsACatch: {
    marginTop: heightPercentageToDP(5),
    fontSize: 56,
    fontFamily: fonts.Questrail,
    color: Theme.APP_WHITE_COLOR,
  },
  customBtnStyle1: {
    flexDirection: "row",
    marginTop: heightPercentageToDP(8),
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
    paddingHorizontal: 20,
  },
  customBtnStyle2: {
    flexDirection: "row",
    marginTop: heightPercentageToDP(2),
    backgroundColor: Theme.APP_LIGHT_BLUE,
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
    paddingHorizontal: 20,
  },
  btnTxt: {
    flex: 1,
    color: Theme.APP_WHITE_COLOR,
    fontFamily: fonts.Questrail,
    fontSize: 24,
    textAlign: "center",
    left: -10,
  },
  leftLogoStyle: { width: 55, height: 55 },
  leftLogoStyle2: { width: 49, height: 49 },
});
