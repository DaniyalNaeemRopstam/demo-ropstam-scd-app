import {
  ActionSheetIOS,
  Alert,
  FlatList,
  Image,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import Theme from "../../utils/theme";
import { widthPercentageToDP } from "react-native-responsive-screen";
import fonts from "../../utils/fonts";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/loader/Loader";
import {
  deleteChatAsyncThunk,
  getAllChatsAsynThunk,
} from "../../redux/features/ChatSlice";
import { CustomErrorToast } from "../../helpers/CustomToast";
import { useWebsocket } from "../../hooks/useWebsocket";
import { WEB_SOCKET_URL_FROM_ENV } from "@env";
import { useFocusEffect } from "@react-navigation/native";

export default function MyMessages(props: any) {
  const dispatch = useDispatch();
  const { token, userID } = useSelector((state: any) => state?.login);
  const [loading, setLoading] = useState(true);
  const [isRefreshing] = useState(false);
  const [messages, setMessages] = useState([]);
  const { socket } = useWebsocket(WEB_SOCKET_URL_FROM_ENV);

  const receiveMessage = () => {
    getAllChats();
  };

  const getAllChats = () => {
    dispatch<any>(getAllChatsAsynThunk(token))
      .unwrap()
      .then((result: any) => {
        setLoading(false);

        const filteredMatchedArray = result.data.filter((item: any) => {
          const { status, likeByStatus, likeToStatus } = item.matchID || {};

          if (status !== "MATCHED") return false;

          return (
            (likeByStatus === "STAR_BOARD" && likeToStatus === "STAR_BOARD") ||
            (likeByStatus === "HARPOON" && likeToStatus === "HARPOON") ||
            (likeByStatus === "STAR_BOARD" && likeToStatus === "HARPOON") ||
            (likeByStatus === "HARPOON" && likeToStatus === "STAR_BOARD") ||
            (likeByStatus === "STAR_BOARD" &&
              likeToStatus === "CATCH_OF_THE_DAY") ||
            (likeByStatus === "CATCH_OF_THE_DAY" &&
              likeToStatus === "STAR_BOARD")
          );
        });

        const sortedChatArray = filteredMatchedArray.sort((a: any, b: any) => {
          const dateA = new Date(a?.lastMessage?.createdAt)?.getTime() || 0;
          const dateB = new Date(b?.lastMessage?.createdAt)?.getTime() || 0;
          return dateB - dateA;
        });
        setMessages(sortedChatArray);
      })
      .catch((err: any) => {
        setLoading(false);
        CustomErrorToast(err?.messaeg);
      });
  };

  useFocusEffect(
    useCallback(() => {
      getAllChats();
      socket?.emit("addUser", { userID, isChatOpen: false, chatID: null });
      socket?.on("receiveMessage", receiveMessage);
      return () => {
        socket?.off("receiveMessage", receiveMessage);
      };
    }, [socket])
  );

  const deleteChat = (id?: string) => {
    if (Platform.OS == "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Delete chat"],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 0,
          userInterfaceStyle: "dark",
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            // cancel action
          } else {
            const data = {
              id: id,
              token,
            };
            dispatch<any>(deleteChatAsyncThunk(data))
              .unwrap()
              .then(() => {
                setLoading(false);

                getAllChats();
              })
              .catch((err: any) => {
                setLoading(false);
                CustomErrorToast(err?.message);
              });
          }
        }
      );
    } else {
      Alert.alert(
        "Delete Chat",
        "Are you sure you want to delete this Chat?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              const data = {
                id: id,
                token,
              };
              dispatch<any>(deleteChatAsyncThunk(data))
                .unwrap()
                .then(() => {
                  setLoading(false);
                  getAllChats();
                })
                .catch((err: any) => {
                  setLoading(false);
                  CustomErrorToast(err?.message);
                });
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  const renderMessage = ({ item, index }: any) => {
    return (
      <Pressable
        key={index}
        onLongPress={() => deleteChat(item?._id)}
        style={styles(index !== messages.length - 1).messageMainCont}
        onPress={() =>
          props?.navigation?.navigate("CHAT", {
            profileData:
              item?.memberOne?._id == userID
                ? item?.memberTwo
                : item?.memberOne,
            chatID: item?._id,
            matchID: item?.matchID?._id,
          })
        }
      >
        <View style={styles().messageCont}>
          <View style={styles().imageMainCont}>
            <Image
              source={{
                uri:
                  item?.memberOne?._id == userID
                    ? item?.memberTwo?.mainImage
                    : item?.memberOne?.mainImage,
              }}
              style={styles().profileImg}
            />
          </View>

          <View style={styles().rightVeiw}>
            <Text style={styles().name}>
              {item?.memberOne?._id == userID
                ? item?.memberTwo?.userName
                : item?.memberOne?.userName}
            </Text>
            {item?.lastMessage ? (
              <Text
                style={
                  styles(
                    item?.lastMessage?.user == userID
                      ? true
                      : item?.lastMessage?.isRead
                  ).msg
                }
              >
                {item?.lastMessage?.messageType == "IMAGE"
                  ? "Image"
                  : item?.lastMessage?.messageType == "AUDIO"
                  ? "Audio"
                  : item?.lastMessage?.message}
              </Text>
            ) : (
              <Text style={styles(true).msg}>Say Ahoy...</Text>
            )}
          </View>
          {item?.unreadMessageCount > 0 && (
            <View style={styles().conterCont}>
              <Text style={styles().counter}>{item?.unreadMessageCount}</Text>
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles().mainCont}>
      {messages.length > 0 ? (
        <FlatList
          data={messages}
          renderItem={renderMessage}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles().flatListCont}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={getAllChats} />
          }
        />
      ) : (
        <View style={styles().noMessageCont}>
          <Text style={styles().noMessageTxt}>No Messages yet</Text>
        </View>
      )}

      <Loader isVisible={loading} />
    </View>
  );
}

