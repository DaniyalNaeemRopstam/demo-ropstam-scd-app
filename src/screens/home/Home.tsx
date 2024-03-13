import {
  Dimensions,
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
import Sound from "../../components/modals/Sound";
import { useDispatch, useSelector } from "react-redux";
import {
  setBeaconTime,
  setCardsArray,
  setCounter,
  setGameUsers,
  setIsSound,
} from "../../redux/features/AuthSlice";
import { updateSoundAsynThunk } from "../../redux/features/ProfileSlice";
import { CustomErrorToast } from "../../helpers/CustomToast";
import { useWebsocket } from "../../hooks/useWebsocket";
import { getTotalCounterAsyncThunk } from "../../redux/features/ChatSlice";
import { useFocusEffect } from "@react-navigation/native";
import { WEB_SOCKET_URL_FROM_ENV } from "@env";
import GameService from "../../redux/api/GameService";

const windowWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("screen").height;

export default function Home(props: any) {
  const [showSound, setShowSound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { socket } = useWebsocket(WEB_SOCKET_URL_FROM_ENV);
  const { isSound, token, isViewMessageLog, isPremium, userID } = useSelector(
    (state: any) => state.login
  );

  const dispatch = useDispatch();
  const routeFrom = props?.route?.params?.routeFrom;

  const onUpdateSound = (value?: boolean) => {
    const data = {
      token: token,
      isSound: value,
    };
    dispatch<any>(updateSoundAsynThunk(data))
      .unwrap()
      .then((result: any) => {
        setShowSound(false);
        dispatch(setIsSound(result?.data?.isSound));
      })
      .catch((err: any) => {
        setShowSound(false);
        CustomErrorToast(err);
      });
  };

  const getCounter = () => {
    dispatch<any>(getTotalCounterAsyncThunk(token))
      .unwrap()
      .then((result: any) => {
        dispatch(
          setCounter(
            result?.data?.length
              ? result?.data.reduce((a: any, b: any) => (a = a + b.count), 0)
              : 0
          )
        );
      })
      .catch((err: any) => {
        CustomErrorToast(err);
      });
  };

  const getUsers = async () => {
    setIsLoading(true);
    await GameService.getUsersApi(token)
      .then((result: any) => {
        setIsLoading(false);

        const originalResponse = result.data;

        dispatch(setGameUsers(originalResponse));
        dispatch(setCardsArray(originalResponse?.matches));
        dispatch(setBeaconTime(result.data?.beacons?.startDateAndTime));
      })
      .catch((err: any) => {
        setIsLoading(false);
        CustomErrorToast(err);
      });
  };

  const receiveMessage = () => {
    getCounter();
  };

  useFocusEffect(
    useCallback(() => {
      getCounter();
      socket?.emit("addUser", { userID, isChatOpen: false, chatID: null });
      socket?.on("receiveMessage", receiveMessage);
      return () => {
        socket?.off("receiveMessage", receiveMessage);
      };
    }, [socket])
  );

  useFocusEffect(
    useCallback(() => {
      getUsers();
    }, [])
  );

  useEffect(() => {
    if (routeFrom == "SIGNUP") {
      setShowSound(true);
    }
  }, [routeFrom]);

  return (
    <ImageBackground
      source={require("../../assets/bg.png")}
      style={styles.backgroundStyle}
    >
      <View style={styles.catchMsgCont}>
        <Pressable onPress={() => props?.navigation?.navigate("CATCHOFDAY")}>
          <Image
            source={require("../../assets/CatchOfDay.png")}
            style={styles.catchStyle}
            resizeMode="contain"
          />
        </Pressable>
        <Pressable
          onPress={() => {
            isViewMessageLog
              ? props?.navigation?.navigate("MYMESSAGES")
              : props?.navigation?.navigate("MESSAGINGLAW");
          }}
        >
          <Image
            source={require("../../assets/Messages.png")}
            style={styles.messageStyle}
            resizeMode="contain"
          />
        </Pressable>
      </View>

      <Pressable
        disabled={isLoading}
        onPress={() => props?.navigation?.navigate("GAMESCREEN")}
      >
        <Image
          source={require("../../assets/setSail.png")}
          style={styles.setSailStyle}
          resizeMode="contain"
        />
      </Pressable>

      <View style={styles.catchProfileCont}>
        <Pressable onPress={() => props?.navigation?.navigate("MYCATCHES")}>
          <Image
            source={require("../../assets/MyCatches.png")}
            style={styles.myCatchStyle}
            resizeMode="contain"
          />
        </Pressable>
        <Pressable onPress={() => props?.navigation?.navigate("MYPROFILE")}>
          <Image
            source={require("../../assets/MyProfile.png")}
            style={styles.myProfileStyle}
            resizeMode="contain"
          />
        </Pressable>
      </View>

      <View style={styles.bottomMainCont}>
        <View style={styles.welcomeCont}>
          <Text style={styles.welcomeTxt}>
            Welcome aboard,{isPremium ? " Admiral!" : " Captain!"}
          </Text>
        </View>

        <View style={styles.bottomCont}>
          <Pressable
            disabled={isLoading}
            onPress={() => onUpdateSound(!isSound)}
            style={styles.soundCont}
          >
            <Image
              source={
                isSound
                  ? require("../../assets/sound_on.png")
                  : require("../../assets/sound_off.png")
              }
              style={styles.soundImg}
              resizeMode="contain"
            />
          </Pressable>
          {!isPremium && (
            <CustomButton
              BtnContstyle={styles.customBtnStyle}
              text="Upgrade to Admiral"
              textStyle={styles.customBtnTxt}
              leftImage={true}
              leftImageSrc={require("../../assets/Admiralicon.png")}
              leftImgStyle={styles.customBtnImg}
              onPress={() => props?.navigation?.navigate("UPGRADE")}
            />
          )}

          <Pressable
            disabled={isLoading}
            onPress={() => props?.navigation?.navigate("BEACON")}
          >
            <Image
              source={require("../../assets/Beaconbutton.png")}
              style={styles.soundBeaconImg}
              resizeMode="contain"
            />
          </Pressable>
        </View>
      </View>

      <Sound
        routeFrom={routeFrom}
        visible={showSound}
        onSoundOn={() => {
          onUpdateSound(true);
        }}
        onSoundOff={() => {
          onUpdateSound(false);
        }}
        onClose={() => {
          setShowSound(false);
        }}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundStyle: { flex: 1, alignItems: "center" },
  catchMsgCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: heightPercentageToDP(5),
    width: widthPercentageToDP(windowWidth > 500 ? 80 : 95),
  },

  catchStyle: {
    width: widthPercentageToDP(42),
    height: heightPercentageToDP(22),
  },

  messageStyle: {
    width: widthPercentageToDP(35),
    height:
      screenHeight < 851 ? heightPercentageToDP(19) : heightPercentageToDP(22),
  },

  setSailStyle: {
    width: widthPercentageToDP(55),
    height: heightPercentageToDP(29),
    top: -20,
  },
  catchProfileCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: widthPercentageToDP(windowWidth > 500 ? 80 : 95),
    top: -20,
  },

  myCatchStyle: {
    width: widthPercentageToDP(35),
    height: heightPercentageToDP(18),
  },

  myProfileStyle: {
    width: widthPercentageToDP(35),
    height: heightPercentageToDP(18.5),
  },
  welcomeCont: {
    backgroundColor: Theme.APP_YELLOW,
    paddingHorizontal: 15,
    paddingVertical: 2,
    borderRadius: 100,
  },
  welcomeTxt: {
    fontSize: 20,
    textShadowRadius: 1,
    color: Theme.APP_WHITE_COLOR,
    fontFamily: fonts.VarelaRoundRegular,
    textShadowColor: Theme.APP_BLACK_COLOR,
    textShadowOffset: { width: 1, height: 1 },
  },
  bottomMainCont: { alignItems: "center", position: "absolute", bottom: 20 },
  bottomCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: widthPercentageToDP(90),
    marginTop: 13,
  },
  customBtnStyle: {
    backgroundColor: Theme.APP_RED_COLOR,
    width: widthPercentageToDP(60),
    height: 43,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-evenly",
    shadowColor: Theme.APP_BLACK_COLOR,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  customBtnTxt: {
    fontSize: 16,
    fontFamily: fonts.VarelaRoundRegular,
    color: Theme.APP_WHITE_COLOR,
    textShadowRadius: 1,
    textShadowColor: Theme.APP_BLACK_COLOR,
    textShadowOffset: { width: 1, height: 1 },
  },
  customBtnImg: { width: 24, height: 28 },
  soundCont: {
    backgroundColor: Theme.APP_WHITE_COLOR,
    width: 38,
    height: 38,
    borderRadius: 38 / 2,
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
  soundImg: { width: 24, height: 22, tintColor: Theme.APP_FREQUENT_BLUE },
  soundBeaconImg: { width: 41, height: 41 },
});
