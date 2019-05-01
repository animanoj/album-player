//@flow
import Spotify from "rn-spotify-sdk/src/Spotify";

import spotifyOptions from "../authValues";
import { type Track } from "../types/Data";

export function parseSpotifySongs(songs: any): Array<Track> {
  return songs.map(song => ({
    id: song.id,
    title: song.name,
    artist: song.artists.map(artist => artist.name).join(", "),
    artwork: song.album.images[0].url,
    url: song.uri
  }));
}

export function parseUserSongs(items: any): Array<Track> {
  const songs = items.map(({ track }) => track);
  return parseSpotifySongs(songs);
}

export async function makeSpotifySearch(search: string): Promise<Array<Track>> {
  const response = await Spotify.search(search, ["track"]);
  return parseSpotifySongs(response.tracks.items);
}

export async function getAllUserTracks(): Promise<Array<Track>> {
  const songs: Array<Track> = [];

  const { total, items } = await Spotify.getMyTracks({
    limit: 50,
    offset: 0
  });

  songs.push(...parseUserSongs(items));

  for (let i = 50; i < total; i += 50) {
    const { items } = await Spotify.getMyTracks({
      limit: 50,
      offset: i
    });

    songs.push(...parseUserSongs(items));
  }

  return songs;
}

export async function initializeIfNeeded(): Promise<boolean> {
  const loggedIn = (await Spotify.isInitializedAsync())
    ? await Spotify.isLoggedInAsync()
    : await Spotify.initialize(spotifyOptions);

  if (loggedIn) {
    const session = await Spotify.getSessionAsync();
    if (session.expireTime - new Date().getTime() < 0) {
      await Spotify.logout();
      await Spotify.login();
    }
  }

  return loggedIn;
}
