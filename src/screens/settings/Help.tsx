import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { CustomInput } from "../../components/customInput/CustomInput";
import { useForm } from "react-hook-form";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import fonts from "../../utils/fonts";
import Theme from "../../utils/theme";
import ImageButton from "../../components/buttons/ImageButton";
import CustomButton from "../../components/buttons/CutomButton";

export default function Help(props: any) {
  const [search, setSearch] = useState("");
  const [faqs] = useState([
    {
      q: "Is this real?",
      a: "Rest assured that this is a real app.",
    },
    {
      q: "Are you sure it's real?",
      a: "Absolutely it is a real app. Welcome aboard!",
    },
    {
      q: "How does swiping work?",
      a: `To reject another member, swipe them to the left hand side of the screen. This is Port.${"\n"}${"\n"}To like another member, swipe them to the right hand side of the screen. This is Starboard.${"\n"}${"\n"}If both you and the other user like eachother, you will be matched.${"\n"}${"\n"}To send a harpoon to a member, simply shake your device. This will immediately notify the other member that you like them.`,
    },
    {
      q: "How do I edit my profile and add photos?",
      a: "Go to Settings and view your My Account settings to edit your profile and add photos.",
    },
    {
      q: "Can I see who liked or viewed my profile?",
      a: "Currently that is not possible unless the other member has liked you already or sent you a harpoon.",
    },
    {
      q: "Can I customize search preferences for matches?",
      a: "Yes, go to to Settings and then Matching settings to edit your search preferences.",
    },
    {
      q: "How can I improve my chances of finding a match?",
      a: "Try reducing the number of match criteria in the Matching settings to increase your chances.",
    },
    {
      q: "How do I upgrade to a premium Admiral account?",
      a: "Simply tap on the 'Upgrade to Admiral' button at the bottom of the homescreen or through the 'Upgrade' button in Settings.",
    },
    {
      q: "Can I 'undo' accidental swipes?",
      a: "No. Be careful where you swipe as you cannot go back and change your mind.",
    },
    {
      q: "What if a match doesn't respond to my message?",
      a: "Please give them time to respond. If they do not send you a message, remember that it is their decision.",
    },
    {
      q: "How can I ensure my safety when meeting someone in person?",
      a: "Please see our 'Staying Safe' guide for tips on how to stay safe when meeting a match in person.",
    },
    {
      q: "Can I change my location and search in different areas?",
      a: "Yes you can, but you're more likely to have better matches locally.",
    },
    {
      q: "How does the app handle my location data and privacy?",
      a: "Please refer to our Terms and Conditions and Privacy Policy for details on how we handle your data.",
    },
    {
      q: "Can I change my privacy settings for my profile?",
      a: "Yes, you can do so in your My Account settings.",
    },
    {
      q: "How do you deal with fake or spam profiles?",
      a: "While we are pro-active in monitoring our app, we rely on users like you to report fake or spam profiles.",
    },
    {
      q: "How can I block or unmatch unwanted members?",
      a: "Please tap on the 'Report' or 'Red Flag' button when interacting with unwanted members and select 'Block Member'. You may also file a report if you experienced harrassment.",
    },
    {
      q: "How do I report inappropriate or abusive behavior?",
      a: "Tap on the 'Red Flag' icon on your message screen and fill out the report ticket so we can take action.",
    },
    {
      q: "Can I suspend my account?",
      a: "Yes. You can suspend your account and re-activate it later at any time from your My Account settings.",
    },
    {
      q: "How do I delete or deactivate my account?",
      a: "Go to your My Account settings and scroll to the bottom and look for the 'Deactivate Account' option.",
    },
    {
      q: "Further Questions?",
      a: "If you have a question that we have not answered above, please reach out to our Support Crew by tapping on 'Contact Support' in the Help menu.",
    },
  ]);
  const [faqs2, setFaqs2] = useState(faqs);
  const [displayCount, setDisplayCount] = useState(2); // Number of FAQs to display initially

  const { control } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const handleViewMore = () => {
    if (displayCount < faqs.length) {
      setDisplayCount(faqs.length); // Show all FAQs when "View More FAQs" is clicked
    } else {
      setDisplayCount(2);
    }
  };

  async function onSearch(text: string) {
    if (text.length == 0) {
      setSearch(text);
      setDisplayCount(2);
      setFaqs2(faqs);
    } else {
      setSearch(text);
      const nam = text?.toLowerCase();
      const filterQ = await faqs?.filter((e: any) =>
        e?.q?.toLowerCase()?.includes(nam)
      );

      const filterA = await faqs?.filter((e: any) =>
        e?.a?.toLowerCase()?.includes(nam)
      );

      const filteredArr = [...filterA, ...filterQ];

      setFaqs2(filteredArr);
      setDisplayCount(faqs.length);
    }
  }
  return (
    <ScrollView
      bounces={false}
      style={styles().mainStyle}
      contentContainerStyle={styles().mainCont}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles().textInputCont}>
        <Image
          source={require("../../assets/searchIcon.png")}
          style={styles().searchImg}
        />
        <CustomInput
          returnKeyType={"done"}
          value={search}
          editable={true}
          autoCap={false}
          fieldName="about_me"
          control={control}
          keyboardType="default"
          textBoxContainer={styles().textInput}
          txtbxstyl={styles().txtbxstyle1}
          plcholder={`Search Help Topics`}
          plcholdercolor={Theme.APP_TEXT_GREY}
          onChangeTexts={(text: string) => {
            onSearch(text);
          }}
        />
      </View>

      <View style={styles().faqCont}>
        <Text style={styles().frequentTxt}>Frequently Asked Questions</Text>
        <Image
          source={require("../../assets/question.png")}
          style={styles().question}
          resizeMode="contain"
        />

        {faqs2.length == 0 && (
          <Text style={styles().faqsNoData}>No data found</Text>
        )}

        {faqs2.slice(0, displayCount).map((item, index) => (
          <View
            key={`item-${index}`} // Use a unique key for each item
            style={styles(index == faqs2.length - 1).mapOuterCont}
          >
            <Text key={`q-${index}`} style={[styles().faqs, styles().faqsQ]}>
              {index + 1}. {item?.q}
            </Text>

            <Text key={`a-${index}`} style={styles().faqs}>
              {item?.a}
            </Text>
          </View>
        ))}

        <Text style={styles().viewMore} onPress={handleViewMore}>
          {displayCount < faqs.length ? "View More FAQs..." : "View Less"}
        </Text>

        <Image
          source={require("../../assets/mascotWheel.png")}
          style={styles().mascotWheel}
        />
      </View>

      <View style={styles().row}>
        <ImageButton
          onPress={() =>
            props?.navigation?.navigate("PROFILENAVIGATOR", {
              screen: "ONBOARDING",
              params: {
                routeFrom: "SETTINGS",
              },
            })
          }
          buttonText="Tutorial"
          imageSource={require("../../assets/btn1.png")}
        />
        <ImageButton
          onPress={() => props?.navigation?.navigate("TIPSTRICKS")}
          buttonText="Tips & Tricks"
          imageSource={require("../../assets/btn2.png")}
        />
      </View>
      <View style={styles().row}>
        <ImageButton
          onPress={() => props?.navigation?.navigate("STAYINGSAFE")}
          buttonText="Staying Safe"
          imageSource={require("../../assets/btn3.png")}
        />
        <ImageButton
          onPress={() => props?.navigation?.navigate("UPGRADE")}
          buttonText={`How to${"\n"}Upgrade`}
          imageSource={require("../../assets/btn4.png")}
        />
      </View>
      <View style={styles().row}>
        <ImageButton
          onPress={() => props?.navigation?.navigate("MYTICKETS")}
          imageSource={require("../../assets/btn5.png")}
          buttonText="My Tickets"
        />
        <ImageButton
          onPress={() => props?.navigation?.goBack()}
          buttonText={`Go to${"\n"}Settings`}
          imageSource={require("../../assets/btn6.png")}
        />
      </View>

      <View style={styles().bottomCont}>
        <Text style={styles().helpTxt}>Need more help?</Text>
        <CustomButton
          leftImage={true}
          leftImageSrc={require("../../assets/Flags.png")}
          leftImgStyle={styles().imgStyle}
          BtnContstyle={styles().btnCont}
          text="Contact Support"
          textStyle={styles().btnTxt}
          onPress={() =>
            props?.navigation?.navigate("CONTACTSUPPORT", {
              userInfo: props?.route?.params?.userInfo,
            })
          }
        />
      </View>
    </ScrollView>
  );
}

