import React from "react";
import WelcomeScreen from "../screens/auth/WelcomeScreen";
import SignUp from "../screens/auth/SignUp";
import LoginScreen from "../screens/auth/LoginScreen";
import CustomBackHeader from "../components/customHeader/CustomBackHeader";
import CustomHeader from "../components/customHeader/CustomHeader";
import Email from "../screens/auth/Email";
import Phone from "../screens/auth/Phone";
import ForgotPssword from "../screens/auth/ForgotPssword";
import EnterOtp from "../screens/auth/EnterOtp";
import SetPassword from "../screens/auth/SetPassword";
import ResetPassword from "../screens/auth/ResetPassword";
import { createStackNavigator } from "@react-navigation/stack";

export default function AuthNavigator() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerLeftContainerStyle: { paddingLeft: 10 },
        headerRightContainerStyle: { paddingRight: 10 },
      }}
    >
      <Stack.Screen
        name="WELCOMESCREEN"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="SIGNUPSCREEN"
        component={SignUp}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LOGINSCREEN"
        component={LoginScreen}
        options={{
          headerLeft: () => <CustomBackHeader />,
          headerTitle: () => <CustomHeader />,
          headerTitleAlign: "center",
        }}
      />

      <Stack.Screen
        name="ENTEREMAIL"
        component={Email}
        options={{
          headerLeft: () => <CustomBackHeader />,
          headerTitle: () => <CustomHeader />,
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="ENTERPHONE"
        component={Phone}
        options={{
          headerLeft: () => <CustomBackHeader />,
          headerTitle: () => <CustomHeader />,
          headerTitleAlign: "center",
        }}
      />

      <Stack.Screen
        name="FORGOTPASSWORD"
        component={ForgotPssword}
        options={{
          headerLeft: () => <CustomBackHeader />,
          headerTitle: () => <CustomHeader />,
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="ENTEROTP"
        component={EnterOtp}
        options={{
          headerLeft: () => <CustomBackHeader />,
          headerTitle: () => <CustomHeader />,
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="SETPASSWORD"
        component={SetPassword}
        options={{
          headerLeft: () => <CustomBackHeader />,
          headerTitle: () => <CustomHeader />,
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="RESETPASSWORD"
        component={ResetPassword}
        options={{
          headerLeft: () => <CustomBackHeader />,
          headerTitle: () => <CustomHeader />,
          headerTitleAlign: "center",
        }}
      />
    </Stack.Navigator>
  );
}
