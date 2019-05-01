//@flow
import React from "react";
import { TouchableNativeFeedback, View } from "react-native";

import Details from "./Details";
import AlbumArt from "./AlbumArt";

type Props = {
  cover: string,
  title: string,
  artist: string,
  albumArtStyle: any,
  onPress?: void => void | Promise<void>,
  albumContainerStyle?: any,
  detailsContainerStyle?: any,
  titleStyle?: any,
  artistStyle?: any
};

const Album = ({
  cover,
  title,
  artist,
  onPress,
  albumArtStyle,
  albumContainerStyle,
  detailsContainerStyle,
  titleStyle,
  artistStyle
}: Props) => (
  <TouchableNativeFeedback disabled={onPress == undefined} {...{ onPress }}>
    <View style={albumContainerStyle}>
      <AlbumArt {...{ cover, albumArtStyle }} />
      <Details
        {...{ title, artist, detailsContainerStyle, titleStyle, artistStyle }}
      />
    </View>
  </TouchableNativeFeedback>
);

export default Album;
