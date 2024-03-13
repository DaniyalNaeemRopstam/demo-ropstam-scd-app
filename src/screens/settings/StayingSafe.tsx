import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import fonts from "../../utils/fonts";
import Theme from "../../utils/theme";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

export default function StayingSafe() {
  const data = [
    {
      heading: "Choose a Public Place:",
      text: "Opt for a well-lit, busy public location for your first meeting, such as a café, restaurant, or park. This reduces the chances of any potential harm.",
    },
    {
      heading: "Inform a Trusted Friend or Family Member:",
      text: "Share your plans with someone you trust. Let them know where you're going, who you're meeting, and what time you expect to be back. Check in with them before and after the meeting.",
    },
    {
      heading: "Avoid Sharing Personal Information:",
      text: "Don't share sensitive personal information like your home address, workplace, or financial details. Keep conversations focused on common interests and safe topics.",
    },
    {
      heading: "Use the App's Messaging feature:",
      text: "Keep your conversations within Sea Captain Date's messaging system initially. This provides an extra layer of privacy until you're more certain about the person.",
    },
    {
      heading: "Arrange Your Own Transportation:",
      text: "Use your own mode of transportation to and from the meeting place. This gives you control over your exit and avoids sharing private travel details.",
    },
    {
      heading: "Trust Your Instincts:",
      text: "If something feels off during your interactions or at the meeting, trust your gut feeling. Your safety is more important than politeness.",
    },
    {
      heading: "Limit Alcohol Consumption:",
      text: "If you choose to have alcohol, do so responsibly. Excessive drinking can impair your judgment and put you at risk.",
    },
    {
      heading: "Keep Your Phone Charged:",
      text: "Ensure your phone is fully charged and easily accessible. You can use it to call for help or share your location if needed.",
    },
    {
      heading: "Stay in Public Areas:",
      text: "Throughout the meeting, stay in public spaces where there are other people around. Avoid going to isolated or unfamiliar locations.",
    },
    {
      heading: "Be Cautious with Personal Belongings:",
      text: "Keep an eye on your personal belongings like purse, phone, and wallet. Don't leave them unattended.",
    },
    {
      heading: "Set a Time Limit:",
      text: "Establish a time limit for the meeting, especially for the first encounter. This gives you an easy exit if things don't go as planned.",
    },
    {
      heading: "Don't Feel Obligated:",
      text: "You're under no obligation to continue the date if you're uncomfortable. Politely but firmly express your feelings and leave if necessary.",
    },
  ];

  return (
    <ScrollView
      style={styles.scrollStyle}
      contentContainerStyle={styles.mainCont}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <Text style={styles.mainHeading}>
        {`Here's a simple guide to help you stay safe when meeting other members\nin person.`}
      </Text>
      {data.map((item, index) => {
        return (
          <View style={styles.itemCont} key={index}>
            <View style={styles.indexCont}>
              <View style={styles.bar} />
              <View style={styles.numberCont}>
                <Text style={styles.numbering}>{index + 1}</Text>
              </View>
              <View style={styles.bar} />
            </View>

            <Text style={styles.heading}>{item?.heading}</Text>
            <Text style={styles.text}>{item?.text}</Text>
          </View>
        );
      })}
      <Text style={styles.bottomText}>
        Remember, your safety is paramount. Take your time getting to know the
        member before meeting in person, and follow these guidelines to ensure a
        safer and more enjoyable dating experience.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollStyle: { flex: 1 },
  mainCont: {
    alignItems: "center",
    paddingBottom: 30,
    width: widthPercentageToDP(90),
    alignSelf: "center",
  },
  mainHeading: {
    marginTop: 17,
    fontSize: 17,
    fontFamily: fonts.VarelaRoundRegular,
    color: Theme.APP_BLACK_COLOR,
    textAlign: "center",
    marginBottom: 15,
  },
  itemCont: {
    marginTop: 15,
  },
  indexCont: {
    width: widthPercentageToDP(90),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bar: {
    backgroundColor: Theme.APP_BORDER_GREY,
    flex: 1,
    height: heightPercentageToDP(1),
    borderRadius: 10,
  },
  numberCont: {
    backgroundColor: Theme.APP_SETTING_YELLOW,
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 15,
  },
  numbering: {
    color: Theme.APP_WHITE_COLOR,
    fontFamily: fonts.VarelaRoundRegular,
    fontSize: 30,
  },
  heading: {
    marginTop: 10,
    fontSize: 18,
    fontFamily: fonts.VarelaRoundRegular,
    color: Theme.APP_BLACK_COLOR,
  },
  text: {
    marginTop: 5,
    fontSize: 15,
    fontFamily: fonts.VarelaRoundRegular,
    color: Theme.APP_BLACK_COLOR,
  },
  bottomText: {
    marginTop: heightPercentageToDP(5),
    fontSize: 15,
    fontFamily: fonts.VarelaRoundRegular,
    color: Theme.APP_BLACK_COLOR,
  },
});
