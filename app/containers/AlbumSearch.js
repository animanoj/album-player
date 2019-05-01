//@flow
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { SearchBar } from "react-native-elements";
import { type NavigationScreenProp } from "react-navigation";

import AlbumPlayList from "../components/AlbumPlayList";
import { addAlbumPlaylist } from "../actions";
import { type State as ReduxState } from "../types/State";
import { type Track } from "../types/Data";

type Props = {
  albums: Map<string, Array<Track>>,
  albumPlaylists: Map<string, Array<string>>,
  addAlbumPlaylist: (string, Array<string>) => void,
  navigation: NavigationScreenProp<any>
};

type State = {
  search: string
};

class AlbumSearch extends Component<Props, State> {
  state = {
    search: ""
  };

  _filterAlbum = (album: string, search: string): boolean => {
    const attributes: Array<string> = [album];

    const { albums } = this.props;
    const tracks: Array<Track> = albums.get(album) || [];
    if (tracks.length > 0) {
      attributes.push(tracks[0].artist);
    }

    return attributes.reduce(
      (shouldKeepTrack, attribute) =>
        shouldKeepTrack ||
        attribute.toLowerCase().includes(search.toLowerCase()),
      false
    );
  };

  _updateSearch = (search: string): void => {
    this.setState({ search });
  };

  _addAlbum = (album: string): void => {
    const { albumPlaylists, addAlbumPlaylist, navigation } = this.props;
    const playlistName = navigation.getParam("playlistName", "");

    if (playlistName.length > 0) {
      const currentPlaylist = albumPlaylists.get(playlistName) || [];
      addAlbumPlaylist(playlistName, [...currentPlaylist, album]);

      const onAddAlbum = navigation.getParam("onAddAlbum", () => {});
      onAddAlbum();
    }

    navigation.goBack();
  };

  render() {
    const { _filterAlbum, _updateSearch, _addAlbum, state, props } = this;
    const { search } = state;
    const { albums } = props;

    const filteredAlbums = [...albums.keys()].filter(album =>
      _filterAlbum(album, search)
    );

    return (
      <>
        <SearchBar lightTheme value={search} onChangeText={_updateSearch} />
        <AlbumPlayList
          playlistAlbums={filteredAlbums}
          onPress={index => _addAlbum(filteredAlbums[index])}
          showListHeader={false}
          {...{ albums }}
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
  bindActionCreators({ addAlbumPlaylist }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AlbumSearch);
