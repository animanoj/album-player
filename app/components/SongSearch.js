//@flow
import React, { Component } from "react";
import { SearchBar } from "react-native-elements";

import SongPlayList from "./SongPlayList";
import { type Track } from "../types/Data";

type Props = {
  tracks: Array<Track>,
  onPress: Track => void,
  filterTrack?: (Track, string) => boolean,
  onSubmitEditing?: string => void | Promise<void>
};

type State = {
  search: string
};

export default class SongSearch extends Component<Props, State> {
  state = {
    search: ""
  };

  _filterTrack = (track: Track, search: string): boolean =>
    [track.title || "", track.album || "", track.artist || ""].reduce(
      (shouldKeepTrack, attribute) =>
        shouldKeepTrack ||
        attribute.toLowerCase().includes(search.toLowerCase()),
      false
    );

  _updateSearch = (search: string): void => {
    this.setState({ search });
  };

  render() {
    const { _updateSearch, _filterTrack, state, props } = this;
    const { search } = state;
    const { tracks, filterTrack, onPress, onSubmitEditing } = props;

    const filterFunction: (Track, string) => boolean =
      filterTrack || _filterTrack;
    const filteredTracks = tracks.filter(track =>
      filterFunction(track, search)
    );

    return (
      <>
        <SearchBar
          lightTheme
          value={search}
          onChangeText={_updateSearch}
          onSubmitEditing={() => onSubmitEditing?.(search)}
        />
        <SongPlayList
          tracks={filteredTracks}
          onPress={index => onPress(filteredTracks[index])}
          showListHeader={false}
        />
      </>
    );
  }
}
