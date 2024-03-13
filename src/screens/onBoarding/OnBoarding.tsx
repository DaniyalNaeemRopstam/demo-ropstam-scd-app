import {
  Dimensions,
  Image,
  ImageBackground,
  PixelRatio,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import fonts from "../../utils/fonts";
import Theme from "../../utils/theme";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import CustomButton from "../../components/buttons/CutomButton";

export default function OnBoarding(props: any) {
  const [sliderState, setSliderState] = useState({ currentPage: 0 });
  const routeFrom = props?.route?.params?.routeFrom;

  const { width } = Dimensions.get("window");
  const scrollRef = useRef<any>(null);
  const setSliderPage = (event: any) => {
    const { x } = event.nativeEvent.contentOffset;
    const indexOfNextScreen = Math.round(x / width);
    if (indexOfNextScreen !== sliderState.currentPage) {
      setSliderState({
        ...sliderState,
        currentPage: indexOfNextScreen,
      });
    }
  };

  const { currentPage: pageIndex } = sliderState;

  const handlePreviousPress = () => {
    if (pageIndex > 0) {
      const nextPage = pageIndex - 1;
      setSliderState((prevState) => ({
        ...prevState,
        currentPage: nextPage,
      }));
      scrollRef?.current.scrollTo({
        x: nextPage * width,
        y: 0,
        animated: false,
      });
    }
  };

  const handleNextPress = () => {
    if (pageIndex < 3) {
      const nextPage = pageIndex + 1;
      setSliderState((prevState) => ({
        ...prevState,
        currentPage: nextPage,
      }));
      scrollRef?.current?.scrollTo({
        x: nextPage * width,
        y: 0,
        animated: false,
      });
    } else {
      if (routeFrom == "SETTINGS") {
        props?.navigation?.goBack();
      } else {
        props?.navigation?.reset({
          index: 0,
          routes: [
            {
              name: "USERNAVIGATOR",
              params: {
                routeFrom: "SIGNUP",
              },
            },
          ],
        });
      }
    }
  };

  return (
    <>
      <SafeAreaView style={styles().safeCont}>
        <ScrollView
          ref={scrollRef}
          style={styles().scrollCont}
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          onScroll={(event: any) => {
            setSliderPage(event);
          }}
        >
          <View style={styles().cardCont}>
            <Text style={styles().title}>Swiping Starboard</Text>
            <Text style={styles().text}>
              Swipe right on member to like them
            </Text>
            <Image
              source={require("../../assets/DemoCard1.png")}
              style={styles().image}
              resizeMode="contain"
            />
            <Image
              source={require("../../assets/rightSwip.png")}
              style={styles().image1}
              resizeMode="contain"
            />
            <ImageBackground
              source={require("../../assets/Union.png")}
              style={styles().unionImgCont}
              resizeMode="stretch"
            >
              <Text style={styles().unionMainTxt}>
                {`Like the look of someone?\nSwipe right on them to send them `}
                <Text style={styles().unionStandard}>Starboard!</Text>
                {`\nIf they like you back, you will then match\nand be able to send each other messages...`}
              </Text>
            </ImageBackground>
          </View>

          <View style={styles().cardCont}>
            <Text style={styles().title}>Swiping Port</Text>
            <Text style={styles().text}>Swipe left on a member to dismiss</Text>
            <Image
              source={require("../../assets/DemoCard2.png")}
              style={styles().image}
              resizeMode="contain"
            />
            <Image
              source={require("../../assets/leftSwip.png")}
              style={styles().image1}
              resizeMode="contain"
            />
            <ImageBackground
              source={require("../../assets/Union.png")}
              style={styles().unionImgCont}
              resizeMode="stretch"
            >
              <Text style={styles().unionMainTxt}>
                {`Can't picture a future with someone?\nSwipe left on that member to send them`}
                <Text style={styles().unionPort}> Port!</Text>
                {`\nand you won't have to see them again...`}
              </Text>
            </ImageBackground>
          </View>

          <View style={styles().cardCont}>
            <Text style={styles().title}>Scope it out</Text>
            <Text style={styles().text}>
              Tap Scope to learn more about someone
            </Text>
            <Image
              source={require("../../assets/ScopeBtn.png")}
              style={styles().image}
              resizeMode="contain"
            />
            <Image
              source={require("../../assets/tapIcon.png")}
              style={styles().image1}
              resizeMode="contain"
            />
            <ImageBackground
              source={require("../../assets/Union.png")}
              style={styles().unionImgCont}
              resizeMode="stretch"
            >
              <Text style={styles().unionMainTxt}>
                {`Tap the `}
                <Text style={styles().unionsScop}>Scope</Text>
                {` button or tap directly on a\nmember to find out more.\nUse it to see more pictures, read their bio\nand find out what really hoists their sails!`}
              </Text>
            </ImageBackground>
          </View>

          <View style={styles().cardCont}>
            <Text style={styles().title}>Harpoon Time!</Text>
            <Text style={styles().text}>For that special person</Text>
            <Image
              source={require("../../assets/DemoCard3.png")}
              style={styles().image}
              resizeMode="contain"
            />
            <Image
              source={require("../../assets/shake.png")}
              style={styles().image1}
              resizeMode="contain"
            />
            <ImageBackground
              source={require("../../assets/Union.png")}
              style={styles().unionImgCont}
              resizeMode="stretch"
            >
              <Text style={styles().unionMainTxt}>
                {`Want a member to know you really like them?\nShake your device to use your `}
                <Text style={styles().unionHarpoon}>Harpoon</Text>
                {`\nand they will be immediately notified of your devotion.`}
              </Text>
            </ImageBackground>
          </View>
        </ScrollView>

        <Image
          source={require("../../assets/mascotWheel.png")}
          style={styles().mascot}
        />

        <ImageBackground
          source={require("../../assets/woodBlock.png")}
          style={styles().paginationWrapper}
        >
          {Array.from(Array(4).keys()).map((key, index) => (
            <View
              style={styles(pageIndex === index).paginationDots}
              key={index}
            >
              {pageIndex === index && (
                <Text style={styles().dotTxt}>{index + 1}</Text>
              )}
            </View>
          ))}
        </ImageBackground>

        <View style={styles().btnCont}>
          <CustomButton
            BtnContstyle={styles(sliderState?.currentPage).prevBtnCont}
            leftImage={true}
            leftImageSrc={require("../../assets/BackArrow.png")}
            leftImgStyle={styles(sliderState?.currentPage).leftImg}
            text="Previous"
            textStyle={styles(sliderState?.currentPage).prevTxtStyle}
            onPress={handlePreviousPress}
          />
          <CustomButton
            BtnContstyle={styles(sliderState?.currentPage).nextBtnCont}
            rightImage={sliderState?.currentPage < 3 ? true : false}
            rightImageSrc={require("../../assets/BackArrow.png")}
            rightImgStyle={styles().rightImg}
            text={sliderState?.currentPage < 3 ? "Next" : "Aye Aye!"}
            textStyle={styles().nextTxtStyle}
            onPress={handleNextPress}
          />
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = (props?: any) =>
  StyleSheet.create({
    safeCont: { flex: 1 },
    scrollCont: { flex: 1 },
    imageStyle: {
      height: PixelRatio.getPixelSizeForLayoutSize(135),
      width: "100%",
    },

    cardCont: { alignItems: "center", width: widthPercentageToDP(100) },
    title: {
      fontSize: 20,
      fontFamily: fonts.VarelaRoundRegular,
      marginTop: 17,
      color: Theme.APP_BLACK_COLOR,
    },
    text: {
      fontSize: 14,
      fontFamily: fonts.VarelaRoundRegular,
      color: Theme.APP_TEXT_GREY,
      marginTop: 5,
    },
    image: {
      height: heightPercentageToDP(16.5),
      marginTop: heightPercentageToDP(1),
      width: widthPercentageToDP(25),
    },
    // image: { height: 131, marginTop: heightPercentageToDP(1), width: 91 },
    // image1: { height: 73, marginTop: heightPercentageToDP(1), width: 63 },
    image1: {
      height: heightPercentageToDP(8),
      marginTop: heightPercentageToDP(1),
      width: widthPercentageToDP(20),
    },
    unionImgCont: {
      height: heightPercentageToDP(20),
      width: widthPercentageToDP(95),
      marginTop:
        Platform.OS == "android"
          ? heightPercentageToDP(2.5)
          : heightPercentageToDP(2.5),
      paddingLeft: widthPercentageToDP(8),
      paddingRight: widthPercentageToDP(4),
    },
    unionMainTxt: {
      top: 25,
      fontSize: 14,
      fontFamily: fonts.RobotoRegular,
      color: Theme.APP_BLACK_COLOR,
    },
    unionStandard: {
      fontSize: 14,
      fontFamily: fonts.RobotoRegular,
      color: Theme.APP_GREEN,
    },
    unionPort: {
      fontSize: 14,
      fontFamily: fonts.RobotoRegular,
      color: Theme.APP_RED_COLOR,
    },
    unionsScop: {
      fontSize: 14,
      fontFamily: fonts.RobotoRegular,
      color: Theme.APP_YELLOW,
    },
    unionHarpoon: {
      fontSize: 14,
      fontFamily: fonts.RobotoRegular,
      color: Theme.APP_HARPOON_BLUE,
    },
    mascot: { width: 100, height: 97, alignSelf: "center" },
    wood: { width: 235, height: 33 },
    paginationWrapper: {
      justifyContent: "space-evenly",
      alignItems: "center",
      flexDirection: "row",
      width: widthPercentageToDP(60),
      height: 33,
      alignSelf: "center",
    },
    paginationDots: {
      borderRadius: 100,
      backgroundColor: Theme.APP_RED_COLOR,
      alignItems: "center",
      justifyContent: "center",
      borderColor: Theme.APP_WHITE_COLOR,
      shadowColor: Theme.APP_BLACK_COLOR,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      height: props ? 39 : 19,
      width: props ? 39 : 19,
      borderWidth: props ? 3.5 : 3,
    },
    dotTxt: {
      fontSize: 24,
      fontFamily: fonts.VarelaRoundRegular,
      color: Theme.APP_WHITE_COLOR,
    },
    btnCont: {
      flexDirection: "row",
      alignSelf: "center",
      justifyContent: "space-between",
      width: widthPercentageToDP(90),
      marginTop: heightPercentageToDP(5),
      bottom: 10,
    },
    prevBtnCont: {
      backgroundColor: props > 0 ? Theme.APP_WHITE_COLOR : Theme.APP_DROP_GREY,
      height: 60,
      width: widthPercentageToDP(42),
      borderRadius: 10,
      borderWidth: 3,
      borderColor: props > 0 ? Theme.APP_RED_COLOR : Theme.APP_DISABLED,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: Theme.APP_BLACK_COLOR,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      paddingHorizontal: 10,
    },
    leftImg: {
      width: 16,
      height: 34,
      tintColor: props > 0 ? Theme.APP_RED_COLOR : Theme.APP_DISABLED,
    },
    prevTxtStyle: {
      flex: 1,
      textAlign: "center",
      fontSize: 24,
      fontFamily: fonts.VarelaRoundRegular,
      color: props > 0 ? Theme.APP_RED_COLOR : Theme.APP_DISABLED,
    },
    nextBtnCont: {
      backgroundColor: props < 3 ? Theme.APP_RED_COLOR : Theme.APP_BRIGHT_GREEN,
      height: 60,
      width: widthPercentageToDP(42),
      borderRadius: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: Theme.APP_BLACK_COLOR,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      paddingHorizontal: 10,
    },
    nextTxtStyle: {
      flex: 1,
      textAlign: "center",
      fontSize: 24,
      fontFamily: fonts.VarelaRoundRegular,
      color: Theme.APP_WHITE_COLOR,
    },
    rightImg: {
      width: 16,
      height: 34,
      transform: [{ rotate: "180deg" }],
      tintColor: Theme.APP_WHITE_COLOR,
    },
  });
