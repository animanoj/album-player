//@flow
import TrackPlayer from "react-native-track-player";

import { type Action } from "../types/Action";
import { type Track } from "../types/Data";
import { type Dispatch } from "../types/Store";

export const saveTracks = (tracks: Array<Track>): Action => ({
  type: "SAVE_TRACKS",
  tracks
});

export const updateTrack = (track: Track): Action => ({
  type: "UPDATE_TRACK",
  track
});

export const updateQueue = (queue: Array<Track>): Action => ({
  type: "UPDATE_QUEUE",
  queue
});

export function fetchQueue() {
  return async (dispatch: Dispatch) => {
    const tracks = await TrackPlayer.getQueue();
    dispatch(updateQueue(tracks));
  };
}
