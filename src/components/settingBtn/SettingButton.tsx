import { Image, Pressable, StyleSheet, Text } from "react-native";
import React from "react";
import fonts from "../../utils/fonts";
import Theme from "../../utils/theme";
import { widthPercentageToDP } from "react-native-responsive-screen";

interface SettingButtonProps {
  color: string;
  image: any;
  imageStyle: any;
  text: string;
  onPress: (e: any) => void;
}

export default function SettingButton({
  color,
  image,
  imageStyle,
  text,
  onPress,
}: SettingButtonProps) {
  return (
    <Pressable onPress={onPress} style={styles(color).buttonStyle}>
      <Image source={image} style={imageStyle} resizeMode="contain" />
      <Text style={styles().text}>{text}</Text>
    </Pressable>
  );
}

const styles = (props?: any) =>
  StyleSheet.create({
    buttonStyle: {
      width: widthPercentageToDP(30),
      height: 116,
      // Platform.OS == "android"
      //   ? heightPercentageToDP(17)
      //   : heightPercentageToDP(15),
      borderRadius: 10,
      backgroundColor: props,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: Theme.APP_BLACK_COLOR,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 1,
      elevation: 4,
    },
    text: {
      marginTop: 7,
      fontSize: 15,
      fontFamily: fonts.VarelaRoundRegular,
      color: Theme.APP_WHITE_COLOR,
      textShadowColor: Theme.APP_WHITE_COLOR,
      textShadowOffset: { width: 0.17, height: 0.17 },
      textShadowRadius: 1,
      textAlign: "center",
    },
  });
