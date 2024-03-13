import {
  // Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import ContinueButton from "../../components/buttons/ContinueButton";
import fonts from "../../utils/fonts";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Theme from "../../utils/theme";
import CustomCameraView from "../../components/customView/CustomCameraView";
import CustomBxCameraView from "../../components/customView/CustomBxCameraView";
import ImageCropPicker from "react-native-image-crop-picker";
import CustomButton from "../../components/buttons/CutomButton";
import { useDispatch, useSelector } from "react-redux";
import {
  createProfileAsynThunk,
  // deleteImageAsynThunk,
  uploadImageAsynThunk,
} from "../../redux/features/ProfileSlice";
import { CustomErrorToast } from "../../helpers/CustomToast";
import Loader from "../../components/loader/Loader";
import { excludeUnUsedkeysFromUserObj } from "../../helpers/Common";
import { setMainImage } from "../../redux/features/AuthSlice";

const ProfilePic = (props: any) => {
  const routeFrom = props?.route?.params?.routeFrom;
  const userData = props?.route?.params;
  const [loading, setLoading] = useState(false);
  const [profileImg, setProfileImg] = useState(
    props?.route?.params?.userInfo?.mainImage || ""
  );

  const [pics, setPics] = useState(
    props?.route?.params?.userInfo?.images || []
  );
  const [showErr, setShowErr] = useState(false);
  const [, setErrmsg] = useState("");
  const dispatch = useDispatch();
  const { token } = useSelector((state: any) => state?.login);

  useEffect(() => {
    setShowErr(false);
  }, [pics]);

  const handleImagePick = () => {
    ImageCropPicker.openPicker({
      width: 314.4,
      height: 235.8,
      cropping: true,
      forceJpg: true,
    })
      .then((image) => {
        const imageData = {
          token,
          image,
        };
        dispatch<any>(uploadImageAsynThunk(imageData))
          .unwrap()
          .then((result: any) => {
            const newImagePath = result?.data[0]?.path;
            setProfileImg(result?.data[0]?.path);
            setPics((prevPics: any) => [...prevPics, newImagePath]);
          })
          .catch((error: any) => {
            // console.error("Error in handleImagePick:", error); // Log the actual error
            if (typeof error === "string") {
              CustomErrorToast(error); // Display the network error message
            } else {
              CustomErrorToast("Failed to upload. Try again");
            }
          });
      })
      .catch((e) => {
        // console.error("Error in ImagePicker:", e); // Log the actual error
        setErrmsg(e);
      });
  };

  const renderCircleImage = (index: number) => {
    return (
      <View key={index}>
        {pics[index] && (
          <Pressable
            onPress={() => {
              // setLoading(true);
              // const data = {
              //   filePath: pics[index].replace("http://15.235.162.99:4031/", ""),
              //   userToken,
              // };
              // dispatch<any>(deleteImageAsynThunk(data))
              //   .unwrap()
              //   .then((result: any) => {
              //     setLoading(false);
              //     Alert.alert(result?.message);
              //   })
              //   .catch((err: any) => {
              //     setLoading(false);
              //     CustomErrorToast(err);
              //   });
              const newPics = [...pics];
              const removedItem = newPics.splice(index, 1);
              if (removedItem.length > 0) {
                setPics(newPics);
                if (!newPics.includes(profileImg)) {
                  const lastItem = newPics[newPics.length - 1];
                  setProfileImg(lastItem);
                }
              }
            }}
            style={styles().circleImgCrossCont}
          >
            <Image
              source={require("../../assets/cross.png")}
              style={styles().circleImgCross}
            />
          </Pressable>
        )}
        <Pressable
          onPress={() => {
            if (pics[index]) {
              setProfileImg(pics[index]);
            } else {
              handleImagePick();
            }
          }}
          style={styles().circleCont}
        >
          {pics[index] ? (
            <Image
              source={{ uri: pics[index] }}
              style={styles().circleImgStyle}
            />
          ) : (
            <CustomCameraView index={index} />
          )}
          <Text style={styles().circleTxt}>{index + 1}</Text>
        </Pressable>
      </View>
    );
  };

  const renderBoxImage = (index: number) => (
    <View key={index}>
      {pics[index] ? (
        <Image source={{ uri: pics[index] }} style={styles().boxImgStyle} />
      ) : (
        <CustomBxCameraView index={index} />
      )}
    </View>
  );

  const onSubmit = () => {
    const updatedUserData = {
      ...userData,
      images: pics,
      mainImage: profileImg,
    };
    dispatch(setMainImage(profileImg));
    props.navigation.navigate("ABOUTME", updatedUserData);
  };

  const onUpdate = () => {
    setLoading(true);
    const updatedUserData = {
      ...excludeUnUsedkeysFromUserObj(props?.route?.params?.userInfo),
      images: pics,
      token,
      mainImage: profileImg,
    };
    dispatch(setMainImage(profileImg));
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
      style={styles().mainStyle}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles(routeFrom).mainCont}
    >
      <Text style={styles().txt1}>Profile Pictures</Text>
      <Text style={styles().txt2}>
        Line up your face inside the circle. {"\n"}This is how your picture will
        be displayed{"\n"} to other users before they use their scope.
      </Text>

      {profileImg ? (
        <Image
          source={{ uri: profileImg }}
          style={styles().cropViewNoImg}
          resizeMode="cover"
        />
      ) : (
        <View style={styles().cropViewNoImg}>
          <Image
            source={require("../../assets/camera.png")}
            style={styles().cropImg}
            resizeMode="contain"
          />
          <Text style={styles().uploadTxt}>Upload Your Picture</Text>
        </View>
      )}

      <View style={styles().circleContMain}>
        {Array(4)
          .fill(null)
          .map((_, index) => renderCircleImage(index))}
      </View>

      <View style={styles().boxContMain}>
        {Array(4)
          .fill(null)
          .map((_, index) => renderBoxImage(index))}
      </View>

      {showErr && (
        <Text style={styles().errtxtstyle1}>
          Please select at least one profile picture
        </Text>
      )}
      {routeFrom == "MYPROFILE" ? (
        <View style={styles().btnCont}>
          <CustomButton
            BtnContstyle={styles().customBtnStyle}
            text="Update"
            textStyle={styles().btnTxt}
            onPress={() => (pics.length != 0 ? onUpdate() : setShowErr(true))}
          />
        </View>
      ) : (
        <View style={styles().continueBtnCont}>
          <ContinueButton
            onPress={() => (pics.length != 0 ? onSubmit() : setShowErr(true))}
          />
        </View>
      )}
      <Loader isVisible={loading} />
    </ScrollView>
  );
};

