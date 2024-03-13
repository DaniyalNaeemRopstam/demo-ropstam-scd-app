import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import fonts from "../../utils/fonts";
import Theme from "../../utils/theme";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import ContinueButton from "../../components/buttons/ContinueButton";
import MapView, { Marker } from "react-native-maps";
import GetLocation from "react-native-get-location";
import CustomButton from "../../components/buttons/CutomButton";
import Loader from "../../components/loader/Loader";
import { excludeUnUsedkeysFromUserObj } from "../../helpers/Common";
import { useDispatch, useSelector } from "react-redux";
import { createProfileAsynThunk } from "../../redux/features/ProfileSlice";
import { CustomErrorToast } from "../../helpers/CustomToast";
import { GOOGLE_API_KEY } from "@env";

export default function MatchingSettings(props: any) {
  const userData = props?.route?.params;
  const routeFrom = props?.route?.params?.routeFrom;
  const [miles, setMiles] = useState(
    props?.route?.params?.userInfo?.radius || 100
  );
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [formattedAddress, setFormattedAddress] = useState(
    props?.route?.params?.userInfo?.location?.formattedAddress || ""
  );
  const token = useSelector((state: any) => state?.login?.token);
  const mapViewRef = useRef<any>(null);

  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [userLocation, setUserLocation] = useState({
    latitude:
      props?.route?.params?.userInfo?.location?.coordinates[1] || 37.78825,
    longitude:
      props?.route?.params?.userInfo?.location?.coordinates[0] || -122.4324,
  });

  const animateToUserLocation = () => {
    mapViewRef?.current?.animateToRegion({
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      latitudeDelta: region.latitudeDelta,
      longitudeDelta: region.longitudeDelta,
    });
  };

  const getCurrentLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then((location) => {
        const { latitude, longitude } = location;

        setRegion((prevRegion) => ({
          ...prevRegion,
          latitude,
          longitude,
        }));

        setUserLocation((prevUserLocation) => ({
          ...prevUserLocation,
          latitude: location.latitude,
          longitude: location.longitude,
        }));

        fetch(
          "https://maps.googleapis.com/maps/api/geocode/json?address=" +
            latitude +
            "," +
            longitude +
            "&key=" +
            GOOGLE_API_KEY
        )
          .then((response) => response.json())
          .then((responseJson) => {
            const firstResult = responseJson.results[0];

            if (firstResult) {
              const cityComponent = firstResult.address_components.find(
                (component: any) => component.types.includes("locality")
              );
              const stateComponent = firstResult.address_components.find(
                (component: any) =>
                  component.types.includes("administrative_area_level_1")
              );
              const countryComponent = firstResult.address_components.find(
                (component: any) => component.types.includes("country")
              );

              const city = cityComponent ? cityComponent.long_name : "";
              const state = stateComponent ? stateComponent.long_name : "";
              const country = countryComponent
                ? countryComponent.long_name
                : "";

              const address = `${city},\n${state},\n${country}`;

              setFormattedAddress(address);
            }
          })
          .catch();
      })
      .catch();
  };

  useEffect(() => {
    if (!props?.route?.params?.userInfo?.location?.coordinates[1]) {
      getCurrentLocation();
    }
    setTimeout(() => {
      animateToUserLocation();
    }, 1000);
  }, [userLocation]);

  const onSubmit = () => {
    if (formattedAddress) {
      const updatedUserData = {
        ...userData,
        location: {
          type: "Point",
          coordinates: [userLocation?.longitude, userLocation?.latitude],
          formattedAddress: formattedAddress,
        },
        radius: miles,
      };

      props.navigation.navigate("SETNAME", updatedUserData);
    }
  };

  const onUpdate = () => {
    setLoading(true);
    const updatedUserData = {
      ...excludeUnUsedkeysFromUserObj(props?.route?.params?.userInfo),
      location: {
        type: "Point",
        coordinates: [userLocation?.longitude, userLocation?.latitude],
        formattedAddress: formattedAddress,
      },
      radius: miles,
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
    <ScrollView
      bounces={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles(routeFrom).mainCont}
      style={styles().mainStyle}
    >
      <Text style={styles().txt1}>Your Home Port</Text>
      <Text style={styles().txt2}>Set your home location</Text>
      <View style={styles().mapCont} pointerEvents="none">
        <MapView
          ref={mapViewRef}
          provider="google"
          style={styles().mapStyle}
          region={region}
          loadingEnabled={true}
        >
          <Marker coordinate={userLocation} draggable={false}>
            <Image
              source={require("../../assets/sailboatIcon.png")}
              style={styles().markerIcon}
            />
          </Marker>
        </MapView>
      </View>

      <Text style={styles().locationTxt} numberOfLines={3}>
        {formattedAddress}
      </Text>

      <CustomButton
        BtnContstyle={styles().pointBtncont}
        leftImage={true}
        leftImageSrc={require("../../assets/sailboatIcon.png")}
        leftImgStyle={styles().sailboatIcon}
        textStyle={styles().pointBtnTxt}
        text="Pinpoint My Location"
        onPress={getCurrentLocation}
      />

      <Text style={styles().discoverTxt}>Discovery Radius</Text>
      <Text style={styles().chooseTxt}>Choose how far away matches can be</Text>

      <View style={styles().incDecCont}>
        <Pressable
          onPress={() => {
            if (miles > 50) {
              setMiles(miles - 10);
            } else if (miles > 1) {
              setMiles(miles - 1);
            }
          }}
        >
          <Image
            source={require("../../assets/minus.png")}
            style={styles().minPlusImg}
          />
        </Pressable>
        <View style={styles().milesCont}>
          <Text style={styles().milesNum}>{miles}</Text>
          <Text style={styles().milesTxt}>miles</Text>
        </View>

        <Pressable
          onPress={() => {
            if (miles < 50) {
              setMiles(miles + 1);
            } else if (miles >= 50 && miles < 250) {
              setMiles(miles + 10);
            }
          }}
        >
          <Image
            source={require("../../assets/Plus.png")}
            style={styles().minPlusImg}
          />
        </Pressable>
      </View>
      {routeFrom == "MYPROFILE" || routeFrom == "SETTINGS" ? (
        <View style={styles().btnCont}>
          <CustomButton
            BtnContstyle={styles().customBtnStyle}
            text="Update"
            textStyle={styles().btnTxt}
            onPress={onUpdate}
          />
        </View>
      ) : (
        <View style={styles().continueBtnCont}>
          <ContinueButton onPress={onSubmit} />
        </View>
      )}
      <Loader isVisible={loading} />
    </ScrollView>
  );
}

