import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import Theme from "../../utils/theme";
import { widthPercentageToDP } from "react-native-responsive-screen";
import fonts from "../../utils/fonts";

interface CustomToastProps {
  toast: any;
}

export default function CustomToast({ toast }: CustomToastProps) {
  // Extract the message content from the data
  const messageContent = toast?.data?.message;

  // Extract the username (assumes it's the last word)
  const username = messageContent?.split(" ").pop();

  // Construct the prefix without the username
  const prefix = messageContent.replace(username, "").trim();

  return (
    <Pressable onPress={() => toast.onPress()} style={styles.mainCont}>
      <Image
        source={toast.data.image}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.divider} />
      <View style={styles.txtCont}>
        <Text style={styles.title}>{toast.data.title}</Text>
        <Text style={styles.message}>{prefix}</Text>
        <Text style={styles.text}>{username}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  mainCont: {
    width: widthPercentageToDP(95),
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: Theme.APP_BACKGROUND_COLOR,
    marginVertical: 4,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    shadowColor: Theme.APP_BLACK_COLOR,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: { width: 67, height: 60 },
  divider: {
    marginLeft: 15,
    marginRight: 30,
    width: 4,
    height: 71,
    backgroundColor: Theme.APP_BORDER_GREY,
    borderRadius: 10,
  },
  txtCont: { alignItems: "center" },
  title: {
    fontSize: 19,
    color: Theme.APP_BLACK_COLOR,
    fontFamily: fonts.VarelaRoundRegular,
  },
  message: {
    color: Theme.APP_TEXT_GREY,
    marginTop: 4,
    fontFamily: fonts.VarelaRoundRegular,
  },
  text: {
    color: Theme.APP_RED_COLOR,
    marginTop: 4,
    fontFamily: fonts.VarelaRoundRegular,
  },
});
