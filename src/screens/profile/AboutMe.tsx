import { Keyboard, Platform, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import fonts from "../../utils/fonts";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Theme from "../../utils/theme";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { About } from "../../components/validations/validations";
import { CustomInput } from "../../components/customInput/CustomInput";
import ContinueButton from "../../components/buttons/ContinueButton";
import CustomButton from "../../components/buttons/CutomButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { excludeUnUsedkeysFromUserObj } from "../../helpers/Common";
import Loader from "../../components/loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { createProfileAsynThunk } from "../../redux/features/ProfileSlice";
import { CustomErrorToast } from "../../helpers/CustomToast";

export default function AboutMe(props: any) {
  const routeFrom = props?.route?.params?.routeFrom;
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState(
    props?.route?.params?.userInfo?.description || ""
  );
  const token = useSelector((state: any) => state?.login?.token);
  const userData = props?.route?.params;
  const dispatch = useDispatch();

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(About),
  });

  useEffect(() => {
    setValue("about_me", description);
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

  const onSubmit = () => {
    const updatedUserData = {
      ...userData,
      description: description,
    };

    props?.navigation?.navigate("MATCHINGPREFERENCE", updatedUserData); // reset and redirct to home page so the user cannot go back
  };

  const onUpdate = () => {
    setLoading(true);
    const updatedUserData = {
      ...excludeUnUsedkeysFromUserObj(props?.route?.params?.userInfo),
      description: description,
      token: token,
    };

    setLoading(false);
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
      style={styles().mainStyle}
      bounces={false}
      extraScrollHeight={30}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles(keyboardStatus).keyboardCont}
    >
      <Text style={styles().txt1}>Describe Yourself</Text>
      <Text style={styles().txt2}>
        Let other members know a little bit more{"\n"}about you and what you’re
        looking for
      </Text>

      <CustomInput
        allowMultiLine={true}
        returnKeyType={"next"}
        value={description}
        editable={true}
        autoCap={false}
        maxLength={150}
        fieldName="about_me"
        control={control}
        keyboardType="default"
        textBoxContainer={styles().textInput1}
        txtbxstyl={styles().txtbxstyle1}
        plcholder={`Call me Ishmael...`}
        plcholdercolor={Theme.APP_TEXT_GREY}
        errTxt={errors?.about_me && errors?.about_me?.message}
        errTxtstyle={styles().errtxtstyle1}
        onChangeTexts={(text: string) => {
          setDescription(text);
        }}
      />

      <Text style={styles().txt3}>(150 word limit)</Text>
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
    mainStyle: { flex: 1 },
    keyboardCont: {
      alignItems: "center",
      flexGrow: 1,
      paddingBottom:
        props && Platform.OS == "android" ? heightPercentageToDP(45) : 0,
    },
    txt1: {
      fontFamily: fonts.VarelaRoundRegular,
      fontSize: 20,
      marginTop: 17,
      color: Theme.APP_BLACK_COLOR,
    },
    txt2: {
      width: widthPercentageToDP(80),
      fontFamily: fonts.RobotoRegular,
      fontSize: 14,
      marginTop: 10,
      color: Theme.APP_TEXT_GREY,
      textAlign: "center",
    },
    txt3: {
      width: widthPercentageToDP(80),
      fontFamily: fonts.RobotoRegular,
      fontSize: 14,
      color: Theme.APP_TEXT_GREY,
      textAlign: "center",
    },
    textInput1: {
      marginTop: 32,
      height: heightPercentageToDP(40),
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
      textAlignVertical: "top",
      color: Theme.APP_BLACK_COLOR,
    },
    errtxtstyle1: {
      top: 2,
      left: widthPercentageToDP(5),
      color: Theme.APP_RED_COLOR,
      fontSize: 14,
      alignSelf: "flex-start",
      fontFamily: fonts.RobotoRegular,
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
