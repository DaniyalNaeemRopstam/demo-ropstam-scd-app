import {
  FlatList,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import fonts from "../../utils/fonts";
import Theme from "../../utils/theme";
import { widthPercentageToDP } from "react-native-responsive-screen";
import CustomButton from "../../components/buttons/CutomButton";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/loader/Loader";
import { getMatchAsynThunk } from "../../redux/features/MatchSlice";
import { CustomErrorToast } from "../../helpers/CustomToast";
import { useFocusEffect } from "@react-navigation/native";
import { useWebsocket } from "../../hooks/useWebsocket";
import { WEB_SOCKET_URL_FROM_ENV } from "@env";
import { getUserProfileAsynThunk } from "../../redux/features/ProfileSlice";
import { setTotalMatches } from "../../redux/features/AuthSlice";

export default function MyCatches(props: any) {
  const { isViewMessageLog, token, userID, isPremium } = useSelector(
    (state: any) => state.login
  );
  const [laoding, setIsLoading] = useState(true);
  const { socket } = useWebsocket(WEB_SOCKET_URL_FROM_ENV);
  const dispatch = useDispatch();

  const [matchedCaptains, setMatchedCaptains] = useState<any>([]);
  const [captainswhoLike, setCaptainsWhoLike] = useState<any>([]);

  const receiveMessage = () => {
    getAllMatches();
  };

  const getAllMatches = () => {
    dispatch<any>(getMatchAsynThunk(token))
      .unwrap()
      .then((response: any) => {
        const filteredMatchedArray = response.data.filter((item: any) => {
          const { status, likeByStatus, likeToStatus, likeTo } = item || {};

          if (status !== "MATCHED") return false;

          return (
            (likeByStatus === "STAR_BOARD" && likeToStatus === "STAR_BOARD") ||
            (likeByStatus === "HARPOON" && likeToStatus === "HARPOON") ||
            (likeByStatus === "STAR_BOARD" && likeToStatus === "HARPOON") ||
            (likeByStatus === "HARPOON" && likeToStatus === "STAR_BOARD") ||
            (likeByStatus === "CATCH_OF_THE_DAY" &&
              likeToStatus === "STAR_BOARD") ||
            (likeByStatus === "STAR_BOARD" &&
              likeToStatus === "CATCH_OF_THE_DAY") ||
            (likeByStatus === "CATCH_OF_THE_DAY" && likeTo?._id === userID) ||
            (likeByStatus === "HARPOON" && likeTo?._id === userID)
          );
        });

        const filteredPendingArray = response.data.filter(
          (item: any) => item.status == "PENDING" && item.likeTo?._id === userID
        );

        const sortedMatchedArray = filteredMatchedArray.sort(
          (a: any, b: any) => {
            const dateA = a?.updatedAt ? new Date(a.updatedAt) : null;
            const dateB = b?.updatedAt ? new Date(b.updatedAt) : null;

            if (dateA && dateB) {
              return dateB.getTime() - dateA.getTime();
            }
            return 0;
          }
        );
        dispatch(setTotalMatches(sortedMatchedArray.length));
        setMatchedCaptains(sortedMatchedArray);
        setCaptainsWhoLike(filteredPendingArray);
        setIsLoading(false);
      })
      .catch((err: any) => {
        setIsLoading(false);
        CustomErrorToast(err);
      });
  };

  useFocusEffect(
    useCallback(() => {
      getAllMatches();
      socket?.emit("addUser", { userID, isChatOpen: false, chatID: null });
      socket?.on("receiveMessage", receiveMessage);
      return () => {
        socket?.off("receiveMessage", receiveMessage);
      };
    }, [socket])
  );

  const userProfile = (item: any, showMatchBtn: boolean) => {
    setIsLoading(true);
    const data = {
      id: item?.likeBy?._id,
      token,
    };
    dispatch<any>(getUserProfileAsynThunk(data))
      .unwrap()
      .then((result: any) => {
        setIsLoading(false);
        props?.navigation?.navigate("USERPROFILE", {
          routeFrom: "MYCATCHES",
          profileData: result?.data,
          matchID: item?._id,
          chatID: item?.chat,
          status: item?.status,
          showMatchBtn,
        });
      })
      .catch((err: any) => {
        setIsLoading(false);
        CustomErrorToast(err?.message);
      });
  };

  const isHarpoon = (item: any) => {
    if (
      (item?.likeTo?._id === userID && item?.likeByStatus === "HARPOON") ||
      (item?.likeTo?._id === userID &&
        item?.likeByStatus === "CATCH_OF_THE_DAY")
    )
      return true;

    return false;
  };

  return (
    <ScrollView
      bounces={false}
      style={styles.mainStyle}
      contentContainerStyle={styles.mainCont}
      showsVerticalScrollIndicator={false}
    >
      <Image
        source={require("../../assets/swordfish.png")}
        style={styles.swordFish}
      />
      <Text style={styles.txt1}>Members you are matched with</Text>

      <View style={styles.matchesCont}>
        {matchedCaptains.length > 0 ? (
          matchedCaptains?.map((item: any, index: number) => (
            <Pressable
              onPress={() => {
                if (item?.likeToStatus == "PENDING") {
                  userProfile(item, true);
                } else {
                  isViewMessageLog
                    ? props?.navigation?.navigate("CHAT", {
                        profileData:
                          item?.likeBy?._id == userID
                            ? item?.likeTo
                            : item?.likeBy,
                        chatID: item?.chat,
                        matchID: item?._id,
                      })
                    : props?.navigation?.navigate("MESSAGINGLAW", {
                        routeFrom: "MYCATHES",
                        profileData:
                          item?.likeBy?._id == userID
                            ? item?.likeTo
                            : item?.likeBy,
                        chatID: item?.chat,
                        matchID: item?._id,
                      });
                }
              }}
              style={styles.matchCont}
              key={index}
            >
              <View style={styles.imageMainCont}>
                {item?.unreadMessageCount > 0 && (
                  <View style={styles.messageCont}>
                    <Text style={styles.messageTxt}>
                      {item?.unreadMessageCount}
                    </Text>
                  </View>
                )}
                {
                  isHarpoon(item) && (
                    <View style={styles.harpoonIconCont}>
                      <Image
                        source={require("../../assets/harpoonIcon.png")}
                        style={styles.harpoonIcon}
                      />
                    </View>
                  )
                  // )
                  // : (
                  //   item?.likeBy?._id === userID &&
                  //   item?.likeToStatus == "HARPOON" && (
                  //     <View style={styles.harpoonIconCont}>
                  //       <Image
                  //         source={require("../../assets/harpoonIcon.png")}
                  //         style={styles.harpoonIcon}
                  //       />
                  //     </View>
                  //   )
                  // )
                }

                <Image
                  source={{
                    uri:
                      item?.likeBy?._id == userID
                        ? item?.likeTo?.mainImage
                        : item?.likeBy?.mainImage,
                  }}
                  style={styles.profileImg}
                />
              </View>

              <View style={styles.nameCont}>
                <Text style={styles.nameTxt}>
                  {item?.likeBy?._id == userID
                    ? item?.likeTo?.userName
                    : item?.likeBy?.userName}
                </Text>
              </View>
            </Pressable>
          ))
        ) : (
          <Text style={styles.noMatchTxt}>No Matches yet</Text>
        )}
      </View>

      <View style={styles.divider} />

      <Text style={styles.txt2}>More Members who like you</Text>

      <View style={styles.captiansCont}>
        {captainswhoLike.length > 0 ? (
          <FlatList
            data={captainswhoLike}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: widthPercentageToDP(6) }}
            renderItem={({ item, index }) => {
              return (
                <Pressable
                  disabled={!isPremium}
                  onPress={() => userProfile(item, false)}
                  style={styles.matchCont}
                  key={index}
                >
                  <View style={styles.imageMainCont}>
                    <ImageBackground
                      blurRadius={
                        isPremium ? 0 : Platform.OS == "ios" ? 30 : 15
                      }
                      borderRadius={widthPercentageToDP(24.2) / 2}
                      source={{ uri: item?.likeBy?.mainImage }}
                      style={styles.profileImg}
                    />
                  </View>

                  <View style={styles.nameCont}>
                    <Text style={styles.nameTxt}>{item?.likeBy?.userName}</Text>
                  </View>
                </Pressable>
              );
            }}
          />
        ) : (
          <Text style={styles.noMatchTxt}>No Matches yet</Text>
        )}
      </View>
      {!isPremium && (
        <>
          <Text style={styles.txt2}>
            Upgrade your account to see who likes you
          </Text>

          <CustomButton
            BtnContstyle={styles.customBtnStyle}
            text="Upgrade to Admiral"
            textStyle={styles.customBtnTxt}
            leftImage={true}
            leftImageSrc={require("../../assets/Admiralicon.png")}
            leftImgStyle={styles.customBtnImg}
            onPress={() => props?.navigation?.navigate("UPGRADE")}
          />
        </>
      )}

      <Loader isVisible={laoding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainStyle: { flex: 1 },
  mainCont: { alignItems: "center", paddingBottom: 50 },
  swordFish: { width: 259, height: 94, marginTop: 10 },
  txt1: {
    marginTop: 21,
    fontSize: 17,
    fontFamily: fonts.VarelaRoundRegular,
    color: Theme.APP_BLACK_COLOR,
  },
  matchesCont: {
    marginTop: 11,
    flexDirection: "row",
    flexWrap: "wrap", // Enable wrapping to next line
    width: widthPercentageToDP(100),
  },
  matchCont: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: widthPercentageToDP(6),
  },
  imageMainCont: {
    width: widthPercentageToDP(25.5),
    height: widthPercentageToDP(25.5),
    borderRadius: widthPercentageToDP(25.5) / 2,
    borderWidth: 3,
    borderColor: Theme.APP_YELLOW,
    shadowColor: Theme.APP_BLACK_COLOR,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 5,
    backgroundColor: Theme.APP_BLACK_COLOR,
    justifyContent: "center",
    alignItems: "center",
  },
  messageCont: {
    top: 0,
    zIndex: 1,
    right: -10,
    width: 33,
    height: 33,
    borderRadius: 33 / 2,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.APP_RED_COLOR,
  },
  messageTxt: {
    fontSize: 19,
    color: Theme.APP_WHITE_COLOR,
    fontFamily: fonts.VarelaRoundRegular,
  },
  harpoonIconCont: {
    zIndex: 1,
    width: 33,
    height: 33,
    borderRadius: 33 / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.APP_HARPOON_BLUE,
    position: "absolute",
    bottom: -3,
    right: -5,
  },
  harpoonIcon: {
    width: 22,
    height: 22,
  },
  profileImg: {
    width: widthPercentageToDP(24.2),
    height: widthPercentageToDP(24.2),
    borderRadius: widthPercentageToDP(24.2) / 2,
  },
  nameCont: {
    marginTop: 3,
    width: "100%",
    paddingHorizontal: 5,
    marginBottom: 15,
    paddingVertical: 3,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.APP_YELLOW,
    shadowColor: Theme.APP_BLACK_COLOR,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 5,
  },
  nameTxt: {
    fontSize: 14,
    textShadowRadius: 1,
    color: Theme.APP_WHITE_COLOR,
    fontFamily: fonts.RobotoBold,
    textShadowColor: Theme.APP_BLACK_COLOR,
    textShadowOffset: { width: 0, height: 1 },
  },
  noMatchTxt: {
    width: widthPercentageToDP(100),
    textAlign: "center",
    fontSize: 17,
    marginVertical: 12,
    color: Theme.APP_TEXT_GREY,
    fontFamily: fonts.VarelaRoundRegular,
  },
  divider: {
    height: 3,
    marginTop: 5,
    width: widthPercentageToDP(80),
    backgroundColor: Theme.APP_DIVIDER,
  },
  txt2: {
    fontSize: 17,
    marginTop: 12,
    color: Theme.APP_BLACK_COLOR,
    fontFamily: fonts.VarelaRoundRegular,
  },
  captiansCont: {
    marginTop: 30,
    flexDirection: "row",
    flexWrap: "wrap", // Enable wrapping to next line
    width: widthPercentageToDP(100),
  },
  customBtnStyle: {
    marginTop: 20,
    backgroundColor: Theme.APP_RED_COLOR,
    width: widthPercentageToDP(60),
    height: 43,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "space-evenly",
    shadowColor: Theme.APP_BLACK_COLOR,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  customBtnTxt: {
    fontSize: 16,
    fontFamily: fonts.VarelaRoundRegular,
    color: Theme.APP_WHITE_COLOR,
    textShadowRadius: 1,
    textShadowColor: Theme.APP_BLACK_COLOR,
    textShadowOffset: { width: 1, height: 1 },
  },
  customBtnImg: { width: 24, height: 28 },
});
