//@flow
import AsyncStorage from "@react-native-community/async-storage";

import { type Track } from "../types/Data";

export function storeSongs(tracks: Array<Track>): void {
  try {
    const songKeys: Array<string> = [];

    tracks.forEach(async track => {
      if (track.id) {
        songKeys.push(track.id);
        await AsyncStorage.setItem(track.id, JSON.stringify(track));
      }
    });

    AsyncStorage.setItem("songs", JSON.stringify(songKeys));
  } catch (_) {
    // error
  }
}

export async function loadSongs(): Promise<Array<Track>> {
  let tracks: Array<Track> = [];

  try {
    const possibleSongKeys: string | null = await AsyncStorage.getItem("songs");
    if (possibleSongKeys != null) {
      const songKeys: Array<string> = JSON.parse(possibleSongKeys);

      const loadedTracks: Array<Track> = (await AsyncStorage.multiGet(
        songKeys
      )).map(track => JSON.parse(track[1]));

      loadedTracks.forEach(track => {
        if (typeof track.artwork != "string") {
          track.artwork = require("../img/default_album.png");
        }
      });

      tracks = loadedTracks;
    }
  } catch (e) {
    // error
  }

  return tracks;
}

export function storeSongPlaylists(songPlaylists: Map<string, Array<Track>>) {
  try {
    AsyncStorage.setItem("songPlaylists", JSON.stringify([...songPlaylists]));
  } catch (_) {
    // error
  }
}

export async function loadSongPlaylists(): Promise<Map<string, Array<Track>>> {
  try {
    const possibleSongPlaylists: string | null = await AsyncStorage.getItem(
      "songPlaylists"
    );

    if (possibleSongPlaylists != null) {
      return new Map(JSON.parse(possibleSongPlaylists));
    }
  } catch (_) {
    // error
  }

  return new Map();
}

export function storeAlbumPlaylists(
  albumPlaylists: Map<string, Array<string>>
) {
  try {
    AsyncStorage.setItem("albumPlaylists", JSON.stringify([...albumPlaylists]));
  } catch (_) {
    // error
  }
}

export async function loadAlbumPlaylists(): Promise<
  Map<string, Array<string>>
> {
  try {
    const possibleAlbumPlaylists: string = await AsyncStorage.getItem(
      "albumPlaylists"
    );

    if (possibleAlbumPlaylists != null) {
      return new Map(JSON.parse(possibleAlbumPlaylists));
    }
  } catch (_) {
    // error
  }

  return new Map();
}
