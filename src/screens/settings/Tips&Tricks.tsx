import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { widthPercentageToDP } from "react-native-responsive-screen";
import Theme from "../../utils/theme";
import fonts from "../../utils/fonts";

export default function TipsTricks() {
  const data = [
    {
      heading: "Increase Your Discovery Radius",
      text: "Visit Navigation Options in Settings and increase the size of your Discovery Radius to get more matches.",
    },
    {
      heading: "Flesh Out Your Bio",
      text: "Let other members get to know you better by fleshing out your bio. Be sure to include your hobbies and interests and let others know something interesting about you. This will improve the quality of your matches.",
    },
    {
      heading: "Upload More Photos",
      text: "Members enjoy seeing photos so be sure to upload as many good quality photos as you can. Just make sure the photos show off your face. This will improve your results.",
    },
    {
      heading: "Use Your Harpoons",
      text: "When you use a Harpoon on another member, they will instantly know you liked them. Use your harpoons wisely but if you run out, you can always purchase a harpoon bundle.",
    },
    {
      heading: "Set A Beacon",
      text: "Attract more attention to your profile by setting a Beacon. Tap on the orange Beacon icon on the bottom right of the home screen to set a beacon. Your profile will be promoted to all the members in your area for a set amount of time. If you run out, you can always purchase a beacon bundle.",
    },
  ];
  return (
    <ScrollView
      style={styles.scrollStyle}
      contentContainerStyle={styles.mainCont}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      {data.map((item, index) => {
        return (
          <View key={index} style={styles.cardCont}>
            <View style={styles.cardTopCont}>
              <Image
                source={require("../../assets/lightbulb-icon.png")}
                style={styles.img}
              />
              <Text style={styles.cardTopTxt}>{item.heading}</Text>
            </View>
            <Text style={styles.cardBottomTxt}>{item.text}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollStyle: { flex: 1 },
  mainCont: {
    paddingTop: 15,
    paddingBottom: 20,
    alignItems: "center",
  },
  cardCont: {
    width: widthPercentageToDP(95),
    backgroundColor: Theme.APP_DROP_GREY,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 20,
    marginBottom: 15,
  },
  cardTopCont: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.APP_WHITE_COLOR,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingVertical: 5,
  },
  img: {
    left: 15,
    width: 20,
    height: 30,
    tintColor: Theme.APP_SETTING_YELLOW,
  },
  cardTopTxt: {
    flex: 1,
    textAlign: "center",
    fontSize: 15,
    fontFamily: fonts.VarelaRoundRegular,
    color: Theme.APP_RED_COLOR,
  },
  cardBottomTxt: {
    fontSize: 15,
    fontFamily: fonts.VarelaRoundRegular,
    color: Theme.APP_BLACK_COLOR,
    padding: 10,
    textAlign: "center",
  },
});
