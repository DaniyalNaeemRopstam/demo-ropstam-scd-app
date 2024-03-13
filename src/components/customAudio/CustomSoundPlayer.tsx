import Sound from "react-native-sound";

export default function CustomSoundPlayer(soundFile: any) {
  const sound = new Sound(soundFile, Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      null;
    } else {
      sound.play();
    }
  });

  return () => {
    sound.stop();
    sound.release(); // Release resources when component unmounts
  };
}
