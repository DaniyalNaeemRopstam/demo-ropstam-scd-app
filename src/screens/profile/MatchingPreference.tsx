import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import fonts from "../../utils/fonts";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Theme from "../../utils/theme";
import ContinueButton from "../../components/buttons/ContinueButton";
import InputRange from "../../components/sliderComponents/InputRange";
import CustomButton from "../../components/buttons/CutomButton";
import { excludeUnUsedkeysFromUserObj } from "../../helpers/Common";
import { useDispatch, useSelector } from "react-redux";
import { createProfileAsynThunk } from "../../redux/features/ProfileSlice";
import { CustomErrorToast } from "../../helpers/CustomToast";
import Loader from "../../components/loader/Loader";

export default function MatchingPreference(props: any) {
  const userData = props?.route?.params;
  const routeFrom = props?.route?.params?.routeFrom;

  const dispatch = useDispatch();
  const token = useSelector((state: any) => state?.login?.token);
  const [drinks, setDrinks] = useState(false);
  const [smokes, setSmokes] = useState(false);
  const [changeValue, setChangeValue] = useState({
    min: props?.route?.params?.userInfo?.ageRange?.min || 18,
    max: props?.route?.params?.userInfo?.ageRange?.max || 99,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDrinks(props?.route?.params?.userInfo?.preferences[0]?.value || false);
    setSmokes(props?.route?.params?.userInfo?.preferences[1]?.value || false);
  }, []);

  const onSubmit = () => {
    const updatedUserData = {
      ...userData,
      ageRange: {
        min: changeValue?.min,
        max: changeValue?.max,
      },
      preferences: [
        {
          label: "drinks",
          value: drinks,
        },
        {
          label: "smokes",
          value: smokes,
        },
      ],
    };
    props.navigation.navigate("HABITS", updatedUserData);
  };

  const onUpdate = () => {
    setLoading(true);
    const updatedUserData = {
      ...excludeUnUsedkeysFromUserObj(props?.route?.params?.userInfo),
      ageRange: {
        min: changeValue?.min,
        max: changeValue?.max,
      },
      preferences: [
        {
          label: "drinks",
          value: drinks,
        },
        {
          label: "smokes",
          value: smokes,
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
    <View style={styles().mainCont}>
      <Text style={styles().txt1}>Age Range for Matches</Text>

      <View style={styles().rangeCont}>
        <InputRange
          min={18}
          max={99}
          steps={1}
          onChangeValue={(val: any) => setChangeValue(val)}
          initialValue={{
            min: props?.route?.params?.userInfo?.ageRange?.min || 18,
            max: props?.route?.params?.userInfo?.ageRange?.max || 99,
          }}
        />
      </View>

      <View style={styles().rangeTextCont}>
        <Text style={styles().rangeTxt}>18+</Text>
        <Text style={styles().rangeTxt}>(Age)</Text>
        <Text style={styles().rangeTxt}>99+</Text>
      </View>

      <Text style={styles().txt2}>Match Preferences</Text>

      <View style={styles().checkBoxMainCont}>
        <View style={styles().checkBoxCont}>
          <Text style={styles().rangeTxt}>Y</Text>
          <Pressable
            style={styles(drinks).checkBox}
            onPress={() => setDrinks(true)}
          >
            {drinks && (
              <Image
                style={styles().checkBoxTick}
                source={require("../../assets/tick.png")}
                resizeMode="contain"
              />
            )}
          </Pressable>
          <Pressable
            style={styles(smokes).checkBox}
            onPress={() => setSmokes(true)}
          >
            {smokes && (
              <Image
                style={styles().checkBoxTick}
                source={require("../../assets/tick.png")}
                resizeMode="contain"
              />
            )}
          </Pressable>
        </View>

        <View style={styles().checkBoxCont}>
          <Text style={styles().rangeTxt}>N</Text>
          <Pressable
            style={styles(drinks).checkBox2}
            onPress={() => setDrinks(false)}
          >
            {!drinks && (
              <Image
                style={styles().checkBoxTick}
                source={require("../../assets/cross.png")}
                resizeMode="contain"
              />
            )}
          </Pressable>
          <Pressable
            style={styles(smokes).checkBox2}
            onPress={() => setSmokes(false)}
          >
            {!smokes && (
              <Image
                style={styles().checkBoxTick}
                source={require("../../assets/cross.png")}
                resizeMode="contain"
              />
            )}
          </Pressable>
        </View>

        <View style={styles().checkBoxTxtCont}>
          <Text style={styles().checkBoxTxt}>Drinks</Text>
          <Text style={styles().checkBoxTxt}>Smokes</Text>
        </View>
      </View>

      {routeFrom == "SETTINGS" ||
      routeFrom == "MYPROFILE" ||
      routeFrom == "CATCHOFTHEDAY" ? (
        <View style={styles().btnCont}>
          <CustomButton
            BtnContstyle={styles().customBtnStyle}
            text="Update"
            textStyle={styles().btnTxt}
            onPress={onUpdate}
          />
        </View>
      ) : (
        <ContinueButton onPress={onSubmit} />
      )}
      <Loader isVisible={loading} />
    </View>
  );
}

const styles = (props?: any) =>
  StyleSheet.create({
    mainCont: { alignItems: "center", flex: 1 },
    txt1: {
      fontFamily: fonts.VarelaRoundRegular,
      fontSize: 20,
      marginTop: 17,
      color: Theme.APP_BLACK_COLOR,
    },
    txt2: {
      color: Theme.APP_TEXT_GREY,
      fontFamily: fonts.VarelaRoundRegular,
      fontSize: 20,
      marginTop: 43,
    },
    rangeCont: { marginTop: 72 },
    rangeTextCont: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: widthPercentageToDP(88),
      marginTop: 8,
    },
    rangeTxt: {
      color: Theme.APP_TEXT_GREY,
      fontFamily: fonts.VarelaRoundRegular,
      fontSize: 16,
    },
    checkBoxMainCont: {
      width: widthPercentageToDP(90),
      marginTop: 10,
      flexDirection: "row",
    },
    checkBoxCont: { alignItems: "center", marginRight: 15 },
    checkBox: {
      height: 24,
      width: 24,
      backgroundColor:
        props == true ? Theme.APP_LIGHT_BLUE : Theme.APP_BORDER_GREY,
      borderRadius: 5,
      marginBottom: 15,
      shadowColor: Theme.APP_BLACK_COLOR,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 0.5,
      elevation: 5,
      justifyContent: "center",
      alignItems: "center",
    },
    checkBox2: {
      height: 24,
      width: 24,
      backgroundColor:
        props == false ? Theme.APP_RED_COLOR : Theme.APP_BORDER_GREY,
      borderRadius: 5,
      marginBottom: 15,
      shadowColor: Theme.APP_BLACK_COLOR,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 0.5,
      elevation: 5,
      justifyContent: "center",
      alignItems: "center",
    },
    checkBoxTxtCont: {
      justifyContent: "space-evenly",
      marginTop: 5,
    },
    checkBoxTick: { width: 16, height: 13 },
    checkBoxTxt: {
      fontSize: 16,
      fontFamily: fonts.RobotoRegular,
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
