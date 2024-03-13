import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import fonts from "../../utils/fonts";
import Theme from "../../utils/theme";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/loader/Loader";
import { getSupportAsynThunk } from "../../redux/features/ReportSupportSlice";
import { CustomErrorToast } from "../../helpers/CustomToast";
import moment from "moment";

export default function MyTickets() {
  const token = useSelector((state: any) => state?.login?.token);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [issues, setIssues] = useState([]);

  const getTickets = () => {
    setLoading(true);
    dispatch<any>(getSupportAsynThunk(token))
      .unwrap()
      .then((response: any) => {
        setIssues(response.data);
        setLoading(false);
      })
      .catch((err: any) => {
        setLoading(false);
        CustomErrorToast(err);
      });
  };

  useEffect(() => {
    getTickets();
  }, []);

  const renderIssues = ({ item, index }: any) => {
    const date = moment(item.date).format("DD/MM/YYYY");
    const issue = item?.issueType.replace(/_/g, " ");
    return (
      <View key={index} style={styles().flatListCont}>
        <Text style={styles().flatListTxt1}>{date}</Text>
        <Text style={styles().flatListTxt2}>{issue}</Text>
        <Text style={styles(item?.status).flatListTxt1}>{item?.status}</Text>
      </View>
    );
  };
  return (
    <View style={styles().mainCont}>
      <Text style={styles().txt1}>My Tickets</Text>

      <Text style={styles().txt2}>
        {`When you contact support,\nyou can keep track of your tickets here.\n\nPlease check your e-mail for correspondence.`}
      </Text>

      <View style={styles().headingBarCont}>
        <Text style={styles().headingBarTxt1}>Date</Text>
        <Text style={styles().headingBarTxt2}>Issue</Text>
        <Text style={styles().headingBarTxt1}>Status</Text>
      </View>

      <FlatList
        data={issues}
        renderItem={renderIssues}
        contentContainerStyle={styles().flatListContentCont}
      />
      <Loader isVisible={loading} />
    </View>
  );
}

const styles = (props?: any) =>
  StyleSheet.create({
    mainCont: { flex: 1, alignItems: "center" },
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
      width: widthPercentageToDP(90),
    },
    headingBarCont: {
      paddingVertical: 15,
      flexDirection: "row",
      alignItems: "center",
      width: widthPercentageToDP(100),
    },
    headingBarTxt1: {
      flex: 0.33,
      textAlign: "center",
      color: Theme.APP_TEXT_GREY,
      fontSize: 14,
      fontFamily: fonts.RobotoBold,
    },
    headingBarTxt2: {
      flex: 0.33,
      color: Theme.APP_TEXT_GREY,
      fontSize: 14,
      fontFamily: fonts.RobotoBold,
    },
    flatListContentCont: { paddingBottom: 30 },
    flatListCont: {
      paddingVertical: 20,
      flexDirection: "row",
      alignItems: "center",
      width: widthPercentageToDP(100),
      shadowColor: Theme.APP_BLACK_COLOR,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      backgroundColor: Theme.APP_WHITE_COLOR,
    },
    flatListTxt1: {
      flex: 0.33,
      textAlign: "center",
      color:
        props == "RESOLVED" ? Theme.APP_BRIGHT_GREEN : Theme.APP_BLACK_COLOR,
      fontSize: 14,
      fontFamily: fonts.RobotoRegular,
      textTransform: "capitalize",
    },
    flatListTxt2: {
      flex: 0.33,
      color: Theme.APP_BLACK_COLOR,
      fontSize: 14,
      fontFamily: fonts.RobotoRegular,
      textTransform: "capitalize",
    },
  });
