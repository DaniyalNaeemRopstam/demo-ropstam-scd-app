import { Keyboard, Platform, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import fonts from "../../utils/fonts";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Theme from "../../utils/theme";
import ContinueButton from "../../components/buttons/ContinueButton";
import { CustomInput } from "../../components/customInput/CustomInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IceBreakerValid } from "../../components/validations/validations";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import SkipButton from "../../components/buttons/SkipButton";
import { CustomErrorToast } from "../../helpers/CustomToast";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/loader/Loader";
import { createProfileAsynThunk } from "../../redux/features/ProfileSlice";
import { excludeUnUsedkeysFromUserObj } from "../../helpers/Common";
import CustomButton from "../../components/buttons/CutomButton";

export default function IceBreaker(props: any) {
  const [favBody, setFavBody] = useState("");
  const [boatName, setBoatName] = useState("");
  const [goSailing, setGoSailing] = useState("");
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const { token } = useSelector((state: any) => state?.login);
  const routeFrom = props?.route?.params?.routeFrom;

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const userData = props?.route?.params;

  const input_2 = useRef<null>(null);
  const input_3 = useRef<null>(null);

  useLayoutEffect(() => {
    if (routeFrom != "MYPROFILE") {
      props?.navigation?.setOptions({
        headerRight: () => <SkipButton onPress={onSubmit} />,
      });
    }
  }, []);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    setValue("fav_body", favBody);
    setValue("boat_name", boatName);
    setValue("go_sailing", goSailing);
    if (props?.route?.params?.userInfo) {
      setFavBody(props?.route?.params?.userInfo?.iceBreakers[0]?.answer);
      setBoatName(props?.route?.params?.userInfo?.iceBreakers[1]?.answer);
      setGoSailing(props?.route?.params?.userInfo?.iceBreakers[2]?.answer);
    }
  }, []);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(IceBreakerValid),
  });

  const onSubmit = () => {
    // setLoading(true);
    const updateUserData = {
      ...userData,
      iceBreakers: [
        {
          question: "My favorite body of water is...",
          answer: favBody,
        },
        {
          question: "My boat's name is...",
          answer: boatName,
        },
        {
          question: "I go sailing...",
          answer: goSailing,
        },
      ],
      token: token,
    };

    dispatch<any>(createProfileAsynThunk(updateUserData))
      .unwrap()
      .then(() => {
        setLoading(false);
        props?.navigation?.navigate("ONBOARDING", updateUserData);
      })
      .catch((err: any) => {
        setLoading(false);
        CustomErrorToast(err);
      });
  };

  const onUpdate = () => {
    setLoading(true);
    const updatedUserData = {
      ...excludeUnUsedkeysFromUserObj(props?.route?.params?.userInfo),
      iceBreakers: [
        {
          question: "My favorite body of water is...",
          answer: favBody,
        },
        {
          question: "My boat's name is...",
          answer: boatName,
        },
        {
          question: "I go selling...",
          answer: goSailing,
        },
      ],
      token: token,
    };

    dispatch<any>(createProfileAsynThunk(updatedUserData))
      .unwrap()
      .then(() => {
        setLoading(false);
        props?.navigation?.goBack();
      })
      .catch((err: any) => {
        setLoading(false);
        CustomErrorToast(err);
      });
  };

  return (
    <KeyboardAwareScrollView
      style={styles().mainCont}
      extraScrollHeight={30}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles(keyboardStatus).keyboardCont}
    >
      {routeFrom != "MYPROFILE" && (
        <Text style={styles().txt1}>Almost finished...</Text>
      )}

      <Text style={styles().txt2}>
        Let other members quickly get to know you {"\n"} by answering some
        simple questions
      </Text>

      <Text style={styles().txt3}>My favorite body of water is...</Text>
      <CustomInput
        onSubmitEditing={() => input_2?.current?.focus()}
        returnKeyType={"next"}
        value={favBody}
        editable={true}
        autoCap={false}
        fieldName="fav_body"
        control={control}
        keyboardType="default"
        textBoxContainer={styles().textInput1}
        txtbxstyl={styles().txtbxstyle1}
        plcholdercolor={Theme.APP_TEXT_GREY}
        errTxt={errors?.fav_body && errors?.fav_body?.message}
        errTxtstyle={styles().errtxtstyle1}
        onChangeTexts={(text: string) => {
          setFavBody(text);
        }}
      />

      <Text style={styles().txt4}>My boat’s name is...</Text>

      <CustomInput
        onSubmitEditing={() => input_3?.current?.focus()}
        reference={input_2}
        returnKeyType={"next"}
        value={boatName}
        editable={true}
        autoCap={false}
        fieldName="boat_name"
        control={control}
        keyboardType="default"
        textBoxContainer={styles().textInput1}
        txtbxstyl={styles().txtbxstyle1}
        plcholdercolor={Theme.APP_TEXT_GREY}
        errTxt={errors?.boat_name && errors?.boat_name?.message}
        errTxtstyle={styles().errtxtstyle1}
        onChangeTexts={(text: string) => {
          setBoatName(text);
        }}
      />

      <Text style={styles().txt4}>I go sailing...</Text>
      <CustomInput
        reference={input_3}
        returnKeyType={"done"}
        value={goSailing}
        editable={true}
        autoCap={false}
        fieldName="go_sailing"
        control={control}
        keyboardType="default"
        textBoxContainer={styles().textInput1}
        txtbxstyl={styles().txtbxstyle1}
        plcholdercolor={Theme.APP_TEXT_GREY}
        errTxt={errors?.go_sailing && errors?.go_sailing?.message}
        errTxtstyle={styles().errtxtstyle1}
        onChangeTexts={(text: string) => {
          setGoSailing(text);
        }}
      />

      {routeFrom == "MYPROFILE" ? (
        <View style={styles().btnCont}>
          <CustomButton
            BtnContstyle={styles().customBtnStyle}
            text="Update"
            textStyle={styles().btnTxt}
            onPress={handleSubmit(onUpdate)}
          />
        </View>
      ) : (
        <ContinueButton onPress={handleSubmit(onSubmit)} />
      )}
      <Loader isVisible={loading} />
    </KeyboardAwareScrollView>
  );
}