const styles = (props?: any) =>
  StyleSheet.create({
    mainStyle: { flex: 1 },
    mainCont: {
      alignItems: "center",
      paddingBottom: props == "MYPROFILE" || props == "SETTINGS" ? 30 : 0,
    },
    txt1: {
      fontFamily: fonts.VarelaRoundRegular,
      fontSize: 20,
      marginTop: 17,
      color: Theme.APP_BLACK_COLOR,
    },
    txt2: {
      fontFamily: fonts.RobotoRegular,
      fontSize: 14,
      marginTop: 10,
      color: Theme.APP_TEXT_GREY,
      textAlign: "center",
    },
    mapCont: {
      marginTop: 13,
      height: heightPercentageToDP(30),
      width: widthPercentageToDP(90),
      borderRadius: 10,
      borderWidth: 3,
      borderColor: Theme.APP_YELLOW,
      overflow: "hidden",
    },
    mapStyle: { flex: 1, borderRadius: 7 },
    markerIcon: {
      width: 23,
      height: 23,
      tintColor: Theme.APP_RED_COLOR,
    },
    pointBtncont: {
      marginTop: heightPercentageToDP(1),
      backgroundColor: Theme.APP_LIGHT_BLUE,
      height: 44,
      paddingHorizontal: 15,
      borderRadius: 5,
      flexDirection: "row",
      width: widthPercentageToDP(75),
      alignItems: "center",
      shadowColor: Theme.APP_BLACK_COLOR,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    sailboatIcon: { width: 23, height: 23 },
    pointBtnTxt: {
      fontFamily: fonts.VarelaRoundRegular,
      fontSize: 20,
      color: Theme.APP_WHITE_COLOR,
      flex: 1,
      textAlign: "center",
    },
    locationTxt: {
      textAlign: "center",
      fontSize: 14,
      fontFamily: fonts.VarelaRoundRegular,
      marginTop: 10,
      color: Theme.APP_BLACK_COLOR,
      height: heightPercentageToDP(8),
    },
    discoverTxt: {
      fontFamily: fonts.VarelaRoundRegular,
      fontSize: 20,
      marginTop: heightPercentageToDP(2),
      color: Theme.APP_BLACK_COLOR,
    },
    chooseTxt: {
      fontFamily: fonts.RobotoRegular,
      fontSize: 14,
      marginTop: 7,
      color: Theme.APP_TEXT_GREY,
      textAlign: "center",
    },
    incDecCont: {
      marginTop: 18,
      flexDirection: "row",
      alignItems: "center",
      width: widthPercentageToDP(40),
      justifyContent: "space-between",
    },
    minPlusImg: { width: 50, height: 50 },
    milesCont: { alignItems: "center" },
    milesNum: {
      fontSize: 21,
      fontFamily: fonts.VarelaRoundRegular,
      color: Theme.APP_BLACK_COLOR,
    },
    milesTxt: {
      top: -2,
      fontSize: 15,
      fontFamily: fonts.VarelaRoundRegular,
      color: Theme.APP_BLACK_COLOR,
    },
    btnCont: {
      // position: "absolute",
      // bottom:
      //   Platform.OS == "android"
      //     ? heightPercentageToDP(5)
      //     : heightPercentageToDP(8),
      marginTop: heightPercentageToDP(8),
      alignItems: "center",
    },
    continueBtnCont: {
      marginTop: heightPercentageToDP(23),
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
