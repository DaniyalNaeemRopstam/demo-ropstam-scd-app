import {
  Image,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import fonts from "../../utils/fonts";
import Theme from "../../utils/theme";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Help } from "../../components/validations/validations";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { CustomInput } from "../../components/customInput/CustomInput";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import CustomDropDownPicker from "../../components/customDropDown/CustomDropDownPicker";
import CustomButton from "../../components/buttons/CutomButton";
import Loader from "../../components/loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { CustomErrorToast } from "../../helpers/CustomToast";
import { createSupportAsynThunk } from "../../redux/features/ReportSupportSlice";

export default function ContactSupport(props?: any) {
  const [name, setName] = useState(
    props?.route?.params?.userInfo?.userName || ""
  );
  const [email, setEmail] = useState(
    props?.route?.params?.userInfo?.email || ""
  );
  const [message, setMessage] = useState("");
  const [selectedIssue, setSelectedIssue] = useState<any>("");
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [showError, setShowError] = useState(false);
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = useSelector((state: any) => state.login.token);
  const dispatch = useDispatch();

  const [issues] = useState([
    {
      label: "Profile Locked",
      value: "PROFILE_LOCKED",
    },
    {
      label: "Report a bug",
      value: "REPORT_A_BUG",
    },
    {
      label: "In App Purchase",
      value: "IN_APP_PURCHASE",
    },
    {
      label: "Spam Messages",
      value: "SPAM_MESSAGE",
    },
    {
      label: "Matched",
      value: "MATCHED",
    },
    {
      label: "Other",
      value: "OTHER",
    },
  ]);

  const input_2 = useRef<null>(null);
  const input_3 = useRef<null>(null);

  useEffect(() => {
    if (!isCollapsed) {
      setShowError(false);
    }
  }, [isCollapsed]);

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

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(Help),
    defaultValues: {
      name: name,
      email_address: email,
    },
  });

  const onSubmit = () => {
    if (selectedIssue == "") {
      setShowError(true);
    } else {
      setLoading(true);
      const data = {
        email: email,
        issueType: selectedIssue?.value,
        message: message,
        token: token,
      };

      dispatch<any>(createSupportAsynThunk(data))
        .unwrap()
        .then(() => {
          setLoading(false);
          props?.navigation?.navigate("THANKYOUPAGE");
        })
        .catch((err: any) => {
          setLoading(false);
          CustomErrorToast(err);
        });
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles().mainCont}
      bounces={false}
      extraScrollHeight={30}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles(keyboardStatus).keyboardCont}
    >
      <Text style={styles().txt1}>How can we help?</Text>

      <Text style={styles().txt2}>
        Please fill out the contact form below and we will do our best to help.
      </Text>

      <CustomInput
        returnKeyType={"next"}
        value={name}
        editable={false}
        autoCap={false}
        fieldName="name"
        control={control}
        keyboardType="default"
        textBoxContainer={styles().textInput1}
        txtbxstyl={styles().txtbxstyle1}
        plcholder={"Name"}
        plcholdercolor={Theme.APP_TEXT_GREY}
        errTxt={errors?.name && errors?.name?.message}
        errTxtstyle={styles().errtxtstyle1}
        onChangeTexts={(text: string) => {
          setName(text);
        }}
        onSubmitEditing={() => input_2?.current?.focus()}
      />

      <CustomInput
        reference={input_2}
        returnKeyType={"next"}
        value={email}
        editable={props?.route?.params?.userInfo?.email ? false : true}
        autoCap={false}
        fieldName="email_address"
        control={control}
        keyboardType="email-address"
        textBoxContainer={[styles().textInput1, styles().textInput2]}
        txtbxstyl={styles().txtbxstyle1}
        plcholder={"Email"}
        plcholdercolor={Theme.APP_TEXT_GREY}
        errTxt={errors?.email_address && errors?.email_address?.message}
        errTxtstyle={styles().errtxtstyle1}
        onChangeTexts={(text: string) => {
          setEmail(text);
        }}
        onSubmitEditing={() => input_3?.current?.focus()}
      />

      <Pressable
        style={[styles().textInput1, styles().pressable]}
        onPress={() => setIsCollapsed(!isCollapsed)}
      >
        <Text style={styles(selectedIssue).Issuetxt}>
          {selectedIssue ? selectedIssue?.label : "Select Issue"}
        </Text>
        <Image
          source={require("../../assets/issueError.png")}
          style={styles(isCollapsed).arrow}
          resizeMode="contain"
        />
      </Pressable>
      <View style={styles().dropCont}>
        <CustomDropDownPicker
          constactSupport={true}
          isCollapsed={isCollapsed}
          items={issues}
          onValueChange={(value: any) => {
            setIsCollapsed(true);
            setSelectedIssue(value);
          }}
        />
      </View>
      {showError && (
        <Text style={styles().errtxtstyle1}>
          Please Select an Issue to report
        </Text>
      )}

      {isCollapsed && (
        <CustomInput
          allowMultiLine={true}
          reference={input_3}
          returnKeyType={"done"}
          value={message}
          editable={true}
          autoCap={false}
          fieldName="message"
          control={control}
          keyboardType="default"
          textBoxContainer={styles().messageBoxStyle}
          txtbxstyl={styles().messageBox}
          plcholder={"Your Message"}
          plcholdercolor={Theme.APP_TEXT_GREY}
          errTxt={errors?.message && errors?.message?.message}
          errTxtstyle={styles().errtxtstyle1}
          onChangeTexts={(text: string) => {
            setMessage(text);
          }}
        />
      )}
      <CustomButton
        BtnContstyle={styles(isCollapsed).customBtnStyle}
        text="Submit"
        textStyle={styles().btnTxt}
        onPress={handleSubmit(onSubmit)}
      />
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
        props && Platform.OS == "android" ? heightPercentageToDP(45) : 0,
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
      width: widthPercentageToDP(90),
    },
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
      height: 50,
      fontFamily: fonts.RobotoRegular,
      fontSize: 19,
      color: Theme.APP_BLACK_COLOR,
    },
    errtxtstyle1: {
      top: 5,
      color: Theme.APP_RED_COLOR,
      fontSize: 14,
      fontFamily: fonts.RobotoRegular,
      width: widthPercentageToDP(90),
    },
    textInput2: {
      marginTop: 10,
    },
    pressable: {
      marginTop: 10,
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
    messageBoxStyle: {
      marginTop: 25,
      height: heightPercentageToDP(20),
      width: widthPercentageToDP(90),
      paddingHorizontal: 15,
      borderRadius: 10,
      borderWidth: 3,
      borderColor: Theme.APP_BORDER_GREY,
      backgroundColor: Theme.APP_WHITE_COLOR,
    },
    messageBox: {
      paddingTop: 10,
      height: 50,
      flex: 1,
      fontFamily: fonts.RobotoRegular,
      fontSize: 19,
      textAlignVertical: "top",
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
      position: "absolute",
      bottom:
        Platform.OS == "ios"
          ? heightPercentageToDP(7)
          : heightPercentageToDP(5),
      zIndex: props ? 0 : -1,
    },
    btnTxt: {
      color: Theme.APP_WHITE_COLOR,
      fontFamily: fonts.VarelaRoundRegular,
      fontSize: 24,
      textAlign: "center",
    },
  });