const styles = (props?: any) =>
  StyleSheet.create({
    mainStyle: { flex: 1 },
    mainCont: {
      alignItems: "center",
      paddingBottom: props == "MYPROFILE" ? 30 : 0,
    },
    txt1: {
      fontFamily: fonts.VarelaRoundRegular,
      fontSize: 20,
      marginTop: 17,
      color: Theme.APP_BLACK_COLOR,
    },
    txt2: {
      width: widthPercentageToDP(80),
      fontFamily: fonts.RobotoRegular,
      fontSize: 14,
      marginTop: 10,
      color: Theme.APP_TEXT_GREY,
      textAlign: "center",
    },
    cropViewNoImg: {
      width: widthPercentageToDP(90),
      height: heightPercentageToDP(30),
      backgroundColor: Theme.APP_BORDER_GREY,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 20,
      borderWidth: 5,
      borderColor: Theme.APP_YELLOW,
      marginTop: 10,
    },
    cropView: {
      width: widthPercentageToDP(90),
      height: heightPercentageToDP(30),
      backgroundColor: Theme.APP_BORDER_GREY,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 5,
      borderColor: Theme.APP_YELLOW,
      marginTop: 10,
    },
    cropImg: { width: 76, height: 60 },
    uploadTxt: {
      fontSize: 20,
      fontFamily: fonts.VarelaRoundRegular,
      marginTop: 30,
      color: Theme.APP_TEXT_GREY,
    },
    circleContMain: {
      marginTop: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      width: widthPercentageToDP(90),
    },
    circleCont: { alignItems: "center" },
    circleImgStyle: {
      width: 60,
      height: 60,
      borderRadius: 60 / 2,
    },
    circleImgCrossCont: {
      backgroundColor: Theme.APP_RED_COLOR,
      width: 20,
      height: 20,
      borderRadius: 20 / 2,
      position: "absolute",
      right: -5,
      top: -5,
      zIndex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    circleImgCross: { width: 10, height: 10 },
    circleTxt: {
      marginTop: 10,
      fontSize: 26,
      fontFamily: fonts.RobotoRegular,
      color: Theme.APP_TEXT_GREY,
    },

    boxContMain: {
      marginTop: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      width: widthPercentageToDP(90),
    },
    boxImgStyle: {
      width: 60,
      height: 50,
      borderRadius: 10,
    },
    errtxtstyle1: {
      top: 5,
      color: Theme.APP_RED_COLOR,
      fontSize: 14,
      fontFamily: fonts.RobotoRegular,
    },
    btnCont: {
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

export default ProfilePic;
