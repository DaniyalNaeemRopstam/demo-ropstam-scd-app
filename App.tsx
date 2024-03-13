import { Provider } from "react-redux";
import React, { useEffect, useState } from "react";
import { store } from "./src/redux/app/store";
import SetupScreen from "./src/screens/setup/SetupScreen";
import Splash from "./src/components/modals/Splash";
import { ToastProvider } from "react-native-toast-notifications";
import CustomToast from "./src/components/customToast/CustomToast";
import { getToken } from "./src/helpers/AuthToken";
import {
  saveUser,
  setIsSound,
  setMainImage,
  setMobileToken,
  setPremium,
  setThemeMode,
  setTotalMatches,
  setViewMessageLog,
} from "./src/redux/features/AuthSlice";
import { getProfileAsynThunk } from "./src/redux/features/ProfileSlice";
import messaging from "@react-native-firebase/messaging";
import { AppState, PermissionsAndroid, Platform } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import Error from "./src/components/modals/Error";
import { requestNotifications } from "react-native-permissions";
import { readAllNotificationsAsynThunk } from "./src/redux/features/NotificationSlice";

export default function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [visible, setVisible] = useState(false);
  const { token } = store.getState().login;

  const requestUserPermission = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        // console.log('Authorization status:', authStatus);
      }
    } catch (e) {
      // console.log('request granted no', e);
    }
  };

  const requestPermissionForNotification = async () => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    try {
      const permission = await requestNotifications([
        "alert",
        "badge",
        "sound",
      ]);
      if (permission.status === "granted") {
        // console.log('request granted yes');
      }
    } catch (e) {
      // console.log('request granted no', e);
      // console.log(e);
    }
  };

  const getFcmToken = async () => {
    try {
      const mobileToken = await messaging().getToken();
      // console.log({ mobileToken });
      store.dispatch(setMobileToken(mobileToken));
    } catch {
      // console.error(error);
    }
  };

  const getUserToken = async () => {
    try {
      const token = await getToken();
      if (token) {
        const response = await store
          .dispatch<any>(getProfileAsynThunk(token))
          .unwrap();
        if (response) {
          const data = {
            token: token,
            isLoggedIn: true,
            userID: response?.data?._id,
            userName: response?.data?.userName,
            isProfileComplete: response?.data?.isProfileComplete,
            images: response?.data?.images,
          };
          store.dispatch(saveUser(data));
          store.dispatch(setMainImage(response?.data?.mainImage));
          store.dispatch(setIsSound(response?.data?.isSound));
          store.dispatch(setThemeMode(response?.data?.themeMode));
          store.dispatch(setPremium(response?.data?.isPremium));
          store.dispatch(setTotalMatches(response?.totalMatches));
          store.dispatch(setViewMessageLog(response?.data?.isViewMessageLog));
        }
      }
      setIsSplashVisible(false);
    } catch (error) {
      const data = {
        isLoggedIn: false,
      };
      store.dispatch(saveUser(data));
      setVisible(true);
      setIsSplashVisible(false); // Show error message to the user
      return;
    } finally {
      setIsSplashVisible(false); // Hide splash screen regardless of success or failure
    }
  };

  const checkInternetConnection = async () => {
    const state = await NetInfo.fetch();
    setVisible(!state.isConnected);
    if (state.isConnected) {
      setIsSplashVisible(true);
      Platform.OS === "ios"
        ? requestUserPermission()
        : requestPermissionForNotification();
      getFcmToken();
      getUserToken();
    }
  };

  useEffect(() => {
    // Subscribe
    const unsubscribe = NetInfo.addEventListener(checkInternetConnection);

    // Unsubscribe
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const appStateListener = (nextAppState: any) => {
      if (nextAppState === "active") {
        store
          .dispatch<any>(readAllNotificationsAsynThunk(token))
          .then(() => null)
          .catch(() => {
            setVisible(true);
            return;
          });
      }
    };
    AppState.addEventListener("change", appStateListener);
  }, []);

  return (
    <Provider store={store}>
      {visible ? (
        <Error onPress={checkInternetConnection} />
      ) : (
        <ToastProvider
          placement="top"
          renderType={{
            custom_toast: (toast) => <CustomToast toast={toast} />,
          }}
        >
          {isSplashVisible ? <Splash /> : <SetupScreen />}
        </ToastProvider>
      )}
    </Provider>
  );
}
