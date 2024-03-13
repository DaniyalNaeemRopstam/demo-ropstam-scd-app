import AudioRecorderPlayer from "react-native-audio-recorder-player";
import type { PlayBackType } from "react-native-audio-recorder-player";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/app/store";
import { setAudio } from "../../redux/features/AuthSlice";

interface Props {
  audioTrack: string;
  audioId: string;
}
const audioRecorderPlayer = new AudioRecorderPlayer();

export default function AudioPlayer(props: Props) {
  const { audioTrack, audioId } = props;

  const dispatch = useDispatch();
  const audioState = useSelector((state: RootState) => state.login.audio);

  const [playTime, setPlayTime] = useState("00:00");
  const [duration, setDuration] = useState("00:00");
  const [isPlayState, setIsPlayState] = useState<{ [id: string]: boolean }>({});

  audioRecorderPlayer.setSubscriptionDuration(0.1);

  const onStartPlay = async () => {
    dispatch(setAudio(audioId));
    await audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
    setIsPlayState((prevPlayState) => ({ ...prevPlayState, [audioId]: true }));
    try {
      await audioRecorderPlayer.startPlayer(audioTrack);
      await audioRecorderPlayer.setVolume(1.0);

      audioRecorderPlayer.addPlayBackListener((e: PlayBackType) => {
        if (e.currentPosition >= e.duration) {
          audioRecorderPlayer.stopPlayer();
          audioRecorderPlayer.removePlayBackListener();
          setIsPlayState((prevPlayState) => ({
            ...prevPlayState,
            [audioId]: false,
          }));
        }

        setPlayTime(
          audioRecorderPlayer.mmss(Math.floor(e.currentPosition / 60))
        );
        setDuration(audioRecorderPlayer.mmss(Math.floor(e.duration / 60)));
      });
    } catch (err) {
      onStopPlay();
    }
  };

  const onStopPlay = async () => {
    setIsPlayState((prevPlayState) => ({ ...prevPlayState, [audioId]: false }));
    await audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
  };

  return (
    <SafeAreaView style={styles().root}>
      {!isPlayState[audioState] ? (
        <TouchableOpacity
          onPress={() => {
            onStartPlay();
          }}
        >
          <Image
            style={styles().playerButtons}
            source={require("../../assets/play.png")}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={onStopPlay}>
          <Image
            style={styles().playerButtons}
            source={require("../../assets/stop.png")}
          />
        </TouchableOpacity>
      )}
      <View style={styles().timeCont}>
        <Text style={styles().timeStyle}>{playTime}</Text>

        <Text style={styles().timeStyle}>/</Text>
        <Text style={styles().timeStyle}>{duration}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = () =>
  StyleSheet.create({
    root: {
      flexDirection: "row",
      alignItems: "center",
    },
    playerButtons: {
      width: 33,
      height: 33,
      resizeMode: "contain",
      marginRight: 20,
    },
    timeCont: {
      flexDirection: "row",
      width: "40%",
    },
    timeStyle: {
      color: "white",
      fontWeight: "bold",
      fontSize: 11,
    },
  });