const styles = (props?: any) =>
  StyleSheet.create({
    mainStyle: { flex: 1 },
    mainCont: { alignItems: "center", paddingBottom: 50 },
    textInputCont: {
      marginTop: 32,
      height: 52,
      width: widthPercentageToDP(90),
      paddingHorizontal: 15,
      borderRadius: 10,
      borderWidth: 3,
      borderColor: Theme.APP_BORDER_GREY,
      backgroundColor: Theme.APP_WHITE_COLOR,
      flexDirection: "row",
      alignItems: "center",
      shadowColor: Theme.APP_BLACK_COLOR,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },

    searchImg: { width: 27, height: 27 },
    textInput: {
      flex: 1,
      marginLeft: 10,
    },
    txtbxstyle1: {
      height: 52,
      fontFamily: fonts.RobotoRegular,
      fontSize: 19,
      color: Theme.APP_BLACK_COLOR,
    },
    faqCont: {
      width: widthPercentageToDP(90),
      backgroundColor: Theme.APP_HELP_BlUE,
      paddingVertical: 10,
      paddingHorizontal: 10,
      marginTop: 13,
      shadowColor: Theme.APP_BLACK_COLOR,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      borderRadius: 10,
    },
    frequentTxt: {
      fontFamily: fonts.VarelaRoundRegular,
      color: Theme.APP_FREQUENT_BLUE,
      fontSize: 16,
    },
    question: {
      width: 28,
      height: 43,
      position: "absolute",
      right: 10,
      top: 10,
    },
    mapOuterCont: {
      width: props ? widthPercentageToDP(70) : widthPercentageToDP(80),
    },
    faqsNoData: {
      height: 60,
      fontFamily: fonts.VarelaRoundRegular,
      fontSize: 11,
      marginTop: 9,
      color: Theme.APP_BLACK_COLOR,
    },
    faqsQ: {
      textShadowRadius: 1,
      textShadowColor: Theme.APP_BLACK_COLOR,
      textShadowOffset: { width: 0.5, height: 0.5 },
    },
    faqs: {
      fontFamily: fonts.VarelaRoundRegular,
      fontSize: 11,
      marginTop: 9,
      color: Theme.APP_BLACK_COLOR,
    },
    viewMore: {
      fontFamily: fonts.VarelaRoundRegular,
      fontSize: 11,
      marginTop: 9,
      color: Theme.APP_RED_COLOR,
    },
    mascotWheel: {
      width: 83,
      height: 80,
      position: "absolute",
      bottom: 0,
      right: 0,
    },
    row: {
      marginTop: 15,
      width: widthPercentageToDP(90),
      alignItems: "center",
      justifyContent: "space-between",
      flexDirection: "row",
    },
    bottomCont: { alignItems: "center", marginTop: heightPercentageToDP(15) },
    helpTxt: {
      fontFamily: fonts.RobotoRegular,
      color: Theme.APP_BLACK_COLOR,
      fontSize: 14,
    },
    imgStyle: { width: 32, height: 26, marginRight: 10 },
    btnCont: {
      marginTop: 10,
      flexDirection: "row",
      backgroundColor: Theme.APP_DARK_GREY,
      width: widthPercentageToDP(55),
      height: heightPercentageToDP(6),
      alignItems: "center",
      justifyContent: "center",
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
    btnTxt: {
      fontFamily: fonts.VarelaRoundRegular,
      fontSize: 16,
      color: Theme.APP_WHITE_COLOR,
    },
  });
