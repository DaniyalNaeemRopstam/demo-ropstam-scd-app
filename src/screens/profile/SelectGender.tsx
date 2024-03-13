import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
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
import { excludeUnUsedkeysFromUserObj } from "../../helpers/Common";
import ContinueButton from "../../components/buttons/ContinueButton";
import CustomDropDownPicker from "../../components/customDropDown/CustomDropDownPicker";
import CustomButton from "../../components/buttons/CutomButton";
import { useDispatch, useSelector } from "react-redux";
import { createProfileAsynThunk } from "../../redux/features/ProfileSlice";
import { CustomErrorToast } from "../../helpers/CustomToast";
import Loader from "../../components/loader/Loader";
import GameService from "../../redux/api/GameService";
import { setGameUsers } from "../../redux/features/AuthSlice";

const screenHeight = Dimensions.get("screen").height;

export default function SelectGender(props: any) {
  const userInfo = props?.route?.params?.userInfo;
  const routeFrom = props?.route?.params?.routeFrom;
  const { token } = useSelector((state: any) => state?.login);

  const dispatch = useDispatch();

  const [customItems1] = useState([
    {
      label: "Woman",
      value: "FEMALE",
      icon: require("../../assets/female.png"),
    },
    {
      label: "Man",
      value: "MALE",
      icon: require("../../assets/male.png"),
    },
    {
      label: "Male Sea Captain",
      value: "MALE_SEA_CAPTAIN",
      icon: require("../../assets/SeaCaptain.png"),
    },
    {
      label: "Female Sea Captain",
      value: "FEMALE_SEA_CAPTAIN",
      icon: require("../../assets/SeaCaptain.png"),
    },
    {
      label: "Other",
      value: "OTHER",
    },
  ]);
  const [customItems2] = useState([
    {
      label: "Male Sea Captains",
      value: "MALE_SEA_CAPTAIN",
      icon: require("../../assets/SeaCaptain.png"),
    },
    {
      label: "Female Sea Captains",
      value: "FEMALE_SEA_CAPTAIN",
      icon: require("../../assets/SeaCaptain.png"),
    },
    {
      label: "Men",
      value: "MALE",
      icon: require("../../assets/male.png"),
    },
    {
      label: "Women",
      value: "FEMALE",
      icon: require("../../assets/female.png"),
    },
    {
      label: "Men & Women",
      value: "MALE_AND_FEMALE",
    },
    {
      label: "Other",
      value: "OTHER",
    },
    {
      label: "All of the Above",
      value: "ALL",
    },
  ]);

  const [selectedValue1, setSelectedValue1] = useState<any>(customItems1[0]);
  const [selectedValue2, setSelectedValue2] = useState<any>(customItems2[0]);

  const [isCollapsed1, setIsCollapsed1] = useState(true);
  const [isCollapsed2, setIsCollapsed2] = useState(true);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props?.route?.params?.userInfo) {
      // Find the corresponding object from customItems1
      const matchedItem1 = customItems1.find(
        (item) => item.value === userInfo.gender
      );
      setSelectedValue1(matchedItem1);
      // Find the corresponding object from customItems1
      const matchedItem2 = customItems2.find(
        (item) => item.value === userInfo.seeking
      );
      setSelectedValue2(matchedItem2);
    }
  }, [userInfo]);

  const onSubmit = () => {
    const userData = {
      gender: selectedValue1?.value,
      seeking: selectedValue2?.value,
    };

    props.navigation.navigate("SETAGE", userData);
  };

  const onUpdate = () => {
    setLoading(true);
    const updatedUserData = {
      ...excludeUnUsedkeysFromUserObj(props?.route?.params?.userInfo),
      gender: selectedValue1?.value,
      seeking: selectedValue2?.value,
      token: token,
    };

    dispatch<any>(createProfileAsynThunk(updatedUserData))
      .unwrap()
      .then(() => {
        getUsers();
      })
      .catch((err: any) => {
        setLoading(false);
        CustomErrorToast(err);
      });
  };

  const getUsers = async () => {
    await GameService.getUsersApi(token)
      .then((result: any) => {
        const originalResponse = result.data;
        const dummyData = {
          _id: "",
          firstName: "",
          lastName: "",
          userName: "",
          seeking: "",
          education: "",
          dateOfBirth: "",
          interests: [],
          habits: [],
          location: {},
          description: "",
          images: [],
          mainImage: "",
          iceBreakers: "",
        };
        originalResponse.matches.push(dummyData, dummyData, dummyData);
        dispatch(setGameUsers(originalResponse));
        props?.navigation?.goBack();
        setLoading(false);
      })
      .catch((err: any) => {
        setLoading(false);
        CustomErrorToast(err);
      });
  };
  return (
    <ScrollView
      bounces={false}
      contentContainerStyle={styles(isCollapsed2).mainCont}
    >
      <Text style={styles().txt1}>What are you looking for?</Text>
      <Text style={styles().txt2}>
        This can always be changed later in settings
      </Text>

      <View>
        <View style={styles().dropMainCont}>
          <Text style={styles().dropTxt}>I am a:</Text>

          <Pressable
            style={styles().selectedItem}
            onPress={() => {
              if (!isCollapsed2) {
                setIsCollapsed2(true);
              }
              setIsCollapsed1(!isCollapsed1);
            }}
          >
            <View style={styles().selectedInnerCont}>
              {selectedValue1?.icon ? (
                <Image
                  source={selectedValue1?.icon}
                  style={styles().selectedImg}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles().selectedImg} />
              )}

              <Text style={styles().selectedTextStyle}>
                {selectedValue1?.label}
              </Text>
            </View>

            <Image
              source={require("../../assets/arrowdown.png")}
              style={
                isCollapsed1 ? styles().arrowDownStyle : styles().arrowUpStyle
              }
            />
          </Pressable>
        </View>
        <CustomDropDownPicker
          isCollapsed={isCollapsed1}
          items={customItems1}
          onValueChange={(value: any) => {
            setIsCollapsed1(true);
            setSelectedValue1(value);
          }}
        />
      </View>

      {isCollapsed1 && (
        <View>
          <View style={styles().dropMainCont2}>
            <Text style={styles().dropTxt}>Seeking:</Text>

            <Pressable
              style={styles().selectedItem}
              onPress={() => setIsCollapsed2(!isCollapsed2)}
            >
              <View style={styles().selectedInnerCont}>
                {selectedValue2?.icon ? (
                  <Image
                    source={selectedValue2?.icon}
                    style={styles().selectedImg}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={styles().selectedImg} />
                )}

                <Text style={styles().selectedTextStyle}>
                  {selectedValue2?.label}
                </Text>
              </View>

              <Image
                source={require("../../assets/arrowdown.png")}
                style={
                  isCollapsed2 ? styles().arrowDownStyle : styles().arrowUpStyle
                }
              />
            </Pressable>
          </View>

          <CustomDropDownPicker
            isCollapsed={isCollapsed2}
            items={customItems2}
            onValueChange={(value: any) => {
              setIsCollapsed2(true);
              setSelectedValue2(value);
            }}
          />
        </View>
      )}

      {routeFrom == "MYPROFILE" ? (
        <View style={styles(isCollapsed2).btnCont}>
          <CustomButton
            BtnContstyle={styles().customBtnStyle}
            text="Update"
            textStyle={styles().btnTxt}
            onPress={onUpdate}
          />
        </View>
      ) : (
        <ContinueButton
          btnStyle={styles(isCollapsed2).btnCont}
          onPress={onSubmit}
        />
      )}
      <Loader isVisible={loading} />
    </ScrollView>
  );
}

