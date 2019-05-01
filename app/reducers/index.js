//@flow
import { combineReducers } from "redux";

import trackReducer from "./trackReducer";
import playbackReducer from "./playbackReducer";
import navigationReducer from "./navigationReducer";
import playlistReducer from "./playlistReducer";

const reducers = {
  track: trackReducer,
  playback: playbackReducer,
  navigation: navigationReducer,
  playlist: playlistReducer
};

export type Reducers = typeof reducers;

export default combineReducers<Reducers, *>(reducers);
