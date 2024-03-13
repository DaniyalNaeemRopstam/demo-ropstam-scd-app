import {
  Alert,
  Dimensions,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import fonts from "../../utils/fonts";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Theme from "../../utils/theme";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
} from "react-native-confirmation-code-field";
import CustomButton from "../../components/buttons/CutomButton";
import {
  forgetPasswordAsyncThunk,
  loginOTPThunk,
  saveUser,
  setIsSound,
  setMainImage,
  setPremium,
  setThemeMode,
  setTotalMatches,
  setViewMessageLog,
  signUpEmailAyncThunk,
  signUpNumberAyncThunk,
  userLoginThunk,
  verifyOtpAsyncThunk,
} from "../../redux/features/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { CustomErrorToast } from "../../helpers/CustomToast";
import Loading from "../../components/modals/Loading";
import Loader from "../../components/loader/Loader";
import { setToken } from "../../helpers/AuthToken";
import CustomSoundPlayer from "../../components/customAudio/CustomSoundPlayer";
import { useFocusEffect } from "@react-navigation/native";

const screenHeight = Dimensions.get("screen").height;

export default function EnterOtp(props: any) {
  const CELL_COUNT = 5;
  const dispatch = useDispatch();
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [radarLoading, setRadarLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const routeFrom = props?.route?.params?.screen;
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const { mobileToken } = useSelector((state: any) => state?.login);

  useFocusEffect(
    useCallback(() => {
      setValue("");
    }, [])
  );

  const onSubmit = () => {
    if (value?.length !== 5) {
      setError(true);
      return;
    }

    const userID =
      props?.route?.params?.emailData?.userID ||
      props?.route?.params?.phoneData?.userID ||
      props?.route?.params?.userID;

    const data = {
      userID,
      otp: value,
      mobileToken,
    };

    const handleLoginResponse = (response: any) => {
      if (response.data?.isProfileComplete) {
        setRadarLoading(true);
        setTimeout(() => {
          dispatch(
            saveUser({
              token: response.token,
              userID,
              isLoggedIn: true,
              images: response.data?.images,
              userName: response.data?.userName,
              isProfileComplete: response.data?.isProfileComplete,
            })
          );
          response.data?.isSound && CustomSoundPlayer("voice_0.mp3");
        }, 1000);
      } else {
        dispatch(
          saveUser({
            token: response.token,
            userID,
            isLoggedIn: true,
            images: response.data?.images,
            userName: response.data?.userName,
            isProfileComplete: response.data?.isProfileComplete,
          })
        );
      }
      dispatch(setIsSound(response.data?.isSound));
      dispatch(setMainImage(response.data?.mainImage));
      dispatch(setPremium(response.data?.isPremium));
      dispatch(setViewMessageLog(response.data?.isViewMessageLog));
      dispatch(setThemeMode(response.data?.themeMode));
      dispatch(setTotalMatches(response.totalMatches));
      setToken(response.token);
    };

    if (routeFrom === "LOGIN") {
      dispatch<any>(loginOTPThunk(data))
        .unwrap()
        .then(handleLoginResponse)
        .catch((err: any) => {
          CustomErrorToast(err);
          setError(true);
        });
    } else {
      setLoading(true);
      dispatch<any>(verifyOtpAsyncThunk(data))
        .unwrap()
        .then(() => {
          props.navigation.navigate(
            routeFrom === "FORGOTPASSWORD" ? "RESETPASSWORD" : "SETPASSWORD"
          );
        })
        .catch((err: any) => {
          CustomErrorToast(err);
          setError(true);
        })
        .finally(() => setLoading(false));
    }
  };

  const sendAgain = () => {
    setLoading(true);
    setValue("");
    if (routeFrom == "FORGOTPASSWORD" && props?.route?.params?.email) {
      setLoading(true);
      dispatch<any>(forgetPasswordAsyncThunk(props?.route?.params?.email))
        .unwrap()
        .then((response: any) => {
          if (response.data?.otp) {
            Alert.alert("OTP", response.data?.otp);
          } else {
            CustomErrorToast(response.message);
          }
          setLoading(false);
        })
        .catch((err: any) => {
          CustomErrorToast(err?.desc);
          setLoading(false);
        });
    } else if (props?.route?.params?.emailData) {
      dispatch<any>(signUpEmailAyncThunk(props?.route?.params?.emailData))
        .unwrap()
        .then((response: any) => {
          if (response.data?.otp) {
            Alert.alert("OTP", response.data?.otp);
          } else {
            CustomErrorToast(response.message);
          }
          setLoading(false);
        })
        .catch((err: any) => {
          CustomErrorToast(err?.desc);
          setLoading(false);
        });
    } else if (props?.route?.params?.phoneData) {
      dispatch<any>(signUpNumberAyncThunk(props?.route?.params?.phoneData))
        .unwrap()
        .then((response: any) => {
          if (response.data?.otp) {
            Alert.alert("OTP", response.data?.otp);
          } else {
            CustomErrorToast(response.message);
          }
          setLoading(false);
        })
        .catch((err: any) => {
          CustomErrorToast(err?.desc);
          setLoading(false);
        });
    } else if (props?.route?.params?.forgotEmail) {
      dispatch<any>(forgetPasswordAsyncThunk(props?.route?.params?.forgotEmail))
        .unwrap()
        .then((response: any) => {
          if (response.data?.otp) {
            Alert.alert("OTP", response.data?.otp);
          } else {
            CustomErrorToast(response.message);
          }

          setLoading(false);
        })
        .catch((err: any) => {
          CustomErrorToast(err?.desc);
          setLoading(false);
        });
    } else {
      dispatch<any>(userLoginThunk(props?.route?.params?.loginData))
        .unwrap()
        .then((response: any) => {
          if (response.data?.otp) {
            Alert.alert("OTP", response.data?.otp);
          } else {
            CustomErrorToast(response.message);
          }
          setLoading(false);
        })
        .catch((err: any) => {
          CustomErrorToast(err?.desc);
          setLoading(false);
        });
    }
  };

  return (
    <Pressable style={styles().mainCont} onPress={() => Keyboard.dismiss()}>
      <Text style={styles().txt1}>Enter OTP Code</Text>
      <Text style={styles().txt2}>
        Enter the 5-digit OTP passcode sent to your device
      </Text>

      <CodeField
        ref={ref}
        {...props}
        // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
        value={value}
        onChangeText={(text: string) => {
          setError(false);
          setValue(text);
        }}
        cellCount={CELL_COUNT}
        rootStyle={styles().codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <View key={index} style={styles().cellCont}>
            <Text style={[styles(error).cell, isFocused && styles().focusCell]}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          </View>
        )}
      />

      <Text style={styles().sendAgain}>
        Didn’t receive your OTP code?
        <Text style={styles().sendTxt} onPress={sendAgain}>
          {" "}
          Send Again
        </Text>
      </Text>

      <View style={styles().btnCont}>
        <CustomButton
          BtnContstyle={styles().customBtnStyle}
          text="Submit"
          textStyle={styles().btnTxt}
          onPress={onSubmit}
        />
      </View>
      <Loading visible={radarLoading} />
      <Loader isVisible={loading} />
    </Pressable>
  );
}

