//@flow
import React, { type Element } from "react";
import { View } from "react-native";
import { LargeList } from "react-native-largelist-v3";

import PlayShuffleHeader from "./PlayShuffleHeader";
import { type Track } from "../types/Data";

type Props = {
  tracks: Array<Track>,
  renderItem: (Track, number) => Element<any>,
  heightForItem?: number,
  showListHeader?: boolean,
  header?: Element<any>,
  onPressPlay?: void => void | Promise<void>,
  onPressShuffle?: void => void | Promise<void>,
  listContainerStyle?: any
};

const PlayList = ({
  tracks,
  renderItem,
  heightForItem = 70,
  showListHeader = true,
  header,
  onPressPlay,
  onPressShuffle,
  listContainerStyle
}: Props) => (
  <View style={[{ flex: 1 }, listContainerStyle]}>
    {tracks.length > 0 && showListHeader && (
      <PlayShuffleHeader {...{ onPressPlay, onPressShuffle }} />
    )}
    <LargeList
      data={[{ items: tracks }]}
      renderIndexPath={({ row }) => renderItem(tracks[row], row)}
      heightForIndexPath={() => heightForItem}
      renderHeader={() => <View>{header}</View>}
      headerStickyEnabled
    />
  </View>
);

export default PlayList;
