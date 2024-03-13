import {
  Text,
  StyleSheet,
  Pressable,
  Keyboard,
  StatusBar,
  Alert,
} from "react-native";
import React, { useState } from "react";
import fonts from "../../utils/fonts";
import Theme from "../../utils/theme";
import { CustomInput } from "../../components/customInput/CustomInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { EmailAddress } from "../../components/validations/validations";
import { useDispatch, useSelector } from "react-redux";
import { widthPercentageToDP } from "react-native-responsive-screen";
import ContinueButton from "../../components/buttons/ContinueButton";
import { saveUser, signUpEmailAyncThunk } from "../../redux/features/AuthSlice";
import { CustomErrorToast, CustomInfoToast } from "../../helpers/CustomToast";
import Loader from "../../components/loader/Loader";

export default function Email(props: any) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { mobileToken } = useSelector((state: any) => state?.login);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(EmailAddress),
  });

  const onSubmit = () => {
    setLoading(true);
    const data = {
      email,
      mobileToken,
    };
    dispatch<any>(signUpEmailAyncThunk(data))
      .unwrap()
      .then((response: any) => {
        if (response.data.isVerified) {
          CustomInfoToast(response.message);
        } else {
          Alert.alert("OTP", response.data.otp);
          const data = {
            email: email,
            userID: response.data?.userID,
            images: response.data?.images,
            userName: response.data?.userName,
          };
          dispatch(saveUser(data));
          props.navigation.navigate("ENTEROTP", {
            emailData: {
              email,
              mobileToken,
              userID: response.data?.userID,
            },
          });
        }
        setLoading(false);
      })
      .catch((err: any) => {
        setLoading(false);
        CustomErrorToast(err);
      });
  };

  return (
    <Pressable style={styles.mainCont} onPress={() => Keyboard.dismiss()}>
      <StatusBar
        backgroundColor={Theme.APP_WHITE_COLOR}
        barStyle={"dark-content"}
      />
      <Text style={styles.txt1}>Enter Your E-mail</Text>
      <Text style={styles.txt2}>
        {"Your e-mail address will be used\nto recover your account"}
      </Text>
      <CustomInput
        returnKeyType={"done"}
        value={email}
        editable={true}
        autoCap={false}
        fieldName="email_address"
        control={control}
        keyboardType="email-address"
        textBoxContainer={styles.textInput1}
        txtbxstyl={styles.txtbxstyle1}
        plcholder={"E-mail address"}
        plcholdercolor={Theme.APP_TEXT_GREY}
        errTxt={errors?.email_address && errors?.email_address?.message}
        errTxtstyle={styles.errtxtstyle1}
        onChangeTexts={(text: string) => {
          setEmail(text);
        }}
      />

      <ContinueButton onPress={handleSubmit(onSubmit)} />
      <Loader isVisible={loading} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  mainCont: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: widthPercentageToDP(5),
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
    flex: 1,
    fontFamily: fonts.RobotoRegular,
    fontSize: 19,
    color: Theme.APP_BLACK_COLOR,
  },
  errtxtstyle1: {
    top: 5,
    color: Theme.APP_RED_COLOR,
    fontSize: 14,
    alignSelf: "flex-start",
    fontFamily: fonts.RobotoRegular,
    width: widthPercentageToDP(85),
  },
});
