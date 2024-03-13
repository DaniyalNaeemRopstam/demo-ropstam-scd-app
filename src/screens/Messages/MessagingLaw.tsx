import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import fonts from "../../utils/fonts";
import Theme from "../../utils/theme";
import { widthPercentageToDP } from "react-native-responsive-screen";
import CustomButton from "../../components/buttons/CutomButton";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/loader/Loader";
import {
  createProfileAsynThunk,
  getProfileAsynThunk,
} from "../../redux/features/ProfileSlice";
import { CustomErrorToast } from "../../helpers/CustomToast";
import { excludeUnUsedkeysFromUserObj } from "../../helpers/Common";
import { setViewMessageLog } from "../../redux/features/AuthSlice";

export default function MessagingLaw(props: any) {
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const dispatch = useDispatch();
  const { token } = useSelector((state: any) => state?.login);
  const { routeFrom, profileData, chatID, matchID } =
    props?.route?.params || {};

  const getUserInfo = async () => {
    dispatch<any>(getProfileAsynThunk(token))
      .unwrap()
      .then((response: any) => {
        setLoading(false);
        setUserInfo(response.data);
      })
      .catch((err: any) => {
        setLoading(false);
        CustomErrorToast(err);
      });
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const update = () => {
    setLoading(true);
    const updatedUserData = {
      ...excludeUnUsedkeysFromUserObj(userInfo),
      isViewMessageLog: true,
      token: token,
    };

    dispatch<any>(createProfileAsynThunk(updatedUserData))
      .unwrap()
      .then((response: any) => {
        setLoading(false);
        dispatch(setViewMessageLog(response.data?.isViewMessageLog));
        if (routeFrom === "USERPROFILE") {
          props?.navigation?.replace("CHAT", {
            profileData,
            chatID,
            matchID,
          });
        } else {
          props?.navigation?.replace("MYMESSAGES");
        }
      })
      .catch((err: any) => {
        setLoading(false);
        CustomErrorToast(err);
      });
  };
  return (
    <ScrollView
      bounces={false}
      style={styles.mainStyle}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.mainCont}
    >
      <Text style={styles.heading}>Maritime Messaging Laws</Text>
      <Image
        source={require("../../assets/rulebook.png")}
        style={styles.ruleImg}
      />
      <Text style={styles.txtUnderImg}>
        Please adhere to our rules.{"\n"}We run a tight ship.
      </Text>

      <View style={styles.TxtCont}>
        <Text style={styles.headText}>Be respectful</Text>
        <Text style={styles.descriptionTxt}>
          Always treat your fellow sailors with kindness.
        </Text>
      </View>

      <View style={styles.TxtCont}>
        <Text style={styles.headText}>Keep it clean</Text>
        <Text style={styles.descriptionTxt}>
          Steer clear of any content that be explicit or{"\n"}inappropriate for
          the eyes and ears of your{"\n"}fellow sailors.
        </Text>
      </View>

      <View style={styles.TxtCont}>
        <Text style={styles.headText}>Mind your tongue</Text>
        <Text style={styles.descriptionTxt}>
          Keep the conversation as pristine{"\n"}as the sparkling ocean waters.
        </Text>
      </View>

      <View style={styles.TxtCont}>
        <Text style={styles.headText}>Fair winds for all</Text>
        <Text style={styles.descriptionTxt}>
          Every soul deserves fair and equal treatment,{"\n"}regardless of their
          background or circumstance.
        </Text>
      </View>

      <View style={styles.TxtCont}>
        <Text style={styles.headText}>No cargo peddling</Text>
        <Text style={styles.descriptionTxt}>
          Let the focus be on the voyage of connection,{"\n"}and avoid any
          unsolicited promotions or{"\n"}advertisements.
        </Text>
      </View>

      <View style={styles.TxtCont}>
        <Text style={styles.headText}>Raise a red flag</Text>
        <Text style={styles.descriptionTxt}>
          {`If you witness any improper conduct${"\n"}report it to the ship's authority.${"\n"}We shall swiftly address such matters`}
        </Text>
      </View>

      <View style={styles.btnCont}>
        <CustomButton
          BtnContstyle={styles.offBtnCont}
          text="I Disagree"
          textStyle={styles.btnTxt}
          onPress={() => props?.navigation?.goBack()}
        />

        <CustomButton
          BtnContstyle={styles.onBtnCont}
          text="I Agree"
          textStyle={styles.btnTxt}
          onPress={update}
        />
      </View>
      <Loader isVisible={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainStyle: { flex: 1 },
  mainCont: { alignItems: "center", paddingBottom: 30 },
  heading: {
    marginTop: 17,
    fontSize: 20,
    fontFamily: fonts.VarelaRoundRegular,
    color: Theme.APP_BLACK_COLOR,
  },
  ruleImg: {
    width: 75,
    height: 57,
    marginTop: 12,
  },
  txtUnderImg: {
    fontFamily: fonts.VarelaRoundRegular,
    fontSize: 14,
    color: Theme.APP_TEXT_GREY,
    marginTop: 10,
    textAlign: "center",
    marginBottom: 5,
  },
  TxtCont: {
    marginTop: 17,
    alignItems: "center",
    width: widthPercentageToDP(95),
  },
  headText: {
    fontSize: 16,
    color: Theme.APP_BLACK_COLOR,
    fontFamily: fonts.VarelaRoundRegular,
    textShadowColor: Theme.APP_BLACK_COLOR,
    textShadowOffset: { width: 0.8, height: 0.5 },
    textShadowRadius: 0.5,
  },
  descriptionTxt: {
    fontSize: 15,
    color: Theme.APP_BLACK_COLOR,
    fontFamily: fonts.VarelaRoundRegular,
    textAlign: "center",
  },
  btnCont: {
    marginTop: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: widthPercentageToDP(100),
  },
  offBtnCont: {
    height: 52,
    backgroundColor: Theme.APP_DISABLED,
    width: widthPercentageToDP(40),
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    shadowColor: Theme.APP_BLACK_COLOR,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  onBtnCont: {
    height: 52,
    backgroundColor: Theme.APP_LIGHT_BLUE,
    width: widthPercentageToDP(40),
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
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
    fontSize: 20,
    fontFamily: fonts.VarelaRoundRegular,
    color: Theme.APP_WHITE_COLOR,
  },
});
