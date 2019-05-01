//@flow
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { type NavigationScreenProp } from "react-navigation";
import SortableList from "react-native-sortable-list";
import TrackPlayer from "react-native-track-player";

import QueueRow from "../components/QueueRow";
import { updateQueueFocus, fetchQueue } from "../actions";
import { type Track } from "../types/Data";
import { type State as ReduxState } from "../types/State";

type Props = {
  queue: Array<Track>,
  activeTrackQueueIndex: number,
  updateQueueFocus: boolean => void,
  fetchQueue: void => void,
  navigation: NavigationScreenProp<any>
};

type State = {
  queue: Array<Track>
};

class Queue extends Component<Props, State> {
  state = {
    queue: []
  };

  static getDerivedStateFromProps(nextProps: Props): State {
    return { queue: nextProps.queue };
  }

  _changeOrder = async (
    key: string,
    currentOrder: Array<string>
  ): Promise<void> => {
    var originalIndex: number = Number.parseInt(key);
    var newIndex: number = currentOrder.findIndex(val => val == key);

    if (
      Number.isFinite(originalIndex) &&
      Number.isFinite(newIndex) &&
      originalIndex != newIndex
    ) {
      const { activeTrackQueueIndex } = this.props;
      const { queue } = this.state;

      originalIndex += activeTrackQueueIndex + 1;
      newIndex += activeTrackQueueIndex + 1;

      const [movedTrack] = queue.splice(originalIndex, 1);
      queue.splice(newIndex, 0, movedTrack);

      await TrackPlayer.removeUpcomingTracks();
      await TrackPlayer.add(queue.slice(activeTrackQueueIndex + 1));
    }
  };

  _deleteRow = async (index: number): Promise<void> => {
    const { queue, activeTrackQueueIndex, fetchQueue } = this.props;
    await TrackPlayer.remove(queue[activeTrackQueueIndex + 1 + index].id);
    fetchQueue();
  };

  componentDidMount() {
    const { navigation, updateQueueFocus, fetchQueue } = this.props;
    navigation.addListener("willFocus", () => updateQueueFocus(true));
    navigation.addListener("willBlur", () => {
      updateQueueFocus(false);
      fetchQueue();
    });
  }

  render() {
    const { activeTrackQueueIndex } = this.props;
    const { queue } = this.state;
    const tracks = queue.slice(activeTrackQueueIndex + 1);

    return (
      <SortableList
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={tracks}
        manuallyActivateRows
        renderRow={({ data, index }) => (
          <QueueRow onDelete={() => this._deleteRow(index)} {...{ data }} />
        )}
        onReleaseRow={this._changeOrder}
      />
    );
  }
}

const mapStateToProps = (state: ReduxState) => {
  const { queue, activeTrackQueueIndex } = state.track;
  return { queue, activeTrackQueueIndex };
};

const mapDispatchToProps = (dispatch: *) =>
  bindActionCreators({ updateQueueFocus, fetchQueue }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Queue);