const styles = (props?: any) =>
  StyleSheet.create({
    mainCont: { flex: 1, alignItems: "center" },
    flatListCont: { paddingTop: 20 },
    messageMainCont: {
      marginBottom: 10,
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: props ? 1 : 0,
      paddingBottom: props ? 10 : 0,
      borderColor: props ? Theme.APP_BORDER_GREY : Theme.APP_WHITE_COLOR,
    },
    messageCont: {
      flexDirection: "row",
      alignItems: "center",
      width: widthPercentageToDP(90),
    },
    imageMainCont: {
      width: 55,
      height: 55,
      borderRadius: 55 / 2,
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
    profileImg: {
      width: 50,
      height: 50,
      borderRadius: 50 / 2,
    },
    rightVeiw: {
      marginLeft: 15,
    },
    name: {
      fontSize: 16,
      fontFamily: fonts.RobotoBold,
      fontWeight: "500",
      color: Theme.APP_BLACK_COLOR,
    },
    msg: {
      marginTop: 3,
      fontSize: 14,
      fontFamily: props ? fonts?.RobotoRegular : fonts.RobotoBold,
      color: Theme.APP_VERIFICATION_GREY,
    },
    conterCont: {
      backgroundColor: Theme.APP_RED_COLOR,
      width: 25,
      height: 25,
      borderRadius: 25 / 2,
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      right: 0,
    },
    counter: {
      color: Theme.APP_WHITE_COLOR,
      fontFamily: fonts.RobotoBold,
      fontSize: 12,
    },
    noMessageCont: { flex: 1, alignItems: "center", justifyContent: "center" },
    noMessageTxt: {
      fontSize: 17,
      marginVertical: 12,
      color: Theme.APP_TEXT_GREY,
      fontFamily: fonts.VarelaRoundRegular,
    },
  });
