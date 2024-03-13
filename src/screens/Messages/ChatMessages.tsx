import {
  // ActionSheetIOS,
  // Alert,
  FlatList,
  Image,
  Keyboard,
  Platform,
  // Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Theme from "../../utils/theme";
import fonts from "../../utils/fonts";
import AudioPlayer from "../../components/customAudio/AudioPlayer";
import { useSelector } from "react-redux";
import CustomSoundPlayer from "../../components/customAudio/CustomSoundPlayer";
// import { CustomErrorToast } from "../../helpers/CustomToast";
// import { deleteChatAsyncThunk } from "../../redux/features/ChatSlice";
import Loader from "../../components/loader/Loader";
import { useFocusEffect } from "@react-navigation/native";
import ImageView from "../../components/modals/ImageView";
import moment from "moment";

interface ChatMessagesProps {
  messages: any;
  userImage: string;
}

export default function ChatMessages({
  messages,
  userImage,
}: ChatMessagesProps) {
  const [keyboardStatus, setKeyboardStatus] = useState("");
  const flatListRef = React.useRef<FlatList>(null);
  const { isSound, userID, mainImage } = useSelector(
    (state: any) => state.login
  );
  const [loading] = useState(false);
  const [viewImage, setViewImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const groupMessagesByDate = (messages: any) => {
    const groupedMessages = {};

    messages.forEach((message: any) => {
      const formattedDate = moment(message.createdAt).format(
        "dddd, MMMM DD, YYYY"
      );

      if (!groupedMessages[formattedDate]) {
        groupedMessages[formattedDate] = [];
      }

      groupedMessages[formattedDate].push(message);
    });

    return groupedMessages;
  };
  // const dispatch = useDispatch();

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus("Keyboard Shown");
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus("Keyboard Hidden");
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    isSound && CustomSoundPlayer("button_pop.mp3");
  }, [messages]);

  useFocusEffect(
    useCallback(() => {
      const timeout = setTimeout(
        () => {
          if (flatListRef.current && messages.length > 0) {
            flatListRef.current.scrollToEnd({
              animated: false,
            });
          }
        },
        Platform.OS == "ios" ? 200 : 1000
      );

      return () => {
        clearTimeout(timeout);
      };
    }, [messages, keyboardStatus])
  );

  const groupedMessages = groupMessagesByDate(messages);

  // const deleteMessage = (id?: string) => {
  //   if (Platform.OS == "ios") {
  //     ActionSheetIOS.showActionSheetWithOptions(
  //       {
  //         options: ["Cancel", "Delete message"],
  //         destructiveButtonIndex: 1,
  //         cancelButtonIndex: 0,
  //         userInterfaceStyle: "dark",
  //       },
  //       (buttonIndex) => {
  //         if (buttonIndex === 0) {
  //           // cancel action
  //         } else {
  //           const data = {
  //             id: id,
  //             token,
  //           };
  //           dispatch<any>(deleteChatAsyncThunk(data))
  //             .unwrap()
  //             .then(() => {
  //               setLoading(false);
  //             })
  //             .catch((err: any) => {
  //               setLoading(false);
  //               CustomErrorToast(err?.message);
  //             });
  //         }
  //       }
  //     );
  //   } else {
  //     Alert.alert(
  //       "Delete Chat",
  //       "Are you sure you want to delete this message?",
  //       [
  //         {
  //           text: "Cancel",
  //           style: "cancel",
  //         },
  //         {
  //           text: "Delete",
  //           style: "destructive",
  //           onPress: () => {
  //             const data = {
  //               id: id,
  //               token,
  //             };
  //             dispatch<any>(deleteChatAsyncThunk(data))
  //               .unwrap()
  //               .then(() => {
  //                 setLoading(false);
  //               })
  //               .catch((err: any) => {
  //                 setLoading(false);
  //                 CustomErrorToast(err?.message);
  //               });
  //           },
  //         },
  //       ],
  //       { cancelable: false }
  //     );
  //   }
  // };

  const renderItem = ({ item }: any) => (
    <View
      key={item?._id}
      style={[
        styles().messageWrapper,
        item.user === userID
          ? styles().userMessageWrapper
          : styles().otherMessageWrapper,
      ]}
    >
      {item.user !== userID && (
        <Image source={{ uri: userImage }} style={styles().profileImg} />
      )}

      <Pressable
        // onLongPress={() => {
        //   if (item?.user === userID) {
        //     deleteMessage(item?._id);
        //   }
        // }}
        style={[
          styles().messageWrapper,
          item.user === userID
            ? styles().userMessageWrapper
            : styles().otherMessageWrapper,
        ]}
      >
        <View
          style={[
            styles().messageContainer,
            item.user === userID ? styles().userMessage : styles().otherMessage,
          ]}
        >
          {item?.messageType == "IMAGE" ? (
            <Pressable
              onPress={() => {
                setSelectedImage(item?.message);
                setViewImage(true);
              }}
            >
              <Image
                source={{ uri: item?.message }}
                style={styles().messageImg}
              />
            </Pressable>
          ) : item?.messageType == "AUDIO" ? (
            <AudioPlayer
              audioTrack={item?.message}
              audioId={item?._id as string}
            />
          ) : (
            <Text
              style={styles(String(item?.message).charCodeAt(0)).messageText}
            >
              {item.message}
            </Text>
          )}
          <Text style={styles(item.user === userID).timeStamp}>
            {moment(item.createdAt).format("hh:mm a")}
          </Text>
        </View>
        <View
          style={[
            styles().triangle,
            item.user === userID
              ? styles().userTriangle
              : styles().otherTriangle,
          ]}
        />
      </Pressable>

      {item.user === userID && (
        <Image
          source={{ uri: mainImage }}
          style={styles(item.isUser).profileImg}
        />
      )}
    </View>
  );

  return (
    <View style={styles().mainCont}>
      <FlatList
        ref={flatListRef}
        data={Object.keys(groupedMessages).map((date) => ({
          date,
          data: groupedMessages[date],
        }))}
        initialNumToRender={messages.length}
        renderItem={({ item: { data, date } }) => (
          <View>
            <View style={styles().dateCont}>
              <Text style={styles().dateStyle}>{date}</Text>
            </View>
            {data.map((message: any) => renderItem({ item: message }))}
          </View>
        )}
        keyboardShouldPersistTaps={"always"}
        keyExtractor={(item) => item._id as string}
        style={styles(keyboardStatus).flatListStyle}
        contentContainerStyle={styles().flatCont}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={styles().flatFooter} />}
      />
      <Loader isVisible={loading} />
      <ImageView
        isVisible={viewImage}
        onClose={() => setViewImage(!viewImage)}
        image={selectedImage}
      />
    </View>
  );
}

