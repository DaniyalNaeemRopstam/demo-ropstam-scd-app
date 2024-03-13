import {
  Alert,
  Dimensions,
  Image,
  Linking,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import SettingButton from "../../components/settingBtn/SettingButton";
import Theme from "../../utils/theme";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import fonts from "../../utils/fonts";
import CustomButton from "../../components/buttons/CutomButton";
import { useDispatch, useSelector } from "react-redux";
import { deleteToken, setIsSound } from "../../redux/features/AuthSlice";
import Sound from "../../components/modals/Sound";
import { CustomErrorToast } from "../../helpers/CustomToast";
import {
  createProfileAsynThunk,
  getProfileAsynThunk,
  updateSoundAsynThunk,
} from "../../redux/features/ProfileSlice";
import Loader from "../../components/loader/Loader";
import { useFocusEffect } from "@react-navigation/native";
import { useWebsocket } from "../../hooks/useWebsocket";
import { WEB_SOCKET_URL_FROM_ENV } from "@env";
import { excludeUnUsedkeysFromUserObj } from "../../helpers/Common";

const screenHeight = Dimensions.get("screen").height;

export default function Settings(props: any) {
  const dispatch = useDispatch();
  const [showSound, setShowSound] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = useSelector((state: any) => state.login.token);
  const [userInfo, setUserInfo] = useState<any>({});
  const { socket } = useWebsocket(WEB_SOCKET_URL_FROM_ENV);

  const onLogOff = () => {
    const updatedUserData = {
      ...excludeUnUsedkeysFromUserObj(userInfo),
      token,
      mobileToken: "",
    };

    dispatch<any>(createProfileAsynThunk(updatedUserData))
      .unwrap()
      .then(() => {
        socket?.close();
        dispatch(deleteToken());
      })
      .catch((err: any) => {
        CustomErrorToast(err);
      });
  };

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

  useFocusEffect(
    useCallback(() => {
      getUserInfo();
    }, [])
  );

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: "https://www.seacaptaindate.com/app",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

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
  return (
    <View style={styles.mainCont}>
      <View style={styles.col1}>
        <SettingButton
          color={Theme.APP_SETTING_PURPLE}
          image={require("../../assets/Captain_hat.png")}
          imageStyle={styles.captainHat}
          text={`My\nAccount`}
          onPress={() => props?.navigation?.navigate("MYPROFILE")}
        />
        <SettingButton
          color={Theme.APP_SETTING_YELLOW}
          image={require("../../assets/Telescope_icon.png")}
          imageStyle={styles.telescope}
          text="Matching"
          onPress={() =>
            props?.navigation?.navigate("PROFILENAVIGATOR", {
              screen: "MATCHINGPREFERENCE",
              params: { routeFrom: "SETTINGS", userInfo: userInfo },
            })
          }
        />
        <SettingButton
          color={Theme.APP_SETTING_CYAN}
          image={require("../../assets/Admiral_icon.png")}
          imageStyle={styles.admiral}
          text={`Upgrade\nto Admiral`}
          onPress={() => props?.navigation?.navigate("UPGRADE")}
        />
      </View>

      <View style={styles.col1}>
        <SettingButton
          color={Theme.APP_SETTING_PINK}
          image={require("../../assets/ship_wheel.png")}
          imageStyle={styles.shipWheel}
          text={`Navigation\nOptions`}
          onPress={() =>
            props?.navigation?.navigate("PROFILENAVIGATOR", {
              screen: "MATCHINGSETTINGS",
              params: {
                routeFrom: "SETTINGS",
                userInfo: userInfo,
              },
            })
          }
        />

        <Image
          style={styles.portHole}
          source={require("../../assets/scd-porthole.gif")}
          resizeMode="contain"
        />

        <SettingButton
          color={Theme.APP_LIGHT_BLUE}
          image={require("../../assets/Ship_bell.png")}
          imageStyle={styles.shipBell}
          text="Sound"
          onPress={() => setShowSound(true)}
        />
      </View>

      <View style={styles.col1}>
        <SettingButton
          color={Theme.APP_SETTING_TULIP}
          image={require("../../assets/Knot.png")}
          imageStyle={styles.knot}
          text={`Learn\nthe Ropes`}
          onPress={() =>
            props?.navigation?.navigate("PROFILENAVIGATOR", {
              screen: "ONBOARDING",
              params: {
                routeFrom: "SETTINGS",
              },
            })
          }
        />
        <SettingButton
          color={Theme.APP_SETTING_MANGO}
          image={require("../../assets/Lifejacket.png")}
          imageStyle={styles.lifeJacket}
          text="Help"
          onPress={() =>
            props?.navigation?.navigate("HELP", { userInfo: userInfo })
          }
        />
        <SettingButton
          color={Theme.APP_SETTING_LIME}
          image={require("../../assets/Flags.png")}
          imageStyle={styles.flags}
          text={`Contact\nSupport`}
          onPress={() =>
            props?.navigation?.navigate("CONTACTSUPPORT", {
              userInfo: userInfo,
            })
          }
        />
      </View>

      <View style={styles.bottomCont}>
        <Image
          source={require("../../assets/wheelIcon.png")}
          style={styles.wheelIcon}
        />
        <Text style={styles.yearTxt}>© 2023</Text>
        <Text style={styles.yearTxtB}>Sea Captain Date</Text>

        <View style={styles.bottomInnerView}>
          <Pressable
            onPress={() => Linking.openURL("https://www.seacaptaindate.com")}
            style={styles.innerView1}
          >
            <Image
              source={require("../../assets/globe_icon.png")}
              style={styles.globe}
              resizeMode="contain"
            />
            <Text style={styles.yearTxtB}>WWW</Text>
          </Pressable>

          <View style={styles.logoffBtnCont}>
            <CustomButton
              BtnContstyle={styles.customBtnStyle}
              text="Log Off"
              textStyle={styles.btnTxt}
              onPress={onLogOff}
            />

            <Text
              style={styles.privacy}
              onPress={() =>
                Linking.openURL(
                  "https://www.seacaptaindate.com/terms-of-service"
                )
              }
            >
              Terms & Privacy Policy
            </Text>
          </View>

          <Pressable onPress={onShare} style={styles.innerView1}>
            <Image
              source={require("../../assets/Share_arrow.png")}
              style={styles.shareIcon}
              resizeMode="contain"
            />
            <Text style={styles.yearTxtB}>Share App!</Text>
          </Pressable>
        </View>
      </View>

      <Sound
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
      <Loader isVisible={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  mainCont: {
    flex: 1,
    alignItems: "center",
  },
  col1: {
    marginTop: 23,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: widthPercentageToDP(100),
  },
  captainHat: {
    width: widthPercentageToDP(20),
    height: heightPercentageToDP(6),
  },
  telescope: {
    width: widthPercentageToDP(20),
    height: heightPercentageToDP(7.5),
  },
  admiral: {
    width: widthPercentageToDP(20),
    height: heightPercentageToDP(7),
  },
  shipWheel: {
    width: widthPercentageToDP(20),
    height: heightPercentageToDP(7),
  },
  portHole: {
    width: widthPercentageToDP(30),
    height:
      screenHeight < 750 ? heightPercentageToDP(17) : heightPercentageToDP(15),
  },
  shipBell: { width: widthPercentageToDP(20), height: heightPercentageToDP(7) },
  knot: { width: widthPercentageToDP(20), height: heightPercentageToDP(7) },
  lifeJacket: {
    width: widthPercentageToDP(20),
    height: heightPercentageToDP(7),
  },
  flags: { width: widthPercentageToDP(20), height: heightPercentageToDP(6) },

  bottomCont: {
    position: "absolute",
    bottom: heightPercentageToDP(3),
    alignItems: "center",
  },
  wheelIcon: { width: 47, height: 47 },
  yearTxt: {
    color: Theme.APP_TEXT_GREY,
    fontSize: 12,
    fontFamily: fonts.VarelaRoundRegular,
    marginTop: 6,
  },
  yearTxtB: {
    color: Theme.APP_TEXT_GREY,
    fontSize: 12,
    fontFamily: fonts.VarelaRoundRegular,
  },

  bottomInnerView: {
    alignItems: "flex-end",

    justifyContent: "space-evenly",
    flexDirection: "row",
    width: widthPercentageToDP(100),
    marginTop: 11,
  },
  innerView1: {
    alignItems: "center",
    flex: 1,
  },
  globe: { width: 15, height: 21 },

  customBtnStyle: {
    backgroundColor: Theme.APP_DARK_GREY,
    width: widthPercentageToDP(32),
    height: 33,
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
  privacy: {
    color: Theme.APP_TEXT_GREY,
    fontSize: 12,
    fontFamily: fonts.VarelaRoundRegular,
    textDecorationLine: "underline",
    marginTop: 10,
  },
  btnTxt: {
    color: Theme.APP_WHITE_COLOR,
    fontFamily: fonts.VarelaRoundRegular,
    fontSize: 16,
    textAlign: "center",
  },
  shareIcon: { width: 24, height: 20 },
  logoffBtnCont: { alignItems: "center" },
});
