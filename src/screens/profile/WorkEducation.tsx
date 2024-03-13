import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { CustomInput } from "../../components/customInput/CustomInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import fonts from "../../utils/fonts";
import Theme from "../../utils/theme";
import ContinueButton from "../../components/buttons/ContinueButton";
import CustomButton from "../../components/buttons/CutomButton";
import { Job } from "../../components/validations/validations";
import CustomDropDownPicker from "../../components/customDropDown/CustomDropDownPicker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Loader from "../../components/loader/Loader";
import { excludeUnUsedkeysFromUserObj } from "../../helpers/Common";
import { CustomErrorToast } from "../../helpers/CustomToast";
import { createProfileAsynThunk } from "../../redux/features/ProfileSlice";
import { useDispatch, useSelector } from "react-redux";

export default function WorkEducation(props: any) {
  const routeFrom = props?.route?.params?.routeFrom;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState(props?.route?.params?.userInfo?.job || "");
  const [selectedEdu, setSelectedEdu] = useState<any>({});
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [showError, setShowError] = useState(false);
  const [education] = useState([
    {
      label: "High School",
      value: "HIGH_SCHOOL",
    },
    {
      label: "College",
      value: "COLLEGE",
    },
    {
      label: "University",
      value: "UNIVERSITY",
    },
    {
      label: "Post-Graduate",
      value: "POST_GRADUATE",
    },
    {
      label: "Doctorate",
      value: "DOCTORATE",
    },
    {
      label: "PhD",
      value: "PHD",
    },
    {
      label: "M.D",
      value: "MD",
    },
  ]);
  const userData = props?.route?.params;
  const token = useSelector((state: any) => state?.login?.token);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(Job),
  });

  useEffect(() => {
    if (!isCollapsed) {
      setShowError(false);
    }
  }, [isCollapsed]);

  useEffect(() => {
    setValue("my_job", job);
    if (props?.route?.params?.userInfo?.education) {
      const matchedEducation = education.find(
        (edu) => edu.value === props?.route?.params?.userInfo?.education
      );
      setSelectedEdu(matchedEducation);
    }
  }, []);

  const onSubmit = () => {
    if (Object.keys(selectedEdu).length === 0) {
      setShowError(true);
    } else {
      const updatedUserData = {
        ...userData,
        job: job,
        education: selectedEdu?.value,
      };

      props?.navigation?.navigate("ICEBREAKER", updatedUserData);
    }
  };

  const onUpdate = () => {
    setLoading(true);
    const updatedUserData = {
      ...excludeUnUsedkeysFromUserObj(props?.route?.params?.userInfo),
      job: job,
      education: selectedEdu?.value,
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
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles().keyboardCont}
    >
      <Text style={styles().txt1}>Work & Education</Text>
      <Text style={styles().txt2}>
        Let other members know about your{"\n"}education & your job
      </Text>

      <Text style={styles().txt4}>
        My Job <Text style={styles().optional}>(optional)</Text>
      </Text>

      <CustomInput
        returnKeyType={"done"}
        value={job}
        editable={true}
        autoCap={false}
        fieldName="my_job"
        control={control}
        keyboardType="default"
        textBoxContainer={styles().textInput1}
        txtbxstyl={styles().txtbxstyle1}
        plcholdercolor={Theme.APP_TEXT_GREY}
        errTxt={errors?.my_job && errors?.my_job?.message}
        errTxtstyle={styles().errtxtstyle1}
        onChangeTexts={(text: string) => {
          setJob(text);
        }}
      />

      <Text style={styles().txt4}>My Education</Text>

      <Pressable
        style={[styles().textInput1, styles().pressable]}
        onPress={() => setIsCollapsed(!isCollapsed)}
      >
        <Text style={styles(selectedEdu).Issuetxt}>
          {selectedEdu ? selectedEdu?.label : "Education"}
        </Text>
        <Image
          source={require("../../assets/issueError.png")}
          style={styles(isCollapsed).arrow}
          resizeMode="contain"
        />
      </Pressable>

      <View style={styles().dropCont}>
        <CustomDropDownPicker
          constactSupport={true}
          isCollapsed={isCollapsed}
          items={education}
          onValueChange={(value: any) => {
            setIsCollapsed(true);
            setSelectedEdu(value);
          }}
        />
      </View>
      {showError && (
        <Text style={styles().errtxtstyle1}>Please select your education</Text>
      )}
      {routeFrom == "MYPROFILE" ? (
        <View style={styles().btnCont}>
          <CustomButton
            BtnContstyle={styles().customBtnStyle}
            text="Update"
            textStyle={styles().btnTxt}
            onPress={handleSubmit(onUpdate)}
          />
        </View>
      ) : (
        <ContinueButton onPress={handleSubmit(onSubmit)} />
      )}
      <Loader isVisible={loading} />
    </KeyboardAwareScrollView>
  );
}

const styles = (props?: any) =>
  StyleSheet.create({
    keyboardCont: { alignItems: "center", paddingBottom: 50, flexGrow: 1 },
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
    textInput1: {
      marginTop: 13,
      height: 52,
      width: widthPercentageToDP(90),
      paddingHorizontal: 15,
      borderRadius: 10,
      borderWidth: 3,
      borderColor: Theme.APP_BORDER_GREY,
      backgroundColor: Theme.APP_WHITE_COLOR,
    },
    txtbxstyle1: {
      height: 50,
      flex: 1,
      fontFamily: fonts.RobotoRegular,
      fontSize: 19,
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
    txt4: {
      marginTop: 10,
      fontFamily: fonts.VarelaRoundRegular,
      fontSize: 17,
      color: Theme.APP_BLACK_COLOR,
    },
    optional: {
      marginTop: 2,
      fontSize: 13,
      color: Theme.APP_CARD_GREY_TXT,
      fontFamily: fonts.VarelaRoundRegular,
    },
    pressable: {
      //   marginTop: 30,
      flexDirection: "row",
      paddingHorizontal: 16,
      alignItems: "center",
      justifyContent: "space-between",
    },
    Issuetxt: {
      fontSize: 19,
      color: props ? Theme.APP_BLACK_COLOR : Theme.APP_BORDER_GREY,
      fontFamily: fonts.RobotoRegular,
    },
    arrow: {
      width: 15,
      height: 20,
      transform: [{ rotate: props ? "0deg" : "-90deg" }],
    },
    dropCont: {
      width: widthPercentageToDP(90),
      zIndex: 1,
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
