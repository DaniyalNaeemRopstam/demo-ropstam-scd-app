import {
  Alert,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import fonts from "../../utils/fonts";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Theme from "../../utils/theme";
import ChatMessages from "./ChatMessages";
import ImageCropPicker from "react-native-image-crop-picker";
import CustomAudio from "../../components/customAudio/CutomAudio";
import EmojiModal from "../../components/modals/EmojiModal";
import { PERMISSIONS, RESULTS, request } from "react-native-permissions";
import ReportModal from "../../components/modals/ReportModal";
import { useWebsocket } from "../../hooks/useWebsocket";
import { WEB_SOCKET_URL_FROM_ENV } from "@env";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/loader/Loader";
import {
  getChatAsynThunk,
  uploadAudioAsynThunk,
} from "../../redux/features/ChatSlice";
import { CustomErrorToast } from "../../helpers/CustomToast";
import { createReportAsynThunk } from "../../redux/features/ReportSupportSlice";
import {
  getUserProfileAsynThunk,
  uploadImageAsynThunk,
} from "../../redux/features/ProfileSlice";
import { setChatID } from "../../redux/features/AuthSlice";

export default function Chat(props: any) {
  const [keyboardStatus, setKeyboardStatus] = useState("");
  const [isAudioOpen, setIsAudioOpen] = useState(false);
  const [isEmojiModalVisible, setEmojiModalVisible] = useState(false);
  const [isReportModalVisible, setReportModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { height } = Dimensions.get("window");
  const { socket } = useWebsocket(WEB_SOCKET_URL_FROM_ENV);
  const { token, userID } = useSelector((state: any) => state?.login);

  const dispatch = useDispatch();

  const navigation = useNavigation();

  const [messages, setMessages] = useState<any>([]);
  const [inputText, setInputText] = useState("");

  const receiveMessage = (data: any) => {
    if (data?.chat === props?.route?.params?.chatID) {
      setMessages((prev: any) => [...prev, data]);
    }
  };

  useEffect(() => {
    getMessages();
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: props?.route?.params?.profileData?.userName,
      headerTitleStyle: styles().headerTitleStyle,
    });
  }, [navigation]);

  useEffect(() => {
    socket?.emit("addUser", {
      userID,
      isChatOpen: true,
      chatID: props?.route?.params?.chatID,
    });
    socket?.on("receiveMessage", receiveMessage);
    return () => {
      socket?.off("receiveMessage", receiveMessage);
    };
  }, [socket]);

  useFocusEffect(
    useCallback(() => {
      // Dispatch setChatID when the screen is focused
      dispatch(setChatID(props.route.params.chatID));
      // console.log("focus");

      return () => {
        // Dispatch setChatID with an empty string when the screen is unfocused
        dispatch(setChatID(""));
        // console.log("nofocus", props.route.params.chatID);
      };
    }, [props.route.params.chatID]) // Dependency array to ensure the effect runs when chatID changes
  );

  const getMessages = () => {
    setLoading(true);
    const data = {
      token: token,
      chatID: props?.route?.params?.chatID,
    };
    dispatch<any>(getChatAsynThunk(data))
      .then((result: any) => {
        setMessages(result?.payload?.data || []);
        setLoading(false);
      })
      .catch((err: any) => {
        setLoading(false);
        CustomErrorToast(err?.messaeg);
      });
  };

  const sendMessage = (messageProps?: any) => {
    const data = {
      token: token,
      chatID: props?.route?.params?.chatID,
      sendTo: props?.route?.params?.profileData?._id,
      sendBy: userID,
      message: messageProps?.message,
      messageType: messageProps?.type,
      matchID: props?.route?.params?.matchID,
    };
    socket?.emit("sendMessage", data);
    setInputText("");
  };

  const sendImageMessage = (imagePath: string) => {
    const data = {
      token: token,
      chatID: props?.route?.params?.chatID,
      sendTo: props?.route?.params?.profileData?._id,
      sendBy: userID,
      message: imagePath,
      messageType: "IMAGE",
      matchID: props?.route?.params?.matchID,
    };
    socket?.emit("sendMessage", data);
  };

  const handleImagePick = () => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      forceJpg: true,
      cropping: true,
    })
      .then((image) => {
        const imageData = {
          image,
          token,
        };
        dispatch<any>(uploadImageAsynThunk(imageData))
          .then((result: any) => {
            sendImageMessage(result?.payload?.data[0]?.path);
          })
          .catch((err: any) => {
            CustomErrorToast(err);
          });
      })
      .catch();
  };

  const micHandler = async () => {
    try {
      const permissionStatus =
        Platform.OS === "ios"
          ? await request("ios.permission.MICROPHONE")
          : await request(PERMISSIONS.ANDROID.RECORD_AUDIO);

      if (
        permissionStatus === RESULTS.BLOCKED ||
        permissionStatus === RESULTS.DENIED
      ) {
        Alert.alert(
          "Microphone Permission Required",
          "This app requires microphone access to function properly. Please enable microphone access in the app settings.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => {
                Linking.openSettings();
              },
            },
          ]
        );
        setIsAudioOpen(false);
      } else if (
        permissionStatus === RESULTS.GRANTED ||
        permissionStatus === RESULTS.UNAVAILABLE
      ) {
        setIsAudioOpen(true);
      }
    } catch (err) {
      null;
    }
  };

  const onEndRecord = async (recordAudio: any) => {
    setIsAudioOpen(false);
    const data = {
      token,
      audio: recordAudio,
    };
    dispatch<any>(uploadAudioAsynThunk(data))
      .unwrap()
      .then((result: any) => {
        sendMessage({ message: result?.data[0]?.path, type: "AUDIO" });
      })
      .catch((err: any) => {
        CustomErrorToast(err.message);
      });
  };

  const userProfile = () => {
    setLoading(true);
    const data = {
      id: props?.route?.params?.profileData?._id,
      token,
    };
    dispatch<any>(getUserProfileAsynThunk(data))
      .unwrap()
      .then((result: any) => {
        setLoading(false);
        props?.navigation?.navigate("USERPROFILE", {
          routeFrom: "Chat",
          profileData: result?.data,
          matchID: props?.route?.params?.matchID,
        });
      })
      .catch((err: any) => {
        setLoading(false);
        CustomErrorToast(err?.message);
      });
  };

  const submitReport = (detail: any) => {
    // setLoading(true);
    const data = {
      reportType: detail?.selectedIssue,
      reason: detail?.description,
      user: props?.route?.params?.profileData?._id,
      token: token,
    };
    dispatch<any>(createReportAsynThunk(data))
      .unwrap()
      .then((response: any) => {
        setLoading(false);
        Alert.alert(response?.message, "", [
          {
            onPress: () => setReportModalVisible(false),
          },
        ]);
      })
      .catch((err: any) => {
        setLoading(false);
        CustomErrorToast(err);
      });
  };

  return (
    <KeyboardAvoidingView style={styles(keyboardStatus).container}>
      <ChatMessages
        messages={messages}
        userImage={props?.route?.params?.profileData?.mainImage}
      />

      {isEmojiModalVisible && (
        <EmojiModal
          onSelect={(item: any) => {
            sendMessage({ message: item?.emoji, type: "TEXT" });
            setEmojiModalVisible(false);
          }}
        />
      )}

      <View style={styles(keyboardStatus, height).bottomCont}>
        <View style={styles().barCont}>
          <Pressable onPress={() => setEmojiModalVisible(!isEmojiModalVisible)}>
            <Image
              source={require("../../assets/emoji.png")}
              style={styles().emoji}
            />
          </Pressable>

          <Pressable onPress={handleImagePick}>
            <Image
              source={require("../../assets/image.png")}
              style={styles().image}
            />
          </Pressable>

          <Pressable style={styles().scopBtn} onPress={userProfile}>
            <Text style={styles().scopeTxt}>View Profile</Text>
          </Pressable>

          <Pressable onPress={() => setReportModalVisible(true)}>
            <Image
              source={require("../../assets/report.png")}
              style={styles().reportIcon}
            />
          </Pressable>
        </View>

        <View style={styles().inputContainer}>
          {isAudioOpen ? (
            <View style={styles(isAudioOpen).inputView}>
              <CustomAudio
                onEndRecord={onEndRecord}
                onStopPlayer={() => setIsAudioOpen(false)}
              />
            </View>
          ) : (
            <View style={styles().inputView}>
              <TextInput
                onFocus={() => setKeyboardStatus("Keyboard Shown")}
                style={styles().input}
                value={inputText}
                placeholderTextColor={Theme.APP_DARK_GREY}
                onChangeText={(text) => setInputText(text)}
                placeholder="Ahoy..."
                autoCorrect={false}
                keyboardType={"ascii-capable"}
                onBlur={() => setKeyboardStatus("Keyboard Hidden")}
              />

              <Pressable onPress={micHandler}>
                <Image
                  source={require("../../assets/audiobtn.png")}
                  style={styles().audioBtn}
                />
              </Pressable>
            </View>
          )}

          <Pressable
            style={styles().sendButton}
            onPress={() => {
              inputText && sendMessage({ message: inputText, type: "TEXT" });
            }}
          >
            <Text style={styles().sendButtonText}>Send</Text>
          </Pressable>
        </View>
      </View>
      <ReportModal
        visible={isReportModalVisible}
        onPress={(detail: any) => {
          setReportModalVisible(false);
          submitReport(detail);
        }}
        onClose={() => setReportModalVisible(false)}
      />
      <Loader isVisible={loading} />
    </KeyboardAvoidingView>
  );
}

