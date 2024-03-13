import React from "react";
import { StyleSheet, ImageBackground, Text, Pressable } from "react-native";
import { widthPercentageToDP } from "react-native-responsive-screen";
import fonts from "../../utils/fonts";
import Theme from "../../utils/theme";

interface ImageButtonProps {
  onPress?: (e: any) => void;
  buttonText?: string;
  imageSource?: any;
}

const ImageButton = ({
  onPress,
  buttonText,
  imageSource,
}: ImageButtonProps) => {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <ImageBackground
        source={imageSource}
        style={styles.image}
        imageStyle={styles.image}
        resizeMode="stretch"
      >
        <Text style={styles.text}>{buttonText}</Text>
      </ImageBackground>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 78,
    width: widthPercentageToDP(43),
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
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 19,
    fontFamily: fonts.RobotoRegular,
    color: Theme.APP_WHITE_COLOR,
    textAlign: "center",
    textShadowColor: Theme.APP_BLACK_COLOR,
    textShadowOffset: { width: 0.17, height: 0.17 },
    textShadowRadius: 1,
  },
});

export default ImageButton;
