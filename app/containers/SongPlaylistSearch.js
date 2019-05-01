//@flow
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { type NavigationScreenProp } from "react-navigation";

import { addSongPlaylist } from "../actions";
import { type State as ReduxState } from "../types/State";
import { type Track } from "../types/Data";
import SongSearch from "../components/SongSearch";

type Props = {
  tracks: Array<Track>,
  songPlaylists: Map<string, Array<Track>>,
  addSongPlaylist: (string, Array<Track>) => void,
  navigation: NavigationScreenProp<any>
};

class SongPlaylistSearch extends Component<Props> {
  _addTrack = (track: Track): void => {
    const { songPlaylists, addSongPlaylist, navigation } = this.props;
    const playlistName = navigation.getParam("playlistName", "");

    if (playlistName.length > 0) {
      const currentPlaylist = songPlaylists.get(playlistName) || [];
      addSongPlaylist(playlistName, [...currentPlaylist, track]);

      const onAddSong = navigation.getParam("onAddSong", () => {});
      onAddSong();
    }

    navigation.goBack();
  };

  render() {
    const { props, _addTrack } = this;
    return <SongSearch tracks={props.tracks} onPress={_addTrack} />;
  }
}

const mapStateToProps = (state: ReduxState) => {
  const { tracks } = state.track;
  const { songPlaylists } = state.playlist;
  return { tracks, songPlaylists };
};

const mapDispatchToProps = (dispatch: *) =>
  bindActionCreators({ addSongPlaylist }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SongPlaylistSearch);
