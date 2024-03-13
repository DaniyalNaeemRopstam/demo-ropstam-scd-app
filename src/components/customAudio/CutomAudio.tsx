import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  OutputFormatAndroidType,
} from "react-native-audio-recorder-player";
import type {
  AudioSet,
  RecordBackType,
} from "react-native-audio-recorder-player";
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { Component } from "react";
import type { ReactElement } from "react";
import { heightPercentageToDP } from "react-native-responsive-screen";
import Theme from "../../utils/theme";
import { MotiView } from "moti";

interface State {
  isLoggingIn: boolean;
  recordSecs: number;
  recordTime: string;
  currentPositionSec: number;
  currentDurationSec: number;
  playTime: string;
  duration: string;
  isPlayState: boolean;
  isRecordState: boolean;
  isAnimated: boolean;
}

const screenWidth = Dimensions.get("screen").width;

class CustomAudio extends Component<any, State> {
  private path = Platform.select({
    ios: undefined,
    android: undefined,
  });

  private audioRecorderPlayer: AudioRecorderPlayer;

  constructor(props: any) {
    super(props);

    this.state = {
      isLoggingIn: false,
      recordSecs: 0,
      recordTime: "00:00",
      currentPositionSec: 0,
      currentDurationSec: 0,
      playTime: "00:00",
      duration: "00:00",
      isPlayState: false,
      isRecordState: true,
      isAnimated: false,
    };

    this.audioRecorderPlayer = new AudioRecorderPlayer();
    this.audioRecorderPlayer.setSubscriptionDuration(0.1); // optional. Default is 0.5
  }
  componentDidMount() {
    this.onStartRecord();
  }

  public render(): ReactElement {
    let playWidth =
      (this.state.currentPositionSec / this.state.currentDurationSec) *
      (screenWidth - 56);

    if (!playWidth) {
      playWidth = 0;
    }

    const onRecordStateView = () => {
      return (
        <View style={styles().buttonStyle}>
          <TouchableOpacity onPress={this.onStopRecord}>
            <Image
              style={styles().playerButtons}
              source={require("../../assets/stop.png")}
            />
          </TouchableOpacity>
          <Text style={styles().timeStyle}>{this.state.recordTime}</Text>

          <TouchableOpacity onPress={this.onStopPlay}>
            <Image
              style={styles().profileEditButton}
              source={require("../../assets/crossCircleIcon.png")}
            />
          </TouchableOpacity>
        </View>
      );
    };

    return (
      <MotiView
        from={styles().rootInitial}
        animate={styles(this.state.isRecordState).rootFinal}
        onDidAnimate={() =>
          this.setState({
            isAnimated: true,
          })
        }
        transition={{ type: "timing" }}
      >
        {this.state.isAnimated && onRecordStateView()}
      </MotiView>
    );
  }

  private onStartRecord = async (): Promise<void> => {
    const audioSet: AudioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
      OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
    };

    await this.audioRecorderPlayer.startRecorder(this.path, audioSet);

    this.audioRecorderPlayer.addRecordBackListener((e: RecordBackType) => {
      const currentPosition = e.currentPosition;
      const recordSecs = currentPosition;
      const recordTime = this.audioRecorderPlayer.mmss(
        Math.floor(currentPosition / 60)
      );

      this.setState({
        recordSecs,
        recordTime,
      });

      if (currentPosition >= 10800) {
        this.onStopRecord();
      }
    });
  };

  private onStopRecord = async (): Promise<void> => {
    this.setState({
      isPlayState: true,
      isRecordState: false,
    });
    const result = await this.audioRecorderPlayer.stopRecorder();
    this.audioRecorderPlayer.removeRecordBackListener();
    this.setState({
      recordSecs: 0,
    });
    this.props.onEndRecord(result);
  };

  private onStopPlay = async (): Promise<void> => {
    this.setState({
      isPlayState: true,
      isRecordState: false,
      recordSecs: 0,
    });
    this.audioRecorderPlayer.stopRecorder();
    this.audioRecorderPlayer.removeRecordBackListener();
    this.props.onStopPlayer();
  };
}
export default CustomAudio;
const styles = (props?: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#455A64",
      flexDirection: "column",
      alignItems: "center",
    },
    titleTxt: {
      marginTop: 100,
      color: "white",
      fontSize: 28,
    },
    viewRecorder: {
      marginTop: 40,
      width: "100%",
      alignItems: "center",
    },
    recordBtnWrapper: {
      flexDirection: "row",
    },
    viewPlayer: {
      marginTop: 60,
      alignSelf: "stretch",
      alignItems: "center",
    },
    viewBarWrapper: {
      marginTop: 28,
      marginHorizontal: 28,
      alignSelf: "stretch",
    },
    viewBar: {
      backgroundColor: "#ccc",
      height: 4,
      alignSelf: "stretch",
    },
    viewBarPlay: {
      backgroundColor: "white",
      height: 4,
      width: 0,
    },
    playStatusTxt: {
      marginTop: 8,
      color: "#ccc",
    },
    playBtnWrapper: {
      flexDirection: "row",
      marginTop: 40,
    },
    btn: {
      borderColor: "white",
      borderWidth: 1,
    },
    txt: {
      color: "white",
      fontSize: 14,
      marginHorizontal: 8,
      marginVertical: 4,
    },
    txtRecordCounter: {
      marginTop: 32,
      color: "white",
      fontSize: 20,
      textAlignVertical: "center",
      fontWeight: "200",
      fontFamily: "Helvetica Neue",
      letterSpacing: 3,
    },
    txtCounter: {
      marginTop: 12,
      color: "white",
      fontSize: 20,
      textAlignVertical: "center",
      fontWeight: "200",
      fontFamily: "Helvetica Neue",
      letterSpacing: 3,
    },
    rootInitial: {
      flex: 0.2,
      borderRadius: 35 / 2,
      height: 35,
      backgroundColor: Theme.APP_RECORDER_BLUE,
    },
    rootFinal: {
      flex: props ? 1 : 0.2,
      borderRadius: 35 / 2,
      height: 35,
      backgroundColor: Theme.APP_RECORDER_BLUE,
    },
    crossImageContainer: {
      position: "absolute",
      right: heightPercentageToDP(-1),
      top: heightPercentageToDP(-1),
    },

    profileEditButton: {
      borderRadius:
        Math.round(
          Dimensions.get("window").width + Dimensions.get("window").height
        ) / 2,
      width: Dimensions.get("window").width * 0.07,
      height: Dimensions.get("window").width * 0.07,
      tintColor: Theme.APP_WHITE_COLOR,
    },
    playerButtons: {
      width: 20,
      height: 20,
      resizeMode: "contain",
    },

    buttonStyle: {
      flex: 1,
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 20,
    },
    timeStyle: {
      color: "white",
      fontWeight: "bold",
      fontSize: 11,
    },
  });
