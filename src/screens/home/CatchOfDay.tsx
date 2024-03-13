import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Theme from "../../utils/theme";
import fonts from "../../utils/fonts";
import CustomButton from "../../components/buttons/CutomButton";
import { useDispatch, useSelector } from "react-redux";
import CustomSoundPlayer from "../../components/customAudio/CustomSoundPlayer";
import {
  getCatchAsynThunk,
  useHarpoonCatchAsynThunk,
} from "../../redux/features/MatchSlice";
import { CustomErrorToast } from "../../helpers/CustomToast";
import Loader from "../../components/loader/Loader";
import HarpoonModal from "../../components/modals/HarpoonModal";
import {
  getProfileAsynThunk,
  getUserProfileAsynThunk,
} from "../../redux/features/ProfileSlice";
import { useFocusEffect } from "@react-navigation/native";

export default function CatchOfDay(props: any) {
  const { isSound, token } = useSelector((state: any) => state.login);
  const [loading, setLoading] = useState(false);
  const [harpoonModal, setHarpoonModal] = useState(false);
  const dispatch = useDispatch();
  const [catchProfile, setCatchProfile] = useState<any>({});
  const [userInfo, setUserInfo] = useState<any>({});

  const getUserInfo = async () => {
    dispatch<any>(getProfileAsynThunk(token))
      .unwrap()
      .then((response: any) => {
        setLoading(false);
        setUserInfo(response.data);
      })
      .catch((err: any) => {
        setLoading(false);
        CustomErrorToast(err);
      });
  };

  const getCatch = () => {
    dispatch<any>(getCatchAsynThunk(token))
      .unwrap()
      .then((response: any) => {
        setLoading(false);
        setCatchProfile(response.data);
      })
      .catch((err: any) => {
        setLoading(false);
        CustomErrorToast(err);
      });
  };

  useEffect(() => {
    setLoading(true);
    isSound && CustomSoundPlayer("voice_13.mp3");
  }, []);

  useFocusEffect(
    useCallback(() => {
      getCatch();
      getUserInfo();
    }, [])
  );

  const useHarpoon = (status: boolean) => {
    setLoading(true);
    const data = {
      token: token,
      catchOfTheDayUser: catchProfile?.catchOfTheDay?.user?._id,
      status: status,
    };
    dispatch<any>(useHarpoonCatchAsynThunk(data))
      .unwrap()
      .then(() => {
        setLoading(false);
        if (!status) {
          isSound && CustomSoundPlayer("big_splash.mp3");
          props?.navigation?.goBack();
        } else {
          isSound && CustomSoundPlayer("harpoon_sfx.mp3");
          props?.navigation?.navigate("MYCATCHES");
          // Alert.alert(response.message, "", [
          //   {
          //     onPress: () => props?.navigation?.navigate("MYCATCHES"),
          //   },
          // ]);
        }
      })
      .catch((err: any) => {
        setLoading(false);
        if (err == "No more harpoons left") {
          setHarpoonModal(true);
        }
        CustomErrorToast(err);
      });
  };

  const userProfile = () => {
    setLoading(true);
    const data = {
      id: catchProfile?.catchOfTheDay?.user?._id,
      token,
    };
    dispatch<any>(getUserProfileAsynThunk(data))
      .unwrap()
      .then((result: any) => {
        setLoading(false);
        props?.navigation?.navigate("USERPROFILE", {
          routeFrom: "CATCHOFTHEDAY",
          profileData: result?.data,
          matchID: catchProfile?.catchOfTheDay?._id,
        });
      })
      .catch((err: any) => {
        setLoading(false);
        CustomErrorToast(err?.message);
      });
  };

  return (
    <ImageBackground
      source={require("../../assets/background.png")}
      style={styles().backGround}
      imageStyle={styles().image}
      resizeMode="cover"
    >
      {catchProfile?.catchOfTheDay?.user && (
        <>
          <Pressable onPress={userProfile} style={styles().profileCont}>
            <Image
              source={
                catchProfile
                  ? { uri: catchProfile?.catchOfTheDay?.user?.mainImage }
                  : require("../../assets/profile.png")
              }
              style={styles().profileImg}
            />
            {/* <Image
              source={require("../../assets/anchor.png")}
              style={styles().anchor}
              resizeMode="contain"
            /> */}
          </Pressable>

          <View style={styles().welcomeCont}>
            <Text style={styles().welcomeTxt}>
              {catchProfile?.catchOfTheDay?.user?.userName}
            </Text>
          </View>
          <Text style={styles().recomendedTxt}>
            This member is recommended to you {"\n"}based on your preferences
            {"\n"}
          </Text>
        </>
      )}

      <Text style={styles(catchProfile?.catchOfTheDay?.user).tomorrowTxt}>
        A new catch will appear tomorrow
      </Text>

      <View style={styles().bottomCont}>
        {catchProfile?.catchOfTheDay?.user ? (
          <View style={styles().bottomInnerCont}>
            <CustomButton
              BtnContstyle={styles().leftBtnCont}
              text="Throw back"
              textStyle={styles().leftBtnTxt}
              onPress={() => useHarpoon(false)}
            />

            <CustomButton
              BtnContstyle={styles().rightBtnCont}
              text={"Send Harpoon"}
              onPress={() => useHarpoon(true)}
              textStyle={styles().rightBtnTxt}
            />
          </View>
        ) : (
          <CustomButton
            BtnContstyle={styles().returnBtn}
            text="Return to Port"
            textStyle={styles().leftBtnTxt}
            onPress={() => props?.navigation?.goBack()}
          />
        )}

        <Text
          style={styles().bottomTxt}
          onPress={() =>
            props?.navigation?.navigate("PROFILENAVIGATOR", {
              screen: "MATCHINGPREFERENCE",
              params: { routeFrom: "CATCHOFTHEDAY", userInfo: userInfo },
            })
          }
        >
          Tap here to change your preferences
        </Text>
      </View>
      <Loader isVisible={loading} />
      <HarpoonModal
        harpoons={0}
        visible={harpoonModal}
        onPress={() => {
          props?.navigation?.navigate("UPGRADE");
          setHarpoonModal(false);
        }}
        onClose={() => setHarpoonModal(false)}
      />
    </ImageBackground>
  );
}

