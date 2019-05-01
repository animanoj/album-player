//@flow
import React, { Component, type Element } from "react";
import { connect } from "react-redux";
import { ListItem } from "react-native-elements";
import { LargeList } from "react-native-largelist-v3";

import NavigationService from "../lib/NavigationService";
import { type Track } from "../types/Data";
import { type State as ReduxState } from "../types/State";

type Props = {
  artists: Map<string, Set<string>>,
  albums: Map<string, Array<Track>>
};

class ArtistList extends Component<Props> {
  _renderArtist = (
    author: string,
    albumNames: Set<string>,
    albums: Map<string, Array<Track>>
  ): Element<any> => {
    const authorAlbums: Map<string, Array<Track>> = new Map();
    albumNames.forEach(albumName =>
      authorAlbums.set(albumName, albums.get(albumName) || [])
    );

    return (
      <ListItem
        title={author}
        leftIcon={{ name: "user", type: "font-awesome" }}
        onPress={() =>
          NavigationService.navigate("ArtistAlbums", {
            author,
            albums: authorAlbums
          })
        }
      />
    );
  };

  render() {
    const { artists, albums } = this.props;
    const artistList = Array.from(artists);

    if (artists.size > 0) {
      return (
        <LargeList
          data={[{ items: artistList }]}
          renderIndexPath={({ row }) => {
            const [author, albumNames] = artistList[row];
            return this._renderArtist(author, albumNames, albums);
          }}
          heightForIndexPath={() => 50}
        />
      );
    } else {
      return <></>;
    }
  }
}

const mapStateToProps = (state: ReduxState) => {
  const { artists, albums } = state.track;
  return { artists, albums };
};

export default connect(
  mapStateToProps,
  null
)(ArtistList);
