import { Text, StyleSheet, Pressable, Keyboard } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import fonts from "../../utils/fonts";
import Theme from "../../utils/theme";
import { CustomInput } from "../../components/customInput/CustomInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ResetPasword } from "../../components/validations/validations";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { useDispatch, useSelector } from "react-redux";
import ContinueButton from "../../components/buttons/ContinueButton";
import {
  createPasswordAsyncThunk,
  saveUser,
  setPremium,
  setThemeMode,
  setViewMessageLog,
} from "../../redux/features/AuthSlice";
import Loader from "../../components/loader/Loader";
import { CustomErrorToast } from "../../helpers/CustomToast";
import { setToken } from "../../helpers/AuthToken";

export default function SetPassword() {
  const input_2 = useRef();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [password, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const userID = useSelector((state: any) => state?.login?.userID);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(ResetPasword),
  });

  useEffect(() => {
    setValue("new_password", password);
    setValue("confirm_password", confirmPassword);
  }, []);

  const onSubmit = () => {
    setLoading(true);
    const data = {
      userID: userID,
      password: password,
      confirmPassword: confirmPassword,
    };
    dispatch<any>(createPasswordAsyncThunk(data))
      .unwrap()
      .then((response: any) => {
        const data = {
          token: response.token,
          userID: response.data?._id,
          isLoggedIn: true,
          images: response.data?.images,
          isProfileComplete: response.data?.isProfileComplete,
        };
        dispatch(saveUser(data));
        dispatch(setPremium(response.data?.isPremium));
        dispatch(setViewMessageLog(response.data?.isViewMessageLog));
        dispatch(setThemeMode(response.data?.themeMode));
        setToken(response.token);
        setLoading(false);
      })
      .catch((err: any) => {
        setLoading(false);
        CustomErrorToast(err);
      });
  };

  return (
    <Pressable style={styles.mainCont} onPress={() => Keyboard.dismiss()}>
      <Text style={styles.txt1}>Set Password</Text>
      <Text style={styles.txt2}>Create a password to protect your account</Text>
      <CustomInput
        onSubmitEditing={() => input_2?.current?.focus()}
        returnKeyType={"next"}
        value={password}
        editable={true}
        autoCap={false}
        encryption={true}
        fieldName="new_password"
        control={control}
        keyboardType="default"
        textBoxContainer={styles.textInput2}
        txtbxstyl={styles.txtbxstyle2}
        plcholder={"Password"}
        plcholdercolor={Theme.APP_TEXT_GREY}
        errTxt={errors?.new_password && errors?.new_password?.message}
        errTxtstyle={styles.errtxtstyle2}
        onChangeTexts={(text: string) => {
          setConfirmPassword("");
          setNewPassword(text);
        }}
        encryptionIconStyle={styles.encryptionIconStyle}
      />
      <CustomInput
        reference={input_2}
        returnKeyType={"done"}
        value={confirmPassword}
        editable={true}
        autoCap={false}
        fieldName="confirm_password"
        control={control}
        keyboardType="default"
        textBoxContainer={styles.textInput2}
        txtbxstyl={styles.txtbxstyle2}
        plcholder={"Confirm Password"}
        plcholdercolor={Theme.APP_TEXT_GREY}
        errTxt={errors?.confirm_password && errors?.confirm_password?.message}
        errTxtstyle={styles.errtxtstyle2}
        onChangeTexts={(text: string) => {
          setConfirmPassword(text);
        }}
        encryption={true}
        encryptionIconStyle={styles.encryptionIconStyle}
      />

      <ContinueButton onPress={handleSubmit(onSubmit)} />
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
    fontFamily: fonts.RobotoRegular,
    fontSize: 14,
    marginTop: 10,
    color: Theme.APP_TEXT_GREY,
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
    width: widthPercentageToDP(90),
    left: widthPercentageToDP(5),
    color: Theme.APP_RED_COLOR,
    fontSize: 14,
    alignSelf: "flex-start",
    fontFamily: fonts.RobotoRegular,
  },
  encryptionIconStyle: { width: 20, height: 20 },
  forgotText: {
    marginTop: 5,
    color: Theme.APP_SKY_BLUE,
    fontFamily: fonts.RobotoRegular,
    fontSize: 14,
    alignSelf: "flex-end",
    right: 20,
  },
});
