import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import fonts from "../../utils/fonts";
import Theme from "../../utils/theme";
import CustomButton from "../../components/buttons/CutomButton";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { MotiImage, MotiView, useAnimationState } from "moti";
import { useDispatch, useSelector } from "react-redux";
import CustomSoundPlayer from "../../components/customAudio/CustomSoundPlayer";
import Loader from "../../components/loader/Loader";
import {
  getUserBeaconsAsynThunk,
  purchaseBeaconsAsynThunk,
  useBeaconsAsynThunk,
} from "../../redux/features/BeaconSlice";
import { CustomErrorToast } from "../../helpers/CustomToast";
import moment from "moment";
import { setBeaconTime } from "../../redux/features/AuthSlice";

const screenHeight = Dimensions.get("screen").height;

export default function Beacon() {
  const [active, setActive] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalBeacons, setTotalBeacons] = useState(10);

  const [formattedTime, setFormattedTime] = useState("");
  const { isSound, token, beaconTime } = useSelector(
    (state: any) => state.login
  );

  const dispatch = useDispatch();

  const animationState = useAnimationState({
    initial: {
      opacity: 0,
      shadowRadius: 10,
      type: "timing",
      duration: 2000,
    },
    glowing: {
      opacity: 0.5,
      shadowRadius: 20,
      type: "timing",
      duration: 2000,
    },
  });

  const startAnimation = async () => {
    let isGlowing = true;

    const animate = () => {
      if (showAnimation) {
        if (isGlowing) {
          animationState.transitionTo("glowing");
        } else {
          animationState.transitionTo("initial");
        }

        isGlowing = !isGlowing;
        setTimeout(animate, 2000); // Schedule the next animation step
      }
    };

    animate();
  };

  const getUserBeacons = () => {
    dispatch<any>(getUserBeaconsAsynThunk(token))
      .unwrap()
      .then((response: any) => {
        dispatch(setBeaconTime(response.data?.startDateAndTime));
        setTotalBeacons(response.data?.beacons + response.data?.paidBeacons);
        setActive(response.data?.isStart);
        if (!response.data?.isStart) {
          setLoading(false);
        }
      })
      .catch((err: any) => {
        setLoading(false);
        CustomErrorToast(err);
      });
  };

  const remainingTime = () => {
    const time = moment(beaconTime).add(1, "hours");
    const currentDateTime = moment();
    const remainingTime = moment.duration(time.diff(currentDateTime));

    if (remainingTime.asMilliseconds() > 0) {
      const minutes = remainingTime.minutes();
      // Use padStart to add a leading zero if minutes is less than 10
      const formattedMinutes = String(minutes).padStart(2, "0");
      setFormattedTime(`${formattedMinutes} minutes`);
    } else {
      null;
    }
    setLoading(false);
  };

  useEffect(() => {
    getUserBeacons();
    showAnimation && startAnimation();
    showAnimation && isSound && CustomSoundPlayer("beacon_sfx.mp3");
  }, [showAnimation]);

  useEffect(() => {
    if (beaconTime) {
      const timerInterval = setInterval(() => {
        remainingTime();
      }, 1000);

      return () => {
        clearInterval(timerInterval);
      };
    }
  }, [beaconTime]);

  const activateBeacon = () => {
    setLoading(true);
    dispatch<any>(useBeaconsAsynThunk(token))
      .unwrap()
      .then((response: any) => {
        setBeaconTime(response.data?.startDateAndTime);
        setShowAnimation(response.data?.isStart);
        setActive(response.data?.isStart);
        setLoading(false);
      })
      .catch((err: any) => {
        setLoading(false);
        CustomErrorToast(err);
      });
  };

  const purchaseBeacon = () => {
    setLoading(true);
    const data = {
      beaconsValue: 10,
      amount: 2500,
      token: token,
    };
    dispatch<any>(purchaseBeaconsAsynThunk(data))
      .unwrap()
      .then((response: any) => {
        setTotalBeacons(response.data?.beacons + response.data?.paidBeacons);
        setLoading(false);
      })
      .catch((err: any) => {
        CustomErrorToast(err);
        setLoading(false);
      });
  };

  return (
    <View style={styles.mainCont}>
      <Text style={styles.heading}>My Beacons</Text>
      <Text
        style={styles.p1}
      >{`Active a beacon and your profile\nwill be shown to all users in your area\nfor a limited time`}</Text>

      {showAnimation ? (
        <ImageBackground
          source={require("../../assets/active-beacon.png")}
          style={styles.beacon}
          resizeMode="contain"
        >
          <MotiImage
            source={require("../../assets/active-glow.png")}
            resizeMode="contain"
            style={styles.glow}
            from={{
              rotateY: "0deg",
            }}
            animate={{
              rotateY: "-360deg",
            }}
            transition={{
              loop: true,
              repeatReverse: false,
              type: "timing",
              duration: 2000,
            }}
          />
          <MotiView
            state={animationState}
            style={styles.glowAnimate}
          ></MotiView>
        </ImageBackground>
      ) : active ? (
        <Image
          source={require("../../assets/active-beacon.png")}
          style={styles.beacon}
          resizeMode="contain"
        />
      ) : (
        <Image
          source={require("../../assets/inactive-beacon.png")}
          resizeMode="contain"
          style={styles.beaconInactive}
        />
      )}

      {formattedTime ? (
        <>
          <Text style={styles.heading}>Beacon Active!</Text>
          <Text style={styles.activeTimerTxt}>
            {`${formattedTime} remaining`}
          </Text>
        </>
      ) : (
        <CustomButton
          onPress={activateBeacon}
          BtnContstyle={styles.activateBeaconBtn}
          text={`Activate Beacon\n(1 hour)`}
          textStyle={styles.activateBeaconTxt}
        />
      )}

      <View style={styles.bottomView}>
        <Image
          source={require("../../assets/Beaconbutton.png")}
          style={styles.beaconIcon}
          resizeMode="contain"
        />

        <Text style={styles.beaconsRemaining}>
          You have {totalBeacons} beacons left
        </Text>

        <CustomButton
          BtnContstyle={styles.buyBeaconCont}
          text="Buy Beacon Bundle"
          textStyle={styles.buyBeaconTxt}
          onPress={purchaseBeacon}
        />
        <Text style={styles.beaconNumber}>(In-app purchase)</Text>
      </View>
      <Loader isVisible={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  mainCont: { flex: 1, alignItems: "center" },
  heading: {
    marginTop: 17,
    fontSize: 20,
    fontFamily: fonts.VarelaRoundRegular,
    color: Theme.APP_BLACK_COLOR,
  },
  p1: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 14,
    fontFamily: fonts.RobotoRegular,
    color: Theme.APP_TEXT_GREY,
  },
  beaconInactive: {
    marginTop: 30,
    height: heightPercentageToDP(28),
  },
  beacon: {
    marginTop: 20,
    height: heightPercentageToDP(30),
  },
  glowAnimate: {
    backgroundColor: Theme.APP_YELLOW,
    top: widthPercentageToDP(4),
    width:
      screenHeight <= 750 ? widthPercentageToDP(32) : widthPercentageToDP(40),
    height:
      screenHeight <= 750 ? widthPercentageToDP(40) : widthPercentageToDP(50),
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    position: "absolute",
    alignSelf: "center",
  },
  glow: {
    height: heightPercentageToDP(30),
    width: widthPercentageToDP(64),
  },
  activeTimerTxt: {
    fontSize: 20,
    marginTop: 5,
    textAlign: "center",
    fontFamily: fonts.VarelaRoundRegular,
    color: Theme.APP_TEXT_GREY,
  },
  activateBeaconBtn: {
    marginTop: 17,
    height: heightPercentageToDP(7),
    width: widthPercentageToDP(60),
    backgroundColor: Theme.APP_SETTING_DARK_YELLOW,
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
  activateBeaconTxt: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: fonts.VarelaRoundRegular,
    color: Theme.APP_WHITE_COLOR,
  },
  bottomView: {
    position: "absolute",
    bottom: heightPercentageToDP(6),
    alignItems: "center",
  },
  beaconIcon: {
    width: 41,
    height: 41,
  },
  beaconsRemaining: {
    marginTop: 5,
    fontFamily: fonts.RobotoRegular,
    color: Theme.APP_TEXT_GREY,
    fontSize: 14,
  },
  beaconNumber: {
    marginTop: 11,
    fontFamily: fonts.RobotoRegular,
    color: Theme.APP_TEXT_GREY,
    fontSize: 14,
  },
  buyBeaconCont: {
    marginTop: 14,
    height: heightPercentageToDP(7),
    width: widthPercentageToDP(90),
    backgroundColor: Theme.APP_SKY_BLUE,
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
  buyBeaconTxt: {
    fontSize: 24,
    color: Theme.APP_WHITE_COLOR,
    fontFamily: fonts.VarelaRoundRegular,
  },
});
