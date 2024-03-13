import { Alert, Platform, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import fonts from "../../utils/fonts";
import Theme from "../../utils/theme";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import CustomButton from "../../components/buttons/CutomButton";
import Loader from "../../components/loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { deleteAccountAsynThunk } from "../../redux/features/ProfileSlice";
import { CustomErrorToast } from "../../helpers/CustomToast";
import { deleteToken } from "../../redux/features/AuthSlice";

export default function ProfileDeactivate() {
  const [loading, setLoading] = useState(false);
  const token = useSelector((state: any) => state?.login?.token);
  const dispatch = useDispatch();
  const deactivateAccount = () => {
    setLoading(true);
    const data = { status: true, token };
    dispatch<any>(deleteAccountAsynThunk(data))
      .unwrap()
      .then(() => {
        setLoading(false);
        Alert.alert("Account deactivated successfully", "", [
          {
            onPress: () => dispatch(deleteToken()),
          },
        ]);
      })
      .catch((err: any) => {
        setLoading(false);
        CustomErrorToast(err);
      });
  };
  return (
    <View style={styles.mainCont}>
      <Text style={styles.txt1}>
        Are you sure you want to deactivate{"\n"}your account?
      </Text>
      <Text style={styles.txt2}>
        If you choose to deactivate your account, your profile will be removed
        from the app and then permanently deleted after a period of 30 days. If
        you choose to log in during that time, your account will be reactivated.
      </Text>
      <Text style={styles.txt3}>
        Deletion is permanent and cannot be undone.
      </Text>

      <View style={styles.btnCont}>
        <CustomButton
          BtnContstyle={styles.customBtnStyle}
          text="Deactivate Account"
          textStyle={styles.btnTxt}
          onPress={deactivateAccount}
        />
      </View>
      <Loader isVisible={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  mainCont: { alignItems: "center", flex: 1 },
  txt1: {
    fontFamily: fonts.VarelaRoundRegular,
    fontSize: 16,
    marginTop: 40,
    color: Theme.APP_BLACK_COLOR,
    textAlign: "center",
    textShadowColor: Theme.APP_BLACK_COLOR,
    textShadowOffset: { width: 0.17, height: 0.17 },
    textShadowRadius: 1,
  },
  txt2: {
    width: widthPercentageToDP(80),
    fontFamily: fonts.RobotoRegular,
    fontSize: 14,
    marginTop: 23,
    color: Theme.APP_BLACK_COLOR,
    textAlign: "center",
  },
  txt3: {
    fontFamily: fonts.RobotoBold,
    fontSize: 14,
    marginTop: 10,
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
