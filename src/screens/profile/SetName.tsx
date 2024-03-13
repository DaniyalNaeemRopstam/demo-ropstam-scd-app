import { Platform, StyleSheet, Text, View } from "react-native";
import React, { useRef, useState, useEffect } from "react";
import fonts from "../../utils/fonts";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Theme from "../../utils/theme";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ContinueButton from "../../components/buttons/ContinueButton";
import { Name } from "../../components/validations/validations";
import { CustomInput } from "../../components/customInput/CustomInput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CustomButton from "../../components/buttons/CutomButton";
import { useDispatch, useSelector } from "react-redux";
import { CustomErrorToast } from "../../helpers/CustomToast";
import {
  checkUserNameAsyncThunk,
  createProfileAsynThunk,
} from "../../redux/features/ProfileSlice";
import Loader from "../../components/loader/Loader";
import { excludeUnUsedkeysFromUserObj } from "../../helpers/Common";

export default function SetName(props: any) {
  const routeFrom = props?.route?.params?.routeFrom;
  const userData = props?.route?.params;
  const token = useSelector((state: any) => state?.login?.token);
  const [loading, setLoading] = useState(false);
  const [userExist, setUserExist] = useState(false);
  const [firstName, setFirstName] = useState(
    props?.route?.params?.userInfo?.firstName || ""
  );
  const [lastName, setLastName] = useState(
    props?.route?.params?.userInfo?.lastName || ""
  );
  const [userName, setUserName] = useState(
    props?.route?.params?.userInfo?.userName || ""
  );
  const dispatch = useDispatch();
  const input_2 = useRef<any>(null);
  const input_3 = useRef<any>(null);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(Name),
  });

  useEffect(() => {
    setValue("first_name", firstName);
    setValue("last_name", lastName);
    setValue("user_name", userName);
  }, []);

  const onSubmit = () => {
    setLoading(true);
    const data = {
      userName: userName,
      token: token,
    };
    dispatch<any>(checkUserNameAsyncThunk(data))
      .unwrap()
      .then((response: any) => {
        if (!response.data?.isExist) {
          setLoading(false);
          const updatedUserData = {
            ...userData,
            firstName: firstName,
            lastName: lastName,
            userName: userName,
          };
          props?.navigation?.navigate("PROFILEPIC", updatedUserData); // reset and redirct to home page so the user cannot go back
        } else {
          setUserExist(true);
          setLoading(false);
        }
      })
      .catch((err: any) => {
        setLoading(false);
        CustomErrorToast(err);
      });
  };

  const onUpdate = () => {
    setLoading(true);
    if (userName == props?.route?.params?.userInfo?.userName) {
      const updatedUserData = {
        ...excludeUnUsedkeysFromUserObj(props?.route?.params?.userInfo),
        firstName: firstName,
        lastName: lastName,
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
    } else {
      const data = {
        userName: userName,
        token: token,
      };
      dispatch<any>(checkUserNameAsyncThunk(data))
        .unwrap()
        .then((response: any) => {
          if (!response.data?.isExist) {
            const updatedUserData = {
              ...excludeUnUsedkeysFromUserObj(props?.route?.params?.userInfo),
              firstName: firstName,
              lastName: lastName,
              userName: userName,
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
          } else {
            setUserExist(true);
            setLoading(false);
          }
        })
        .catch((err: any) => {
          setLoading(false);
          CustomErrorToast(err);
        });
    }
  };

  return (
    <View style={styles().outerCont}>
      <KeyboardAwareScrollView
        style={styles().mainCont}
        contentContainerStyle={styles().keyboardInnerCont}
      >
        <Text style={styles().txt1}>What is your name?</Text>

        <CustomInput
          maxLength={15}
          returnKeyType={"next"}
          value={firstName}
          editable={props?.route?.params?.userInfo?.firstName ? false : true}
          autoCap={true}
          fieldName="first_name"
          control={control}
          keyboardType="default"
          textBoxContainer={styles().textInput1}
          txtbxstyl={
            styles(props?.route?.params?.userInfo?.firstName).txtbxstyle1
          }
          plcholder={"First Name"}
          plcholdercolor={Theme.APP_TEXT_GREY}
          onSubmitEditing={() => input_2?.current?.focus()}
          errTxt={errors?.first_name && errors?.first_name?.message}
          errTxtstyle={styles().errtxtstyle1}
          onChangeTexts={(text: string) => {
            setFirstName(text);
          }}
        />

        <CustomInput
          maxLength={15}
          reference={input_2}
          returnKeyType={"next"}
          value={lastName}
          editable={props?.route?.params?.userInfo?.firstName ? false : true}
          autoCap={true}
          fieldName="last_name"
          control={control}
          keyboardType="default"
          textBoxContainer={styles().textInput2}
          txtbxstyl={
            styles(props?.route?.params?.userInfo?.firstName).txtbxstyle1
          }
          plcholder={"Last Name"}
          plcholdercolor={Theme.APP_TEXT_GREY}
          onSubmitEditing={() => input_3?.current?.focus()}
          errTxt={errors?.last_name && errors?.last_name?.message}
          errTxtstyle={styles().errtxtstyle1}
          onChangeTexts={(text: string) => {
            setLastName(text);
          }}
        />

        <Text style={styles().txt2}>
          Only your username will be visible{"\n"}to other members
        </Text>

        <Text style={styles().txt3}>Choose your username</Text>

        <CustomInput
          maxLength={15}
          reference={input_3}
          returnKeyType={"done"}
          value={userName}
          editable={true}
          autoCap={false}
          fieldName="user_name"
          control={control}
          keyboardType="default"
          textBoxContainer={styles().textInput1}
          txtbxstyl={styles().txtbxstyle1}
          plcholder={"Username"}
          plcholdercolor={Theme.APP_TEXT_GREY}
          errTxt={errors?.user_name && errors?.user_name?.message}
          errTxtstyle={styles().errtxtstyle1}
          onChangeTexts={(text: string) => {
            setUserExist(false);
            setUserName(text);
          }}
        />
        {userExist && (
          <Text style={styles().errtxtstyle2}>User name already exist</Text>
        )}

        <Text style={styles().txt2}>
          Maximum of 15 letters
          {"\n"}
          (No spaces or special characters)
        </Text>
      </KeyboardAwareScrollView>
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
    </View>
  );
}

const styles = (props?: any) =>
  StyleSheet.create({
    outerCont: { flex: 1, alignItems: "center" },
    mainCont: { flex: 1 },
    keyboardInnerCont: { alignItems: "center" },
    txt1: {
      fontFamily: fonts.VarelaRoundRegular,
      fontSize: 20,
      marginTop: 17,
      color: Theme.APP_BLACK_COLOR,
    },
    textInput1: {
      marginTop: 18,
      height: 52,
      width: widthPercentageToDP(90),
      paddingHorizontal: 15,
      borderRadius: 10,
      borderWidth: 3,
      borderColor: Theme.APP_BORDER_GREY,
      backgroundColor: Theme.APP_WHITE_COLOR,
    },
    textInput2: {
      marginTop: 5,
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
      color: props ? Theme.APP_TEXT_GREY : Theme.APP_BLACK_COLOR,
    },
    errtxtstyle1: {
      width: widthPercentageToDP(90),
      color: Theme.APP_RED_COLOR,
      fontSize: 14,
      alignSelf: "flex-start",
      fontFamily: fonts.RobotoRegular,
    },
    errtxtstyle2: {
      top: -10,
      width: widthPercentageToDP(90),
      color: Theme.APP_RED_COLOR,
      fontSize: 14,
      alignSelf: "flex-start",
      fontFamily: fonts.RobotoRegular,
    },
    txt2: {
      fontFamily: fonts.RobotoRegular,
      fontSize: 14,
      color: Theme.APP_TEXT_GREY,
      textAlign: "center",
    },
    txt3: {
      fontFamily: fonts.VarelaRoundRegular,
      fontSize: 20,
      marginTop: 33,
      color: Theme.APP_BLACK_COLOR,
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
