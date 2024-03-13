import { Image, Platform, ScrollView, StyleSheet, Text } from "react-native";
import React, { useState } from "react";
import Theme from "../../utils/theme";
import CustomButton from "../../components/buttons/CutomButton";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import fonts from "../../utils/fonts";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { WEBCLIENTID } from "../../utils/constants";
import { useDispatch } from "react-redux";
import {
  appleLoginAsynThunk,
  // facebookLoginAsynThunk,
  gmailLoginAsynThunk,
} from "../../redux/features/ProfileSlice";
import {
  saveUser,
  setIsSound,
  setPremium,
} from "../../redux/features/AuthSlice";
import { setToken } from "../../helpers/AuthToken";
import { CustomErrorToast } from "../../helpers/CustomToast";
// import { LoginManager, Profile } from "react-native-fbsdk-next";
import appleAuth from "@invertase/react-native-apple-authentication";
import Loader from "../../components/loader/Loader";

export default function SignUp(props: any) {
  GoogleSignin.configure({
    webClientId: WEBCLIENTID,
    offlineAccess: true,
    scopes: ["email"],
  });

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

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

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.mainContStyle}
      contentContainerStyle={styles.mainCont}
      bounces={false}
    >
      <Image
        source={require("../../assets/Logo.png")}
        style={styles.logoStyle}
      />

      <Text style={styles.climbTxt}>
        {"Climb aboard the world’s\n#1 Sea Captain Dating app!"}
      </Text>

      <Text style={styles.connect}>Connect with...</Text>

      <CustomButton
        BtnContstyle={styles.customBtnStyle1}
        text="Google"
        textStyle={styles.btnTxt1}
        onPress={onSubmitGooglesignIn}
        leftImage={true}
        leftImageSrc={require("../../assets/GoogleLogo.png")}
        leftImgStyle={styles.leftLogoStyle1}
      />

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
      <Text style={styles.connect}>Or continue with...</Text>

      <CustomButton
        BtnContstyle={styles.customBtnStyle4}
        text="E-mail"
        textStyle={styles.btnTxt4}
        onPress={() => props?.navigation?.navigate("ENTEREMAIL")}
        leftImage={true}
        leftImageSrc={require("../../assets/emailIcon.png")}
        leftImgStyle={styles.leftLogoStyle4}
      />

      <CustomButton
        BtnContstyle={styles.customBtnStyle4}
        text="Mobile"
        textStyle={styles.btnTxt4}
        onPress={() => props?.navigation?.navigate("ENTERPHONE")}
        leftImage={true}
        leftImageSrc={require("../../assets/phoneIcon.png")}
        leftImgStyle={styles.leftLogoStyle5}
      />

      <Text style={styles.txt2}>
        Already have an account?
        <Text
          style={styles.forgotText}
          onPress={() => props.navigation.navigate("LOGINSCREEN")}
        >
          {" "}
          Log in
        </Text>
      </Text>
      <Loader isVisible={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContStyle: {
    flex: 1,
  },
  mainCont: {
    alignItems: "center",
    flexGrow: 1,
    paddingTop: Platform.OS == "ios" ? 50 : 10,
    paddingBottom: 30,
  },
  logoStyle: {
    // height:
    //   Platform.OS == "ios"
    //     ? heightPercentageToDP(12)
    //     : heightPercentageToDP(13),
    // width: widthPercentageToDP(89),
    height: widthPercentageToDP(25),
    width: widthPercentageToDP(90),
  },
  climbTxt: {
    marginTop: heightPercentageToDP(5),
    fontSize: 24,
    fontFamily: fonts.Questrail,
    textAlign: "center",
    color: Theme.APP_BLACK_COLOR,
  },
  connect: {
    marginTop: 30,
    fontSize: 20,
    fontFamily: fonts.VarelaRoundRegular,
    color: Theme.APP_BLACK_COLOR,
  },
  btnCont: { position: "absolute", bottom: 50, alignItems: "center" },
  customBtnStyle1: {
    flexDirection: "row",
    marginTop: 22,
    backgroundColor: Theme.APP_WHITE_COLOR,
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
    paddingHorizontal: 20,
  },
  btnTxt1: {
    flex: 1,
    color: Theme.APP_BLACK_COLOR,
    fontFamily: fonts.Questrail,
    fontSize: 24,
    textAlign: "center",
    left: -10,
  },
  leftLogoStyle1: { width: 42, height: 43 },
  customBtnStyle2: {
    flexDirection: "row",
    marginTop: 22,
    backgroundColor: Theme.APP_FB_BLUE,
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
    paddingHorizontal: 30,
  },
  btnTxt2: {
    flex: 1,
    color: Theme.APP_WHITE_COLOR,
    fontFamily: fonts.Questrail,
    fontSize: 24,
    textAlign: "center",
  },
  leftLogoStyle2: { width: 20, height: 37 },
  leftLogoStyle3: { width: 33, height: 41 },

  customBtnStyle4: {
    flexDirection: "row",
    marginTop: 22,
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
    paddingHorizontal: 20,
  },
  leftLogoStyle4: { width: 42, height: 31 },
  btnTxt4: {
    flex: 1,
    color: Theme.APP_WHITE_COLOR,
    fontFamily: fonts.Questrail,
    fontSize: 24,
    textAlign: "center",
    left: -10,
  },
  leftLogoStyle5: { width: 42, height: 33 },
  txt2: {
    fontFamily: fonts.RobotoRegular,
    fontSize: 16,
    marginTop: 16,
    color: Theme.APP_TEXT_GREY,
  },
  forgotText: {
    color: Theme.APP_SKY_BLUE,
    fontFamily: fonts.RobotoRegular,
    fontSize: 16,
  },
});