const styles = (props?: any, height?: any) =>
  StyleSheet.create({
    headerTitleStyle: {
      fontSize: 19,
      fontFamily: fonts.VarelaRoundRegular,
    },
    container: {
      flexGrow: 1,
    },
    bottomCont: {
      marginBottom:
        Platform.OS == "android"
          ? props == "Keyboard Shown"
            ? height > 800
              ? heightPercentageToDP(45)
              : heightPercentageToDP(36)
            : heightPercentageToDP(0)
          : props == "Keyboard Shown"
          ? height > 670
            ? heightPercentageToDP(34)
            : heightPercentageToDP(33)
          : heightPercentageToDP(1),
      backgroundColor: Theme.APP_BACKGROUND_COLOR,
    },
    barCont: {
      flexDirection: "row",
      height: 44,
      width: widthPercentageToDP(100),
      backgroundColor: Theme.APP_BORDER_GREY,
      alignItems: "center",
      justifyContent: "space-evenly",
      paddingHorizontal: 20,
      shadowColor: Theme.APP_BLACK_COLOR,
      shadowOffset: {
        width: 1,
        height: 0,
      },
      shadowOpacity: 0.5,
      shadowRadius: 2,
      elevation: 3,
    },
    emoji: { top: 1, height: 46, width: 37 },
    image: { top: 2, height: 35, width: 35 },
    scopBtn: {
      backgroundColor: Theme.APP_YELLOW,
      paddingVertical: 6,
      paddingHorizontal: 21,
      shadowColor: Theme.APP_BLACK_COLOR,
      shadowOffset: {
        width: 0.5,
        height: 1,
      },
      shadowOpacity: 0.5,
      shadowRadius: 1,
      elevation: 3,
      borderRadius: 5,
    },
    scopeTxt: {
      color: Theme.APP_WHITE_COLOR,
      fontSize: 15,
      fontFamily: fonts.Questrail,
    },
    reportIcon: { top: 2, height: 35, width: 35 },
    inputContainer: {
      marginVertical: 13,
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "center",
      width: widthPercentageToDP(90),
    },
    inputView: {
      flex: 1,
      paddingHorizontal: 5,
      height: 45,
      borderWidth: 1,
      borderRadius: 50,
      marginRight: props ? 0 : 8,
      marginLeft: props ? 8 : 0,
      borderColor: Theme.APP_BORDER_GREY,
      flexDirection: props ? "row-reverse" : "row",
      alignItems: "center",
    },
    input: {
      flex: 1,
      marginLeft: 5,
      color: Theme.APP_BLACK_COLOR,
    },
    audioBtn: {
      width: 40,
      height: 40,
    },
    sendButton: {
      paddingHorizontal: 16,
      backgroundColor: Theme.APP_RED_COLOR,
      borderRadius: 50,
      height: 45,
      justifyContent: "center",
    },
    sendButtonText: {
      fontSize: 24,
      color: Theme.APP_WHITE_COLOR,
      fontFamily: fonts.VarelaRoundRegular,
      textShadowColor: Theme.APP_BLACK_COLOR,
      textShadowOffset: { width: 0.17, height: 0.17 },
      textShadowRadius: 1,
    },
  });
