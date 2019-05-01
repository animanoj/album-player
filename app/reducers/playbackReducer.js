//@flow
import { State as PlaybackState, STATE_NONE } from "react-native-track-player";

import { type Action } from "../types/Action";

type State = {
  currentPlayer: "" | "Spotify" | "TrackPlayer",
  playbackState: PlaybackState,
  spotifyPlayback: "None" | "Play" | "Pause"
};

const initialState: State = {
  currentPlayer: "",
  playbackState: STATE_NONE,
  spotifyPlayback: "None"
};

const playbackReducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case "UPDATE_STATE": {
      switch (action.currentPlayer) {
        case "TrackPlayer":
          return {
            ...state,
            currentPlayer: "TrackPlayer",
            playbackState: action.state
          };
        case "Spotify":
          return {
            ...state,
            currentPlayer: "Spotify",
            spotifyPlayback: action.state
          };
        default:
          return state;
      }
    }
    default: {
      return state;
    }
  }
};

export default playbackReducer;
