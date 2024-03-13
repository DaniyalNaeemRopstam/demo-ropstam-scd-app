import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useMemo, useState } from "react";
import Theme from "../../utils/theme";
import { widthPercentageToDP } from "react-native-responsive-screen";
import fonts from "../../utils/fonts";
import CustomButton from "../buttons/CutomButton";
import moment from "moment";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

interface SwipsModalProp {
  visible: boolean;
  onPress?: (e: any) => void;
  onClose: (e: any) => void;
  swipesDate: string;
}

export default function SwipsModal({
  visible,
  onClose,
  onPress,
  swipesDate,
}: SwipsModalProp) {
  const isFocused = useIsFocused();
  const [formattedTime, setFormattedTime] = useState("");
  const [addedDateTime] = useState(moment(swipesDate).add(12, "hours"));
  const memoizedSwipesDate = useMemo(() => swipesDate, [swipesDate]);

  useFocusEffect(
    useCallback(() => {
      if (memoizedSwipesDate !== "") {
        let animationFrameId: number;

        const updateCountdown = () => {
          animationFrameId = requestAnimationFrame(() => {
            const currentDateTime = moment();
            const remainingTime = moment.duration(
              addedDateTime.diff(currentDateTime)
            );

            if (remainingTime.asMilliseconds() > 0) {
              const hours = remainingTime.hours();
              const minutes = remainingTime.minutes();
              setFormattedTime(`${hours} hours, ${minutes} minutes`);
            }
          });
        };

        const clearAnimationFrame = () => {
          cancelAnimationFrame(animationFrameId);
        };

        updateCountdown(); // Initial call
        const intervalId = setInterval(updateCountdown, 1000);

        return () => {
          clearInterval(intervalId);
          clearAnimationFrame();
        };
      }
    }, [memoizedSwipesDate, isFocused])
  );

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.container}>
        <View style={styles.cardCont}>
          <Pressable onPress={onClose} style={styles.closeCont}>
            <Image
              source={require("../../assets/crossCircleIcon.png")}
              style={styles.closeImg}
              resizeMode="contain"
            />
          </Pressable>

          <Text style={styles.cardHeader}>
            Your Starboard swipes{"\n"}have run dry!
          </Text>

          <Image
            source={require("../../assets/mascotLifesaver.png")}
            style={styles.mascot}
            resizeMode="contain"
          />

          <Text style={styles.text2}>Set sail again in...</Text>

          <Text style={styles.text1}>{formattedTime}</Text>

          <View style={styles.btnCont}>
            {/* <CustomButton
              BtnContstyle={styles.buyBtn}
              text={`Buy Starboard${"\n"}& Harpoon Bundle`}
              textStyle={styles.btnTxt}
            /> */}

            <CustomButton
              BtnContstyle={styles.upgradeBtn}
              text={`Upgrade to Admiral${"\n"}for UNLIMITED swipes`}
              textStyle={styles.btnTxt}
              onPress={onPress}
            />
          </View>

          <Text style={styles.purchasesTxt}>(In-app purchase)</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    textAlign: "center",
  },

  mascot: {
    width: 90,
    height: 102,
    marginTop: 11,
  },
  text1: {
    marginTop: 2,
    color: Theme.APP_RED_COLOR,
    fontSize: 24,
    textAlign: "center",
  },
  text2: {
    marginTop: 1,
    textAlign: "center",
    fontSize: 19,
    fontFamily: fonts.VarelaRoundRegular,
    color: Theme.APP_TEXT_GREY,
  },
  btnCont: {
    marginTop: 11,
    alignItems: "center",
    justifyContent: "center",
    width: widthPercentageToDP(90),
  },

  btnTxt: {
    fontSize: 16,
    fontFamily: fonts.VarelaRoundRegular,
    color: Theme.APP_WHITE_COLOR,
    textAlign: "center",
  },
  buyBtn: {
    backgroundColor: Theme.APP_SETTING_DARK_YELLOW,
    width: widthPercentageToDP(65),
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
  upgradeBtn: {
    marginTop: 12,
    backgroundColor: Theme.APP_SKY_BLUE,
    width: widthPercentageToDP(65),
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
  purchasesTxt: {
    marginTop: 7,
    fontSize: 14,
    color: Theme.APP_TEXT_GREY,
    fontFamily: fonts.VarelaRoundRegular,
  },
});