const styles = (props?: any) =>
  StyleSheet.create({
    mainCont: { flex: 1 },
    keyboardCont: {
      alignItems: "center",
      flexGrow: 1,
      paddingBottom:
        props && Platform.OS == "android" ? heightPercentageToDP(50) : 0,
    },
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
      textAlign: "center",
    },
    txt3: {
      marginTop: 34,
      fontFamily: fonts.VarelaRoundRegular,
      fontSize: 17,
      color: Theme.APP_BLACK_COLOR,
    },
    textInput1: {
      marginTop: 13,
      height: 52,
      width: widthPercentageToDP(90),
      paddingHorizontal: 15,
      borderRadius: 10,
      borderWidth: 3,
      borderColor: Theme.APP_BORDER_GREY,
      backgroundColor: Theme.APP_WHITE_COLOR,
    },
    txtbxstyle1: {
      height: 50,
      flex: 1,
      fontFamily: fonts.RobotoRegular,
      fontSize: 19,
      color: Theme.APP_BLACK_COLOR,
    },
    errtxtstyle1: {
      width: widthPercentageToDP(90),
      left: 2,
      color: Theme.APP_RED_COLOR,
      fontSize: 14,
      fontFamily: fonts.RobotoRegular,
    },
    txt4: {
      marginTop: 10,
      fontFamily: fonts.VarelaRoundRegular,
      fontSize: 17,
      color: Theme.APP_BLACK_COLOR,
    },
    optional: {
      marginTop: 2,
      fontSize: 13,
      color: Theme.APP_CARD_GREY_TXT,
      fontFamily: fonts.VarelaRoundRegular,
    },
    pressable: {
      marginTop: 30,
      flexDirection: "row",
      paddingHorizontal: 16,
      alignItems: "center",
      justifyContent: "space-between",
    },
    Issuetxt: {
      fontSize: 19,
      color: props ? Theme.APP_BLACK_COLOR : Theme.APP_BORDER_GREY,
      fontFamily: fonts.RobotoRegular,
    },
    arrow: {
      width: 15,
      height: 20,
      transform: [{ rotate: props ? "0deg" : "-90deg" }],
    },
    dropCont: {
      width: widthPercentageToDP(90),
    },
    continueCont: {
      alignItems: "center",
      marginTop: heightPercentageToDP(21),
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
