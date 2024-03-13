import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Theme from "../../utils/theme";

interface EmojiModalProps {
  onSelect: any;
}

export default function EmojiModal({ onSelect }: EmojiModalProps) {
  const [emojiData] = useState([
    { emoji: "⚓", entity: "&#9875" },
    { emoji: "💧", entity: "&#128167" },
    { emoji: "🐳", entity: "&#128051" },
    { emoji: "🐋", entity: "&#128011" },
    { emoji: "🐬", entity: "&#128044" },
    { emoji: "🐟", entity: "&#128031" },
    { emoji: "🐠", entity: "&#128032" },
    { emoji: "🐡", entity: "&#128033;" },
    { emoji: "🦈", entity: "&#129416;" },
    { emoji: "🐢", entity: "&#128034;" },
    { emoji: "🦐", entity: "&#129424;" },
    { emoji: "🦑", entity: "&#129425;" },
    { emoji: "🦞", entity: "&#129438;" },
    { emoji: "🦀", entity: "&#129408;" },
    { emoji: "🐠", entity: "&#128032;" },
    { emoji: "🐙", entity: "&#128025;" },
    { emoji: "🎣", entity: "&#127907;" },
    { emoji: "🪝", entity: "&#129693;" },
    { emoji: "🧜", entity: "&#129500;" },
    { emoji: "🔱", entity: "&#128305;" },
    { emoji: "👑", entity: "&#128081;" },
    { emoji: "🍍", entity: "&#127821;" },
    { emoji: "🌅", entity: "&#127749;" },
    { emoji: "🌊", entity: "&#127754;" },
    { emoji: "🪸", entity: "&#129720;" },
    { emoji: "🐚", entity: "&#128026;" },
    { emoji: "🚢", entity: "&#128674;" },
    { emoji: "🚤", entity: "&#128676;" },
    { emoji: "🛥", entity: "&#128741;" },
    { emoji: "🛳", entity: "&#128755;" },
    { emoji: "⛴", entity: "&#9972;" },
    { emoji: "⛵", entity: "&#9973;" },
    { emoji: "🚣", entity: "&#128675;" },
    { emoji: "🏄", entity: "&#127940;" },
    { emoji: "☀️", entity: "&#57418;" },
    { emoji: "☁️", entity: "&#9729;" },
    { emoji: "⭐", entity: "&#11088;" },
    { emoji: "✨", entity: "&#10024;" },
    { emoji: "🌙", entity: "&#127769;" },
    { emoji: "🌖", entity: "&#127766;" },
    { emoji: "🍆", entity: "&#127814;" },
    { emoji: "💦", entity: "&#128166;" },
    { emoji: "🌈", entity: "&#127752;" },
    { emoji: "🧔", entity: "&#129492;" },
    { emoji: "👩", entity: "&#128105;" },
    { emoji: "‍🥰", entity: "&#129392;" },
    { emoji: "🆘", entity: "&#127384;" },
    { emoji: "🚩", entity: "&#128681;" },
    { emoji: "🧭", entity: "&#129517;" },
    { emoji: "🗺", entity: "&#128506;" },
    { emoji: "🌎", entity: "&#127758;" },
    { emoji: "🥂", entity: "&#129346;" },
    { emoji: "🍷", entity: "&#127863;" },
    { emoji: "🍹", entity: "&#127865;" },
    { emoji: "🍺", entity: "&#127866;" },
    { emoji: "🍸", entity: "&#127864;" },
    { emoji: "🍾", entity: "&#127870;" },
    { emoji: "💰", entity: "&#128176;" },
    { emoji: "🤿", entity: "&#129343;" },
    { emoji: "💘", entity: "&#128152;" },
    { emoji: "🐚", entity: "&#128026;" },
    { emoji: "🦪", entity: "&#129450;" },
    { emoji: "🏖", entity: "&#127958;" },
    { emoji: "🏝", entity: "&#127965;" },
    { emoji: "👙", entity: "&#128089;" },
    { emoji: "💍", entity: "&#128141;" },
    { emoji: "💎", entity: "&#128142;" },
    { emoji: "❤️", entity: "&#10084;" },
    { emoji: "💋", entity: "&#128139;" },
    { emoji: "🏴‍☠️", entity: "&#127988;" },
    { emoji: "☸️", entity: "&#9784;" },
    { emoji: "🫡", entity: "&#129761;" },
    { emoji: "‍💌", entity: "&#128140;" },
    { emoji: "🐈", entity: "&#128008;" },
  ]);
  const itemWidth = widthPercentageToDP(30) / 10;
  const renderemoji = ({ item, index }: any) => {
    return (
      <Pressable
        style={styles(itemWidth).item}
        onPress={() => onSelect(item)}
        key={index}
      >
        <Text style={styles().emoji}>{item?.emoji}</Text>
      </Pressable>
    );
  };
  return (
    <View style={styles().emojiCont}>
      <FlatList
        data={emojiData}
        style={styles().flatList}
        renderItem={renderemoji}
        numColumns={10}
      />

      <View style={styles().triangle} />
    </View>
  );
}

const styles = (props?: any) =>
  StyleSheet.create({
    emojiCont: {
      width: widthPercentageToDP(90),
      height: heightPercentageToDP(20),
      backgroundColor: Theme.APP_EMOJI_BACKGROUND,
      alignItems: "center",
      borderRadius: 20,
      // paddingHorizontal: 10,
      paddingVertical: 10,
      bottom: heightPercentageToDP(3),
      alignSelf: "center",
      shadowColor: Theme.APP_BLACK_COLOR,
      shadowOffset: {
        width: 1,
        height: 0,
      },
      shadowOpacity: 0.5,
      shadowRadius: 2,
      elevation: 3,
      zIndex: 1,
    },
    flatList: { flex: 1 },
    triangle: {
      width: 0,
      height: 0,
      backgroundColor: "transparent",
      borderStyle: "solid",
      borderLeftWidth: 10,
      borderRightWidth: 10,
      borderBottomWidth: 20,
      borderLeftColor: "transparent",
      borderRightColor: "transparent",
      borderBottomColor: Theme.APP_EMOJI_BACKGROUND,
      position: "absolute",
      transform: [{ rotate: "180deg" }],
      bottom: heightPercentageToDP(-2),
      left: widthPercentageToDP(8),
      zIndex: -1,
    },
    item: {
      marginVertical: 5,
      marginRight: props,
      justifyContent: "center",
      alignItems: "center",
      height: 23, // Adjust the item height as needed
    },
    emoji: {
      color: Theme.APP_BLACK_COLOR,
    },
  });
