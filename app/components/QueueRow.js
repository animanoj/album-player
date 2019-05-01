//@flow
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

import Song from "./Song";
import { Icon } from "react-native-elements";
import { type Track } from "../types/Data";

type Props = {
  data: Track,
  onDelete: void => void | Promise<void>,
  toggleRowActive?: void => void
};

const QueueRow = ({ data, onDelete, toggleRowActive }: Props) => (
  <View style={containerStyles.rowContainer}>
    <View style={containerStyles.startContainer}>
      <Icon
        name="minus-circle"
        type="font-awesome"
        iconStyle={componentStyles.deleteIcon}
        containerStyle={containerStyles.deleteIconContainer}
        onPress={onDelete}
      />
      <Song
        track={data}
        albumArtStyle={componentStyles.albumArt}
        songContainerStyle={containerStyles.songContainer}
        titleStyle={componentStyles.title}
        artistStyle={componentStyles.artist}
      />
    </View>
    <TouchableOpacity
      onLongPress={() => toggleRowActive?.()}
      style={containerStyles.moveIconContainer}
    >
      <Icon
        name="bars"
        type="font-awesome"
        iconStyle={componentStyles.moveIcon}
      />
    </TouchableOpacity>
  </View>
);

export default QueueRow;

const containerStyles = StyleSheet.create({
  rowContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  startContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  deleteIconContainer: {
    margin: 10
  },
  moveIconContainer: {
    margin: 10
  },
  songContainer: {
    flexDirection: "row",
    alignItems: "center"
  }
});

const componentStyles = StyleSheet.create({
  albumArt: {
    width: 50,
    height: 50,
    margin: 10
  },
  title: {
    fontSize: 16,
    fontWeight: "bold"
  },
  artist: {
    fontSize: 14
  },
  deleteIcon: {
    color: "red"
  },
  moveIcon: {
    color: "grey"
  }
});
