import { StyleSheet, Text } from "react-native";
import React from "react";
import Theme from "../../utils/theme";

const NetworkCheck = () => {
  return (
    <Text style={styles.container}>Could not connect to the internet...</Text>
  );
};

export default NetworkCheck;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.APP_RED_COLOR,
    paddingVertical: 30,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
});
