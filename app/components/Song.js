//@flow
import React from "react";
import { TouchableOpacity } from "react-native";

import AlbumArt from "./AlbumArt";
import Details from "./Details";

import { type Track } from "../types/Data";

type Props = {
  track: Track,
  albumArtStyle: any,
  songContainerStyle?: any,
  titleStyle?: any,
  artistStyle?: any,
  detailsContainerStyle?: any,
  onPress?: void => void | Promise<void>
};

const Song = ({
  track,
  songContainerStyle,
  albumArtStyle,
  titleStyle,
  artistStyle,
  detailsContainerStyle,
  onPress
}: Props) => (
  <TouchableOpacity style={songContainerStyle} onPress={() => onPress?.()}>
    <AlbumArt cover={track.artwork} {...{ albumArtStyle }} />
    <Details
      title={track.title}
      artist={track.artist}
      {...{ detailsContainerStyle, titleStyle, artistStyle }}
    />
  </TouchableOpacity>
);

export default Song;
