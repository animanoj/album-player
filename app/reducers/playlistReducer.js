//@flow
import { type Action } from "../types/Action";
import { type Track } from "../types/Data";

type State = {
  songPlaylists: Map<string, Array<Track>>,
  albumPlaylists: Map<string, Array<string>>
};

const initialState: State = {
  songPlaylists: new Map(),
  albumPlaylists: new Map()
};

const playlistReducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case "ADD_SONG_PLAYLIST": {
      const { playlistName, tracks } = action;
      const { songPlaylists } = state;

      songPlaylists.set(playlistName, tracks);
      return { ...state, songPlaylists };
    }
    case "ADD_ALBUM_PLAYLIST": {
      const { playlistName, albums } = action;
      const { albumPlaylists } = state;

      albumPlaylists.set(playlistName, albums);
      return { ...state, albumPlaylists };
    }
    case "LOAD_PLAYLISTS": {
      const { songPlaylists, albumPlaylists } = state;
      const {
        songPlaylists: newSongPlaylists,
        albumPlaylists: newAlbumPlaylists
      } = action;

      return {
        ...state,
        songPlaylists: new Map<string, Array<Track>>([
          ...songPlaylists,
          ...newSongPlaylists
        ]),
        albumPlaylists: new Map<string, Array<string>>([
          ...albumPlaylists,
          ...newAlbumPlaylists
        ])
      };
    }
    default: {
      return state;
    }
  }
};

export default playlistReducer;
