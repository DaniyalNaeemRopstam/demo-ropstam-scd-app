import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import CustomButton from "../../components/buttons/CutomButton";
import Theme from "../../utils/theme";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import fonts from "../../utils/fonts";
import { useDispatch, useSelector } from "react-redux";
import { CustomErrorToast } from "../../helpers/CustomToast";
import Loader from "../../components/loader/Loader";
import { getProfileAsynThunk } from "../../redux/features/ProfileSlice";
import { useFocusEffect } from "@react-navigation/native";

export default function MyProfile(props: any) {
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, isPremium, mainImage } = useSelector(
    (state: any) => state?.login
  );
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState<any>({});

  const getUserInfo = async () => {
    setLoading(true);
    dispatch<any>(getProfileAsynThunk(token))
      .unwrap()
      .then((response: any) => {
        setLoading(false);
        setUserInfo(response.data);
        setInterests(response.data?.interests);
      })
      .catch((err: any) => {
        setLoading(false);
        CustomErrorToast(err);
      });
  };

  useFocusEffect(
    useCallback(() => {
      getUserInfo();
    }, [])
  );

  return (
    <ScrollView
      bounces={false}
      style={styles.mainStyle}
      contentContainerStyle={styles.mainCont}
      showsVerticalScrollIndicator={false}
    >
      <Pressable
        style={styles.profilePicCont}
        onPress={() =>
          props?.navigation?.navigate("PROFILENAVIGATOR", {
            screen: "PROFILEPIC",
            params: { routeFrom: "MYPROFILE", userInfo: userInfo },
          })
        }
      >
        <View style={styles.profilePicInnerCont}>
          <Image
            source={{ uri: mainImage }}
            style={styles.profileImg}
            // resizeMode="cover"
          />
        </View>
        <Text style={styles.profileTxt}>Edit Profile Picture</Text>
        <Image
          source={require("../../assets/issueError.png")}
          style={styles.arrow}
          resizeMode="contain"
        />
      </Pressable>

      <Pressable
        style={styles.profilePicCont1}
        onPress={() =>
          props?.navigation?.navigate("PROFILENAVIGATOR", {
            screen: "SETNAME",
            params: { routeFrom: "MYPROFILE", userInfo: userInfo },
          })
        }
      >
        <View>
          <Text style={styles.txt1}>{userInfo?.userName}</Text>
          <Text style={styles.editTxt}>Edit Name</Text>
        </View>
        <Image
          source={require("../../assets/issueError.png")}
          style={styles.arrow}
          resizeMode="contain"
        />
      </Pressable>

      <Pressable
        style={styles.profilePicCont1}
        onPress={() =>
          props?.navigation?.navigate("PROFILENAVIGATOR", {
            screen: "ABOUTME",
            params: { routeFrom: "MYPROFILE", userInfo: userInfo },
          })
        }
      >
        <View style={styles.bioTxtCont}>
          <Text style={styles.txt1}>{userInfo?.description}</Text>
          <Text style={styles.editTxt}>Edit Bio</Text>
        </View>
        <Image
          source={require("../../assets/issueError.png")}
          style={styles.arrow}
          resizeMode="contain"
        />
      </Pressable>

      <Pressable
        style={styles.profilePicCont1}
        onPress={() =>
          props?.navigation?.navigate("PROFILENAVIGATOR", {
            screen: "MATCHINGPREFERENCE",
            params: { routeFrom: "MYPROFILE", userInfo: userInfo },
          })
        }
      >
        <View>
          <Text style={styles.txt1}>Match Preferences</Text>
          <Text style={styles.editTxt}>Range, Smoke, Drink</Text>
        </View>
        <Image
          source={require("../../assets/issueError.png")}
          style={styles.arrow}
          resizeMode="contain"
        />
      </Pressable>

      <Pressable
        style={styles.profilePicCont1}
        onPress={() =>
          props?.navigation?.navigate("PROFILENAVIGATOR", {
            screen: "SELECTGENDER",
            params: { routeFrom: "MYPROFILE", userInfo: userInfo },
          })
        }
      >
        <View>
          <Text style={styles.txt1}>Gender / Seeking</Text>
          <Text style={styles.editTxt}>
            {`${userInfo?.gender?.replaceAll(
              "_",
              " "
            )} / ${userInfo?.seeking?.replaceAll("_", " ")}`}
          </Text>
        </View>
        <Image
          source={require("../../assets/issueError.png")}
          style={styles.arrow}
          resizeMode="contain"
        />
      </Pressable>

      <Pressable
        style={styles.profilePicCont1}
        onPress={() =>
          props?.navigation?.navigate("PROFILENAVIGATOR", {
            screen: "ICEBREAKER",
            params: { routeFrom: "MYPROFILE", userInfo: userInfo },
          })
        }
      >
        <View>
          <Text style={styles.txt1}>Ice Breakers</Text>
          {/* <Text style={styles.editTxt}>Account Deactivation and Deletion</Text> */}
        </View>
        <Image
          source={require("../../assets/issueError.png")}
          style={styles.arrow}
          resizeMode="contain"
        />
      </Pressable>

      <Pressable
        style={styles.profilePicCont1}
        onPress={() =>
          props?.navigation?.navigate("PROFILENAVIGATOR", {
            screen: "MATCHINGSETTINGS",
            params: { routeFrom: "MYPROFILE", userInfo: userInfo },
          })
        }
      >
        <View>
          <Text style={styles.txt1}>City, Country</Text>
          <Text style={styles.editTxt}>Edit Location</Text>
        </View>
        <Image
          source={require("../../assets/issueError.png")}
          style={styles.arrow}
          resizeMode="contain"
        />
      </Pressable>

      <Pressable
        style={styles.profilePicCont1}
        onPress={() =>
          props?.navigation?.navigate("PROFILENAVIGATOR", {
            screen: "WORKEDUCATION",
            params: { routeFrom: "MYPROFILE", userInfo: userInfo },
          })
        }
      >
        <View>
          <Text style={styles.txt1}>Work, Education</Text>
          <Text style={styles.editTxt}>Edit Work & Education</Text>
        </View>
        <Image
          source={require("../../assets/issueError.png")}
          style={styles.arrow}
          resizeMode="contain"
        />
      </Pressable>

      <Pressable
        style={styles.profilePicCont1}
        onPress={() =>
          props?.navigation?.navigate("GAMETHEME", { userInfo: userInfo })
        }
      >
        <View>
          <Text style={styles.txt1}>Day / Night mode</Text>
          <Text style={styles.editTxt}>App Theme</Text>
        </View>
        <Image
          source={require("../../assets/issueError.png")}
          style={styles.arrow}
          resizeMode="contain"
        />
      </Pressable>

      <Pressable
        style={styles.profilePicCont1}
        onPress={() =>
          props?.navigation?.navigate("PROFILENAVIGATOR", {
            screen: "INTERESTS",
            params: { routeFrom: "MYPROFILE", userInfo: userInfo },
          })
        }
      >
        <View>
          <Text style={styles.txt1}>My Interests</Text>
          <View style={styles.interestsContainer}>
            {interests?.map((item, index) => (
              <View style={styles.chipCont} key={index}>
                <Text style={styles.selectedChipTxt}>{item}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.editTxt}>Edit Interests</Text>
        </View>
        <Image
          source={require("../../assets/issueError.png")}
          style={styles.arrow}
          resizeMode="contain"
        />
      </Pressable>

      <Pressable
        style={styles.profilePicCont1}
        onPress={() => props?.navigation?.navigate("PROFILEDEACTIVATE")}
      >
        <View>
          <Text style={styles.txt1}>Deactivation / Deletion</Text>
          {/* <Text style={styles.editTxt}>Account Deactivation and Deletion</Text> */}
        </View>
        <Image
          source={require("../../assets/issueError.png")}
          style={styles.arrow}
          resizeMode="contain"
        />
      </Pressable>
      {!isPremium && (
        <CustomButton
          BtnContstyle={styles.customBtnStyle}
          text="Upgrade to Admiral"
          textStyle={styles.customBtnTxt}
          leftImage={true}
          leftImageSrc={require("../../assets/Admiralicon.png")}
          leftImgStyle={styles.customBtnImg}
          onPress={() => props?.navigation?.navigate("UPGRADE")}
        />
      )}
      <Loader isVisible={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainStyle: { flex: 1 },
  mainCont: { alignItems: "center", paddingBottom: 50 },
  seeMoreBtn: {
    backgroundColor: Theme.APP_LIGHT_BLUE,
    height: 53,
    width: widthPercentageToDP(80),
    borderRadius: 8,
    marginTop: 17,
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
    fontSize: 24,
    fontFamily: fonts.VarelaRoundRegular,
    textAlign: "center",
  },
  profilePicCont: {
    marginTop: 29,
    width: widthPercentageToDP(90),
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: Theme.APP_BORDER_GREY,
    backgroundColor: Theme.APP_WHITE_COLOR,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profilePicInnerCont: {
    alignItems: "center",
    justifyContent: "center",
    width: 55,
    height: 55,
    borderWidth: 4,
    borderRadius: 55 / 2,
    borderColor: Theme.APP_YELLOW,
  },
  profileImg: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
  },
  profileTxt: {
    flex: 1,
    marginLeft: 25,
    fontSize: 15,
    fontFamily: fonts.VarelaRoundRegular,
    color: Theme.APP_PROFILE_TXT,
  },
  arrow: { width: 15, height: 20 },
  profilePicCont1: {
    marginTop: 11,
    width: widthPercentageToDP(90),
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: Theme.APP_BORDER_GREY,
    backgroundColor: Theme.APP_WHITE_COLOR,
    minHeight: heightPercentageToDP(10),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  bioTxtCont: { flex: 1 },
  txt1: {
    fontSize: 15,
    fontFamily: fonts.VarelaRoundRegular,
    color: Theme.APP_PROFILE_TXT,
  },
  editTxt: {
    marginTop: 5,
    fontSize: 12,
    fontFamily: fonts.RobotoRegular,
    color: Theme.APP_PROFILE_TXT2,
    textTransform: "capitalize",
  },
  chipCont: {
    borderRadius: 50,
    marginRight: 3.5,
    marginVertical: 3.5,
    height: 35,
    paddingHorizontal: 17,
    backgroundColor: Theme.APP_RED_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  interestsContainer: {
    marginVertical: 10,
    flexDirection: "row",
    flexWrap: "wrap", // Enable wrapping to next line
    width: widthPercentageToDP(75),
  },
  selectedChipTxt: {
    fontFamily: fonts.RobotoRegular,
    fontSize: 13,
    color: Theme.APP_WHITE_COLOR,
  },
  customBtnStyle: {
    marginTop: 17,
    backgroundColor: Theme.APP_RED_COLOR,
    width: widthPercentageToDP(60),
    height: 43,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "space-evenly",
    shadowColor: Theme.APP_BLACK_COLOR,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  customBtnTxt: {
    fontSize: 16,
    fontFamily: fonts.VarelaRoundRegular,
    color: Theme.APP_WHITE_COLOR,
    textShadowRadius: 1,
    textShadowColor: Theme.APP_BLACK_COLOR,
    textShadowOffset: { width: 1, height: 1 },
  },
  customBtnImg: { width: 24, height: 28 },
});
