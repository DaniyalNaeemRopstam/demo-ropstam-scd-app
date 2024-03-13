import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import Theme from "../../utils/theme";
import fonts from "../../utils/fonts";
import { useSelector } from "react-redux";

export default function CustomHomeHeaderLeft() {
  const navigation = useNavigation<any>();
  const { counter, isViewMessageLog } = useSelector(
    (state: any) => state?.login
  );

  return (
    <Pressable
      onPress={() => {
        isViewMessageLog
          ? navigation?.navigate("MYMESSAGES")
          : navigation?.navigate("MESSAGINGLAW");
      }}
    >
      {counter > 0 && (
        <View style={styles.counterCont}>
          <Text style={styles.counterTxt}>{counter}</Text>
        </View>
      )}
      <Image
        source={require("../../assets/MessageAlert.png")} // Replace with the correct path to your back arrow image
        style={styles.image}
        resizeMode="contain"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  counterCont: {
    width: 22,
    height: 22,
    borderRadius: 22 / 2,
    backgroundColor: Theme.APP_RED_COLOR,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 10,
    left: -10,
    zIndex: 1,
    borderWidth: 2,
    borderColor: Theme.APP_WHITE_COLOR,
  },
  counterTxt: {
    fontSize: 12,
    fontFamily: fonts.VarelaRoundRegular,
    color: Theme.APP_WHITE_COLOR,
  },
  image: { width: 68, height: 24, tintColor: Theme.APP_RED_COLOR },
});
