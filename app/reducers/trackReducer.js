//@flow
import { type Action } from "../types/Action";
import { type Track } from "../types/Data";

type State = {
  tracks: Array<Track>,
  albums: Map<string, Array<Track>>,
  artists: Map<string, Set<string>>,
  activeTrack: Track,
  queue: Array<Track>,
  activeTrackQueueIndex: number
};

const initialState: State = {
  tracks: [],
  albums: new Map(),
  artists: new Map(),
  activeTrack: null,
  queue: [],
  activeTrackQueueIndex: -1
};

const _sortByTrackName = (track_1: Track, track_2: Track): number => {
  // sorting assumes the file name will have the number of the song in the album
  const track_1_num: number = Number.parseInt(track_1.fileName.substr(0, 2));
  const track_2_num: number = Number.parseInt(track_2.fileName.substr(0, 2));

  if (Number.isFinite(track_1_num) && Number.isFinite(track_2_num)) {
    return track_1_num - track_2_num;
  } else {
    return 0;
  }
};

const trackReducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case "SAVE_TRACKS": {
      const { albums, artists } = state;

      albums.clear();
      artists.clear();

      action.tracks.forEach((track: Track) => {
        const { album, artist } = track;

        const albumSongList = albums.get(album);
        if (albumSongList != undefined) {
          albumSongList.push(track);
        } else {
          albums.set(album, [track]);
        }

        const artistAlbumList = artists.get(artist);
        if (artistAlbumList != undefined) {
          artistAlbumList.add(album);
        } else {
          artists.set(artist, new Set([album]));
        }
      });

      const tracks: Array<Track> = [...action.tracks].sort(
        (a: Track, b: Track) => b.title - a.title
      );
      albums.forEach(tracks => tracks.sort(_sortByTrackName));
      artists.forEach((albums, artist) =>
        artists.set(artist, new Set([...albums].sort()))
      );

      return {
        ...state,
        tracks,
        albums: new Map<string, Array<Track>>([...albums.entries()].sort()),
        artists: new Map<string, Set<string>>([...artists.entries()].sort())
      };
    }
    case "UPDATE_TRACK": {
      const { queue } = state;
      const { track } = action;

      const activeTrackQueueIndex =
        track != null ? queue.findIndex(val => val.id == track.id) : -1;

      return { ...state, activeTrack: track, activeTrackQueueIndex };
    }
    case "UPDATE_QUEUE": {
      return { ...state, queue: action.queue };
    }
    default: {
      return state;
    }
  }
};

export default trackReducer;