const styles = (props?: boolean) =>
  StyleSheet.create({
    mainCont: {
      height:
        screenHeight < 750 && !props
          ? heightPercentageToDP(120)
          : screenHeight < 750
          ? heightPercentageToDP(100)
          : heightPercentageToDP(92),
      alignItems: "center",
      paddingBottom: heightPercentageToDP(5),
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
    dropBarCont: { marginTop: heightPercentageToDP(4) },
    dropMainCont: {
      marginTop: 44,
      flexDirection: "row",
      backgroundColor: Theme.APP_BORDER_GREY,
      width: widthPercentageToDP(90),
      alignItems: "center",
      borderRadius: 10,
      shadowColor: Theme.APP_BLACK_COLOR,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      height: 63,
    },
    dropMainCont2: {
      marginTop: 44,
      flexDirection: "row",
      backgroundColor: Theme.APP_BORDER_GREY,
      width: widthPercentageToDP(90),
      alignItems: "center",
      borderRadius: 10,
      shadowColor: Theme.APP_BLACK_COLOR,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      height: 63,
    },
    dropTxt: {
      width: widthPercentageToDP(24),
      fontSize: 19,
      fontFamily: fonts.Questrail,
      textAlign: "center",
      color: Theme.APP_BLACK_COLOR,
    },
    textStyle: { fontSize: 19, fontFamily: fonts.Questrail },
    selectedTextStyle: {
      fontSize: 19,
      fontFamily: fonts.Questrail,
      color: Theme.APP_WHITE_COLOR,
      marginLeft: 10,
    },
    arrowDownStyle: { width: 17, height: 11 },
    arrowUpStyle: { width: 17, height: 11, transform: [{ rotate: "180deg" }] },
    selectedItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: Theme.APP_RED_COLOR,
      flex: 1,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      paddingHorizontal: 5,
      height: 63,
      shadowColor: Theme.APP_BLACK_COLOR,
      shadowOffset: {
        width: 2,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    selectedInnerCont: { flexDirection: "row", alignItems: "center" },
    selectedImg: { width: 23, height: 23, tintColor: Theme.APP_WHITE_COLOR },
    btnCont: {
      position: "absolute",
      bottom: heightPercentageToDP(8),
      alignItems: "center",
      zIndex: props ? 0 : -1,
    },
    // btnCont: {
    //   position: "absolute",
    //   bottom:
    //     Platform.OS == "android"
    //       ? heightPercentageToDP(5)
    //       : heightPercentageToDP(8),
    //   alignItems: "center",
    // },
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
