import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Theme from "../../utils/theme";
import fonts from "../../utils/fonts";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../../components/buttons/CutomButton";
import { setThemeMode } from "../../redux/features/AuthSlice";
import Loader from "../../components/loader/Loader";
import { createProfileAsynThunk } from "../../redux/features/ProfileSlice";
import { CustomErrorToast } from "../../helpers/CustomToast";
import { excludeUnUsedkeysFromUserObj } from "../../helpers/Common";

export default function GameTheme(props?: any) {
  const [automaticMode, setAutomaticMode] = useState(false);
  const [dayMode, setDayMode] = useState(false);
  const [nightMode, setNightMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = useSelector((state: any) => state?.login?.token);
  const [selectedTheme, setSelectedTheme] = useState(
    useSelector((state: any) => state?.login?.themeMode)
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedTheme == "AUTOMATIC") {
      setAutomaticMode(true);
      setDayMode(false);
      setNightMode(false);
    } else if (selectedTheme == "DAY") {
      setAutomaticMode(false);
      setDayMode(true);
      setNightMode(false);
    } else {
      setAutomaticMode(false);
      setDayMode(false);
      setNightMode(true);
    }
  }, []);

  const changeTheme = () => {
    setLoading(true);

    const updatedUserData = {
      ...excludeUnUsedkeysFromUserObj(props?.route?.params?.userInfo),
      themeMode: selectedTheme,
      token: token,
    };
    dispatch<any>(createProfileAsynThunk(updatedUserData))
      .unwrap()
      .then((response: any) => {
        setLoading(false);
        dispatch(setThemeMode(response.data?.themeMode));
        props?.navigation?.navigate("HOMESCREEN");
      })
      .catch((err: any) => {
        setLoading(false);
        CustomErrorToast(err);
      });
  };

  return (
    <View style={styles().mainCont}>
      <Text style={styles().heading}>Day / Night mode</Text>

      <Pressable
        style={styles().checkBoxMainCont}
        onPress={() => {
          setAutomaticMode(true);
          setDayMode(false);
          setNightMode(false);
          setSelectedTheme("AUTOMATIC");
        }}
      >
        <View style={styles(automaticMode).checkBox}>
          {automaticMode && (
            <Image
              style={styles().checkBoxTick}
              source={require("../../assets/tick.png")}
              resizeMode="contain"
            />
          )}
        </View>

        <Text style={styles().checkBoxTxt}>Automatic</Text>
      </Pressable>

      <Pressable
        style={styles().checkBoxMainCont}
        onPress={() => {
          setAutomaticMode(false);
          setDayMode(true);
          setNightMode(false);
          setSelectedTheme("DAY");
        }}
      >
        <View style={styles(dayMode).checkBox}>
          {dayMode && (
            <Image
              style={styles().checkBoxTick}
              source={require("../../assets/tick.png")}
              resizeMode="contain"
            />
          )}
        </View>

        <Text style={styles().checkBoxTxt}>Day</Text>
      </Pressable>

      <Pressable
        style={styles().checkBoxMainCont}
        onPress={() => {
          setAutomaticMode(false);
          setDayMode(false);
          setNightMode(true);
          setSelectedTheme("NIGHT");
        }}
      >
        <View style={styles(nightMode).checkBox}>
          {nightMode && (
            <Image
              style={styles().checkBoxTick}
              source={require("../../assets/tick.png")}
              resizeMode="contain"
            />
          )}
        </View>

        <Text style={styles().checkBoxTxt}>Night</Text>
      </Pressable>

      <View style={styles().btnCont}>
        <CustomButton
          BtnContstyle={styles().customBtnStyle}
          text="Confirm"
          textStyle={styles().btnTxt}
          onPress={changeTheme}
        />
      </View>
      <Loader isVisible={loading} />
    </View>
  );
}

const styles = (props?: any) =>
  StyleSheet.create({
    mainCont: {
      flex: 1,
      alignItems: "center",
    },
    heading: {
      fontFamily: fonts.VarelaRoundRegular,
      fontSize: 20,
      marginTop: 17,
      color: Theme.APP_BLACK_COLOR,
      marginBottom: 30,
    },
    checkBoxMainCont: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
      width: widthPercentageToDP(90),
    },
    checkBoxCont: { alignItems: "center", marginRight: 15 },
    checkBox: {
      height: 24,
      width: 24,
      backgroundColor:
        props == true ? Theme.APP_LIGHT_BLUE : Theme.APP_BORDER_GREY,
      borderRadius: 5,
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
    checkBoxTick: { width: 16, height: 13 },
    checkBoxTxt: {
      fontSize: 16,
      fontFamily: fonts.RobotoRegular,
      color: Theme.APP_BLACK_COLOR,
      marginLeft: 15,
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
