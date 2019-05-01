//@flow
import React, { Component, type Element } from "react";
import { StyleSheet } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Text, Button } from "react-native-elements";
import { type NavigationScreenProp } from "react-navigation";

import AlbumPlayList from "../components/AlbumPlayList";
import { fetchQueue } from "../actions";
import NavigationService from "../lib/NavigationService";
import { onShuffleAlbums, playAlbums } from "../lib/QueueService";
import { type State as ReduxState } from "../types/State";
import { type Track } from "../types/Data";

type Props = {
  albums: Map<string, Array<Track>>,
  albumPlaylists: Map<string, Array<string>>,
  fetchQueue: void => void,
  navigation: NavigationScreenProp<any>
};

class AlbumPlaylist extends Component<Props> {
  _getPlaylistName = (): string => {
    const { navigation } = this.props;
    return navigation.getParam("playlistName", "");
  };

  _renderHeader = (playlistName: string): Element<any> => (
    <Button
      iconRight
      title="Add Albums"
      buttonStyle={styles.headerButton}
      icon={{ name: "plus-circle", type: "font-awesome" }}
      onPress={() =>
        NavigationService.navigate("AlbumSearch", {
          playlistName,
          onAddAlbum: () => this.forceUpdate()
        })
      }
    />
  );

  render() {
    const { albums, albumPlaylists, fetchQueue } = this.props;
    const playlistName = this._getPlaylistName();
    const playlistAlbums = albumPlaylists.get(playlistName) || [];

    return (
      <>
        <Text style={styles.playlistTitle}>{playlistName}</Text>
        <AlbumPlayList
          onPress={index =>
            playAlbums(playlistAlbums, albums, fetchQueue, index)
          }
          onPressPlay={() => playAlbums(playlistAlbums, albums, fetchQueue)}
          onPressShuffle={() =>
            onShuffleAlbums(playlistAlbums, albums, fetchQueue)
          }
          header={this._renderHeader(playlistName)}
          {...{ playlistAlbums, albums }}
        />
      </>
    );
  }
}

const mapStateToProps = (state: ReduxState) => {
  const { albums } = state.track;
  const { albumPlaylists } = state.playlist;
  return { albums, albumPlaylists };
};

const mapDispatchToProps = (dispatch: *) =>
  bindActionCreators({ fetchQueue }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AlbumPlaylist);

const styles = StyleSheet.create({
  playlistTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center"
  },
  headerButton: {
    backgroundColor: "palevioletred"
  }
});
