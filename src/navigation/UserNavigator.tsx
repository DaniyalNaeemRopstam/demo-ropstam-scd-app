import { StyleSheet } from "react-native";
import React from "react";
import Home from "../screens/home/Home";
import CustomHomeHeaderLeft from "../components/customHeader/CustomHomeHeaderLeft";
import CustomHeaderSeaCaptain from "../components/customHeader/CustomHeaderSeaCaptain";
import CustomSettingHeader from "../components/customHeader/CustomSettingHeader";
import Settings from "../screens/settings/Settings";
import CustomBackHeader from "../components/customHeader/CustomBackHeader";
import Theme from "../utils/theme";
import fonts from "../utils/fonts";
import Upgrade from "../screens/settings/Upgrade";
import CustomHeader from "../components/customHeader/CustomHeader";
import Beacon from "../screens/home/Beacon";
import Help from "../screens/settings/Help";
import ContactSupport from "../screens/settings/ContactSupport";
import MyProfile from "../screens/profile/MyProfile";
import SetProfileNavigator from "./SetProfileNavigator";
import MyCatches from "../screens/home/MyCatches";
import MyMessages from "../screens/Messages/MyMessages";
import CatchOfDay from "../screens/home/CatchOfDay";
import GameScreen from "../screens/home/GameScreen";
import ProfileDeactivate from "../screens/profile/ProfileDeactivate";
import MessagingLaw from "../screens/Messages/MessagingLaw";
import Chat from "../screens/Messages/Chat";
import UserProfile from "../screens/home/UserProfile";
import GameTheme from "../screens/profile/GameTheme";
import TipsTricks from "../screens/settings/Tips&Tricks";
import StayingSafe from "../screens/settings/StayingSafe";
import { useNavigation } from "@react-navigation/native";
import ThankyouPage from "../screens/settings/ThankyouPage";
import MyTickets from "../screens/settings/MyTickets";
import { createStackNavigator } from "@react-navigation/stack";

