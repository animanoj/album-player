//@flow
import { State as PlaybackState } from "react-native-track-player";

import { type Track } from "../types/Data";

type SaveTrackAction = {
  type: "SAVE_TRACKS",
  tracks: Array<Track>
};

type UpdateTrack = {
  type: "UPDATE_TRACK",
  track: Track
};

type UpdateQueue = {
  type: "UPDATE_QUEUE",
  queue: Array<Track>
};

type UpdatePlaybackState = {
  type: "UPDATE_STATE",
  currentPlayer: "TrackPlayer" | "Spotify",
  state: PlaybackState
};

type UpdatePlayerFocus = {
  type: "UPDATE_PLAYER_FOCUS",
  isPlayerFocused: boolean
};

type UpdateQueueFocus = {
  type: "UPDATE_QUEUE_FOCUS",
  isQueueFocused: boolean
};

type AddSongPlaylist = {
  type: "ADD_SONG_PLAYLIST",
  playlistName: string,
  tracks: Array<Track>
};

type AddAlbumPlaylist = {
  type: "ADD_ALBUM_PLAYLIST",
  playlistName: string,
  albums: Array<string>
};

type LoadPlaylists = {
  type: "LOAD_PLAYLISTS",
  songPlaylists: Map<string, Array<Track>>,
  albumPlaylists: Map<string, Array<string>>
};

export type Action =
  | SaveTrackAction
  | UpdateTrack
  | UpdateQueue
  | UpdatePlaybackState
  | UpdatePlayerFocus
  | UpdateQueueFocus
  | AddSongPlaylist
  | AddAlbumPlaylist
  | LoadPlaylists;
