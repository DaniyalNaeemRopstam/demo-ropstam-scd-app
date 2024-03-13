import {
  Alert,
  AppState,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Theme from "../../utils/theme";
import fonts from "../../utils/fonts";
import Carousel from "react-native-reanimated-carousel";
import CustomButton from "../../components/buttons/CutomButton";
import ReportModal from "../../components/modals/ReportModal";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/loader/Loader";
import { createReportAsynThunk } from "../../redux/features/ReportSupportSlice";
import { CustomErrorToast } from "../../helpers/CustomToast";
import { unmatchUserAsynThunk } from "../../redux/features/ProfileSlice";
import UnmatchModal from "../../components/modals/UnmatchModal";
import {
  createMatchAsynThunk,
  updateMatchAsynThunk,
} from "../../redux/features/MatchSlice";
import { useFocusEffect } from "@react-navigation/native";
import Sound from "react-native-sound";

export default function UserProfile(props?: any) {
  const { routeFrom, profileData, matchID, status, showMatchBtn, chatID } =
    props?.route?.params;
  // const locationText = profileData.location.split(", ");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isReportModalVisible, setReportModalVisible] = useState(false);
  const [isUnmatchModalVisible, setUnmatchModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  let formattedAddress;
  if (profileData?.location?.formattedAddress) {
    const location_parts = profileData?.location?.formattedAddress.split(",");
    formattedAddress = `${location_parts[0]},\n${location_parts[1]}`;
  }
  // const [matchedData, setMatchedData] = useState<any>({});
  // const [matchProfile, setMatchProfile] = useState(profiles[0]);
  const dispatch = useDispatch();
  const { token, isSound, isViewMessageLog } = useSelector(
    (state: any) => state?.login
  );

  // Load background sound on component mount
  useFocusEffect(
    useCallback(() => {
      if (isSound && routeFrom == "GAMESCREEN") {
        const sound = new Sound("ocean_bg.mp3", Sound.MAIN_BUNDLE, (error) => {
          if (error) {
            null;
          } else {
            if (AppState.currentState == "active") {
              sound.setNumberOfLoops(-1); // -1 means infinite loop
              sound.play();
            }
          }
        });
        return () => {
          sound.stop();
          sound.release(); // Release resources when component unmounts
        };
      }
    }, [])
  );

  const submitReport = (detail: any) => {
    // setLoading(true);
    const data = {
      reportType: detail?.selectedIssue,
      reason: detail?.description,
      user: profileData?._id,
      token: token,
    };
    dispatch<any>(createReportAsynThunk(data))
      .unwrap()
      .then((response: any) => {
        Alert.alert(response?.message, "", [
          {
            onPress: () => setReportModalVisible(false),
          },
        ]);
      })
      .catch((err: any) => {
        if (err.includes("already")) {
          Alert.alert("", err, [
            {
              onPress: () => setReportModalVisible(false),
            },
          ]);
        }
      });
  };

  const unmatchUser = () => {
    setLoading(true);
    const data = {
      id: matchID,
      token: token,
    };
    dispatch<any>(unmatchUserAsynThunk(data))
      .unwrap()
      .then((response: any) => {
        setLoading(false);
        setUnmatchModalVisible(false);
        if (response.message == "Un-match successfully") {
          Alert.alert("Unmatch successfully", "", [
            {
              onPress: () => props?.navigation?.replace("HOMESCREEN"),
            },
          ]);
        }
      })
      .catch((err: any) => {
        setLoading(false);
        setUnmatchModalVisible(false);
        CustomErrorToast(err);
      });
  };

  const createMatch = () => {
    setLoading(true);
    const data = {
      id: profileData?._id,
      status: "STAR_BOARD",
      token,
    };
    dispatch<any>(createMatchAsynThunk(data))
      .unwrap()
      .then((response: any) => {
        setLoading(false);
        if (response.data?.resp?.status == "MATCHED") {
          props?.navigation.goBack();
        }
      })
      .catch((err: any) => {
        setLoading(false);
        CustomErrorToast(err);
      });
  };

  const updateMatch = (status: boolean) => {
    setLoading(true);
    const data = {
      matchID,
      status,
      token,
    };
    dispatch<any>(updateMatchAsynThunk(data))
      .unwrap()
      .then((response: any) => {
        setLoading(false);
        if (response.data?.status == "MATCHED") {
          isViewMessageLog
            ? props?.navigation?.replace("CHAT", {
                profileData,
                chatID,
                matchID,
              })
            : props?.navigation?.replace("MESSAGINGLAW", {
                profileData,
                chatID,
                matchID,
                routeFrom: "USERPROFILE",
              });
        } else {
          props?.navigation?.goBack();
        }
      })
      .catch((err: any) => {
        setLoading(false);
        CustomErrorToast(err);
      });
  };

  return (
    <ScrollView
      style={styles().mainStyle}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles().mainCont}
    >
      <View>
        <Pressable
          style={styles().crossCont}
          onPress={() => props?.navigation?.goBack()}
        >
          <Image
            source={require("../../assets/crossCircleIcon.png")}
            style={styles().crossImg}
            resizeMode="cover"
          />
        </Pressable>
        <View style={styles().carousalCont}>
          <Carousel
            style={styles().carousalStyle}
            width={widthPercentageToDP(90)}
            height={heightPercentageToDP(30)}
            data={profileData?.images}
            pagingEnabled={true}
            onSnapToItem={(index) => setActiveIndex(index)}
            renderItem={({ item }: any) => (
              <Image source={{ uri: item }} style={styles().carousalImg} />
            )}
          />

          <View style={styles().paginationContainer}>
            {profileData?.images.map((item: any, index: any) => {
              return (
                <View
                  key={index}
                  style={[
                    styles().paginationDot,
                    index == activeIndex
                      ? styles().activeDot
                      : styles().inactiveDot,
                  ]}
                />
              );
            })}
          </View>
        </View>

        <Text style={styles().cardFrontName}>{profileData?.userName}</Text>

        <View style={styles().cardBackABoutCont}>
          <View style={styles().cardBackAbout1}>
            <Text style={styles().cardBackAboutTxt}>Age</Text>
            <Text style={styles().cardBackAboutTxt}>
              {moment().diff(profileData?.dateOfBirth, "years")}
            </Text>
          </View>

          <View style={styles().cardBackAboutDivider} />

          <View style={styles().cardBackLocationCont}>
            {/* {locationText.map((line: string, index: number) => (
              <Text style={styles().cardBackLocationTxt} key={index}>
                {line}
              </Text>
            ))} */}
            <Text style={styles().cardBackLocationTxt} numberOfLines={2}>
              {formattedAddress}
            </Text>
          </View>

          <View style={styles().cardBackAboutDivider} />

          <View style={styles().cardBackAbout1}>
            <Text style={styles().cardBackAboutTxt}>Seeking</Text>
            <Text style={styles().cardBackAboutTxt}>
              {/* {profileData?.seeking.replaceAll("_", " ")} */}
              {profileData?.seeking == "MALE_SEA_CAPTAIN"
                ? "Male Sea Captains"
                : profileData?.seeking == "FEMALE_SEA_CAPTAIN"
                ? "Female Sea Captains"
                : profileData?.seeking == "MALE"
                ? "Men"
                : profileData?.seeking == "FEMALE"
                ? "Women"
                : profileData?.seeking == "MALE_AND_FEMALE"
                ? "Men & Women"
                : profileData?.seeking == "OTHER"
                ? "Other"
                : "All"}
            </Text>
          </View>
        </View>

        <Text style={styles().cardBackBio}>{profileData?.description}</Text>

        {profileData?.iceBreakers.length > 0 &&
          profileData?.iceBreakers.some((e: any) => e?.answer) && (
            <>
              <Text style={styles().cardBackIceBreaker}>Ice Breakers</Text>
              {profileData?.iceBreakers.map((item: any, index: number) => {
                if (!item?.answer) {
                  // Skip rendering if answer is empty or null
                  return null;
                }
                return (
                  <View key={index} style={styles().iceBreakMainCont}>
                    <View style={styles().iceBreakQCont}>
                      <Text style={styles().iceBreakerQ}>Q:</Text>
                      <Text style={styles().iceBreakerA}>
                        {" "}
                        {item?.question}
                      </Text>
                    </View>

                    <View style={styles().iceBreakACont}>
                      <Text style={styles().iceBreakerQ}>A: </Text>
                      <Text style={styles().iceBreakerA}>{item?.answer}</Text>
                    </View>
                  </View>
                );
              })}
            </>
          )}

        <Text style={styles().educationHead}>Education</Text>
        <Text style={styles().education}>
          {profileData?.education.replace(/_/g, " ")}
        </Text>

        {profileData?.job && (
          <>
            <Text style={styles().interestHead}>Job</Text>
            <Text style={styles().job}>{profileData?.job}</Text>
          </>
        )}

        <Text style={styles().interestHead}>Interests</Text>
        <View style={styles().interestsContainer}>
          {profileData?.interests.map((item: any, index: any) => (
            <View style={styles().chipCont} key={index}>
              <Text style={styles().selectedChipTxt}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles().smokerDrinkerCont}>
          <Text style={styles().smokerDrinkerHead}>Smoker: </Text>
          <Text style={styles().smokerDrinkerA}>
            {profileData?.habits?.[1]?.value ? "Yes" : "No"}
          </Text>
        </View>

        <View style={styles().smokerDrinkerCont}>
          <Text style={styles().smokerDrinkerHead}>Drinker: </Text>
          <Text style={styles().smokerDrinkerA}>
            {profileData?.habits?.[0]?.value ? "Yes" : "No"}
          </Text>
        </View>
      </View>

      {routeFrom == "Chat" && (
        <CustomButton
          BtnContstyle={styles().unmatchBtn}
          text={"Unmatch"}
          textStyle={styles().btnTxt}
          onPress={() => setUnmatchModalVisible(true)}
        />
      )}

      {status == "PENDING" && (
        <CustomButton
          BtnContstyle={styles().matchBtn}
          text={"Match User"}
          textStyle={styles().btnTxt}
          onPress={createMatch}
        />
      )}

      {showMatchBtn && (
        <View>
          <CustomButton
            BtnContstyle={styles().matchBtn}
            text={"Match User"}
            textStyle={styles().btnTxt}
            onPress={() => updateMatch(true)}
          />

          <CustomButton
            BtnContstyle={styles(showMatchBtn).matchBtn}
            text={"Reject Harpoon"}
            textStyle={styles().btnTxt}
            onPress={() => updateMatch(false)}
          />
        </View>
      )}

      <CustomButton
        BtnContstyle={styles(routeFrom).reportBtn}
        text={"Report Profile"}
        textStyle={styles().btnTxt}
        onPress={() => setReportModalVisible(true)}
      />

      <UnmatchModal
        visible={isUnmatchModalVisible}
        onPress={unmatchUser}
        onClose={() => setUnmatchModalVisible(false)}
      />

      <ReportModal
        visible={isReportModalVisible}
        onPress={(detail: any) => {
          setReportModalVisible(false);
          submitReport(detail);
        }}
        onClose={() => setReportModalVisible(false)}
      />

      <Loader isVisible={loading} />
    </ScrollView>
  );
}

const styles = (props?: string) =>
  StyleSheet.create({
    mainStyle: {
      flex: 1,
    },
    mainCont: {
      alignItems: "center",
      marginTop: 30,
      paddingBottom: heightPercentageToDP(10),
    },
    crossCont: {
      zIndex: 1,
      width: 35,
      height: 35,
      borderRadius: 40 / 2,
      position: "absolute",
      alignItems: "center",
      justifyContent: "center",
      top: 5,
      right: 5,
      backgroundColor: Theme.APP_WHITE_COLOR,
    },
    crossImg: { tintColor: Theme.APP_DISABLED, width: 46, height: 46 },
    carousalCont: {
      backgroundColor: Theme.APP_BACKGROUND_COLOR,
      shadowColor: Theme.APP_BLACK_COLOR,
      shadowOffset: {
        width: 1,
        height: 0,
      },
      shadowOpacity: 1,
      shadowRadius: 3.84,
      elevation: 5,
      borderRadius: 12,
      width: widthPercentageToDP(90),
      height: heightPercentageToDP(30),
    },
    carousalStyle: {
      borderRadius: 12,
    },
    carousalImg: {
      width: widthPercentageToDP(90),
      height: heightPercentageToDP(30),
      borderRadius: 10,
    },
    cardFrontName: {
      marginTop: 12,
      fontSize: 20,
      fontFamily: fonts.RobotoRegular,
      color: Theme.APP_RED_COLOR,
      textShadowColor: Theme.APP_BLACK_COLOR,
      textShadowOffset: { width: 0.17, height: 0.17 },
      textShadowRadius: 1,
      textAlign: "center",
    },
    cardBackABoutCont: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      width: widthPercentageToDP(90),
      marginTop: 20,
    },
    cardBackAbout1: { alignItems: "center", flex: 0.5 },
    cardBackAboutTxt: {
      fontSize: 14,
      color: Theme.APP_RED_COLOR,
      fontFamily: fonts.RobotoRegular,
      textTransform: "capitalize",
      textAlign: "center",
    },
    cardBackAboutDivider: {
      borderWidth: 0.5,
      height: "100%",
      borderColor: Theme.APP_BORDER_GREY,
    },
    cardBackLocationCont: { flex: 0.75 },
    cardBackLocationTxt: {
      textAlign: "center",
      color: Theme.APP_RED_COLOR,
      fontFamily: fonts.RobotoRegular,
      paddingHorizontal: 5,
      flex: 1,
    },
    cardBackBio: {
      width: widthPercentageToDP(90),
      marginTop: 15,
      color: Theme.APP_BLACK_COLOR,
      fontSize: 13,
      fontFamily: fonts.RobotoRegular,
    },
    cardBackIceBreaker: {
      marginTop: 20,
      alignSelf: "flex-start",
      fontSize: 15,
      fontFamily: fonts.RobotoBold,
      fontWeight: "bold",
      color: Theme.APP_BLACK_COLOR,
      marginBottom: 3,
    },
    iceBreakMainCont: {
      marginBottom: 10,
    },
    iceBreakQCont: {
      flexDirection: "row",
      alignItems: "center",
    },
    iceBreakACont: {
      flexDirection: "row",
      justifyContent: "center",
    },
    iceBreakerQ: {
      color: Theme.APP_BLACK_COLOR,
      fontSize: 15,
      fontFamily: fonts.RobotoRegular,
    },
    iceBreakerA: {
      color: Theme.APP_BLACK_COLOR,
      fontSize: 13,
      fontFamily: fonts.RobotoRegular,
      flex: 1,
    },
    education: {
      textTransform: "capitalize",
      color: Theme.APP_BLACK_COLOR,
      fontSize: 13,
      fontFamily: fonts.RobotoRegular,
    },
    educationHead: {
      marginTop: 20,
      color: Theme.APP_BLACK_COLOR,
      fontSize: 15,
      fontFamily: fonts.RobotoBold,
      fontWeight: "bold",
    },
    interestHead: {
      marginTop: 10,
      color: Theme.APP_BLACK_COLOR,
      fontSize: 15,
      fontFamily: fonts.RobotoBold,
      fontWeight: "bold",
    },
    job: {
      color: Theme.APP_BLACK_COLOR,
      fontSize: 13,
      fontFamily: fonts.RobotoRegular,
    },
    chipCont: {
      borderRadius: 50,
      marginRight: 14.5,
      marginVertical: 3.5,
      height: 20,
      paddingHorizontal: 10,
      backgroundColor: Theme.APP_RED_COLOR,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: Theme.APP_BLACK_COLOR,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 1,
      shadowRadius: 0.5,
      elevation: 3,
    },
    interestsContainer: {
      marginTop: 7,
      flexDirection: "row",
      flexWrap: "wrap", // Enable wrapping to next line
      width: widthPercentageToDP(90),
      marginBottom: 10,
    },
    selectedChipTxt: {
      fontFamily: fonts.RobotoRegular,
      fontSize: 11,
      color: Theme.APP_WHITE_COLOR,
    },
    smokerDrinkerCont: { flexDirection: "row", alignItems: "center" },
    smokerDrinkerHead: {
      fontSize: 15,
      fontFamily: fonts.RobotoBold,
      fontWeight: "bold",
      color: Theme.APP_BLACK_COLOR,
    },
    smokerDrinkerA: {
      fontSize: 15,
      fontFamily: fonts.RobotoRegular,
      textDecorationLine: "underline",
      color: Theme.APP_BLACK_COLOR,
    },
    paginationContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 10,
      position: "absolute",
      bottom: 20,
      alignSelf: "center",
      backgroundColor: Theme.APP_YELLOW,
      paddingHorizontal: 2,
      paddingVertical: 4,
      borderRadius: 10,
      shadowColor: Theme.APP_BLACK_COLOR,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 2,
      shadowRadius: 0.5,
      elevation: 3,
    },
    paginationDot: {
      width: 13,
      height: 13,
      borderRadius: 13 / 2,
      marginHorizontal: 4,
    },
    activeDot: {
      backgroundColor: Theme.APP_WHITE_COLOR, // Active dot color
    },
    inactiveDot: {
      backgroundColor: Theme.APP_DARK_GREY, // Inactive dot color
    },
    unmatchBtn: {
      marginTop: heightPercentageToDP(5),
      backgroundColor: Theme.APP_RED_COLOR,
      paddingHorizontal: widthPercentageToDP(13),
      paddingVertical: 12,
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
    },
    matchBtn: {
      marginTop: heightPercentageToDP(5),
      marginBottom: heightPercentageToDP(-3),
      backgroundColor: props ? Theme.APP_RED_COLOR : Theme.APP_GREEN,
      paddingHorizontal: props
        ? widthPercentageToDP(6.5)
        : widthPercentageToDP(10),
      paddingVertical: 12,
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
    },
    reportBtn: {
      marginTop:
        props == "Chat" ? heightPercentageToDP(1.5) : heightPercentageToDP(5),
      backgroundColor: Theme.APP_DARK_GREY,
      paddingHorizontal: widthPercentageToDP(8),
      paddingVertical: 12,
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
    },
    btnTxt: {
      fontSize: 16,
      fontFamily: fonts.VarelaRoundRegular,
      color: Theme.APP_WHITE_COLOR,
      textAlign: "center",
    },
  });
