import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import fonts from "../../utils/fonts";
import Theme from "../../utils/theme";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ContinueButton from "../../components/buttons/ContinueButton";
import CustomButton from "../../components/buttons/CutomButton";
import moment from "moment";

export default function SetAge(props: any) {
  const userData = props?.route?.params;
  const routeFrom = props?.route?.params?.routeFrom;
  const minDate = new Date(); // Current date
  minDate.setFullYear(minDate.getFullYear() - 18); // 18 years ago

  const [selectedDate, setSelectedDate] = useState("");
  const [userAge, setUserAge] = useState(0);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      setShowError(false);
      setUserAge(moment().diff(selectedDate, "years"));
    }
  }, [selectedDate]);

  const onSubmit = () => {
    if (selectedDate == "") {
      setShowError(true);
    } else {
      const updatedUserData = {
        ...userData,
        dateOfBirth: new Date(selectedDate).toISOString(),
      };

      props.navigation.navigate("INTERESTS", updatedUserData);
    }
  };

  return (
    <View style={styles.mainCont}>
      <Text style={styles.txt1}>When were you born?</Text>

      <View style={styles.flexCont}>
        <View style={styles.innerBx}>
          <Text style={styles.txt2}>Month</Text>
          <Pressable
            style={styles.bxCont}
            onPress={() => setIsDatePickerVisible(true)}
          >
            <Text style={styles.txt3}>
              {selectedDate != "" && new Date(selectedDate).getMonth() + 1}
            </Text>
          </Pressable>
        </View>

        <View style={styles.innerBx}>
          <Text style={styles.txt2}>Day</Text>
          <Pressable
            style={styles.bxCont}
            onPress={() => setIsDatePickerVisible(true)}
          >
            <Text style={styles.txt3}>
              {selectedDate != "" && new Date(selectedDate).getDate()}
            </Text>
          </Pressable>
        </View>

        <View style={styles.innerBx}>
          <Text style={styles.txt2}>Year</Text>
          <Pressable
            style={styles.bxCont}
            onPress={() => setIsDatePickerVisible(true)}
          >
            <Text style={styles.txt3}>
              {selectedDate != "" && new Date(selectedDate).getFullYear()}
            </Text>
          </Pressable>
        </View>
      </View>
      {showError && <Text style={styles.errtxt}>Please enter your age</Text>}
      <Text style={styles.txt4}>Your Age is</Text>
      <Text style={styles.txt5}>{userAge}</Text>

      <View style={styles.redBar} />

      <Text style={styles.txt6}>
        {"You must be 18+ years of age\nto use this app"}
      </Text>
      <Text style={styles.txt6}>
        {"Please be accurate as you\ncannot change this detail later"}
      </Text>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={(date) => {
          setSelectedDate(date.toString());
          setIsDatePickerVisible(false);
        }}
        onCancel={() => setIsDatePickerVisible(false)}
        maximumDate={minDate}
        date={minDate}
      />
      {routeFrom == "MYPROFILE" ? (
        <View style={styles.btnCont}>
          <CustomButton
            BtnContstyle={styles.customBtnStyle}
            text="Update"
            textStyle={styles.btnTxt}
            onPress={() => props?.navigation?.goBack()}
          />
        </View>
      ) : (
        <ContinueButton onPress={onSubmit} />
      )}
    </View>
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

  flexCont: {
    width: widthPercentageToDP(90),
    flexDirection: "row",
    alignItems: "center",
    marginTop: 26,
    justifyContent: "space-between",
  },
  innerBx: { alignItems: "center" },
  txt2: {
    fontSize: 16,
    fontFamily: fonts.RobotoRegular,
    color: Theme.APP_BLACK_COLOR,
  },
  txt3: {
    fontSize: 18,
    fontFamily: fonts.RobotoRegular,
    color: Theme.APP_BLACK_COLOR,
  },
  bxCont: {
    marginTop: 7,
    height: 52,
    width: 90,
    borderRadius: 10,
    borderWidth: 2,
    backgroundColor: Theme.APP_WHITE_COLOR,
    borderColor: Theme.APP_BORDER_GREY,
    alignItems: "center",
    justifyContent: "center",
  },
  errtxt: {
    top: 10,
    color: Theme.APP_RED_COLOR,
    fontSize: 14,
    fontFamily: fonts.RobotoRegular,
  },
  txt4: {
    fontSize: 20,
    fontFamily: fonts.Questrail,
    marginTop: 54,
    color: Theme.APP_BLACK_COLOR,
  },
  txt5: {
    fontSize: 31,
    fontFamily: fonts.Questrail,
    marginTop: 16,
    color: Theme.APP_BLACK_COLOR,
  },
  redBar: {
    marginTop: 8,
    marginBottom: 22,
    height: 4,
    width: 105,
    backgroundColor: Theme.APP_RED_COLOR,
    borderRadius: 10,
  },
  txt6: {
    fontFamily: fonts.RobotoRegular,
    fontSize: 14,
    marginTop: 10,
    color: Theme.APP_TEXT_GREY,
    textAlign: "center",
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
