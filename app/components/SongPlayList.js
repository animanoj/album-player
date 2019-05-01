//@flow
import React, { type Element } from "react";
import { StyleSheet } from "react-native";

import PlayList from "./PlayList";
import Song from "./Song";
import { type Track } from "../types/Data";

type Props = {
  tracks: Array<Track>,
  onPress: number => void | Promise<void>,
  onPressPlay?: void => void | Promise<void>,
  onPressShuffle?: void => void | Promise<void>,
  showListHeader?: boolean,
  header?: Element<any>
};

const SongPlayList = ({
  tracks,
  onPress,
  onPressPlay,
  onPressShuffle,
  showListHeader,
  header
}: Props) => (
  <PlayList
    renderItem={(item: Track, index: number) => (
      <Song
        track={item}
        albumArtStyle={styles.albumArt}
        songContainerStyle={styles.songContainer}
        titleStyle={styles.title}
        artistStyle={styles.artist}
        detailsContainerStyle={styles.detailsContainer}
        onPress={() => onPress(index)}
      />
    )}
    {...{
      tracks,
      onPressPlay,
      onPressShuffle,
      showListHeader,
      header
    }}
  />
);

export default SongPlayList;

const styles = StyleSheet.create({
  songContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  albumArt: {
    width: 50,
    height: 50,
    margin: 10
  },
  detailsContainer: {
    flex: 1,
    margin: 5
  },
  title: {
    fontSize: 16,
    fontWeight: "bold"
  },
  artist: {
    fontSize: 14
  }
});
