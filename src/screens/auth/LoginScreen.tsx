import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Keyboard,
  Platform,
  StatusBar,
  Alert,
} from "react-native";
import React, { useRef, useState } from "react";
import fonts from "../../utils/fonts";
import Theme from "../../utils/theme";
import { CustomInput } from "../../components/customInput/CustomInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SignIn } from "../../components/validations/validations";
import CustomButton from "../../components/buttons/CutomButton";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { useDispatch } from "react-redux";
import {
  saveUser,
  setIsSound,
  setPremium,
} from "../../redux/features/AuthSlice";
import { userLoginThunk } from "../../redux/features/AuthSlice";
import { CustomErrorToast } from "../../helpers/CustomToast";
import Loader from "../../components/loader/Loader";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  appleLoginAsynThunk,
  // facebookLoginAsynThunk,
  gmailLoginAsynThunk,
} from "../../redux/features/ProfileSlice";
import appleAuth from "@invertase/react-native-apple-authentication";
import { setToken } from "../../helpers/AuthToken";
import { WEBCLIENTID } from "../../utils/constants";
// import { LoginManager, Profile } from "react-native-fbsdk-next";

export default function LoginScreen(props: any) {
  GoogleSignin.configure({
    webClientId: WEBCLIENTID,
    offlineAccess: true,
    scopes: ["email"],
  });

  const [loading, setLoading] = useState(false);
  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const input_2 = useRef();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(SignIn),
  });

  const onSubmit = () => {
    setLoading(true);
    const data = {
      loginValue: loginValue,
      password: password,
    };

    dispatch<any>(userLoginThunk(data))
      .unwrap()
      .then((response: any) => {
        Alert.alert("OTP", response.data?.otp);
        const userData = {
          loginValue: loginValue,
          password: password,
          userID: response.data?.userID,
          images: response.data?.images,
          userName: response.data?.userName,
        };
        dispatch(saveUser(userData));
        props?.navigation?.navigate("ENTEROTP", {
          screen: "LOGIN",
          loginData: data,
          userID: response.data?.userID,
        });
        setLoading(false);
      })
      .catch((err: any) => {
        setLoading(false);
        CustomErrorToast(err?.desc);
      });
  };

  const onSubmitGooglesignIn = async () => {
    setLoading(true);
    GoogleSignin.hasPlayServices()
      .then((hasPlayService) => {
        if (hasPlayService) {
          GoogleSignin.signIn()
            .then((response: any) => {
              dispatch<any>(gmailLoginAsynThunk(response.user.id))
                .unwrap()
                .then((response: any) => {
                  const data = {
                    token: response.token,
                    userID: response.data?._id,
                    isLoggedIn: true,
                    isProfileComplete: response.data?.isProfileComplete,
                    images: response.data?.images,
                    userName: response.data?.userName,
                    isPremium: response.data?.isPremium,
                  };

                  dispatch(saveUser(data));
                  dispatch(setIsSound(response.data?.isSound));
                  dispatch(setPremium(response.data?.isPremium));
                  setToken(response.token);
                  setLoading(false);
                })
                .catch((err: any) => {
                  setLoading(false);
                  CustomErrorToast(err);
                });
            })
            .catch((e: any) => {
              setLoading(false);
              if (!e?.message.includes("canceled")) {
                CustomErrorToast(e?.message);
              }
            });
        }
      })
      .catch((e: any) => {
        setLoading(false);
        CustomErrorToast(e?.message);
      });
  };

  const onAppleButtonPress = async () => {
    try {
      // performs login request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });
      // get current authentication state for user
      // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user
      );
      // use credentialState response to ensure the user is authenticated
      if (credentialState === appleAuth.State.AUTHORIZED) {
        // user is authenticated
        setLoading(true);
        const appleID = appleAuthRequestResponse.user;
        dispatch<any>(appleLoginAsynThunk(appleID))
          .unwrap()
          .then((response: any) => {
            const data = {
              token: response.token,
              userID: response.data?._id,
              isLoggedIn: true,
              isProfileComplete: response.data?.isProfileComplete,
              images: response.data?.images,
              userName: response.data?.userName,
            };
            dispatch(saveUser(data));
            dispatch(setPremium(response.data?.isPremium));
            dispatch(setIsSound(response.data?.isSound));
            setToken(response.token);
            setLoading(false);
          })
          .catch((err: any) => {
            setLoading(false);
            CustomErrorToast(err);
          });
      }
    } catch (error: any) {
      if (!error?.message.includes("couldn’t be completed")) {
        CustomErrorToast(error);
      }
    }
  };

  // const onFacebookButtonPress = async () => {
  //   setLoading(true);
  //   LoginManager.logInWithPermissions(["public_profile"]).then(() => {
  //     Profile.getCurrentProfile()
  //       .then((response: any) => {
  //         const facebookID = response.userID;
  //         dispatch<any>(facebookLoginAsynThunk(facebookID));
  //         // .unwrap()
  //         const data = {
  //           userID: response.userID,
  //           isLoggedIn: true,
  //           isProfileComplete: response.data?.isProfileComplete,
  //           images: response.data?.images,
  //           userName: response.data?.userName,
  //           isPremium: response.data?.isPremium,
  //         };
  //         dispatch(saveUser(data));
  //         dispatch(setPremium(response.data?.isPremium));
  //       })
  //       .catch((err: any) => {
  //         setLoading(false);
  //         CustomErrorToast(err);
  //       });
  //   });
  // };

  return (
    <Pressable style={styles.mainStyle} onPress={() => Keyboard.dismiss()}>
      <StatusBar
        backgroundColor={Theme.APP_WHITE_COLOR}
        barStyle={"dark-content"}
      />
      <Text style={styles.txt1}>Enter Your Details</Text>
      <Text style={styles.txt2}>Sign in to your account</Text>
      <View>
        <CustomInput
          onSubmitEditing={() => input_2?.current?.focus()}
          returnKeyType={"next"}
          value={loginValue}
          editable={true}
          autoCap={false}
          fieldName="email_address"
          control={control}
          keyboardType="email-address"
          textBoxContainer={styles.textInput1}
          txtbxstyl={styles.txtbxstyle1}
          plcholder={"Email / Number / Username"}
          plcholdercolor={Theme.APP_TEXT_GREY}
          errTxt={errors?.email_address && errors?.email_address?.message}
          errTxtstyle={styles.errtxtstyle1}
          onChangeTexts={(text: string) => {
            setLoginValue(text);
          }}
        />
        <CustomInput
          reference={input_2}
          returnKeyType={"done"}
          value={password}
          editable={true}
          autoCap={false}
          fieldName="password"
          control={control}
          keyboardType="default"
          textBoxContainer={styles.textInput2}
          txtbxstyl={styles.txtbxstyle2}
          plcholder={"Password"}
          plcholdercolor={Theme.APP_TEXT_GREY}
          errTxt={errors?.password && errors?.password?.message}
          errTxtstyle={styles.errtxtstyle2}
          onChangeTexts={(text: string) => {
            setPassword(text);
          }}
          encryption={true}
          encryptionIconStyle={styles.encryptionIconStyle}
        />

        <Text
          onPress={() => props?.navigation?.navigate("FORGOTPASSWORD")}
          style={styles.forgotText}
        >
          Forgot Password?
        </Text>
      </View>
      <View style={styles.btnCont}>
        <CustomButton
          BtnContstyle={styles.customBtnStyle}
          text="Log In"
          textStyle={styles.btnTxt}
          onPress={handleSubmit(onSubmit)}
        />
        <Text style={styles.txt2}>
          Don’t already have an account?
          <Text
            style={styles.forgotText}
            onPress={() => props.navigation.navigate("SIGNUPSCREEN")}
          >
            {" "}
            Sign Up
          </Text>
        </Text>
      </View>
      <Text style={styles.connect}>Or Connect with...</Text>
      <View style={styles.social}>
        <CustomButton
          BtnContstyle={styles.customBtnStyle2}
          text="Facebook"
          textStyle={styles.btnTxt2}
          // onPress={onFacebookButtonPress}
          leftImage={true}
          leftImageSrc={require("../../assets/facebookLogo.png")}
          leftImgStyle={styles.leftLogoStyle2}
        />

        {Platform.OS == "ios" && (
          <CustomButton
            BtnContstyle={styles.customBtnStyle1}
            text="Apple"
            textStyle={styles.btnTxt1}
            onPress={onAppleButtonPress}
            leftImage={true}
            leftImageSrc={require("../../assets/apple.png")}
            leftImgStyle={styles.leftLogoStyle3}
          />
        )}

        <CustomButton
          BtnContstyle={styles.customBtnStyle3}
          text="Google"
          textStyle={styles.btnTxt1}
          onPress={onSubmitGooglesignIn}
          leftImage={true}
          leftImageSrc={require("../../assets/GoogleLogo.png")}
          leftImgStyle={styles.leftLogoStyle1}
        />
      </View>
      <Loader isVisible={loading} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  mainStyle: { flex: 1, alignItems: "center" },
  txt1: {
    fontFamily: fonts.VarelaRoundRegular,
    fontSize: 20,
    marginTop: 17,
    color: Theme.APP_BLACK_COLOR,
  },
  txt2: {
    fontFamily: fonts.RobotoRegular,
    fontSize: 14,
    marginTop: 10,
    color: Theme.APP_TEXT_GREY,
  },
  customBtnStyle1: {
    flexDirection: "row",
    marginTop: 22,
    backgroundColor: Theme.APP_WHITE_COLOR,
    width: widthPercentageToDP(28),
    height: 55,
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
    paddingHorizontal: 10,
  },
  btnTxt1: {
    flex: 1,
    color: Theme.APP_BLACK_COLOR,
    fontFamily: fonts.Questrail,
    fontSize: heightPercentageToDP(1.9),
    textAlign: "center",
  },

  customBtnStyle2: {
    flexDirection: "row",
    marginTop: 22,
    backgroundColor: Theme.APP_FB_BLUE,
    width:
      Platform.OS == "android"
        ? widthPercentageToDP(42)
        : widthPercentageToDP(28),
    height: 55,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-between",
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
  customBtnStyle3: {
    flexDirection: "row",
    marginTop: 22,
    backgroundColor: Theme.APP_WHITE_COLOR,
    width:
      Platform.OS == "android"
        ? widthPercentageToDP(42)
        : widthPercentageToDP(28),
    height: 55,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-between",
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
  btnTxt2: {
    flex: 1,
    color: Theme.APP_WHITE_COLOR,
    fontFamily: fonts.Questrail,
    fontSize: heightPercentageToDP(1.9),
    textAlign: "center",
    left: 5,
  },
  leftLogoStyle1: { width: 22, height: 20 },
  leftLogoStyle2: { width: 15, height: 37 },
  leftLogoStyle3: { width: 25, height: 30, bottom: 2 },
  textInput1: {
    marginTop: 32,
    height: 52,
    width: widthPercentageToDP(90),
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: Theme.APP_BORDER_GREY,
    backgroundColor: Theme.APP_WHITE_COLOR,
  },
  txtbxstyle1: {
    flex: 1,
    fontFamily: fonts.RobotoRegular,
    fontSize: 19,
    color: Theme.APP_BLACK_COLOR,
  },
  errtxtstyle1: {
    top: 2,
    left: widthPercentageToDP(0),
    color: Theme.APP_RED_COLOR,
    fontSize: 14,
    alignSelf: "flex-start",
    fontFamily: fonts.RobotoRegular,
  },

  textInput2: {
    marginTop: 20,
    height: 52,
    width: widthPercentageToDP(90),
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 3,
    borderColor: Theme.APP_BORDER_GREY,
    backgroundColor: Theme.APP_WHITE_COLOR,
  },
  txtbxstyle2: {
    height: 50,
    flex: 1,
    fontFamily: fonts.RobotoRegular,
    fontSize: 19,
    color: Theme.APP_BLACK_COLOR,
  },
  errtxtstyle2: {
    top: 2,
    left: widthPercentageToDP(0),
    color: Theme.APP_RED_COLOR,
    fontSize: 14,
    alignSelf: "flex-start",
    fontFamily: fonts.RobotoRegular,
  },
  encryptionIconStyle: { width: 20, height: 20 },
  forgotText: {
    color: Theme.APP_SKY_BLUE,
    fontFamily: fonts.RobotoRegular,
    fontSize: 14,
    alignSelf: "flex-end",
    // right: 20,
  },
  btnCont: {
    position: "relative",
    marginTop: 80,
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
  connect: {
    fontSize: 20,
    fontFamily: fonts.VarelaRoundRegular,
    color: Theme.APP_BLACK_COLOR,
  },
  social: {
    flexDirection: "row",
    width: widthPercentageToDP(90),
    justifyContent: "space-between",
    marginTop: 20,
  },
});
