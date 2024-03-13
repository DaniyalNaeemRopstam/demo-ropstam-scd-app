import React, { useEffect, useRef } from "react";
import Navigation from "../../navigation/Navigation";
import { Platform, StatusBar, StyleSheet } from "react-native";
import Theme from "../../utils/theme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import messaging from "@react-native-firebase/messaging";
import { useToast } from "react-native-toast-notifications";
import { NavigationContainerRef } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { useDispatch, useSelector } from "react-redux";
import CustomSoundPlayer from "../../components/customAudio/CustomSoundPlayer";
import { setTotalMatches } from "../../redux/features/AuthSlice";

export default function SetupScreen() {
  const toast = useToast();
  const navigationRef = useRef<NavigationContainerRef<any>>(null);
  const { isSound, chatID, totalMatches } = useSelector(
    (state: any) => state.login
  );
  const dispatch = useDispatch();
  useEffect(() => {
    messaging().onNotificationOpenedApp((remoteMessage) => {
      remoteMessage?.data?.status == "MESSAGE"
        ? navigationRef?.current?.navigate("MYMESSAGES")
        : navigationRef?.current?.navigate("MYCATCHES");
    });

    if (Platform.OS == "ios") {
      PushNotificationIOS.getApplicationIconBadgeNumber((badgenumber) => {
        PushNotificationIOS.setApplicationIconBadgeNumber(badgenumber);
      });
    }

    messaging().setBackgroundMessageHandler(async () => {
      isSound && CustomSoundPlayer("notification_sfx.mp3");
      let count = await AsyncStorage.getItem("badgeCount");

      // Check if count is null
      if (count === null) {
        count = "0"; // Default to "0" or any other default value
      }

      await AsyncStorage.setItem("badgeCount", count.toString());

      if (Platform.OS == "ios") {
        // PushNotificationIOS.getDeliveredNotifications((remoteNotifciation) =>
        //   PushNotificationIOS.setApplicationIconBadgeNumber(
        //     remoteNotifciation.length
        //   )
        // );
        PushNotificationIOS.getApplicationIconBadgeNumber((badgenumber) => {
          PushNotificationIOS.setApplicationIconBadgeNumber(badgenumber);
        });
      }
    });

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      isSound && CustomSoundPlayer("notification_sfx.mp3");

      if (
        remoteMessage?.data?.status == "MATCHED" ||
        remoteMessage?.data?.status == "HARPOON"
      ) {
        dispatch(setTotalMatches(totalMatches + 1));
      }

      if (chatID != remoteMessage?.data?.chatID) {
        toast.show("custom_toast", {
          type: "custom_toast",
          duration: 5000,
          data: {
            title: remoteMessage?.notification?.title,
            message: remoteMessage?.notification?.body,
            // text: remoteMessage?.data?.userName,
            image:
              remoteMessage?.data?.status == "MESSAGE"
                ? require("../../assets/toastMessage.png")
                : remoteMessage?.data?.status == "HARPOON"
                ? require("../../assets/toastHarpoon.png")
                : require("../../assets/catchIcon.png"),
          },

          onPress: () => {
            if (remoteMessage?.data?.status == "MESSAGE") {
              const userData = {
                userID: remoteMessage?.data?.userID,
                userName: remoteMessage?.data?.userName,
                mainImage: remoteMessage?.data?.mainImage,
              };
              navigationRef?.current?.navigate("CHAT", {
                profileData: userData,
                chatID: remoteMessage?.data?.chatID,
                matchID: remoteMessage?.data?.matchID,
              });
            } else {
              navigationRef?.current?.navigate("MYCATCHES");
            }
          },
        });
      }
    });

    return unsubscribe;
  }, [chatID]);

  return (
    <GestureHandlerRootView style={styles.mainCont}>
      <StatusBar
        backgroundColor={Theme.APP_WHITE_COLOR}
        barStyle={"dark-content"}
      />

      <Navigation navigationRef={navigationRef} />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  mainCont: { flex: 1 },
});
