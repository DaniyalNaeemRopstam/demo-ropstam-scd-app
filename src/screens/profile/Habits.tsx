import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import fonts from "../../utils/fonts";
import Theme from "../../utils/theme";
import ContinueButton from "../../components/buttons/ContinueButton";

import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

export default function Habits(props?: any) {
  const [drinks, setDrinks] = useState<any>(null);
  const [smokes, setSmokes] = useState<any>(null);
  const [showError, setShowError] = useState(false);
  const userData = props?.route?.params;

  useEffect(() => {
    if (smokes != null && drinks != null) {
      setShowError(false);
    }
  }, [smokes, drinks]);

  const onSubmit = () => {
    const updatedUserData = {
      ...userData,
      habits: [
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
    props.navigation.navigate("WORKEDUCATION", updatedUserData);
  };

  return (
    <View style={styles().mainCont}>
      <Text style={styles().txt1}>Tell us about your habits</Text>

      <View style={styles().checkBoxMainCont}>
        <Text style={styles().checkBoxTxt}>Do you drink?</Text>
        <View style={styles().checkBoxCont}>
          <Pressable
            style={styles(drinks).checkBox}
            onPress={() => (drinks ? setDrinks(null) : setDrinks(true))}
          >
            <Text style={styles(drinks).checkBoxTxtYes}>Yes</Text>
          </Pressable>
          <Pressable
            style={styles(drinks).checkBox2}
            onPress={() => {
              drinks == false ? setDrinks(null) : setDrinks(false);
            }}
          >
            <Text style={styles(drinks).checkBoxTxtNo}>No</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles().checkBoxMainCont}>
        <Text style={styles().checkBoxTxt}>Do you smoke?</Text>
        <View style={styles().checkBoxCont}>
          <Pressable
            style={styles(smokes).checkBox}
            onPress={() => (smokes ? setSmokes(null) : setSmokes(true))}
          >
            <Text style={styles(smokes).checkBoxTxtYes}>Yes</Text>
          </Pressable>
          <Pressable
            style={styles(smokes).checkBox2}
            onPress={() => {
              smokes == false ? setSmokes(null) : setSmokes(false);
            }}
          >
            <Text style={styles(smokes).checkBoxTxtNo}>No</Text>
          </Pressable>
        </View>
      </View>

      {showError && (
        <Text style={styles().errTxt}>Please select your habits</Text>
      )}
      <ContinueButton
        onPress={() => {
          if (smokes == null || drinks == null) {
            setShowError(true);
          } else {
            onSubmit();
          }
        }}
      />
    </View>
  );
}

const styles = (props?: any) =>
  StyleSheet.create({
    mainCont: { flex: 1, alignItems: "center" },
    txt1: {
      fontFamily: fonts.VarelaRoundRegular,
      fontSize: 20,
      marginTop: 17,
      color: Theme.APP_BLACK_COLOR,
    },
    checkBoxMainCont: {
      width: widthPercentageToDP(90),
      marginTop: 30,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    checkBoxCont: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    checkBox: {
      backgroundColor:
        props == true ? Theme.APP_LIGHT_BLUE : Theme.APP_BORDER_GREY,
      borderRadius: 5,
      shadowColor: Theme.APP_BLACK_COLOR,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 15,
      padding: 10,
      paddingHorizontal: 15,
    },
    checkBox2: {
      backgroundColor:
        props == false ? Theme.APP_RED_COLOR : Theme.APP_BORDER_GREY,
      borderRadius: 5,
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
      paddingHorizontal: 17,
    },
    checkBoxTick: { width: 16, height: 13 },
    checkBoxTxt: {
      fontSize: 16,
      fontFamily: fonts.RobotoRegular,
      color: props != null ? Theme.APP_WHITE_COLOR : Theme.APP_BLACK_COLOR,
    },
    checkBoxTxtYes: {
      fontSize: 16,
      fontFamily: fonts.RobotoRegular,
      color: props ? Theme.APP_WHITE_COLOR : Theme.APP_BLACK_COLOR,
    },
    checkBoxTxtNo: {
      fontSize: 16,
      fontFamily: fonts.RobotoRegular,
      color: props == false ? Theme.APP_WHITE_COLOR : Theme.APP_BLACK_COLOR,
    },
    errTxt: {
      marginTop: heightPercentageToDP(2),
      width: widthPercentageToDP(90),
      textAlign: "center",
      color: Theme.APP_RED_COLOR,
      fontSize: 14,
      alignSelf: "center",
      fontFamily: fonts.RobotoRegular,
    },
  });
