import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Keyboard,
  Platform,
  Alert,
} from "react-native";
import React, { useState } from "react";
import fonts from "../../utils/fonts";
import Theme from "../../utils/theme";
import { CustomInput } from "../../components/customInput/CustomInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ForgotEmail } from "../../components/validations/validations";
import CustomButton from "../../components/buttons/CutomButton";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { useDispatch } from "react-redux";
import {
  forgetPasswordAsyncThunk,
  saveUser,
} from "../../redux/features/AuthSlice";
import { CustomErrorToast } from "../../helpers/CustomToast";
import Loader from "../../components/loader/Loader";

export default function ForgotPssword(props: any) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(ForgotEmail),
  });

  const onSubmit = () => {
    setLoading(true);
    dispatch<any>(forgetPasswordAsyncThunk(email))
      .unwrap()
      .then((response: any) => {
        Alert.alert("OTP", response.data?.otp);
        const data = {
          userID: response.data.userID,
          images: response.data?.images,
          userName: response.data?.userName,
          isPremium: response.data?.isPremium,
        };

        dispatch(saveUser(data));
        props?.navigation?.navigate("ENTEROTP", {
          screen: "FORGOTPASSWORD",
          email: email,
          userID: response.data.userID,
        });
        setLoading(false);
      })
      .catch((err: any) => {
        setLoading(false);
        CustomErrorToast(err);
      });
  };

  return (
    <Pressable style={styles.mainCont} onPress={() => Keyboard.dismiss()}>
      <Text style={styles.txt1}>Forgot Your Password?</Text>
      <Text style={styles.txt2}>
        Enter your e-mail address below to receive a verification code
      </Text>
      <CustomInput
        returnKeyType={"next"}
        value={email}
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
        onChangeTexts={(text: any) => {
          setEmail(text);
        }}
      />

      <View style={styles.btnCont}>
        <CustomButton
          BtnContstyle={styles.customBtnStyle}
          text="Submit"
          textStyle={styles.btnTxt}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
      <Loader isVisible={loading} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
    top: 2,
    left: widthPercentageToDP(5),
    color: Theme.APP_RED_COLOR,
    fontSize: 14,
    alignSelf: "flex-start",
    fontFamily: fonts.RobotoRegular,
    width: widthPercentageToDP(85),
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
