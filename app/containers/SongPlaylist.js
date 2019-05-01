//@flow
import React, { Component, type Element } from "react";
import { StyleSheet } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Text, Button } from "react-native-elements";
import { type NavigationScreenProp } from "react-navigation";

import SongPlayList from "../components/SongPlayList";
import { fetchQueue } from "../actions";
import NavigationService from "../lib/NavigationService";
import { playSongs, onShuffleSongs } from "../lib/QueueService";
import { type Track } from "../types/Data";
import { type State as ReduxState } from "../types/State";

type Props = {
  songPlaylists: Map<string, Array<Track>>,
  fetchQueue: void => void,
  navigation: NavigationScreenProp<any>
};

class SongPlaylist extends Component<Props> {
  _getPlaylistName = (): string => {
    const { navigation } = this.props;
    return navigation.getParam("playlistName", "");
  };

  _renderHeader = (playlistName: string): Element<any> => (
    <Button
      iconRight
      title="Add Songs"
      buttonStyle={styles.headerButton}
      icon={{ name: "plus-circle", type: "font-awesome" }}
      onPress={() =>
        NavigationService.navigate("SongPlaylistSearch", {
          playlistName,
          onAddSong: () => this.forceUpdate()
        })
      }
    />
  );

  render() {
    const { songPlaylists, fetchQueue } = this.props;
    const playlistName = this._getPlaylistName();
    const tracks = songPlaylists.get(playlistName) || [];

    return (
      <>
        <Text style={styles.playlistTitle}>{playlistName}</Text>
        <SongPlayList
          onPressPlay={() => playSongs(tracks, 0, fetchQueue)}
          onPressShuffle={() => onShuffleSongs(tracks, fetchQueue)}
          header={this._renderHeader(playlistName)}
          onPress={index => playSongs(tracks, index, fetchQueue)}
          {...{ tracks }}
        />
      </>
    );
  }
}

const mapStateToProps = (state: ReduxState) => {
  const { songPlaylists } = state.playlist;
  return { songPlaylists };
};

const mapDispatchToProps = (dispatch: *) =>
  bindActionCreators({ fetchQueue }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SongPlaylist);

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
