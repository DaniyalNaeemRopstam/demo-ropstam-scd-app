import React from "react";
import { Image, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Theme from "../../utils/theme";
import { widthPercentageToDP } from "react-native-responsive-screen";

interface CustomBackHeaderProps {
  onPress?: any;
}

const CustomBackHeader = ({ onPress }: CustomBackHeaderProps) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    onPress ? onPress() : navigation.goBack();
  };

  return (
    <Pressable onPress={handleBackPress} style={styles.cont}>
      <Image
        source={require("../../assets/BackArrow.png")} // Replace with the correct path to your back arrow image
        style={styles.image}
        resizeMode="contain"
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cont: {
    width: widthPercentageToDP(10),
    alignItems: "flex-start",
  },
  image: { width: 16, height: 34, tintColor: Theme.APP_RED_COLOR },
});

export default CustomBackHeader;
