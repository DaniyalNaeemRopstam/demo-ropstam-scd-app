import { GestureResponderEvent, Image, Pressable, Text } from "react-native";
import React from "react";

interface CustomButtonProps {
  text?: string;
  textStyle?: any;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  BtnContstyle?: any;
  rightImage?: boolean;
  rightImageSrc?: any;
  leftImage?: boolean;
  leftImageSrc?: any;
  leftImgStyle?: any;
  rightImgStyle?: any;
}

export default function CustomButton({
  text,
  textStyle,
  onPress,
  BtnContstyle,
  rightImage,
  rightImageSrc,
  leftImage,
  leftImageSrc,
  leftImgStyle,
  rightImgStyle,
}: CustomButtonProps) {
  return (
    <Pressable style={BtnContstyle} onPress={onPress}>
      {leftImage && (
        <Image
          source={leftImageSrc}
          style={leftImgStyle}
          resizeMode="contain"
        />
      )}
      <Text style={textStyle}>{text}</Text>
      {rightImage && <Image source={rightImageSrc} style={rightImgStyle} />}
    </Pressable>
  );
}
