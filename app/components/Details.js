//@flow
import React from "react";
import { View, Text } from "react-native";

type Props = {
  title: string,
  artist: string,
  detailsContainerStyle?: Object,
  titleStyle?: Object,
  artistStyle?: Object
};

const Details = ({
  title,
  artist,
  detailsContainerStyle,
  titleStyle,
  artistStyle
}: Props) => (
  <View style={detailsContainerStyle}>
    <Text style={titleStyle}>{title}</Text>
    <Text style={artistStyle}>{artist}</Text>
  </View>
);

export default Details;
