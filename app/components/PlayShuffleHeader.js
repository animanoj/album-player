//@flow
import React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-elements";

type Props = {
  onPressPlay: void => void | Promise<void>,
  onPressShuffle: void => void | Promise<void>
};

const PlayShuffleHeader = ({ onPressPlay, onPressShuffle }: Props) => (
  <View style={styles.container}>
    <Button
      type="clear"
      title="Play"
      icon={{ name: "play", type: "font-awesome" }}
      titleStyle={styles.title}
      style={styles.button}
      onPress={onPressPlay}
    />
    <Button
      type="clear"
      title="Shuffle"
      icon={{ name: "random", type: "font-awesome" }}
      titleStyle={styles.title}
      style={styles.button}
      onPress={onPressShuffle}
    />
  </View>
);

export default PlayShuffleHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    margin: 10
  },
  button: {
    padding: 20
  },
  title: {
    color: "palevioletred"
  }
});
