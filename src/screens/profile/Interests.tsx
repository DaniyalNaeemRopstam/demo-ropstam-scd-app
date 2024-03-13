import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import fonts from "../../utils/fonts";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Theme from "../../utils/theme";
import ContinueButton from "../../components/buttons/ContinueButton";
import CustomButton from "../../components/buttons/CutomButton";
import { createProfileAsynThunk } from "../../redux/features/ProfileSlice";
import { excludeUnUsedkeysFromUserObj } from "../../helpers/Common";
import Loader from "../../components/loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { CustomErrorToast } from "../../helpers/CustomToast";

export default function Interests(props: any) {
  const userData = props?.route?.params;
  const routeFrom = props?.route?.params?.routeFrom;
  const initialItemsToShow = 16; // Number of items to display initially
  const [itemsToShow, setItemsToShow] = useState(initialItemsToShow);
  const [showErr, setShowErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [maxSix, setMaxSix] = useState(false);
  const [interests, setInterests] = useState([
    { name: "Windsurfing", selected: false },
    { name: "Scuba Diving", selected: false },
    { name: "Surfing", selected: false },
    { name: "Snorkeling", selected: false },
    { name: "Fishing", selected: false },
    { name: "Shipbuilding", selected: false },
    { name: "Cruising", selected: false },
    { name: "Parasailing", selected: false },
    { name: "Reading", selected: false },
    { name: "Nautical History", selected: false },
    { name: "Photography", selected: false },
    { name: "Music", selected: false },
    { name: "Dancing", selected: false },
    { name: "Swimming", selected: false },
    { name: "Birdwatching", selected: false },
    { name: "Sailing", selected: false },
    { name: "Boating", selected: false },
    { name: "Kayaking/Canoeing", selected: false },
    { name: "Jet Skiing", selected: false },
    { name: "Yachting", selected: false },
    { name: "Rowing", selected: false },
    { name: "Water Skiing", selected: false },
    { name: "Writing", selected: false },
    { name: "Painting", selected: false },
    { name: "Cooking", selected: false },
    { name: "Gardening", selected: false },
    { name: "Hiking", selected: false },
    { name: "Animals", selected: false },
    { name: "Travel", selected: false },
    { name: "Yoga", selected: false },
    { name: "Fitness", selected: false },
    { name: "Sports", selected: false },
    { name: "Cycling", selected: false },
    { name: "Running", selected: false },
    { name: "Gaming", selected: false },
    { name: "Film", selected: false },
    { name: "Meditation", selected: false },
    { name: "Woodworking", selected: false },
    { name: "Wine Tasting", selected: false },
    { name: "Astronomy", selected: false },
  ]);
  const token = useSelector((state: any) => state?.login?.token);
  const dispatch = useDispatch();

  useEffect(() => {
    if (props?.route?.params?.userInfo?.interests) {
      const userInterests = props.route.params.userInfo.interests;

      // Create a new interests array with selected values updated
      const updatedInterests = interests.map((interest) => {
        if (userInterests.includes(interest.name)) {
          // If the interest name is in the user's interests, set selected to true
          return { ...interest, selected: true };
        } else {
          // Otherwise, keep the selected as false
          return { ...interest, selected: false };
        }
      });

      // Set the updated interests array to state
      setInterests(updatedInterests);
    }
  }, []);

  const handleChipPress = (index: number) => {
    const selectedInterestsCount = interests.filter(
      (item) => item.selected
    ).length;

    if (selectedInterestsCount >= 6 && !interests[index].selected) {
      // Limit of 6 interests reached, prevent selection
      setMaxSix(true);
      return;
    }
    const updatedInterests = interests.map((item, i) => {
      if (i === index) {
        setMaxSix(false);
        setShowErr(false);
        return { ...item, selected: !item.selected };
      } else {
        return item;
      }
    });
    setInterests(updatedInterests);
  };

  const handleLoadMore = () => {
    // Increase the count of displayed items when "Load More" is pressed
    setItemsToShow(interests.length);
  };

  const handlePress = () => {
    const atLeastOneSelected = interests.some((interest) => interest.selected);
    if (atLeastOneSelected) {
      const selectedInterests = interests
        .filter((interest) => interest?.selected)
        .map((interest) => interest.name);

      const updatedUserData = {
        ...userData,
        interests: selectedInterests,
      };
      props.navigation.navigate("MATCHINGSETTINGS", updatedUserData);
    } else {
      setShowErr(true);
    }
  };

  const onUpdate = () => {
    setLoading(true);
    const selectedInterests = interests
      .filter((interest) => interest?.selected)
      .map((interest) => interest.name);

    const updatedUserData = {
      ...excludeUnUsedkeysFromUserObj(props?.route?.params?.userInfo),
      interests: selectedInterests,
      token: token,
    };

    dispatch<any>(createProfileAsynThunk(updatedUserData))
      .unwrap()
      .then(() => {
        setLoading(false);
        props?.navigation?.goBack();
      })
      .catch((err: any) => {
        setLoading(false);
        CustomErrorToast(err);
      });
  };

  return (
    <View style={styles().mainCont}>
      <Text style={styles().txt1}>What are your interests?</Text>

      <ScrollView
        style={styles(itemsToShow < interests.length).chipScrollStyle}
        contentContainerStyle={styles().chipsWrapper}
        showsVerticalScrollIndicator={false}
      >
        {interests.map((item, index) => {
          if (index < itemsToShow) {
            return (
              <Pressable
                key={index}
                onPress={() => handleChipPress(index)}
                style={styles(item.selected).chipCont}
              >
                <Text
                  style={
                    item.selected ? styles().selectedChipTxt : styles().chipTxt
                  }
                >
                  {item?.name}
                </Text>
              </Pressable>
            );
          }
        })}
      </ScrollView>

      {itemsToShow < interests.length && (
        <CustomButton
          BtnContstyle={styles().seeMoreBtn}
          onPress={handleLoadMore}
          text={"See More"}
          textStyle={styles().seeMoreTxt}
        />
      )}
      {showErr && (
        <Text style={styles().errtxt}>Please select at least one interest</Text>
      )}
      {maxSix && (
        <Text style={styles().errtxt}>
          Maximum six interests can be selected
        </Text>
      )}

      {routeFrom == "MYPROFILE" ? (
        <View style={styles().btnCont}>
          <CustomButton
            BtnContstyle={styles().customBtnStyle}
            text="Update"
            textStyle={styles().btnTxt}
            onPress={onUpdate}
          />
        </View>
      ) : (
        <ContinueButton onPress={handlePress} />
      )}
      <Loader isVisible={loading} />
    </View>
  );
}

const styles = (props?: boolean) =>
  StyleSheet.create({
    mainCont: { alignItems: "center", flex: 1 },
    txt1: {
      fontFamily: fonts.VarelaRoundRegular,
      fontSize: 20,
      marginTop: 17,
      color: Theme.APP_BLACK_COLOR,
    },
    chipScrollStyle: {
      maxHeight: props ? heightPercentageToDP(40) : heightPercentageToDP(60),
      marginTop: 10,
    },
    chipsWrapper: {
      flexWrap: "wrap",
      width: widthPercentageToDP(90),
      flexDirection: "row",
    },
    flatListCont: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    chipTxt: {
      fontFamily: fonts.RobotoBold,
      fontSize: 13,
      color: Theme.APP_BLACK_COLOR,
      fontWeight: "500",
    },
    selectedChipTxt: {
      fontFamily: fonts.RobotoBold,
      fontSize: 13,
      color: Theme.APP_WHITE_COLOR,
      fontWeight: "500",
    },
    chipCont: {
      borderRadius: 50,
      borderWidth: 2,
      borderColor: props ? Theme.APP_RED_COLOR : Theme.APP_BORDER_GREY,
      margin: 3.5,
      height: 38,
      paddingHorizontal: 17,
      backgroundColor: props ? Theme.APP_RED_COLOR : Theme.APP_WHITE_COLOR,
      alignItems: "center",
      justifyContent: "center",
    },

    seeMoreBtn: {
      backgroundColor: Theme.APP_LIGHT_BLUE,
      height: 44,
      width: widthPercentageToDP(50),
      borderRadius: 8,
      marginTop: 40,
      shadowColor: Theme.APP_BLACK_COLOR,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      justifyContent: "center",
    },
    seeMoreTxt: {
      color: Theme.APP_WHITE_COLOR,
      fontSize: 20,
      fontFamily: fonts.VarelaRoundRegular,
      textAlign: "center",
    },
    errtxt: {
      top: 10,
      color: Theme.APP_RED_COLOR,
      fontSize: 14,
      fontFamily: fonts.RobotoRegular,
    },
    btnCont: {
      position: "absolute",
      bottom:
        Platform.OS == "android"
          ? heightPercentageToDP(5)
          : heightPercentageToDP(8),
      alignItems: "center",
    },
    customBtnStyle: {
      backgroundColor: Theme.APP_RED_COLOR,
      width: widthPercentageToDP(90),
      height: 63,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: Theme.APP_BLACK_COLOR,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    btnTxt: {
      color: Theme.APP_WHITE_COLOR,
      fontFamily: fonts.VarelaRoundRegular,
      fontSize: 24,
    },
  });
