import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Image,
  Pressable,
  Platform,
} from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import fonts from "../../utils/fonts";
import { countriesArr } from "./Countries";
import Theme from "../../utils/theme";

export interface countryModTypes {
  visible?: boolean;
  setPhoneCode?: (e: string) => void;
  setFlag?: (e: string) => void;
  setCountryCode?: (e: string) => void;
  setVisible: (e: boolean) => void;
}

export const CountryPickerMod: React.FC<countryModTypes> = ({
  visible,
  setVisible,
  setPhoneCode,
  setFlag,
  setCountryCode,
}) => {
  const [allCountries] = useState(countriesArr);
  const [countries, setCountries] = useState(allCountries);

  async function onCodePress(item: any) {
    if (setPhoneCode && item?.phoneCode) setPhoneCode("+" + item?.phoneCode);
    if (setFlag && item?.flag) setFlag(item?.flag);
    if (setCountryCode && item?.code) setCountryCode(item?.code);
    setCountries(allCountries);
    setVisible(false);
  }
  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => {
        onCodePress(item);
      }}
      style={styles.flagCont}
    >
      <Text style={styles.body}>{item?.flag}</Text>
      <Text style={styles.code}>+{item?.phoneCode}</Text>
      <Text style={styles.title}>{item?.name}</Text>
    </TouchableOpacity>
  );

  async function onSearch(name: string) {
    const nam = name?.toLowerCase();
    const filter = await allCountries?.filter(
      (e: any) =>
        e?.name?.toLowerCase()?.includes(nam) ||
        name?.includes(e?.name ? e?.name?.toLowerCase() : ".") ||
        name?.includes(e?.phoneCode ? e?.phoneCode : ".") ||
        e?.phoneCode?.includes(nam)
    );
    setCountries(filter);
  }
  return (
    <Modal visible={visible}>
      <View style={styles.mainCont}>
        <Pressable
          style={styles.closeCont}
          onPress={() => {
            setCountries(allCountries);
            setVisible(false);
          }}
        >
          <Image
            source={require("../../assets/cross.png")}
            style={styles.closeImg}
          />
        </Pressable>
        <TextInput
          onChangeText={(e: any) => {
            onSearch(e);
          }}
          style={styles.inp}
          placeholder="Search"
        />
        {countries.length > 0 ? (
          <FlatList
            data={countries}
            renderItem={renderItem}
            initialNumToRender={15}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flatCont}
          />
        ) : (
          <View style={styles.noCountryCont}>
            <Text style={styles.title}>No country found</Text>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  mainCont: {
    flex: 1,
    alignItems: "center",
  },
  closeCont: {
    padding: 5,
    marginTop:
      Platform.OS == "android"
        ? heightPercentageToDP(2)
        : heightPercentageToDP(6),
    alignSelf: "flex-end",
    right: widthPercentageToDP(5),
  },
  closeImg: { width: 20, height: 20, tintColor: Theme.APP_BLACK_COLOR },
  inp: {
    marginTop: 10,
    height: 52,
    fontSize: 19,
    width: widthPercentageToDP(90),
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 3,
    borderColor: Theme.APP_BORDER_GREY,
    backgroundColor: Theme.APP_WHITE_COLOR,
    fontFamily: fonts.RobotoRegular,
    color: Theme.APP_BLACK_COLOR,
  },
  flatCont: { alignItems: "center" },
  flagCont: {
    flexDirection: "row",
    alignItems: "center",
    height: 45,
    marginBottom: 5,
    width: widthPercentageToDP(90),
  },
  title: {
    fontSize: 16,
    color: Theme.APP_BLACK_COLOR,
    fontFamily: fonts.RobotoRegular,
  },
  body: {
    fontFamily: fonts.RobotoRegular,
    fontSize: 20,
    color: Theme.APP_BLACK_COLOR,
    marginRight: 5,
  },
  code: {
    fontFamily: fonts.RobotoRegular,
    fontSize: 16,
    color: Theme.APP_BLACK_COLOR,
    marginRight: 5,
  },
  noCountryCont: { flex: 1, justifyContent: "center" },
});