const styles = (props?: boolean) =>
  StyleSheet.create({
    mainCont: { alignItems: "center", flex: 1 },
    txt1: {
      fontFamily: fonts.VarelaRoundRegular,
      fontSize: 20,
      marginTop: 17,
      color: Theme.APP_BLACK_COLOR,
    },
    txt2: {
      width: widthPercentageToDP(55),
      fontFamily: fonts.RobotoRegular,
      fontSize: 14,
      marginTop: 10,
      color: Theme.APP_TEXT_GREY,
      textAlign: "center",
    },
    codeFieldRoot: {
      marginTop: heightPercentageToDP(2),
      width: widthPercentageToDP(90),
    },
    cellCont: { backgroundColor: Theme.APP_WHITE_COLOR, borderRadius: 7 },
    cell: {
      width: widthPercentageToDP(14),
      height:
        screenHeight < 750
          ? heightPercentageToDP(7.5)
          : heightPercentageToDP(6.5),
      lineHeight:
        screenHeight < 750
          ? heightPercentageToDP(6.5)
          : heightPercentageToDP(6),
      borderWidth: 2,
      borderRadius: 7,
      borderColor: props ? Theme.APP_RED_COLOR : Theme.APP_BORDER_GREY,
      textAlign: "center",
      color: Theme.APP_BLACK_COLOR,
      fontFamily: fonts.RobotoRegular,
      fontSize: 24,
    },
    focusCell: {
      borderColor: Theme.APP_BLACK_COLOR,
      color: Theme.APP_BLACK_COLOR,
    },
    sendAgain: {
      marginTop: 12,
      width: widthPercentageToDP(90),
      fontFamily: fonts.RobotoRegular,
      fontSize: 14,
      color: Theme.APP_TEXT_GREY,
    },
    sendTxt: {
      color: Theme.APP_SKY_BLUE,
      fontFamily: fonts.RobotoRegular,
      fontSize: 14,
    },
    btnCont: {
      position: "absolute",
      bottom:
        Platform.OS == "android"
          ? heightPercentageToDP(5)
          : heightPercentageToDP(8),
      alignItems: "center",
    },
    customBtnStyle: {
      backgroundColor: Theme.APP_RED_COLOR,
      width: widthPercentageToDP(90),
      height: 63,
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
    btnTxt: {
      color: Theme.APP_WHITE_COLOR,
      fontFamily: fonts.VarelaRoundRegular,
      fontSize: 24,
    },
  });
