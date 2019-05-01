//@flow
import { type Action } from "../types/Action";
import { type Track } from "../types/Data";

export const addSongPlaylist = (
  playlistName: string,
  tracks: Array<Track>
): Action => ({
  type: "ADD_SONG_PLAYLIST",
  playlistName,
  tracks
});

export const addAlbumPlaylist = (
  playlistName: string,
  albums: Array<string>
): Action => ({
  type: "ADD_ALBUM_PLAYLIST",
  playlistName,
  albums
});

export const loadPlaylists = (
  songPlaylists: Map<string, Array<Track>>,
  albumPlaylists: Map<string, Array<string>>
): Action => ({
  type: "LOAD_PLAYLISTS",
  songPlaylists,
  albumPlaylists
});