export default function UserNavigator(props: any) {
  const Stack = createStackNavigator();
  const navigation = useNavigation();
  return (
    <Stack.Navigator
      initialRouteName="HOMESCREEN"
      screenOptions={{
        headerLeftContainerStyle: { paddingLeft: 10 },
        headerRightContainerStyle: { paddingRight: 10 },
      }}
    >
      <Stack.Screen
        name="HOMESCREEN"
        component={Home}
        initialParams={props.route?.params}
        options={{
          gestureEnabled: false,
          headerTitleAlign: "center",
          headerLeft: () => <CustomHomeHeaderLeft />,
          headerTitle: () => <CustomHeaderSeaCaptain />,
          headerRight: () => <CustomSettingHeader />,
        }}
      />
      <Stack.Screen
        name="SETTINGS"
        component={Settings}
        options={{
          gestureEnabled: false,
          headerTintColor: Theme.APP_RED_COLOR,
          headerTitle: "Settings",
          headerLeft: () => <CustomBackHeader />,
          headerTitleStyle: styles.headerTitleStyle,
          headerTitleAlign: "center",
        }}
      />

      <Stack.Screen
        name="UPGRADE"
        component={Upgrade}
        options={{
          headerTitle: () => <CustomHeader />,
          headerTitleAlign: "center",
          headerLeft: () => <CustomBackHeader />,
          headerRight: () => <CustomSettingHeader />,
        }}
      />
      <Stack.Screen
        name="BEACON"
        component={Beacon}
        options={{
          headerTitle: () => <CustomHeader />,
          headerTitleAlign: "center",
          headerLeft: () => <CustomBackHeader />,
          headerRight: () => <CustomSettingHeader />,
        }}
      />
      <Stack.Screen
        name="HELP"
        component={Help}
        options={{
          headerTintColor: Theme.APP_RED_COLOR,
          headerTitle: "Help",
          headerLeft: () => <CustomBackHeader />,
          headerTitleStyle: styles.headerTitleStyle,
          headerTitleAlign: "center",
          headerRight: () => <CustomSettingHeader />,
        }}
      />
      <Stack.Screen
        name="TIPSTRICKS"
        component={TipsTricks}
        options={{
          headerTintColor: Theme.APP_RED_COLOR,
          headerTitle: "Tips & Tricks",
          headerLeft: () => <CustomBackHeader />,
          headerTitleStyle: styles.headerTitleStyle,
          headerTitleAlign: "center",
          headerRight: () => <CustomSettingHeader />,
        }}
      />
      <Stack.Screen
        name="STAYINGSAFE"
        component={StayingSafe}
        options={{
          headerTintColor: Theme.APP_RED_COLOR,
          headerTitle: "Staying Safe",
          headerLeft: () => <CustomBackHeader />,
          headerTitleStyle: styles.headerTitleStyle,
          headerTitleAlign: "center",
          headerRight: () => <CustomSettingHeader />,
        }}
      />
      <Stack.Screen
        name="CONTACTSUPPORT"
        component={ContactSupport}
        options={{
          headerTintColor: Theme.APP_RED_COLOR,
          headerTitle: "Contact Support",
          headerLeft: () => <CustomBackHeader />,
          headerTitleStyle: styles.headerTitleStyle,
          headerTitleAlign: "center",
          headerRight: () => <CustomSettingHeader />,
        }}
      />
      <Stack.Screen
        name="THANKYOUPAGE"
        component={ThankyouPage}
        options={{
          headerTitleAlign: "center",
          gestureEnabled: false,
          headerTintColor: Theme.APP_RED_COLOR,
          headerTitle: () => <CustomHeader />,
          headerLeft: () => null,
        }}
      />
      <Stack.Screen
        name="MYTICKETS"
        component={MyTickets}
        options={{
          gestureEnabled: false,
          headerTintColor: Theme.APP_RED_COLOR,
          headerTitleAlign: "center",
          headerTitle: () => <CustomHeader />,
          headerLeft: () => <CustomBackHeader />,
        }}
      />
      <Stack.Screen
        name="MYPROFILE"
        component={MyProfile}
        options={{
          headerTintColor: Theme.APP_RED_COLOR,
          headerTitle: "Profile",
          headerLeft: () => <CustomBackHeader />,
          headerTitleStyle: styles.headerTitleStyle,
          headerTitleAlign: "center",
          headerRight: () => <CustomSettingHeader />,
        }}
      />
      <Stack.Screen
        name="MYCATCHES"
        component={MyCatches}
        options={{
          headerTintColor: Theme.APP_RED_COLOR,
          headerTitle: "My Catches",
          headerLeft: () => <CustomBackHeader />,
          headerTitleStyle: styles.headerTitleStyle,
          headerTitleAlign: "center",
          headerRight: () => <CustomSettingHeader />,
        }}
      />
      <Stack.Screen
        name="MESSAGINGLAW"
        component={MessagingLaw}
        options={{
          headerTitle: () => <CustomHeader />,
          headerTitleAlign: "center",
          headerLeft: () => <CustomBackHeader />,
          headerRight: () => <CustomSettingHeader />,
        }}
      />
      <Stack.Screen
        name="MYMESSAGES"
        component={MyMessages}
        options={{
          headerTintColor: Theme.APP_RED_COLOR,
          headerTitle: "My Messages",
          headerLeft: () => <CustomBackHeader />,
          headerTitleStyle: styles.headerTitleStyle,
          headerTitleAlign: "center",
          headerRight: () => <CustomSettingHeader />,
        }}
      />
      <Stack.Screen
        name="CHAT"
        component={Chat}
        options={{
          headerTintColor: Theme.APP_RED_COLOR,
          headerLeft: () => <CustomBackHeader />,
          headerTitleAlign: "center",
          headerRight: () => <CustomSettingHeader />,
        }}
      />
      <Stack.Screen
        name="CATCHOFDAY"
        component={CatchOfDay}
        options={{
          headerTintColor: Theme.APP_RED_COLOR,
          headerTitle: "Catch of the Day",
          headerLeft: () => <CustomBackHeader />,
          headerTitleStyle: styles.headerTitleStyle,
          headerTitleAlign: "center",
          headerRight: () => <CustomSettingHeader />,
        }}
      />
      <Stack.Screen
        name="GAMESCREEN"
        component={GameScreen}
        options={{
          gestureEnabled: false,
          headerLeft: () => (
            <CustomBackHeader
              onPress={() => {
                navigation.reset({
                  index: 0,
                  routes: [
                    { name: "HOMESCREEN", params: { routeFrom: "GAMESCREEN" } },
                  ],
                });
              }}
            />
          ),
          headerTitle: () => <CustomHeaderSeaCaptain />,
          headerTitleAlign: "center",
          headerRight: () => <CustomSettingHeader />,
        }}
      />

      <Stack.Screen
        name="USERPROFILE"
        component={UserProfile}
        options={{ presentation: "modal", headerShown: false }}
      />

      <Stack.Screen
        name="PROFILEDEACTIVATE"
        component={ProfileDeactivate}
        options={{
          headerTintColor: Theme.APP_RED_COLOR,
          headerTitle: "Profile",
          headerLeft: () => <CustomBackHeader />,
          headerTitleStyle: styles.headerTitleStyle,
          headerTitleAlign: "center",
          headerRight: () => <CustomSettingHeader />,
        }}
      />
      <Stack.Screen
        name="GAMETHEME"
        component={GameTheme}
        options={{
          headerTintColor: Theme.APP_RED_COLOR,
          headerTitle: "Profile",
          headerLeft: () => <CustomBackHeader />,
          headerTitleStyle: styles.headerTitleStyle,
          headerTitleAlign: "center",
          headerRight: () => <CustomSettingHeader />,
        }}
      />
      <Stack.Screen
        name="PROFILENAVIGATOR"
        component={SetProfileNavigator}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerTitleStyle: {
    fontSize: 19,
    fontFamily: fonts.VarelaRoundRegular,
  },
});
