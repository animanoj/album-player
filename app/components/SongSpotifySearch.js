//@flow
import React, { Component } from "react";
import { type NavigationScreenProp } from "react-navigation";

import { type Track } from "../types/Data";
import SongSearch from "./SongSearch";
import { safePlaySpotify } from "../lib/PlayService";
import { makeSpotifySearch } from "../lib/SpotifyService";

type Props = {
  navigation: NavigationScreenProp<any>
};

type State = {
  searchTracks: Array<Track>
};

export default class SongSpotifySearch extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { tracks } = this._getNavigationProps(props);
    this.state = { searchTracks: tracks };
  }

  _getNavigationProps = (props: Props): Object => {
    const { navigation } = props;
    return {
      tracks: navigation.getParam("tracks", [])
    };
  };

  _submitSearch = async (search: string): Promise<void> => {
    const searchTracks = await makeSpotifySearch(search);
    this.setState({ searchTracks });
  };

  render() {
    return (
      <SongSearch
        filterTrack={() => true}
        tracks={this.state.searchTracks}
        onPress={(track: Track) => safePlaySpotify(track.url)}
        onSubmitEditing={this._submitSearch}
      />
    );
  }
}
