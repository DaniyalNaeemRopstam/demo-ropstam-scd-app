import {
  Alert,
  Dimensions,
  Image,
  Keyboard,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import fonts from "../../utils/fonts";
import Theme from "../../utils/theme";
import ContinueButton from "../../components/buttons/ContinueButton";
import { CountryPickerMod } from "../../components/countryPicker/CountryPicker";
import { CustomInput } from "../../components/customInput/CustomInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { PhoneNumber } from "../../components/validations/validations";
import { countriesArr } from "../../components/countryPicker/Countries";
import {
  saveUser,
  signUpNumberAyncThunk,
} from "../../redux/features/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { CustomErrorToast, CustomInfoToast } from "../../helpers/CustomToast";
import Loader from "../../components/loader/Loader";

const screenHeight = Dimensions.get("screen").height;

export default function Phone(props: any) {
  const dispatch = useDispatch();
  const [number, setNumber] = useState("");
  const [valid, setValid] = useState(true);
  const [loading, setLoading] = useState(false);

  const [selectedFlag, setSelectedFlag] = useState(countriesArr[29].flag);
  const [selectedPhoneCode, setSelectedPhoneCode] = useState(
    "+" + countriesArr[29].phoneCode
  );
  const [showPicker, setShowPicker] = useState(false);
  const { mobileToken } = useSelector((state: any) => state?.login);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(PhoneNumber),
  });

  const onSubmit = () => {
    setLoading(true);
    const phoneNumber = selectedPhoneCode + number;
    const data = {
      phoneNumber,
      mobileToken,
    };
    dispatch<any>(signUpNumberAyncThunk(data))
      .unwrap()
      .then((response: any) => {
        if (response.data.isVerified) {
          CustomInfoToast(response.message);
        } else {
          Alert.alert("OTP", response.data.otp);
          const data = {
            phone: phoneNumber,
            userID: response.data?.userID,
            userName: response.data?.userName,
          };
          dispatch(saveUser(data));
          props.navigation.navigate("ENTEROTP", {
            phoneData: {
              phoneNumber,
              mobileToken,
              userID: response.data?.userID,
            },
          });
        }
        setLoading(false);
      })
      .catch((err: any) => {
        setLoading(false);
        CustomErrorToast(err?.desc);
      });
  };
  return (
    <Pressable style={styles.mainCont} onPress={() => Keyboard.dismiss()}>
      <StatusBar
        backgroundColor={Theme.APP_WHITE_COLOR}
        barStyle={"dark-content"}
      />
      <Text style={styles.txt1}>Verify Your Phone Number</Text>
      <Text style={styles.txt2}>
        {"A valid phone number is required\nto verify your account"}
      </Text>

      <View style={styles.textInput}>
        <Pressable onPress={() => setShowPicker(true)} style={styles.flagCont}>
          <Text style={styles.flagSize}>{selectedFlag}</Text>
          <Image
            source={require("../../assets/BackArrow.png")}
            style={styles.dropDownImg}
            resizeMode="contain"
          />
        </Pressable>

        <View style={styles.divider} />

        <Text style={styles.code}>{selectedPhoneCode}</Text>

        <CustomInput
          returnKeyType={"done"}
          value={number}
          editable={true}
          autoCap={false}
          fieldName="phone_number"
          control={control}
          keyboardType="numeric"
          textBoxContainer={{
            width: widthPercentageToDP(60),
          }}
          txtbxstyl={styles.txtbxstyle}
          plcholder={"(555) 555-555"}
          plcholdercolor={Theme.APP_TEXT_GREY}
          errTxt={errors?.phone_number && errors?.phone_number?.message}
          errTxtstyle={styles.errtxtstyle}
          onChangeTexts={(text: string) => {
            setValid(true);
            setNumber(text);
          }}
          maxLength={15}
        />
      </View>
      {!valid && (
        <Text style={styles.errTxt}>Please enter a valid phone number</Text>
      )}

      <ContinueButton onPress={handleSubmit(onSubmit)} />

      <CountryPickerMod
        visible={showPicker}
        setVisible={() => setShowPicker(false)}
        setFlag={(e) => setSelectedFlag(e)}
        setPhoneCode={(e) => setSelectedPhoneCode(e)}
      />
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
    textAlign: "center",
  },
  dropDownImg: {
    transform: [{ rotate: "270deg" }],
    width: 5,
    height: 10,
    marginLeft: 5,
    tintColor: Theme.APP_TEXT_GREY,
  },
  errTxt: {
    top: 2,
    left: widthPercentageToDP(5),
    color: Theme.APP_RED_COLOR,
    fontSize: 14,
    alignSelf: "flex-start",
    fontFamily: fonts.RobotoRegular,
  },
  textInput: {
    marginTop: 20,
    height: 52,
    width: widthPercentageToDP(90),
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 3,
    borderColor: Theme.APP_BORDER_GREY,
    backgroundColor: Theme.APP_WHITE_COLOR,
  },
  txtbxstyle: {
    height: 52,
    fontFamily: fonts.RobotoRegular,
    fontSize: 19,
    color: Theme.APP_BLACK_COLOR,
    marginLeft: 5,
  },
  errtxtstyle: {
    top:
      Platform.OS == "android"
        ? heightPercentageToDP(7)
        : screenHeight < 750
        ? heightPercentageToDP(7.5)
        : heightPercentageToDP(6),
    position: "absolute",
    color: Theme.APP_RED_COLOR,
    fontSize: 14,
    alignSelf: "flex-start",
    fontFamily: fonts.RobotoRegular,
  },
  divider: {
    height: heightPercentageToDP(4),
    borderWidth: 1,
    marginLeft: 5,
    marginRight: 10,
    borderColor: Theme.APP_BORDER_GREY,
  },
  flagCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: heightPercentageToDP(4),
    width: widthPercentageToDP(15),
  },
  code: {
    fontFamily: fonts.RobotoRegular,
    fontSize: 19,
    color: Theme.APP_BLACK_COLOR,
  },
  flagSize: {
    fontSize: 25,
    color: Theme.APP_BLACK_COLOR,
    bottom: Platform.OS == "android" ? 3 : 0,
  },
});
