//@flow
import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import GridLayout from "react-native-layout-grid";
import { type NavigationScreenProp } from "react-navigation";

import Album from "../components/Album";
import PlayShuffleHeader from "../components/PlayShuffleHeader";
import NavigationService from "../lib/NavigationService";
import { onShuffleAlbums, playAlbums } from "../lib/QueueService";
import { type Track } from "../types/Data";
import { type State as ReduxState } from "../types/State";
import { fetchQueue } from "../actions";

type Props = {
  albums: Map<string, Array<Track>>,
  fetchQueue: void => void,
  navigation: NavigationScreenProp<any>
};

class AlbumList extends Component<Props> {
  _getAlbums = (): Map<string, Array<Track>> => {
    const { albums, navigation } = this.props;
    return navigation.getParam("albums", albums);
  };

  _renderAlbum = (item: [string, Array<Track>]) => {
    if (item != undefined) {
      const [album: string, tracks: Array<Track>] = item;
      return (
        <Album
          cover={tracks[0].artwork}
          title={album}
          artist={tracks[0].artist}
          onPress={() =>
            NavigationService.navigate("AlbumSongs", { album, tracks })
          }
          albumArtStyle={styles.albumArt}
          albumContainerStyle={styles.albumContainer}
          titleStyle={styles.title}
          artistStyle={styles.artist}
        />
      );
    }
  };

  render() {
    const { fetchQueue } = this.props;
    const albums = this._getAlbums();
    const albumQueue = Array.from(albums.keys());

    if (albums.size > 0) {
      return (
        <>
          <PlayShuffleHeader
            onPressPlay={() => playAlbums(albumQueue, albums, fetchQueue)}
            onPressShuffle={() =>
              onShuffleAlbums(albumQueue, albums, fetchQueue)
            }
          />
          <GridLayout
            items={Array.from(albums)}
            itemsPerRow={2}
            renderItem={item => this._renderAlbum(item)}
          />
        </>
      );
    } else {
      return <></>;
    }
  }
}

const mapStateToProps = (state: ReduxState) => {
  const { albums } = state.track;
  return { albums };
};

const mapDispatchToProps = (dispatch: *) =>
  bindActionCreators({ fetchQueue }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AlbumList);

const styles = StyleSheet.create({
  albumContainer: {
    margin: 15
  },
  albumArt: {
    height: 175,
    width: 175
  },
  title: {
    fontSize: 16,
    fontWeight: "bold"
  },
  artist: {
    fontSize: 14
  }
});
