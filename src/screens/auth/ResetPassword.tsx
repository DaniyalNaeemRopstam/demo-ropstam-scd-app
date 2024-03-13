import {
  View,
  Text,
  StyleSheet,
  Platform,
  Pressable,
  Keyboard,
  Alert,
} from "react-native";
import React, { useRef, useState } from "react";
import fonts from "../../utils/fonts";
import Theme from "../../utils/theme";
import { CustomInput } from "../../components/customInput/CustomInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ResetPasword } from "../../components/validations/validations";
import CustomButton from "../../components/buttons/CutomButton";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { useDispatch, useSelector } from "react-redux";
import { createPasswordAsyncThunk } from "../../redux/features/AuthSlice";
import { CustomErrorToast } from "../../helpers/CustomToast";
import Loader from "../../components/loader/Loader";

export default function ResetPassword(props?: any) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const userID = useSelector((state: any) => state?.login?.userID);
  const dispatch = useDispatch();

  const input_2 = useRef();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(ResetPasword),
  });

  const onSubmit = () => {
    setLoading(true);
    const data = {
      userID: userID,
      password: newPassword,
      confirmPassword: confirmPassword,
    };
    dispatch<any>(createPasswordAsyncThunk(data))
      .then(() => {
        setLoading(false);
        Alert.alert("Password update", "successfully", [
          {
            onPress: props.navigation.navigate("LOGINSCREEN"),
          },
        ]);
      })
      .catch((err: any) => {
        setLoading(false);
        CustomErrorToast(err);
      });
  };

  return (
    <Pressable onPress={() => Keyboard.dismiss()} style={styles.mainCont}>
      <Text style={styles.txt1}>Reset Password</Text>
      <Text style={styles.txt2}>Create and confirm your new password</Text>
      <CustomInput
        onSubmitEditing={() => input_2?.current?.focus()}
        returnKeyType={"next"}
        value={newPassword}
        editable={true}
        autoCap={false}
        fieldName="new_password"
        control={control}
        keyboardType="default"
        textBoxContainer={styles.textInput2}
        txtbxstyl={styles.txtbxstyle2}
        plcholder={"New Password"}
        plcholdercolor={Theme.APP_TEXT_GREY}
        errTxt={errors?.new_password && errors?.new_password?.message}
        errTxtstyle={styles.errtxtstyle2}
        onChangeTexts={(text: string) => {
          setConfirmPassword("");
          setNewPassword(text);
        }}
        encryption={true}
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

      <View style={styles.btnCont}>
        <CustomButton
          BtnContstyle={styles.customBtnStyle}
          text="Update"
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