const styles = (props?: any) =>
  StyleSheet.create({
    backGround: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    image: {
      width: widthPercentageToDP(100),
      height: heightPercentageToDP(105),
    },
    profileCont: {
      width: widthPercentageToDP(50),
      height: widthPercentageToDP(50),
      borderRadius: widthPercentageToDP(50) / 2,
      borderWidth: 5,
      borderColor: Theme.APP_YELLOW,
      shadowColor: Theme.APP_BLACK_COLOR,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.8,
      shadowRadius: 5,
      elevation: 15,
      backgroundColor: Theme.APP_BLACK_COLOR,
      justifyContent: "center",
      alignItems: "center",
    },
    profileImg: {
      width: widthPercentageToDP(50),
      height: widthPercentageToDP(50),
      borderRadius: widthPercentageToDP(50) / 2,
      borderWidth: 5,
      borderColor: Theme.APP_YELLOW,
    },
    anchor: {
      width: 50,
      height: 50,
      position: "absolute",
      bottom: -5,
      right: 10,
    },
    welcomeCont: {
      marginTop: 8,
      backgroundColor: Theme.APP_YELLOW,
      paddingHorizontal: 15,
      paddingVertical: 2,
      borderRadius: 100,
      width: 200,
      alignItems: "center",
    },
    welcomeTxt: {
      fontSize: 20,
      textShadowRadius: 1,
      color: Theme.APP_WHITE_COLOR,
      fontFamily: fonts.VarelaRoundRegular,
      textShadowColor: Theme.APP_BLACK_COLOR,
      textShadowOffset: { width: 0, height: 1 },
    },
    recomendedTxt: {
      marginTop: heightPercentageToDP(8),
      fontSize: 16,
      fontFamily: fonts.VarelaRoundRegular,
      color: Theme.APP_WHITE_COLOR,
      textAlign: "center",
    },
    tomorrowTxt: {
      marginTop: props ? heightPercentageToDP(2) : heightPercentageToDP(53),
      fontSize: 16,
      fontFamily: fonts.VarelaRoundRegular,
      color: Theme.APP_WHITE_COLOR,
      textAlign: "center",
    },

    bottomCont: {
      position: "absolute",
      bottom: widthPercentageToDP(7),
      width: widthPercentageToDP(100),
    },
    bottomInnerCont: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
    },
    bottomTxt: {
      fontFamily: fonts.VarelaRoundRegular,
      color: Theme.APP_WHITE_COLOR,
      fontSize: 14,
      textAlign: "center",
      marginTop: heightPercentageToDP(2),
    },

    leftBtnCont: {
      width: widthPercentageToDP(40),
      height: heightPercentageToDP(7),
      backgroundColor: Theme.APP_BUTTON_GREY,
      borderRadius: 10,
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
    },
    leftBtnTxt: {
      color: Theme.APP_WHITE_COLOR,
      fontSize: 18,
      fontFamily: fonts.VarelaRoundRegular,
    },
    rightBtnCont: {
      width: widthPercentageToDP(40),
      height: heightPercentageToDP(7),
      backgroundColor: Theme.APP_HARPOON_BLUE,
      borderRadius: 10,
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
    },
    rightBtnTxt: {
      color: Theme.APP_WHITE_COLOR,
      fontSize: 18,
      fontFamily: fonts.VarelaRoundRegular,
    },
    returnBtn: {
      width: widthPercentageToDP(60),
      height: heightPercentageToDP(7),
      backgroundColor: Theme.APP_RED_COLOR,
      borderRadius: 10,
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
      alignSelf: "center",
    },
  });
