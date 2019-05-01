//@flow
import React, { type Element } from "react";
import { StyleSheet } from "react-native";

import PlayList from "./PlayList";
import Album from "./Album";
import { type Track } from "../types/Data";

type Props = {
  playlistAlbums: Array<string>,
  albums: Map<string, Array<Track>>,
  onPress: number => void | Promise<void>,
  onPressPlay?: void => void | Promise<void>,
  onPressShuffle?: void => void | Promise<void>,
  showListHeader?: boolean,
  header?: Element<any>
};

const AlbumPlayList = ({
  playlistAlbums,
  albums,
  onPress,
  onPressPlay,
  onPressShuffle,
  showListHeader,
  header
}: Props) => (
  <PlayList
    tracks={playlistAlbums}
    renderItem={(item: Track, index: number) => {
      const tracks: Array<Track> = albums.get(item) || [];
      return (
        <Album
          cover={tracks[0].artwork}
          title={item}
          artist={tracks[0].artist}
          albumArtStyle={styles.albumArt}
          onPress={() => onPress(index)}
          albumContainerStyle={styles.albumContainer}
          detailsContainerStyle={styles.detailsContainer}
          titleStyle={styles.title}
          artistStyle={styles.artist}
        />
      );
    }}
    heightForItem={120}
    {...{ onPressPlay, onPressShuffle, showListHeader, header }}
  />
);

export default AlbumPlayList;

const styles = StyleSheet.create({
  albumArt: {
    height: 90,
    width: 90,
    margin: 5
  },
  title: {
    fontSize: 24,
    fontWeight: "bold"
  },
  artist: {
    fontSize: 20
  },
  albumContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    margin: 10
  },
  detailsContainer: {
    flex: 1,
    margin: 5
  }
});
