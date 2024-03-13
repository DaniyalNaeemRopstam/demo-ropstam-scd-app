import {
  Animated,
  AppState,
  Dimensions,
  Easing,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Theme from "../../utils/theme";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import fonts from "../../utils/fonts";
import Swiper from "react-native-deck-swiper";
import SwipsModal from "../../components/modals/SwipesModal";
import GestureFlipView from "react-native-gesture-flip-card";
import CustomButton from "../../components/buttons/CutomButton";
import MatchModal from "../../components/modals/MatchModal";
import Octopus from "../../components/modals/Octopus";
import RNShake from "react-native-shake";
import { useDispatch, useSelector } from "react-redux";
import HarpoonModal from "../../components/modals/HarpoonModal";
import Sound from "react-native-sound";
import CustomSoundPlayer from "../../components/customAudio/CustomSoundPlayer";
import { useFocusEffect } from "@react-navigation/native";
import Loader from "../../components/loader/Loader";
import { CustomErrorToast } from "../../helpers/CustomToast";
import moment from "moment";
import { useHarpoonAsynThunk } from "../../redux/features/MatchSlice";
import GameService from "../../redux/api/GameService";
import MatchService from "../../redux/api/MatchService";
import GameLoader from "../../components/loader/GameLoader";
import {
  setGameUsers,
  setTotalMatches,
  setFlipped,
  setCardsArray,
} from "../../redux/features/AuthSlice";
import axios from "axios";
import { debounce } from "lodash";
import NoMoreUsersModal from "../../components/modals/NoMoreUsersModal";

const screenHeight = Dimensions.get("screen").height;

export default function GameScreen(props: any) {
  const {
    themeMode,
    isSound,
    token,
    isViewMessageLog,
    userID,
    isPremium,
    gameUsers,
    beaconTime,
    totalMatches,
    flipped,
    cardsArray,
  } = useSelector((state: any) => state?.login);

  const dispatch = useDispatch();

  const { height } = Dimensions.get("window");
  const swipRef = useRef<Swiper<any>>(null);
  const cardRefs = useRef(new Map());
  const currentTime = new Date().getHours();

  const [images, setImages] = useState([
    require("../../assets/GameScreen1.png"),
    require("../../assets/GameScreen2.png"),
    require("../../assets/GameScreen1.png"),
    require("../../assets/GameScreen1.png"),
  ]);
  const [loading, setLoading] = useState(false);
  const [gameLoading, setGameLoading] = useState(false);
  const [harpoonModal, setHarpoonModal] = useState(false);
  const [isMatch, setIsMatch] = useState(false);
  const [cardIndex, setcardIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likeCounter, setLikecounter] = useState(1);
  const [showSwipModal, setShowSwipModal] = useState(false);
  const [showOcto, setShowOcto] = useState(false);
  const [currentRotations, setCurrentRotations] = useState(0);
  const [matchProfile, setMatchProfile] = useState(cardsArray[0]);
  const [matchedData, setMatchedData] = useState<any>({});
  const [darkMode, setDarkMode] = useState(false);
  const [swipesDate, setSwipesDate] = useState("");
  const [lastPress, setLastPress] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);

  const [formattedTime, setFormattedTime] = useState("");
  const [totalBeacons, setTotalBeacons] = useState(
    gameUsers?.beacons?.beacons + gameUsers?.beacons?.paidBeacons
  );
  const [totalHarpoons, setTotalHarpoons] = useState(
    gameUsers?.harpoons?.weeklyHarpoons +
      gameUsers?.harpoons?.monthlyHarpoons +
      gameUsers?.harpoons?.paidHarpoons
  );

  const [overlayOpacity] = useState(new Animated.Value(0));
  const [overlayOpacity1] = useState(new Animated.Value(0));
  const [overlayOpacity2] = useState(new Animated.Value(0));

  const rotation = useRef(new Animated.Value(0)).current;
  const animated = useRef(new Animated.Value(0)).current;
  const animated2 = useRef(new Animated.Value(0)).current;
  const animated3 = useRef(new Animated.Value(0)).current;
  const spinValue = useRef(new Animated.Value(0)).current;
  const animatedValue = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const portAnimBtn = useRef(new Animated.Value(0)).current;
  const scopeAnimBtn = useRef(new Animated.Value(0)).current;
  const starboardAnimBtn = useRef(new Animated.Value(0)).current;

  const ITEM_HEIGHT = Platform.OS === "ios" ? 169 : 166;
  const SHADOW_HEIGHT = 3;

  const translateX = useRef(
    new Animated.Value(-Dimensions.get("window").width)
  ).current;

  const duration = 2000;
  const boatduration = 10000;
  const duration2 = 2000;
  const duration3 = 2000;

  const spin = spinValue.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "180deg"],
  });

  const needleRotate = spinValue.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "180deg"],
  });

  const imageTranslateX = animatedValue.interpolate({
    inputRange: [0, images.length],
    outputRange: [0, widthPercentageToDP(-100) * images.length],
  });

  const audioFiles = [
    "voice_0.mp3",
    "voice_1.mp3",
    "voice_2.mp3",
    "voice_3.mp3",
    "voice_4.mp3",
    "voice_5.mp3",
    "voice_6.mp3",
    "voice_7.mp3",
    "voice_8.mp3",
    "voice_9.mp3",
    "voice_10.mp3",
    "voice_11.mp3",
    "voice_12.mp3",
    "voice_13.mp3",
    "voice_14.mp3",
    "voice_15.mp3",
    "voice_16.mp3",
    "voice_17.mp3",
    "voice_18.mp3",
    "voice_19.mp3",
    "voice_20.mp3",
    "voice_21.mp3",
    "voice_22.mp3",
    "voice_23.mp3",
    "voice_24.mp3",
    "voice_25.mp3",
    "voice_26.mp3",
    "voice_27.mp3",
    "voice_28.mp3",
    "voice_29.mp3",
    "voice_30.mp3",
    "voice_31.mp3",
    "voice_32.mp3",
    "voice_33.mp3",
    "voice_34.mp3",
    "voice_35.mp3",
    "voice_36.mp3",
    "voice_37.mp3",
    "voice_38.mp3",
    "voice_39.mp3",
    "voice_40.mp3",
    "voice_41.mp3",
    "voice_42.mp3",
    "voice_43.mp3",
    "voice_44.mp3",
  ];

  const splashAudios = [
    "splash_0.mp3",
    "splash_1.mp3",
    "splash_2.mp3",
    "splash_3.mp3",
    "splash_4.mp3",
    "splash_5.mp3",
    "splash_6.mp3",
  ];

  const checkSwipes = (userSwipes: any) => {
    if (userSwipes?.swipes + userSwipes?.paidSwipes == 0) {
      setSwipesDate(userSwipes?.date);
      setShowOcto(true);
      setTimeout(() => {
        setShowOcto(false);
        setShowSwipModal(true);
      }, 4500);
    } else {
      setLikecounter(userSwipes?.swipes + userSwipes?.paidSwipes);
    }
  };

  const getUsers = async () => {
    setGameLoading(true);
    await GameService.getUsersApi(token)
      .then(async (result: any) => {
        const originalResponse = result.data;
        setcardIndex(0);
        dispatch(setGameUsers(originalResponse));
        dispatch(setCardsArray(originalResponse?.matches));

        if (isPremium) {
          setLikecounter(30);
        } else {
          checkSwipes(result?.data?.swipes);
        }

        setTotalBeacons(
          result?.data?.beacons?.beacons + result?.data?.beacons?.paidBeacons
        );
        setTotalHarpoons(
          result?.data?.harpoons?.weeklyHarpoons +
            result?.data?.harpoons?.monthlyHarpoons +
            result?.data?.harpoons?.paidHarpoons
        );

        setGameLoading(false);
      })
      .catch((err: any) => {
        setGameLoading(false);
        CustomErrorToast(err);
      });
  };

  const remainingTime = () => {
    const time = moment(beaconTime).add(1, "hours");
    const currentDateTime = moment();
    const remainingTime = moment.duration(time.diff(currentDateTime));

    if (remainingTime.asMilliseconds() > 0) {
      const hours = remainingTime.hours();
      const minutes = remainingTime.minutes();
      // Use padStart to add a leading zero if minutes is less than 10
      const formattedMinutes = String(minutes).padStart(2, "0");

      setFormattedTime(`${hours}:${formattedMinutes}`);
    } else {
      null;
    }
    setLoading(false);
  };

  const createMatch = async (status: string) => {
    if (cardIndex === swipRef?.current?.props?.cardIndex) {
      isSound && CustomSoundPlayer("woosh.mp3");
      if (status == "PORT") {
        isSound && CustomSoundPlayer("boat_horn.mp3");
        const randomIndex = Math.floor(Math.random() * splashAudios.length);
        const randomItem = splashAudios[randomIndex];
        isSound && CustomSoundPlayer(randomItem);
        startSpinningAntiClockwise();
      } else if (status == "STAR_BOARD") {
        startSpinningClockwise();
      }
      const data = {
        id: cardsArray[cardIndex]?._id,
        status,
      };
      await MatchService.createMatchApi(data, token)
        .then((response: any) => {
          if (response.data?.resp?.status == "PENDING") {
            setLikecounter(
              response.data?.swipesResp?.paidSwipes +
                response.data?.swipesResp?.swipes
            );
            setSwipesDate(response.data?.swipesResp?.date);
          } else if (response.data?.resp?.status == "MATCHED") {
            isSound && CustomSoundPlayer("ships_bell.mp3");
            setTimeout(() => {
              const randomIndex = Math.floor(Math.random() * audioFiles.length);
              const randomItem = audioFiles[randomIndex];
              isSound && CustomSoundPlayer(randomItem);
            }, 1000);
            setMatchedData(response.data);
            setMatchProfile(cardsArray[cardIndex]);
            setIsMatch(true);
            dispatch(setTotalMatches(totalMatches + 1));
          }
        })
        .catch((err: any) => {
          if (axios.isAxiosError(err)) {
            return null;
          } else {
            CustomErrorToast(err);
          }
        });
    }
    setcardIndex((prev) => prev + 1);
    setDisabled(false);
  };

  const useHarpoon = () => {
    if (!showOcto && !gameLoading && !showUsersModal) {
      const data = {
        token: token,
        id: cardsArray[cardIndex]?._id,
        userName: cardsArray[cardIndex]?.userName,
      };
      dispatch<any>(useHarpoonAsynThunk(data))
        .unwrap()
        .then((response: any) => {
          if (
            response.match?.likeToStatus == "HARPOON" &&
            response.match?.likeByStatus == "STAR_BOARD"
          ) {
            isSound && CustomSoundPlayer("ships_bell.mp3");
            setTimeout(() => {
              const randomIndex = Math.floor(Math.random() * audioFiles.length);
              const randomItem = audioFiles[randomIndex];
              isSound && CustomSoundPlayer(randomItem);
            }, 1000);

            const data = {
              chat: response?.chatID?._id,
              resp: response?.match,
            };

            setMatchedData(data);
            setMatchProfile(cardsArray[cardIndex]);
            setIsMatch(true);
            dispatch(setTotalMatches(totalMatches + 1));
          }

          setcardIndex(cardIndex + 1);

          dispatch(setFlipped(true));
          setTotalHarpoons(
            response.data?.monthlyHarpoons +
              response.data?.paidHarpoons +
              response.data?.weeklyHarpoons
          );
        })
        .catch((err: any) => {
          CustomErrorToast(err);
        });
    }
  };

  // Load background sound on component mount
  useFocusEffect(
    useCallback(() => {
      if (isSound) {
        const sound = new Sound("ocean_bg.mp3", Sound.MAIN_BUNDLE, (error) => {
          if (error) {
            null;
          } else {
            if (AppState.currentState == "active") {
              sound.setNumberOfLoops(-1); // -1 means infinite loop
              sound.play();
            }
          }
        });
        const appStateListener = (nextAppState: any) => {
          if (nextAppState.match(/inactive|background/) && sound.isPlaying()) {
            sound.pause();
          } else if (nextAppState === "active" && !sound.isPlaying()) {
            sound.play();
          }
        };
        AppState.addEventListener("change", appStateListener);
        return () => {
          sound.stop();
          sound.release(); // Release resources when component unmounts
        };
      }
    }, [])
  );

  // Load monter sound on component mount
  useFocusEffect(
    useCallback(() => {
      if (isSound && showOcto) {
        const sound = new Sound(
          "sea_monster_sfx.mp3",
          Sound.MAIN_BUNDLE,
          (error) => {
            if (error) {
              null;
            } else {
              if (AppState.currentState == "active") {
                sound.play();
              }
            }
          }
        );
        const appStateListener = (nextAppState: any) => {
          if (nextAppState.match(/inactive|background/) && sound.isPlaying()) {
            sound.pause();
          } else if (nextAppState === "active" && !sound.isPlaying()) {
            sound.play();
          }
        };
        AppState.addEventListener("change", appStateListener);
        return () => {
          sound.stop();
          sound.release(); // Release resources when component unmounts
        };
      }
    }, [showOcto])
  );

  // Harpoon shake gesture
  useFocusEffect(
    useCallback(() => {
      if (!isMatch && !showOcto && !showSwipModal && !showUsersModal) {
        const subscription = RNShake.addListener(() => {
          // Your code here...
          topSwipe();
        });

        return () => {
          // Your code here...
          subscription.remove();
        };
      }
    }, [cardIndex, isMatch, totalHarpoons])
  );

  // Boat animation / theme mode / API call
  useFocusEffect(
    useCallback(() => {
      BoatMove();
      const animations = [
        Animated.sequence([
          Animated.timing(animated, {
            toValue: 8,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(animated, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(animated2, {
            toValue: 6,
            duration: duration2,
            useNativeDriver: true,
          }),
          Animated.timing(animated2, {
            toValue: 0,
            duration: duration2,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(animated3, {
            toValue: -10,
            duration: duration3,
            useNativeDriver: true,
          }),
          Animated.timing(animated3, {
            toValue: 0,
            duration: duration3,
            useNativeDriver: true,
          }),
        ]),
      ];
      animations.forEach((animation) => Animated.loop(animation).start());
      //boat view

      if (themeMode == "NIGHT") {
        setImages([
          require("../../assets/GameNight1.png"),
          require("../../assets/GameNight2.png"),
          require("../../assets/GameNight1.png"),
          require("../../assets/GameNight1.png"),
        ]);
        setDarkMode(true);
      } else if (themeMode == "AUTOMATIC") {
        if (currentTime >= 20 || currentTime < 6) {
          setImages([
            require("../../assets/GameNight1.png"),
            require("../../assets/GameNight2.png"),
            require("../../assets/GameNight1.png"),
            require("../../assets/GameNight1.png"),
          ]);
          setDarkMode(true);
        }
      } else {
        null;
      }
    }, [])
  );

  // check user profiles
  useFocusEffect(
    useCallback(() => {
      if (cardsArray.length === 0) {
        setShowOcto(true);
        const timeout = setTimeout(() => {
          setShowOcto(false);
          setShowUsersModal(true);
        }, 4500);

        return () => {
          // Cleanup function to reset state when navigating away
          setShowOcto(false);
          setShowUsersModal(false);
          clearTimeout(timeout);
        };
      } else {
        // Reset state if cardsArray is not empty
        setShowOcto(false);
        setShowUsersModal(false);
      }
    }, [cardsArray])
  );

  useEffect(() => {
    if (isPremium) {
      setLikecounter(30);
    } else {
      checkSwipes(gameUsers?.swipes);
    }
  }, [gameUsers?.swipes]);

  // Beacon Timer
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

  // Progress bar and octopus animation on Like counter
  useEffect(() => {
    Animated.timing(progress, {
      toValue: (likeCounter / 30) * 100,
      duration: 800,
      useNativeDriver: false,
    }).start();
    if (likeCounter == 0 && !isPremium) {
      setShowOcto(true);
      setTimeout(() => {
        setShowOcto(false);
        setShowSwipModal(true);
      }, 4500);
    }
  }, [likeCounter]);

  useEffect(() => {
    return () => {
      // Cleanup function to reset showUsersModal when component unmounts
      setShowUsersModal(false);
    };
  }, []);

  const BoatMove = () => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(1000),
        Animated.timing(translateX, {
          toValue: Dimensions.get("window").width,
          duration: boatduration,
          useNativeDriver: true,
          easing: Easing.linear,
        }),

        Animated.timing(rotation, {
          toValue: Math.PI, // 1 represents 180 degrees
          duration: boatduration,
          useNativeDriver: true,
          easing: Easing.linear,
        }),

        Animated.timing(translateX, {
          toValue: -Dimensions.get("window").width * 2,
          duration: boatduration,
          useNativeDriver: true,
          easing: Easing.linear,
        }),

        Animated.timing(rotation, {
          toValue: 0, // Reset rotation
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startSpinningClockwise = () => {
    dispatch(setFlipped(true));
    Animated.timing(spinValue, {
      toValue: currentRotations + 180,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => setCurrentRotations(currentRotations + 180));
    const newIndex = currentIndex + 1;
    if (newIndex >= images.length) {
      const newImages = images.concat(images);
      setImages(newImages);
    }
    moveObjectBack();
    Animated.timing(animatedValue, {
      toValue: newIndex,
      duration: 500, // Adjust the animation duration as needed
      useNativeDriver: false,
    }).start();

    setCurrentIndex(newIndex);
  };

  const startSpinningAntiClockwise = () => {
    dispatch(setFlipped(true));
    Animated.timing(spinValue, {
      toValue: currentRotations - 180,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => setCurrentRotations(currentRotations - 180));
    const newIndex = currentIndex - 1;
    moveObject();
    if (newIndex < 0) {
      const newImages = [...images, ...images];
      setImages(newImages);
      setCurrentIndex(newImages.length + newIndex); // Adjust the current index accordingly
    } else {
      Animated.timing(animatedValue, {
        toValue: newIndex,
        duration: 500, // Adjust the animation duration as needed
        useNativeDriver: false,
      }).start();
      setCurrentIndex(newIndex);
    }
  };

  const handleFlip = async () => {
    const now = new Date().getTime();
    if (now - lastPress < 1000) {
      // If less than 5000ms since last press, discard press event
      return;
    }

    // Update last press time and disable the button temporarily
    setLastPress(now);
    setDisabled(true);

    const card = cardRefs.current.get(cardIndex);
    card?.current?.flipLeft();
    await dispatch(setFlipped(!flipped));
    isSound && CustomSoundPlayer("scope.mp3");
    setDisabled(false);
  };

  const topSwipe = () => {
    if (totalHarpoons > 0) {
      isSound && CustomSoundPlayer("harpoon_sfx.mp3");
      overlayOpacity2.setValue(1);
      setTimeout(() => {
        overlayOpacity2.setValue(0);
        swipRef?.current?.swipeTop();
        useHarpoon();
      }, 500);
    } else {
      setHarpoonModal(true);
    }
  };

  const moveObject = () => {
    Animated.timing(translateX, {
      toValue: Dimensions.get("screen").width, // Move forward
      duration: 1000, // Adjust the duration as needed
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(() => {
      BoatMove();
    });
  };

  const moveObjectBack = () => {
    Animated.timing(translateX, {
      toValue: -150, // Move backward
      duration: 1000, // Adjust the duration as needed
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(() => {
      BoatMove();
    });
  };

  const renderCard = (card: any, index: any) => {
    cardRefs.current.set(index, React.createRef());

    let formattedAddress;
    if (card?.location?.formattedAddress) {
      const location_parts = card?.location?.formattedAddress.split(",");
      formattedAddress = `${location_parts[0]},\n${location_parts[1]}`;
    }

    return (
      <GestureFlipView
        key={index}
        ref={cardRefs.current.get(index)}
        width={widthPercentageToDP(90)}
        height={widthPercentageToDP(80)}
      >
        {/* Card Front */}
        <Pressable
          onPress={() => {
            const now = new Date().getTime();
            if (now - lastPress < 1000) {
              // If less than 5000ms since last press, discard press event
              return;
            }

            // Update last press time and disable the button temporarily
            setLastPress(now);

            // Enable the button after 5000ms
            setTimeout(() => {
              handleFlip();
            }, 1000);
          }}
          style={styles().cardFrontMainCont}
        >
          {index === cardIndex && (
            <Animated.View style={styles(overlayOpacity).overlay}>
              <Image
                source={require("../../assets/starboardOverlay.png")}
                style={styles().overlayImg}
                resizeMode="cover"
              />
            </Animated.View>
          )}

          {index === cardIndex && (
            <Animated.View style={styles(overlayOpacity1).overlay}>
              <Image
                source={require("../../assets/portOverlay.png")}
                style={styles().overlayImg}
                resizeMode="cover"
              />
            </Animated.View>
          )}

          {index === cardIndex && (
            <Animated.View style={styles(overlayOpacity2).overlay}>
              <Image
                source={require("../../assets/harpoonOverlay.png")}
                style={styles().overlayImg}
                resizeMode="cover"
              />
            </Animated.View>
          )}

          <View style={styles().cardFronInnerMainCont}>
            <View style={styles().cardFrontInnerTopCont}>
              <View style={styles().cardFrontImgCont}>
                {card?.mainImage && (
                  <Image
                    source={{ uri: card?.mainImage }}
                    style={styles().cardFrontImg}
                  />
                )}
              </View>

              <Text style={styles().cardFrontName}>{card?.userName}</Text>
              {/* <Text style={styles().cardFrontLocation}>{card?.location}</Text> */}
            </View>

            <View style={styles().cardFrontGreyDivider} />

            <View style={styles().cardFrontBottomCont}>
              {card?.dateOfBirth && (
                <Text style={styles().cardFrontBottomTxt}>
                  {moment().diff(card?.dateOfBirth, "years")}
                </Text>
              )}

              <View style={styles().cardFrontBottomDivider} />
              <Text
                style={styles().cardFrontBottomLocationTxt}
                numberOfLines={2}
              >
                {formattedAddress}
              </Text>
              {/* <View style={styles().cardFrontBottomDivider} />
              <Text style={styles().cardFrontBottomTxt}>
                {card?.seeking.replaceAll("_", " ")}
              </Text> */}
            </View>
          </View>
        </Pressable>

        {/* Card Back */}
        <View style={styles().cardBackCont}>
          {index === cardIndex && (
            <Animated.View style={styles(overlayOpacity).overlay}>
              <Image
                source={require("../../assets/starboardOverlay.png")}
                style={styles(flipped).overlayImg}
                resizeMode="cover"
              />
            </Animated.View>
          )}

          {index === cardIndex && (
            <Animated.View style={styles(overlayOpacity1).overlay}>
              <Image
                source={require("../../assets/portOverlay.png")}
                style={styles(flipped).overlayImg}
                resizeMode="cover"
              />
            </Animated.View>
          )}

          {index === cardIndex && (
            <Animated.View style={styles(overlayOpacity2).overlay}>
              <Image
                source={require("../../assets/harpoonOverlay.png")}
                style={styles(flipped).overlayImg}
                resizeMode="cover"
              />
            </Animated.View>
          )}
          <View style={styles().backCardInnerCont}>
            <Pressable
              style={styles().backCardFlip}
              onPress={() => {
                const now = new Date().getTime();
                if (now - lastPress < 1000) {
                  // If less than 5000ms since last press, discard press event
                  return;
                }

                // Update last press time and disable the button temporarily
                setLastPress(now);

                // Enable the button after 5000ms
                setTimeout(() => {
                  handleFlip();
                }, 1000);
              }}
            >
              <View style={styles().carousalImgCont}>
                {card?.mainImage && (
                  <Image
                    source={{ uri: card?.mainImage }}
                    style={styles().carousalImg}
                    resizeMode="cover"
                    // resizeMode="stretch"
                  />
                )}
              </View>

              <Text style={styles().cardFrontName}>{card?.userName}</Text>

              <View style={styles().cardBackABoutCont}>
                <View style={styles().cardBackAbout1}>
                  <Text style={styles().cardBackAboutTxt}>Age</Text>
                  <Text style={styles().cardBackAboutTxt}>
                    {moment().diff(card?.dateOfBirth, "years")}
                  </Text>
                </View>

                <View style={styles().cardBackAboutDivider} />

                <View style={styles().cardBackLocationCont}>
                  {/* {locationText?.map((line: string, index: number) => (
                  <Text style={styles().cardBackLocationTxt} key={index}>
                    {line}
                  </Text>
                ))} */}
                  <Text style={styles().cardBackLocationTxt} numberOfLines={2}>
                    {formattedAddress}
                  </Text>
                </View>

                <View style={styles().cardBackAboutDivider} />

                <View style={styles().cardBackAbout1}>
                  <Text style={styles().cardBackAboutTxt}>Seeking</Text>
                  <Text style={styles().cardBackAboutTxt} numberOfLines={2}>
                    {card?.seeking == "MALE_SEA_CAPTAIN"
                      ? "Male Sea Captains"
                      : card?.seeking == "FEMALE_SEA_CAPTAIN"
                      ? "Female Sea Captains"
                      : card?.seeking == "MALE"
                      ? "Men"
                      : card?.seeking == "FEMALE"
                      ? "Women"
                      : card?.seeking == "MALE_AND_FEMALE"
                      ? "Men & Women"
                      : card?.seeking == "OTHER"
                      ? "Other"
                      : "All"}
                  </Text>
                </View>
              </View>

              <Text style={styles().cardBackBio} numberOfLines={4}>
                {card?.description}
              </Text>
            </Pressable>
            <CustomButton
              BtnContstyle={styles().onBtnCont}
              text="View Profile"
              textStyle={styles().btnTxt}
              onPress={() => {
                props?.navigation?.navigate("USERPROFILE", {
                  profileData: card,
                  routeFrom: "GAMESCREEN",
                });
              }}
            />
          </View>
        </View>
      </GestureFlipView>
    );
  };

  // Calculate the progress percentage
  const progressPercentage = progress.interpolate({
    inputRange: [0, 100], // Range of counter values
    outputRange: ["0%", "100%"], // Corresponding width values
  });

  const animatedStyle = {
    transform: [
      { translateX: translateX },
      {
        rotateY: rotation.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "180deg"],
        }),
      },
    ],
  };

  const onPressIn = () => {
    Animated.timing(portAnimBtn, {
      toValue: SHADOW_HEIGHT,
      duration: 100,
      useNativeDriver: true,
    }).start();
    setDisabled(true);
    // Set overlayOpacity1 to 1 without animation
    overlayOpacity1.setValue(1);
  };

  const onPressOut = () => {
    Animated.timing(portAnimBtn, {
      toValue: 0,
      duration: 0,
      useNativeDriver: true,
    }).start();

    overlayOpacity1.setValue(0);

    const now = new Date().getTime();
    if (now - lastPress < 800) {
      return;
    }

    // Update last press time and disable the button temporarily
    setLastPress(now);
    setDisabled(true);

    // Perform other actions without animation
    createMatch("PORT");
    swipRef?.current?.swipeLeft();
  };

  const onScopePressIn = () => {
    Animated.timing(scopeAnimBtn, {
      toValue: SHADOW_HEIGHT,
      duration: 100,
      useNativeDriver: true,
    }).start();

    const now = new Date().getTime();
    if (now - lastPress < 800) {
      return;
    }
  };

  const onScopePressOut = () => {
    Animated.timing(scopeAnimBtn, {
      toValue: 0,
      duration: 0, // Adjust duration as needed
      useNativeDriver: true,
    }).start();

    // Check if handleFlip is necessary to call here
    handleFlip();
  };

  const onStarboardPressIn = () => {
    Animated.timing(starboardAnimBtn, {
      toValue: SHADOW_HEIGHT,
      duration: 100,
      useNativeDriver: true,
    }).start();
    setDisabled(true);
    // Set overlayOpacity1 to 1 without animation
    overlayOpacity.setValue(1);
  };

  const onStarboardPressOut = () => {
    Animated.timing(starboardAnimBtn, {
      toValue: 0,
      duration: 0,
      useNativeDriver: true,
    }).start();

    overlayOpacity.setValue(0);

    const now = new Date().getTime();
    if (now - lastPress < 800) {
      return;
    }

    // Update last press time and disable the button temporarily
    setLastPress(now);

    createMatch("STAR_BOARD");
    swipRef?.current?.swipeRight();
  };

  // Debounce the onPressIn and onPressOut functions
  const debouncedOnPressIn = useCallback(
    debounce(onPressIn, 100, { leading: true, trailing: false }),
    [onPressIn]
  );
  const debouncedOnPressOut = useCallback(
    debounce(onPressOut, 500, { leading: false, trailing: true }),
    [onPressOut]
  );

  const debouncedonScopePressIn = useCallback(
    debounce(onScopePressIn, 100, { leading: true, trailing: false }),
    [onScopePressIn]
  );
  const debouncedonScopePressOut = useCallback(
    debounce(onScopePressOut, 100, { leading: false, trailing: true }),
    [onScopePressOut]
  );

  const debouncedonStarboardPressIn = useCallback(
    debounce(onStarboardPressIn, 100, { leading: true, trailing: false }),
    [onStarboardPressIn]
  );
  const debouncedonStarboardPressOut = useCallback(
    debounce(onStarboardPressOut, 500, { leading: false, trailing: true }),
    [onStarboardPressOut]
  );

  return (
    <View style={styles(darkMode).mainCont}>
      {/* backgound Animation */}
      <Animated.View
        style={[
          styles().backgroundContainer,
          { transform: [{ translateX: imageTranslateX }] },
        ]}
      >
        {images.map((image, index) => (
          <ImageBackground
            key={index}
            source={image}
            style={styles().backgroundImage}
            resizeMode={darkMode ? "cover" : "cover"}
          >
            {index % 4 === 3 && (
              <Image
                source={require("../../assets/lighthouse.png")}
                style={styles().lightHouse}
                resizeMode="cover"
              />
            )}

            {index % 4 === 2 && (
              <Image
                source={require("../../assets/buoy.gif")}
                style={styles().buoy}
                resizeMode="contain"
              />
            )}
          </ImageBackground>
        ))}
      </Animated.View>

      <View style={styles().topCont}>
        <Pressable
          style={styles().leftCont}
          onPress={() => props?.navigation?.navigate("MYCATCHES")}
        >
          <ImageBackground
            source={require("../../assets/CaptianCounter.png")}
            imageStyle={styles().captianCounter}
            // style={styles().captainCounterCont}
            resizeMode="contain"
          >
            <Text style={styles(totalMatches).matchesTxt}>{totalMatches}</Text>
          </ImageBackground>
        </Pressable>
        <View style={styles().topMidCont}>
          <View style={styles().topMidBarCont}>
            <Image
              source={require("../../assets/topStaricon.png")}
              style={styles().topMidBarImg}
              resizeMode="contain"
            />
            <View style={styles(darkMode).topMidBarOuter}>
              <Animated.View style={styles(progressPercentage).progressBar} />
            </View>
          </View>
          <View style={styles().harpoonBeaconCont}>
            <Pressable
              onPress={() => setHarpoonModal(true)}
              style={styles().harpoonCont}
            >
              <Image
                source={require("../../assets/harpoonIcon.png")}
                style={styles().harpoonIcon}
                resizeMode="contain"
              />
              <Text style={styles().xStyle}>x</Text>
              <Text style={styles().harpoonTxt}>{totalHarpoons}</Text>
            </Pressable>

            <Pressable
              onPress={() => props?.navigation?.navigate("BEACON")}
              style={styles().timerCont}
            >
              <Image
                source={require("../../assets/beacon.png")}
                style={styles().beaconIcon}
                resizeMode="contain"
              />
              {formattedTime != "" ? (
                <Text
                  style={styles(true).beaconTxt}
                >{` ${formattedTime}`}</Text>
              ) : (
                <>
                  <Text style={styles().xStyle}>x</Text>
                  <Text style={styles().beaconTxt}>{totalBeacons}</Text>
                </>
              )}
            </Pressable>
          </View>
        </View>

        <View style={styles().rightcont}>
          <ImageBackground
            source={require("../../assets/compusBack.png")}
            style={styles().compas}
            resizeMode="contain"
          >
            <Animated.View style={styles(needleRotate).needleAnimate}>
              <Image
                style={styles().needleStyle}
                resizeMode="contain"
                source={require("../../assets/compusNeedle.png")}
              />
            </Animated.View>
          </ImageBackground>
        </View>
      </View>

      {/* Waves Animation */}
      <View style={styles().wavesCont}>
        {/* Boat Animation */}
        <Animated.View style={[styles().movie, animatedStyle]}>
          <Image
            style={[styles(translateX).boatImg]}
            source={require("../../assets/boat.png")}
            resizeMode="contain"
          />
        </Animated.View>
        <View style={styles().wavesInnerCont}>
          <Animated.View
            style={[
              { transform: [{ translateY: animated }] },
              styles().wave1Animate,
            ]}
          >
            <View style={styles().wave1}>
              <Image
                tintColor={"#29708e"}
                style={styles().waveImg}
                source={require("../../assets/layer.png")}
                resizeMode="stretch"
              />
            </View>
          </Animated.View>

          <Animated.View
            style={[
              { transform: [{ translateY: animated2 }] },
              styles().wave2Animate,
            ]}
          >
            <View style={styles().wave2}>
              <Image
                tintColor={"#3286a9"}
                style={styles().waveImg}
                source={require("../../assets/layer.png")}
                resizeMode="stretch"
              />
            </View>
          </Animated.View>

          <Animated.View style={[{ transform: [{ translateY: animated3 }] }]}>
            <View style={styles().wave3}>
              <Image
                tintColor={"#29708e"}
                style={styles().waveImg}
                source={require("../../assets/layer.png")}
                resizeMode="stretch"
              />
            </View>
          </Animated.View>
        </View>
      </View>

      {showOcto && <Octopus />}

      {/* Wheel Animation */}
      <Animated.View style={styles(spin, height).wheel}>
        <Image
          style={styles().wheelImg}
          resizeMode="contain"
          source={require("../../assets/wheel.png")}
        />
      </Animated.View>

      {/* Card Swiper */}
      {!(showOcto || showSwipModal) && (
        <View style={styles(flipped, screenHeight).swiperCont}>
          <Swiper
            ref={swipRef}
            onSwipedAll={getUsers}
            key={cardsArray.length}
            cards={cardsArray}
            renderCard={renderCard}
            cardVerticalMargin={2}
            cardIndex={cardIndex}
            stackSeparation={screenHeight < 750 ? 4 : 1}
            stackSize={cardsArray.length > 4 ? 4 : cardsArray.length}
            disableBottomSwipe={true}
            disableTopSwipe={true}
            disableLeftSwipe={disabled}
            disableRightSwipe={disabled}
            onSwipedLeft={() => {
              const now = new Date().getTime();
              if (now - lastPress < 1500) {
                // If less than 5000ms since last press, discard press event
                return;
              }

              // Update last press time and disable the button temporarily
              setLastPress(now);
              setDisabled(true);

              // Enable the button after 5000ms
              setTimeout(() => {
                setDisabled(false);
              }, 1500);
              !disabled && createMatch("PORT");
            }}
            onSwipedRight={() => {
              const now = new Date().getTime();
              if (now - lastPress < 1500) {
                // If less than 5000ms since last press, discard press event
                return;
              }

              // Update last press time and disable the button temporarily
              setLastPress(now);
              setDisabled(true);

              // Enable the button after 5000ms
              setTimeout(() => {
                setDisabled(false);
              }, 1500);
              !disabled && createMatch("STAR_BOARD");
            }}
            overlayLabelWrapperStyle={styles().overLayLableWrapper}
            overlayLabels={{
              left: {
                element: (
                  <Image
                    source={require("../../assets/portOverlay.png")}
                    style={{
                      top: flipped
                        ? heightPercentageToDP(10)
                        : screenHeight < 750
                        ? heightPercentageToDP(3.4)
                        : heightPercentageToDP(0),
                      height: flipped
                        ? screenHeight < 750
                          ? heightPercentageToDP(45)
                          : heightPercentageToDP(40)
                        : heightPercentageToDP(58),
                      left: flipped
                        ? widthPercentageToDP(14)
                        : widthPercentageToDP(3),
                      width: flipped
                        ? widthPercentageToDP(70)
                        : widthPercentageToDP(105),
                    }}
                    resizeMode="contain"
                  />
                ),
              },
              right: {
                element: (
                  <Image
                    source={require("../../assets/starboardOverlay.png")}
                    style={{
                      top: flipped
                        ? heightPercentageToDP(10)
                        : screenHeight < 750
                        ? heightPercentageToDP(3.4)
                        : heightPercentageToDP(0),
                      height: flipped
                        ? screenHeight < 750
                          ? heightPercentageToDP(45)
                          : heightPercentageToDP(40)
                        : heightPercentageToDP(58),
                      left: flipped
                        ? widthPercentageToDP(5.5)
                        : widthPercentageToDP(-18),
                      width: flipped
                        ? widthPercentageToDP(70)
                        : widthPercentageToDP(105),
                    }}
                    resizeMode="contain"
                  />
                ),
              },
            }}
          />
        </View>
      )}

      {/* Buttons */}
      <View style={styles().bottomCont}>
        <TouchableOpacity
          style={[styles().bottomBtn, { height: ITEM_HEIGHT + SHADOW_HEIGHT }]}
          activeOpacity={1}
          onPressIn={debouncedOnPressIn}
          onPressOut={debouncedOnPressOut}
          disabled={showOcto || gameLoading || disabled ? true : false}
        >
          <Animated.View style={{ transform: [{ translateY: portAnimBtn }] }}>
            <Image
              source={require("../../assets/port.png")}
              style={styles().portStarIcon}
              resizeMode={"contain"}
            />
          </Animated.View>

          <Text style={styles().portTxt}>Port</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles().bottomBtn, { height: ITEM_HEIGHT + SHADOW_HEIGHT }]}
          activeOpacity={1}
          disabled={showOcto || gameLoading || disabled ? true : false}
          onPressIn={debouncedonScopePressIn}
          onPressOut={debouncedonScopePressOut}
          // onPressOut={topSwipe}
        >
          <Animated.View style={{ transform: [{ translateY: scopeAnimBtn }] }}>
            <Image
              source={require("../../assets/scope.png")}
              style={styles().scopeIcon}
              resizeMode="contain"
            />
          </Animated.View>

          <Text style={styles().scopeTxt}>Scope</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles().bottomBtn, { height: ITEM_HEIGHT + SHADOW_HEIGHT }]}
          activeOpacity={1}
          disabled={showOcto || gameLoading || disabled ? true : false}
          onPressIn={debouncedonStarboardPressIn}
          onPressOut={debouncedonStarboardPressOut}
        >
          <Animated.View
            style={{ transform: [{ translateY: starboardAnimBtn }] }}
          >
            <Image
              source={require("../../assets/starboard.png")}
              style={styles().portStarIcon}
              resizeMode="contain"
            />
          </Animated.View>
          <Text style={styles().starboadTxt}>Starboard</Text>
        </TouchableOpacity>
      </View>

      {showSwipModal && (
        <SwipsModal
          visible={showSwipModal}
          swipesDate={swipesDate}
          onClose={() => {
            props?.navigation?.reset({
              index: 0,
              routes: [{ name: "HOMESCREEN" }],
            });
            setShowSwipModal(false);
          }}
          onPress={() => {
            setShowSwipModal(false);
            props?.navigation?.replace("UPGRADE");
          }}
        />
      )}

      <MatchModal
        visible={isMatch}
        onClose={() => {
          setIsMatch(false);
        }}
        userProfile={matchProfile}
        onPress={() => {
          isViewMessageLog
            ? props?.navigation?.navigate("CHAT", {
                profileData:
                  matchedData?.resp?.likeBy == userID
                    ? matchedData?.resp?.likeTo
                    : matchedData?.resp?.likeBy,
                chatID: matchedData?.chat,
                matchID: matchedData?.resp?._id,
              })
            : props?.navigation?.navigate("MESSAGINGLAW");
          setIsMatch(false);
        }}
      />

      <HarpoonModal
        harpoons={totalHarpoons}
        visible={harpoonModal}
        onPress={() => {
          props?.navigation?.navigate("UPGRADE");
          setHarpoonModal(false);
        }}
        onClose={() => setHarpoonModal(false)}
      />

      {showUsersModal && (
        <NoMoreUsersModal
          visible={showUsersModal}
          onPress={() => {
            setShowUsersModal(false);
            getUsers();
          }}
          onClose={() => {
            props?.navigation?.reset({
              index: 0,
              routes: [{ name: "HOMESCREEN" }],
            });
            setShowUsersModal(false);
          }}
        />
      )}
      <GameLoader isVisible={gameLoading} />
      <Loader isVisible={loading} />
    </View>
  );
}

const styles = (props?: any, height?: any) =>
  StyleSheet.create({
    mainCont: {
      flex: 1,
      alignItems: "center",
    },
    backgroundContainer: {
      flexDirection: "row",
      position: "absolute",
      top: 0,
      left: 0,
    },
    backgroundImage: {
      width: widthPercentageToDP(100), // Adjust this value based on the number of images
      height: heightPercentageToDP(100),
    },
    topCont: {
      marginTop: heightPercentageToDP(1),
      flexDirection: "row",
      justifyContent: "space-between",
      width: widthPercentageToDP(98),
    },
    leftCont: {
      top: heightPercentageToDP(-2),
      width: widthPercentageToDP(25),
      height: heightPercentageToDP(10),
    },
    captainCounterCont: {
      width: widthPercentageToDP(23),
      alignItems: "center",
      justifyContent: "center",
    },
    captianCounter: {
      width: widthPercentageToDP(27),
      height: heightPercentageToDP(13),
    },
    topMidCont: { flex: 0.92 },
    topMidBarCont: { flexDirection: "row", alignItems: "center" },
    topMidBarImg: { width: 31, height: 31 },
    topMidBarOuter: {
      marginLeft: 5,
      flex: 1,
      borderWidth: 1,
      borderColor: Theme.APP_WHITE_COLOR,
      borderRadius: 10,
      height: 10,
      shadowColor: Theme.APP_BLACK_COLOR,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.5,
      shadowRadius: 3.84,
      elevation: 5,
      backgroundColor: props ? Theme.APP_BLACK_COLOR : Theme.APP_GAME_SKY_BLUE,
      overflow: "hidden",
    },
    progressBar: {
      width: props,
      height: 8,
      shadowRadius: 3.84,
      backgroundColor: Theme.APP_GREEN,
      shadowColor: Theme.APP_BLACK_COLOR,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.5,
    },
    rightcont: {
      top: -4,
      alignItems: "center",
      right: widthPercentageToDP(0.5),
    },
    compas: {
      width: widthPercentageToDP(15),
      height: heightPercentageToDP(8),
      alignItems: "center",
      justifyContent: "center",
    },
    needleAnimate: { transform: [{ rotate: props }] },
    needleStyle: {
      width: widthPercentageToDP(10),
      height: heightPercentageToDP(6.2),
    },

    harpoonBeaconCont: {
      flexDirection: "row",
      justifyContent: "space-between",
      height: heightPercentageToDP(4),
      marginTop: heightPercentageToDP(0.5),
    },
    harpoonCont: {
      left: 3,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Theme.APP_HARPOON_BLUE,
      borderRadius: 20,
      paddingVertical: 4,
      shadowColor: Theme.APP_BLACK_COLOR,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      justifyContent: "space-evenly",
      width: widthPercentageToDP(23),
    },
    harpoonIcon: {
      width: widthPercentageToDP(5),
      height: heightPercentageToDP(3),
    },
    matchesTxt: {
      // top:
      //   Platform.OS == "ios" && screenHeight >= 812
      //     ? heightPercentageToDP(2.6)
      //     : Platform.OS == "android" && screenHeight <= 851
      //     ? heightPercentageToDP(2)
      //     : heightPercentageToDP(1.6),
      top:
        Platform.OS === "ios"
          ? screenHeight >= 812
            ? heightPercentageToDP(2.6)
            : heightPercentageToDP(1.5)
          : heightPercentageToDP(1.8),
      position: "absolute",
      right: props > 10 ? 3 : 8,
      fontSize: 17,
      color: Theme.APP_WHITE_COLOR,
      fontFamily: fonts.VarelaRoundRegular,
      textShadowColor: Theme.APP_BLACK_COLOR,
      textShadowOffset: { width: 0.17, height: 0.17 },
      textShadowRadius: 1,
    },
    harpoonTxt: {
      fontSize: 17,
      color: Theme.APP_WHITE_COLOR,
      fontFamily: fonts.VarelaRoundRegular,
      textShadowColor: Theme.APP_BLACK_COLOR,
      textShadowOffset: { width: 0.17, height: 0.17 },
      textShadowRadius: 1,
    },
    beaconCounterCont: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      flex: 0.5,
    },
    beaconTxt: {
      fontSize: 17,
      color: Theme.APP_WHITE_COLOR,
      fontFamily: fonts.VarelaRoundRegular,
      textShadowColor: Theme.APP_BLACK_COLOR,
      textShadowOffset: { width: 0.17, height: 0.17 },
      textShadowRadius: 1,
      top: screenHeight >= 800 && props ? heightPercentageToDP(0.1) : 0,
    },
    xStyle: {
      fontSize: 17,
      color: Theme.APP_WHITE_COLOR,
      fontFamily: fonts.VarelaRoundRegular,
      textShadowColor: Theme.APP_BLACK_COLOR,
      textShadowOffset: { width: 0.17, height: 0.17 },
      textShadowRadius: 1,
      bottom: 0.5,
    },
    timerCont: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
      backgroundColor: Theme.APP_SETTING_DARK_YELLOW,
      borderRadius: 20,
      paddingVertical: 4,
      alignSelf: "flex-end",
      shadowColor: Theme.APP_BLACK_COLOR,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      width: widthPercentageToDP(23),
    },
    beaconIcon: {
      width: widthPercentageToDP(5),
      height: heightPercentageToDP(3),
    },

    bottomCont: {
      backgroundColor: Theme.APP_WHITE_COLOR,
      position: "absolute",
      bottom: 0,
      height: widthPercentageToDP(14),
      width: widthPercentageToDP(100),
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
    },
    bottomBtn: {
      alignItems: "center",
      top: heightPercentageToDP(screenHeight > 750 ? -1 : 1),
    },
    portStarIcon: {
      width: widthPercentageToDP(40),
      height: heightPercentageToDP(11),
    },
    scopeIcon: {
      width: widthPercentageToDP(30),
      height: heightPercentageToDP(9),
      top: heightPercentageToDP(2),
    },
    portTxt: {
      top: heightPercentageToDP(-0.5),
      fontSize: 20,
      fontFamily: fonts.Questrail,
      color: Theme.APP_PORT_RED,
      textShadowColor: Theme.APP_BLACK_COLOR,
      textShadowOffset: { width: 0.17, height: 0.17 },
      textShadowRadius: 1,
    },
    scopeTxt: {
      top: heightPercentageToDP(1.5),
      fontSize: 20,
      fontFamily: fonts.Questrail,
      color: Theme.APP_SCOPE_YELLOW,
      textShadowColor: Theme.APP_BLACK_COLOR,
      textShadowOffset: { width: 0.17, height: 0.17 },
      textShadowRadius: 1,
    },
    starboadTxt: {
      top: heightPercentageToDP(-0.5),
      fontSize: 20,
      fontFamily: fonts.Questrail,
      color: Theme.APP_STARBOARD_GREEN,
      textShadowColor: Theme.APP_BLACK_COLOR,
      textShadowOffset: { width: 0.17, height: 0.17 },
      textShadowRadius: 1,
    },
    wavesCont: {
      position: "absolute",
      bottom: 0,
      width: widthPercentageToDP(100),
    },
    wavesInnerCont: {
      height: 180,
    },
    wave1: {
      bottom:
        Platform.OS == "android"
          ? heightPercentageToDP(3)
          : heightPercentageToDP(-0.5),
      height: 50,
      width: "100%",
      zIndex: 3, // works on ios
      elevation: 3, // works on android,
    },
    waveImg: { width: "100%", height: "100%" },
    wave1Animate: { bottom: -65 },
    wave2: {
      height: 50,
      width: "100%",
      zIndex: 3, // works on ios
      elevation: 3, // works on android,
    },
    wave2Animate: { bottom: -30 },
    wave3Animate: { bottom: 10 },
    wave4Animate: { bottom: 0 },
    wave3: {
      height: 50,
      width: "100%",
      zIndex: 3, // works on ios
      elevation: 3, // works on android,
    },
    movie: {
      width: "100%",
      height: 100,
      position: "absolute",
      top: Platform.OS == "android" ? heightPercentageToDP(-4.8) : -13,
    },
    boatImg: {
      height: 90,
      width: 150,
      transform: [{ rotateY: props ? "180deg" : "0deg" }],
    },
    wheel: {
      position: "absolute",
      bottom:
        height > 670 ? heightPercentageToDP(-8) : heightPercentageToDP(-12),
      transform: [{ rotate: props }],
    },
    wheelImg: {
      height: widthPercentageToDP(70),
      width: widthPercentageToDP(55),
    },
    swiperCont: {
      top: props
        ? height <= 750
          ? heightPercentageToDP(6)
          : height <= 851
          ? heightPercentageToDP(8)
          : heightPercentageToDP(10)
        : !props
        ? height <= 750
          ? heightPercentageToDP(7)
          : height <= 851
          ? heightPercentageToDP(9)
          : heightPercentageToDP(10)
        : heightPercentageToDP(10),
      width: widthPercentageToDP(100),
      justifyContent: "center",
    },
    cardFrontMainCont: {
      width: widthPercentageToDP(65),
      flex: 1,
      borderRadius: 20,
      backgroundColor: Theme.APP_WHITE_COLOR,
      alignSelf: "center",
      borderWidth: 3,
      borderColor: Theme.APP_DARK_GREY,
      padding: 5,
    },
    cardFronInnerMainCont: {
      flex: 1,
      backgroundColor: Theme.APP_CARD_BACKGROUND,
      borderRadius: 18,
      borderWidth: 1.5,
      borderColor: Theme.APP_DARK_GREY,
    },
    cardFrontInnerTopCont: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    cardFrontImgCont: {
      borderWidth: 4,
      borderColor: Theme.APP_YELLOW,
      shadowColor: Theme.APP_BLACK_COLOR,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      backgroundColor: Theme.APP_BACKGROUND_COLOR,
      alignItems: "center",
      justifyContent: "center",
      width: widthPercentageToDP(40),
      height: widthPercentageToDP(40),
      borderRadius: widthPercentageToDP(40) / 2,
    },
    cardFrontImg: {
      width: widthPercentageToDP(38),
      height: widthPercentageToDP(38),
      borderRadius: widthPercentageToDP(38) / 2,
    },
    cardFrontName: {
      marginTop: 12,
      fontSize: 20,
      fontFamily: fonts.RobotoRegular,
      color: Theme.APP_RED_COLOR,
      textShadowColor: Theme.APP_BLACK_COLOR,
      textShadowOffset: { width: 0.17, height: 0.17 },
      textShadowRadius: 1,
    },
    cardFrontLocation: {
      marginTop: heightPercentageToDP(1.5),
      fontSize: 16,
      fontFamily: fonts.RobotoRegular,
      color: Theme.APP_CARD_GREY_TXT,
    },
    cardFrontGreyDivider: {
      height: 10,
      width: "100%",
      backgroundColor: Theme.APP_CARD_SPACE_GREY,
    },
    cardFrontBottomCont: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      width: "100%",
      paddingVertical: heightPercentageToDP(1.5),
      borderColor: Theme.APP_CARD_SPACE_GREY,
      borderWidth: 1,
      borderBottomLeftRadius: 18,
      borderBottomRightRadius: 18,
      backgroundColor: Theme.APP_WHITE_COLOR,
    },
    cardFrontBottomTxt: {
      fontSize: 16,
      color: Theme.APP_RED_COLOR,
      fontFamily: fonts.RobotoRegular,
      textTransform: "capitalize",
      textAlign: "center",
    },
    cardFrontBottomLocationTxt: {
      fontSize: 16,
      color: Theme.APP_RED_COLOR,
      fontFamily: fonts.RobotoRegular,
      textTransform: "capitalize",
      textAlign: "center",
      flex: 0.7,
    },
    cardFrontBottomDivider: {
      borderWidth: 0.5,
      height: 28,
      borderColor: Theme.APP_BORDER_GREY,
    },
    cardBackCont: {
      alignItems: "center",
      borderRadius: 20,
      backgroundColor: Theme.APP_WHITE_COLOR,
      alignSelf: "center",
      borderWidth: 3,
      borderColor: Theme.APP_DARK_GREY,
      padding: 5,
    },
    backCardInnerCont: {
      paddingHorizontal: 10,
      alignItems: "center",
      backgroundColor: Theme.APP_CARD_BACKGROUND,
      borderRadius: 18,
      borderWidth: 1.5,
      borderColor: Theme.APP_DARK_GREY,
      zIndex: 1,
    },
    backCardFlip: { alignItems: "center" },
    carousalStyle: {
      marginTop: 10,
      borderRadius: 12,
    },
    carousalImgCont: {
      backgroundColor: Theme.APP_BACKGROUND_COLOR,
      shadowColor: Theme.APP_BLACK_COLOR,
      shadowOffset: {
        width: 1,
        height: 0,
      },
      shadowOpacity: 1,
      shadowRadius: 2,
      elevation: 5,
      marginTop: heightPercentageToDP(1),
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      borderColor: Theme.APP_YELLOW,
      borderWidth: 4,
    },
    carousalImg: {
      width: widthPercentageToDP(80),
      height: heightPercentageToDP(26),
    },
    cardBackABoutCont: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      width: "100%",
      marginTop: heightPercentageToDP(1),
    },
    cardBackAbout1: { alignItems: "center", flex: 0.5 },
    cardBackAboutTxt: {
      fontSize: 14,
      color: Theme.APP_RED_COLOR,
      fontFamily: fonts.RobotoRegular,
      textTransform: "capitalize",
      textAlign: "center",
      flex: 1,
      paddingHorizontal: 5,
    },
    cardBackAboutDivider: {
      borderWidth: 0.5,
      height: "100%",
      borderColor: Theme.APP_BORDER_GREY,
    },
    cardBackLocationCont: { flex: 0.8 },
    cardBackLocationTxt: {
      textAlign: "center",
      color: Theme.APP_RED_COLOR,
      fontFamily: fonts.RobotoRegular,
      paddingHorizontal: 5,
      // flex: 1,
    },
    cardBackBio: {
      height: heightPercentageToDP(8),
      marginTop: heightPercentageToDP(1),
      color: Theme.APP_BLACK_COLOR,
      fontSize: 13,
      fontFamily: fonts.RobotoRegular,
      alignSelf: "flex-start",
    },
    cardBackIceBreaker: { marginTop: 20, alignSelf: "flex-start" },
    cardBackInterestsHeading: { marginTop: 20 },
    cardBackInterestsCont: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    cardBackInterestsView: {
      backgroundColor: "red",
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 15,
      marginRight: 10,
      marginTop: 10,
    },
    cardBackInterestsTxt: { color: "white" },
    decorationTxt: { textDecorationLine: "underline" },
    onBtnCont: {
      marginTop: heightPercentageToDP(1),
      marginBottom: 10,
      backgroundColor: Theme.APP_LIGHT_BLUE,
      width: widthPercentageToDP(40),
      paddingVertical: heightPercentageToDP(1),
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
    overlay: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 10,
      opacity: props,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      borderRadius: 20,
      borderWidth: 10,
      borderColor: Theme.APP_WHITE_COLOR,
      pointerEvents: "none",
    },
    overlayImg: {
      width: props ? "110%" : "120%",
      height: screenHeight < 750 ? (props ? "100%" : "100%") : "100%",
    },
    overLayLableWrapper: {
      top: heightPercentageToDP(-10),
      justifyContent: "center",
      position: "absolute",
      zIndex: 1,
      flex: 1,
    },
    lightHouse: {
      width: widthPercentageToDP(25),
      height: heightPercentageToDP(18),
      position: "absolute",
      bottom: heightPercentageToDP(
        Platform.OS == "ios"
          ? screenHeight < 750
            ? 22.8
            : 22
          : screenHeight < 851
          ? 22
          : 20
      ),
      alignSelf: "flex-end",
    },
    buoy: {
      width: widthPercentageToDP(30),
      height: heightPercentageToDP(15),
      position: "absolute",
      bottom: heightPercentageToDP(
        Platform.OS == "ios"
          ? screenHeight < 750
            ? 22.8
            : 21
          : screenHeight < 851
          ? 22
          : 20
      ),
      alignSelf: "flex-end",
    },
  });
