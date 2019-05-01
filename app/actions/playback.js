//@flow
import { type State as PlaybackState } from "react-native-track-player";

import { type Action } from "../types/Action";

export const updateState = (
  currentPlayer: "TrackPlayer" | "Spotify",
  state: PlaybackState | "None" | "Play" | "Pause"
): Action => ({
  type: "UPDATE_STATE",
  currentPlayer,
  state
});
