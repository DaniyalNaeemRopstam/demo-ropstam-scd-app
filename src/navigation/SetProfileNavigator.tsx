import { StyleSheet } from "react-native";
import React from "react";
import SelectGender from "../screens/profile/SelectGender";
import Theme from "../utils/theme";
import fonts from "../utils/fonts";
import SetAge from "../screens/profile/SetAge";
import CustomBackHeader from "../components/customHeader/CustomBackHeader";
import Interests from "../screens/profile/Interests";
import MatchingSettings from "../screens/profile/MatchingSettings";
import SetName from "../screens/profile/SetName";
import ProfilePic from "../screens/profile/ProfilePic";
import AboutMe from "../screens/profile/AboutMe";
import MatchingPreference from "../screens/profile/MatchingPreference";
import IceBreaker from "../screens/profile/IceBreaker";
import SkipButton from "../components/buttons/SkipButton";
import CustomHeader from "../components/customHeader/CustomHeader";
import OnBoarding from "../screens/onBoarding/OnBoarding";
import UserNavigator from "./UserNavigator";
import { CommonActions, useNavigation } from "@react-navigation/native";
import WorkEducation from "../screens/profile/WorkEducation";
import Habits from "../screens/profile/Habits";
import { createStackNavigator } from "@react-navigation/stack";

export default function SetProfileNavigator(props: any) {
  const navigation = useNavigation();
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerLeftContainerStyle: { paddingLeft: 10 },
        headerRightContainerStyle: { paddingRight: 10 },
      }}
    >
      <Stack.Screen
        name="SELECTGENDER"
        component={SelectGender}
        options={{
          headerTintColor: Theme.APP_RED_COLOR,
          headerTitle: "About Me",

          headerTitleStyle: styles.headerTitleStyle,
          headerTitleAlign: "center",
          headerLeft: () =>
            props?.route?.params?.params?.routeFrom ? (
              <CustomBackHeader />
            ) : null,
        }}
      />
      <Stack.Screen
        name="SETAGE"
        component={SetAge}
        options={{
          headerTintColor: Theme.APP_RED_COLOR,
          headerTitle: "About Me",
          headerLeft: () => <CustomBackHeader />,
          headerTitleStyle: styles.headerTitleStyle,
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="INTERESTS"
        component={Interests}
        options={{
          headerTintColor: Theme.APP_RED_COLOR,
          headerTitle: "About Me",
          headerLeft: () => <CustomBackHeader />,
          headerTitleStyle: styles.headerTitleStyle,
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="MATCHINGSETTINGS"
        component={MatchingSettings}
        options={{
          headerTintColor: Theme.APP_RED_COLOR,
          headerTitle: "Matching",
          headerLeft: () => <CustomBackHeader />,
          headerTitleStyle: styles.headerTitleStyle,
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="SETNAME"
        component={SetName}
        options={{
          headerTintColor: Theme.APP_RED_COLOR,
          headerTitle: "About Me",
          headerLeft: () => <CustomBackHeader />,
          headerTitleStyle: styles.headerTitleStyle,
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="PROFILEPIC"
        component={ProfilePic}
        options={{
          headerTintColor: Theme.APP_RED_COLOR,
          headerTitle: "About Me",
          headerLeft: () => <CustomBackHeader />,
          headerTitleStyle: styles.headerTitleStyle,
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="ABOUTME"
        component={AboutMe}
        options={{
          headerTintColor: Theme.APP_RED_COLOR,
          headerTitle: "About Me",
          headerLeft: () => <CustomBackHeader />,
          headerTitleStyle: styles.headerTitleStyle,
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="MATCHINGPREFERENCE"
        component={MatchingPreference}
        options={{
          headerTintColor: Theme.APP_RED_COLOR,
          headerTitle: "Matching",
          headerLeft: () => <CustomBackHeader />,
          headerTitleStyle: styles.headerTitleStyle,
          headerTitleAlign: "center",
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="HABITS"
        component={Habits}
        options={{
          headerTintColor: Theme.APP_RED_COLOR,
          headerTitle: "Habits",
          headerLeft: () => <CustomBackHeader />,
          headerTitleStyle: styles.headerTitleStyle,
          headerTitleAlign: "center",
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="WORKEDUCATION"
        component={WorkEducation}
        options={{
          headerTintColor: Theme.APP_RED_COLOR,
          headerTitle: "About Me",
          headerLeft: () => <CustomBackHeader />,
          headerTitleStyle: styles.headerTitleStyle,
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="ICEBREAKER"
        component={IceBreaker}
        options={{
          headerTintColor: Theme.APP_RED_COLOR,
          headerTitle: "Ice Breakers",
          headerLeft: () => <CustomBackHeader />,
          headerTitleStyle: styles.headerTitleStyle,
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="ONBOARDING"
        component={OnBoarding}
        options={{
          headerLeft: () => <CustomBackHeader />,
          headerTitle: () => <CustomHeader />,
          headerTitleAlign: "center",
          headerRight: () => (
            <SkipButton
              onPress={() => {
                if (props?.route?.params?.params?.routeFrom == "SETTINGS") {
                  props?.navigation?.goBack();
                } else {
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [
                        {
                          name: "USERNAVIGATOR",
                          state: {
                            index: 0,
                            routes: [
                              {
                                name: "HOMESCREEN",
                                params: {
                                  routeFrom: "SIGNUP",
                                },
                              },
                            ],
                          },
                        },
                      ],
                    })
                  );
                }
              }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="USERNAVIGATOR"
        component={UserNavigator}
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
