import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Theme from "../../utils/theme";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import fonts from "../../utils/fonts";
import CustomButton from "../buttons/CutomButton";
import CustomDropDownPicker from "../customDropDown/CustomDropDownPicker";
import { CustomInput } from "../customInput/CustomInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IssueDetail } from "../validations/validations";
import { useFocusEffect } from "@react-navigation/native";

interface ReportModalProps {
  visible: boolean;
  onClose: () => void;
  onPress: any;
}

export default function ReportModal({
  visible,
  onClose,
  onPress,
}: ReportModalProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [showIssueError, setIssueError] = useState(false);
  const [selectedIssue, setSelecteIssue] = useState<any>("");
  const [description, setDescription] = useState("");

  const [issues] = useState([
    {
      label: "Offensive Behaviour",
      value: "OFFENSIVE_BEHAVIOUR",
    },
    {
      label: "Explicit Photos",
      value: "EXPLICIT_PHOTOS",
    },
    {
      label: "Abuse / Bullying",
      value: "ABUSE_BULLYING",
    },
    {
      label: "Harassment",
      value: "HARASSMENT",
    },
    {
      label: "Underage",
      value: "UNDERAGE",
    },
    {
      label: "No Face Pictures",
      value: "NO_FACE_PICTURES",
    },
    {
      label: "Spam / Advertising",
      value: "SPAM_ADVERTISING",
    },
    {
      label: "Other",
      value: "OTHER",
    },
  ]);

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(IssueDetail),
  });

  useFocusEffect(
    useCallback(() => {
      // Reset form when the modal becomes visible
      if (visible) {
        reset(); // Reset the form to its default values
        setIssueError(false);
        setSelecteIssue("");
        setDescription("");
      }
    }, [visible, reset])
  );

  useEffect(() => {
    setValue("issue", description);
  }, [description, setValue]);

  const onSubmit = () => {
    onPress({ selectedIssue: selectedIssue?.value, description });
    setSelecteIssue("");
    setDescription("");
  };
  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles().container}>
        <View style={styles().cardCont}>
          <Pressable onPress={onClose} style={styles().closeCont}>
            <Image
              source={require("../../assets/crossCircleIcon.png")}
              style={styles().closeImg}
              resizeMode="contain"
            />
          </Pressable>

          <Text style={styles().cardHeader}>Report Member</Text>

          <ScrollView
            style={styles().scrollStyle}
            bounces={false}
            contentContainerStyle={styles(isCollapsed).scrollCont}
          >
            <Pressable
              style={styles().issueCont}
              onPress={() => setIsCollapsed(!isCollapsed)}
            >
              <Text style={styles(selectedIssue).Issuetxt}>
                {selectedIssue ? selectedIssue?.label : "Select Reason"}
              </Text>
              <Image
                source={require("../../assets/arrowdown.png")}
                style={styles(isCollapsed).arrow}
                resizeMode="contain"
              />
            </Pressable>

            {showIssueError && (
              <Text style={styles().errtxtstyle1}>
                Please select an issue to report
              </Text>
            )}

            <View style={styles(isCollapsed).dropCont}>
              <CustomDropDownPicker
                isCollapsed={isCollapsed}
                items={issues}
                onValueChange={(value: any) => {
                  setIsCollapsed(true);
                  setIssueError(false);
                  setSelecteIssue(value);
                }}
              />
            </View>
            {isCollapsed && (
              <>
                <Text style={styles().text1}>
                  Please help our moderators {"\n"} by describing the issue
                  below
                </Text>

                <CustomInput
                  allowMultiLine={true}
                  returnKeyType={"next"}
                  value={description}
                  editable={true}
                  autoCap={false}
                  maxLength={150}
                  fieldName="issue"
                  control={control}
                  keyboardType="default"
                  textBoxContainer={styles().textInput1}
                  txtbxstyl={styles().txtbxstyle1}
                  plcholder={`Please go into detail...`}
                  plcholdercolor={Theme.APP_TEXT_GREY}
                  errTxt={errors?.issue && errors?.issue?.message}
                  errTxtstyle={styles().errtxtstyle1}
                  onChangeTexts={(text: string) => {
                    setDescription(text);
                  }}
                />
                <CustomButton
                  BtnContstyle={styles().btnCont}
                  text="Submit Report"
                  textStyle={styles().btnTxt}
                  onPress={() => {
                    if (selectedIssue == "") {
                      setIssueError(true);
                    } else {
                      handleSubmit(onSubmit)();
                    }
                  }}
                />
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = (props?: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Theme.APP_BLACK_COLOR_OPACITY,
    },
    cardCont: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Theme.APP_WHITE_COLOR,
      width: widthPercentageToDP(90),
      paddingTop: 20,
      paddingBottom: 15,
      borderRadius: 30,
    },
    closeCont: {
      padding: 5,
      position: "absolute",
      top: 0,
      right: 0,
    },
    closeImg: {
      tintColor: Theme.APP_DISABLED,
      width: 50,
      height: 50,
    },
    scrollStyle: {
      maxHeight: heightPercentageToDP(70),
      width: "100%",
    },
    scrollCont: {
      alignItems: "center",
      paddingBottom: props ? 0 : 5,
    },
    cardHeader: {
      fontSize: 22,
      fontFamily: fonts.VarelaRoundRegular,
      color: Theme.APP_BLACK_COLOR,
    },
    text1: {
      marginTop: 20,
      color: Theme.APP_BLACK_COLOR,
      fontSize: 19,
      textAlign: "center",
      fontFamily: fonts.Questrail,
    },
    issueCont: {
      marginTop: 20,
      height: 52,
      width: widthPercentageToDP(80),
      paddingHorizontal: 15,
      borderRadius: 10,
      backgroundColor: Theme.APP_RED_COLOR,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    Issuetxt: {
      color: Theme.APP_WHITE_COLOR,
      fontFamily: fonts.VarelaRoundRegular,
      fontSize: 18,
    },
    arrow: {
      width: 15,
      height: 20,
      transform: [{ rotate: props ? "0deg" : "-180deg" }],
    },
    textInput1: {
      marginTop: 12,
      height: heightPercentageToDP(30),
      width: widthPercentageToDP(80),
      paddingHorizontal: 15,
      borderRadius: 10,
      borderColor: Theme.APP_BORDER_GREY,
      backgroundColor: Theme.APP_DROP_GREY,
    },
    txtbxstyle1: {
      height: 50,
      flex: 1,
      fontFamily: fonts.RobotoRegular,
      fontSize: 19,
      textAlignVertical: "top",
      color: Theme.APP_BLACK_COLOR,
    },
    errtxtstyle1: {
      top: 2,
      left: widthPercentageToDP(5),
      color: Theme.APP_RED_COLOR,
      fontSize: 14,
      alignSelf: "flex-start",
      fontFamily: fonts.RobotoRegular,
    },
    dropCont: {
      marginTop: props ? 0 : 5,
      width: widthPercentageToDP(83),
      zIndex: 1,
      maxHeight: heightPercentageToDP(70),
      borderRadius: 15,
      shadowOffset: {
        width: 2,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      backgroundColor: Theme.APP_WHITE_COLOR,
      display: "flex",
    },
    btnTxt: {
      fontSize: 20,
      fontFamily: fonts.VarelaRoundRegular,
      color: Theme.APP_WHITE_COLOR,
    },
    btnCont: {
      backgroundColor: Theme.APP_RED_COLOR,
      paddingVertical: 15,
      paddingHorizontal: 15,
      alignItems: "center",
      borderRadius: 10,
      shadowColor: Theme.APP_BLACK_COLOR,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      marginTop: 5,
    },
  });
