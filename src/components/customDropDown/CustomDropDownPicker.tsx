import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Collapsible from "react-native-collapsible";
import Theme from "../../utils/theme";
import fonts from "../../utils/fonts";

interface CustomDropDownPickerProps {
  items: any;
  onValueChange: (e: any) => void;
  isCollapsed: boolean;
  constactSupport?: boolean | undefined;
}

const CustomDropDownPicker = ({
  items,
  onValueChange,
  isCollapsed,
  constactSupport,
}: CustomDropDownPickerProps) => {
  const renderItem = (item: any, index: number) => {
    const lastIndex = items.length - 1;
    const borderRadiusStyle = {
      borderBottomLeftRadius: index === lastIndex ? 10 : 0,
      borderBottomRightRadius: index === lastIndex ? 10 : 0,
      marginBottom: index === lastIndex ? 0 : 5,
    };
    return (
      <TouchableOpacity
        key={index}
        style={[styles(index).listItem, borderRadiusStyle]}
        onPress={() => {
          onValueChange(item);
        }}
      >
        {item?.icon ? (
          <Image
            source={item?.icon}
            style={styles().listItemImg}
            resizeMode="contain"
          />
        ) : (
          <View style={styles().listItemImg} />
        )}

        <Text style={styles(constactSupport).listItemTxt}>{item.label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Collapsible collapsed={isCollapsed} align="bottom" duration={0}>
      <View style={styles().collapseContainer}>
        {items.map((item: any, index: number) => renderItem(item, index))}
      </View>
    </Collapsible>
  );
};

const styles = (props?: any) =>
  StyleSheet.create({
    selectedItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: Theme.APP_RED_COLOR,
      flex: 1,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      paddingHorizontal: 10,
    },
    selectedImg: { width: 23, height: 23, tintColor: Theme.APP_WHITE_COLOR },
    listItem: {
      backgroundColor: Theme.APP_DROP_GREY,
      flexDirection: "row",
      alignItems: "center",
      borderTopLeftRadius: props == 0 ? 10 : 0,
      borderTopRightRadius: props == 0 ? 10 : 0,
      height: 53,
      paddingLeft: 15,
    },
    listItemImg: { width: 23, height: 23, tintColor: Theme.APP_BLACK_COLOR },
    collapseContainer: {
      marginTop: 4,
      backgroundColor: Theme.APP_WHITE_COLOR,
      padding: 5,
      borderRadius: 15,
    },
    listItemTxt: {
      fontSize: 19,
      fontFamily: fonts.Questrail,
      color: Theme.APP_BLACK_COLOR,
      marginLeft: props ? 0 : 15,
    },
  });

export default CustomDropDownPicker;
