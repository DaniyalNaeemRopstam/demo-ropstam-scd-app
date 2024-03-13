import { Image, Pressable, StyleSheet } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

export default function CustomSettingHeader() {
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={() => {
        navigation.navigate("SETTINGS");
      }}
    >
      <Image
        source={require("../../assets/Settings.png")} // Replace with the correct path to your back arrow image
        style={styles.imgStyle}
        resizeMode="contain"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  imgStyle: { width: 33, height: 33, bottom: 3 },
});
