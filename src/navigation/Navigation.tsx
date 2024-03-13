import React from "react";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { useSelector } from "react-redux";
import Theme from "../utils/theme";
import SetProfile from "./SetProfileNavigator";
import AuthNavigator from "./AuthNavigator";
import UserNavigator from "./UserNavigator";

interface NavigationProps {
  navigationRef: any;
}

export default function Navigation({ navigationRef }: NavigationProps) {
  const { isLoggedIn, isProfileComplete } = useSelector(
    (state: any) => state.login
  );

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: Theme.APP_BACKGROUND_COLOR,
    },
  };

  return (
    <NavigationContainer theme={MyTheme} ref={navigationRef}>
      {isLoggedIn && isProfileComplete ? (
        <UserNavigator />
      ) : isLoggedIn && !isProfileComplete ? (
        <SetProfile />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}
