//@flow
import React, { Component } from "react";
import { Image } from "react-native-elements";
import { ResourceObject } from "react-native-track-player";

type Props = {
  cover: string | ResourceObject,
  albumArtStyle: Object
};

export default class AlbumArt extends Component<Props> {
  _getSource = (): ResourceObject => {
    const { cover } = this.props;
    if (typeof cover == "string") {
      return { uri: cover };
    } else {
      return cover;
    }
  };

  render() {
    const { albumArtStyle } = this.props;
    return (
      <Image
        source={this._getSource()}
        style={albumArtStyle}
        resizeMode="stretch"
      />
    );
  }
}
