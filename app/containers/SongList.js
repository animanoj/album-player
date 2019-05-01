//@flow
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import SongPlayList from "../components/SongPlayList";
import { fetchQueue } from "../actions";
import { playSongs, onShuffleSongs } from "../lib/QueueService";
import { type Track } from "../types/Data";
import { type State as ReduxState } from "../types/State";

type Props = {
  tracks: Array<Track>,
  fetchQueue: void => void
};

class SongList extends Component<Props> {
  render() {
    const { tracks, fetchQueue } = this.props;
    return (
      <SongPlayList
        onPressPlay={() => playSongs(tracks, 0, fetchQueue)}
        onPressShuffle={() => onShuffleSongs(tracks, fetchQueue)}
        onPress={index => playSongs(tracks, index, fetchQueue)}
        {...{ tracks }}
      />
    );
  }
}

const mapStateToProps = (state: ReduxState) => {
  const { tracks } = state.track;
  return { tracks };
};

const mapDispatchToProps = (dispatch: *) =>
  bindActionCreators({ fetchQueue }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SongList);