const styles = (props?: any) =>
  StyleSheet.create({
    mainCont: {
      flex: 1,
      paddingHorizontal: widthPercentageToDP(3),
    },
    flatListStyle: {
      paddingHorizontal: 5,
      paddingTop: 20,
    },
    flatCont: { paddingBottom: 30 },
    flatFooter: { height: heightPercentageToDP(3) },
    dateCont: {
      marginTop: heightPercentageToDP(2),
      marginBottom: heightPercentageToDP(4),
      alignItems: "center",
    },
    dateStyle: {
      paddingVertical: heightPercentageToDP(1),
      textAlign: "center",
      backgroundColor: Theme.APP_BORDER_GREY,
      borderRadius: 18,
      paddingHorizontal: 15,
      overflow: "hidden",
      fontWeight: "500",
      fontFamily: fonts.RobotoBold,
      fontSize: 14,
      color: Theme.APP_CARD_GREY_TXT,
    },
    messageWrapper: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    userMessageWrapper: {
      justifyContent: "flex-end",
      flex: 1,
    },
    otherMessageWrapper: {
      justifyContent: "flex-start",
      flex: 1,
    },
    messageContainer: {
      borderRadius: 8,
      padding: 8,
      marginBottom: 8,
      maxWidth: widthPercentageToDP(80),
      minHeight: 53,
      justifyContent: "center",
    },
    userMessage: {
      backgroundColor: Theme.APP_USER_MESSAGE,
      alignSelf: "flex-end",
      right: 12,
      maxWidth: widthPercentageToDP(70),
    },
    otherMessage: {
      backgroundColor: Theme.APP_OTHER_MESSAGE,
      alignSelf: "flex-start",
      left: 12,
      maxWidth: widthPercentageToDP(77),
    },
    messageText: {
      fontSize: props > 150 ? 60 : 16,
      fontWeight: "500",
      fontFamily: fonts.RobotoRegular,
      color: Theme.APP_WHITE_COLOR,
    },
    timeStamp: {
      fontWeight: "500",
      fontFamily: fonts.RobotoBold,
      fontSize: 10,
      bottom: -5,
      alignSelf: props ? "flex-end" : "flex-start",
      color: Theme.APP_CARD_GREY_TXT,
    },
    messageEmoji: {
      fontSize: 44,
    },
    messageImg: {
      width: widthPercentageToDP(34),
      height: widthPercentageToDP(40),
    },
    triangle: {
      width: 0,
      height: 0,
      backgroundColor: "transparent",
      borderStyle: "solid",
      position: "absolute",
      top: 20,
      // zIndex: -1,
    },
    userTriangle: {
      width: 0,
      height: 0,
      zIndex: -1,
      backgroundColor: "transparent",
      borderStyle: "solid",
      borderLeftWidth: 10,
      borderRightWidth: 10,
      borderBottomWidth: 10,
      borderLeftColor: "transparent",
      borderRightColor: "transparent",
      borderBottomColor: Theme.APP_USER_MESSAGE,
      transform: [{ rotate: "90deg" }],
    },
    otherTriangle: {
      width: 0,
      height: 0,
      zIndex: -1,
      backgroundColor: "transparent",
      borderStyle: "solid",
      borderLeftWidth: 10,
      borderRightWidth: 10,
      borderBottomWidth: 10,
      borderLeftColor: "transparent",
      borderRightColor: "transparent",
      borderBottomColor: Theme.APP_OTHER_MESSAGE,
      transform: [{ rotate: "-90deg" }],
    },
    profileImg: {
      width: 48,
      height: 48,
      borderRadius: 48 / 2,
      top: 2,
      marginLeft: props ? 2 : 0,
      marginRight: props ? 0 : 2,
    },
  });
