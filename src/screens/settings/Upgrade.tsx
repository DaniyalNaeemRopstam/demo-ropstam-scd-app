import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import fonts from "../../utils/fonts";
import { widthPercentageToDP } from "react-native-responsive-screen";
import Theme from "../../utils/theme";
import { useDispatch, useSelector } from "react-redux";
import { premiumUserAsynThunk } from "../../redux/features/ProfileSlice";
import Loader from "../../components/loader/Loader";
import { CustomErrorToast } from "../../helpers/CustomToast";
import { setPremium } from "../../redux/features/AuthSlice";
// import {             // for later use once app is udloaded
//   initConnection,
//   purchaseErrorListener,
//   purchaseUpdatedListener,
//   // type ProductPurchase,
//   // PurchaseError,
//   flushFailedPurchasesCachedAsPendingAndroid,
//   finishTransaction,
//   getProducts,
//   requestPurchase,
//   endConnection,
//   // validateReceiptIos,
//   // requestSubscription,
//   // useIAP,
// } from "react-native-iap";
// import { APP_STORE_SECRET } from "@env";

export default function Upgrade(props?: any) {
  const { token } = useSelector((state: any) => state.login);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // useEffect(() => {     // for later use once app is udloaded
  //   const initializeConnection = async () => {
  //     try {
  //       await initConnection();
  //       if (Platform.OS === "android") {
  //         await flushFailedPurchasesCachedAsPendingAndroid();
  //       }
  //     } catch (error: any) {
  //       // console.error("An error occurred1", error.message);
  //     }
  //   };

  //   const purchaseUpdateSubscription = purchaseUpdatedListener(
  //     async (purchase) => {
  //       const receipt = purchase.transactionReceipt;
  //       // console.log({ receipt });

  //       if (receipt) {
  //         try {
  //           await finishTransaction({ purchase, isConsumable: true });
  //         } catch (error: any) {
  //           // console.error("An error occurred2", error.message);
  //         }
  //       }
  //     }
  //   );

  //   const purchaseErrorSubscription = purchaseErrorListener(() => {
  //     // console.error("Purchase error", error.message)
  //   });

  //   initializeConnection();
  //   fetchProducts();

  //   const removeSubscriptions = () => {
  //     endConnection();
  //     purchaseUpdateSubscription.remove();
  //     purchaseErrorSubscription.remove();
  //   };

  //   return removeSubscriptions;
  // }, []);

  // const fetchProducts = async () => {
  //   try {
  //     const products = await getProducts({
  //       skus:
  //         Platform.select({
  //           ios: [
  //             "com.seacaptaindate.app.1",
  //             "com.seacaptaindate.app.2",
  //             "com.seacaptaindate.app.3",
  //           ],
  //           // android: ["com.rniap.product100", "com.rniap.product200"],
  //         }) || [], // Provide a default empty array if Platform.select returns undefined
  //     });
  //     // console.log({ products });
  //     setProducts(products);
  //   } catch (error: any) {
  //     // console.error("Error occurred while fetching products", error.message);
  //   }
  // };

  // const makePurchase = async (sku: any) => {
  //   try {
  //     await requestPurchase({ sku });
  //   } catch (error: any) {
  //     console.error("Error making purchase", error.message);
  //   }
  // };

  const upgradeUser = () => {
    const data = {
      token,
      status: true,
    };
    dispatch<any>(premiumUserAsynThunk(data))
      .unwrap()
      .then((result: any) => {
        setLoading(false);
        dispatch(setPremium(result.data?.isPremium)),
          Alert.alert(result.message, "", [
            {
              onPress: () => props?.navigation?.goBack(),
            },
          ]);
      })
      .catch((err: any) => {
        setLoading(false);
        CustomErrorToast(err);
      });
  };
  return (
    <ScrollView
      style={styles.scrollStyle}
      contentContainerStyle={styles.mainCont}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <Text style={styles.heading}>Upgrade to Admiral</Text>
      <Image
        style={styles.admiral}
        source={require("../../assets/mascot-admiral.png")}
        resizeMode="contain"
      />
      <Text style={styles.heading2}>Premium Member Benefits</Text>

      <View style={styles.bulletCont}>
        <Text style={styles.bullets}>
          • <Text style={styles.underline}>Unlimited</Text> Starboard Swipes
        </Text>
        <Text style={styles.bullets}>
          • <Text style={styles.underline}>20x</Text> Harpoons per week
        </Text>
        <Text style={styles.bullets}>
          • <Text style={styles.underline}>5x</Text> Beacons per week
        </Text>
        <Text style={styles.bullets}>
          • <Text style={styles.underline}>Instantly</Text> see who has liked
          your profile
        </Text>
      </View>

      <View style={styles.bottomCont}>
        <Pressable
          style={styles.c1}
          // onPress={() => {
          //   makePurchase("com.seacaptaindate.app.2");
          // }}
        >
          <Text style={styles.c1Txt1}>1 Month</Text>
          <Text style={styles.c1Amount}>$4.99</Text>
          <Text style={styles.billTxt}>Billed monthly</Text>
        </Pressable>

        <Pressable
          style={styles.c2}
          onPress={() => {
            // makePurchase("com.seacaptaindate.app.1");
            upgradeUser();
          }}
        >
          <View style={styles.c2Chip}>
            <Text style={styles.c2ChipTxt}>POPULAR</Text>
          </View>
          <Text style={styles.c2Txt1}>6 Months</Text>
          <Text style={styles.c2OldPriceTxt}>$29.94</Text>
          <Text style={styles.c2NewPriceTxt}>$29.99</Text>
          <Text style={styles.c2SaveTxt}>SAVE 33%</Text>

          <Text style={styles.c2billTxt}>Billed every 6 months</Text>
        </Pressable>

        <Pressable
          style={styles.c1}
          // onPress={() => {
          //   makePurchase("com.seacaptaindate.app.3");
          // }}
        >
          <View style={styles.c1Chip}>
            <Text style={styles.c1ChipTxt}>BEST VALUE</Text>
          </View>
          <Text style={styles.c1Txt1}>1 Year</Text>
          <Text style={styles.c1OldPrice}>$59.88</Text>
          <Text style={styles.c1NewPriceTxt}>$29.99</Text>
          <Text style={styles.c1SaveTxt}>SAVE 50%</Text>
          <Text style={styles.c1Bill2Txt}>Billed yearly</Text>
        </Pressable>
      </View>

      <Text
        style={styles.bottomTxt}
      >{`Select your chosen plan and you\nwill be redirected to the app store`}</Text>
      <Loader isVisible={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollStyle: { flex: 1 },
  mainCont: { flexGrow: 1, alignItems: "center", paddingBottom: 30 },
  heading: {
    marginTop: 17,
    fontSize: 20,
    fontFamily: fonts.VarelaRoundRegular,
    color: Theme.APP_BLACK_COLOR,
  },
  admiral: { width: 112, height: 158, marginTop: 9 },
  heading2: {
    marginTop: 6,
    fontSize: 18,
    fontFamily: fonts.VarelaRoundRegular,
    color: Theme.APP_BLACK_COLOR,
  },
  bulletCont: {
    width: widthPercentageToDP(90),
    marginTop: 16,
    alignItems: "flex-start",
  },
  underline: { textDecorationLine: "underline" },
  bullets: {
    fontSize: 16,
    fontFamily: fonts.VarelaRoundRegular,
    marginBottom: 10,
    color: Theme.APP_BLACK_COLOR,
  },
  bottomCont: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: widthPercentageToDP(100),
  },
  c1: {
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: "center",
    minWidth: widthPercentageToDP(28),
    shadowColor: Theme.APP_BLACK_COLOR,
    backgroundColor: Theme.APP_WHITE_COLOR,
    paddingBottom: 10,
  },
  c1Txt1: {
    marginTop: 23,
    color: Theme.APP_RED_COLOR,
    fontFamily: fonts.VarelaRoundRegular,
    fontSize: 16,
  },
  c1Amount: {
    marginTop: 26,
    fontFamily: fonts.VarelaRoundRegular,
    fontSize: 18,
    color: Theme.APP_BLACK_COLOR,
  },
  billTxt: {
    marginTop: 53,
    fontSize: 8,
    fontFamily: fonts.VarelaRoundRegular,
    color: Theme.APP_BLACK_COLOR,
  },
  c2: {
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: "center",
    minWidth: widthPercentageToDP(32),
    shadowColor: Theme.APP_BLACK_COLOR,
    backgroundColor: Theme.APP_RED_COLOR,
    paddingBottom: 10,
  },
  c2Chip: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: Theme.APP_WHITE_COLOR,
    paddingHorizontal: 10,
    paddingVertical: 5,
    position: "absolute",
    top: -10,
    borderRadius: 20,
  },
  c2ChipTxt: {
    color: Theme.APP_RED_COLOR,
    fontFamily: fonts.VarelaRoundRegular,
    fontSize: 13,
  },
  c2Txt1: {
    marginTop: 22,
    fontFamily: fonts.VarelaRoundRegular,
    fontSize: 20,
    color: Theme.APP_WHITE_COLOR,
  },
  c2OldPriceTxt: {
    color: Theme.APP_FADE_RED,
    fontSize: 13,
    fontFamily: fonts.VarelaRoundRegular,
    textDecorationLine: "line-through",
    marginTop: 7,
  },
  c2NewPriceTxt: {
    color: Theme.APP_WHITE_COLOR,
    fontSize: 20,
    fontFamily: fonts.VarelaRoundRegular,
    marginTop: 12,
  },
  c2SaveTxt: {
    color: Theme.APP_WHITE_COLOR,
    fontSize: 18,
    fontFamily: fonts.VarelaRoundRegular,
    marginTop: 15,
  },
  c2billTxt: {
    color: Theme.APP_WHITE_COLOR,
    fontSize: 10,
    fontFamily: fonts.VarelaRoundRegular,
    marginTop: 16,
  },
  c1Chip: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: Theme.APP_SKY_BLUE,
    paddingHorizontal: 10,
    paddingVertical: 8,
    position: "absolute",
    top: -10,
    borderRadius: 20,
  },
  c1ChipTxt: {
    fontSize: 10,
    fontFamily: fonts.VarelaRoundRegular,
    color: Theme.APP_WHITE_COLOR,
  },
  c1OldPrice: {
    marginTop: 7,
    fontSize: 12,
    fontFamily: fonts.VarelaRoundRegular,
    textDecorationLine: "line-through",
    color: Theme.APP_TEXT_GREY,
  },
  c1NewPriceTxt: {
    fontFamily: fonts.VarelaRoundRegular,
    fontSize: 18,
    marginTop: 5,
    color: Theme.APP_BLACK_COLOR,
  },
  c1Bill2Txt: {
    marginTop: 18,
    fontSize: 8,
    fontFamily: fonts.VarelaRoundRegular,
    color: Theme.APP_BLACK_COLOR,
  },
  c1SaveTxt: {
    marginTop: 14,
    color: Theme.APP_SKY_BLUE,
    fontSize: 16,
    fontFamily: fonts.VarelaRoundRegular,
  },
  bottomTxt: {
    marginTop: 14,
    fontSize: 14,
    fontFamily: fonts.RobotoRegular,
    color: Theme.APP_TEXT_GREY,
  },
});
