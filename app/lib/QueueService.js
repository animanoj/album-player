//@flow
import TrackPlayer from "react-native-track-player";

import { safePlayTrackPlayer } from "./PlayService";
import { Track } from "../types/Data";

function shuffle<T>(items: Array<T>): Array<T> {
  var i: number, j: number, temp: T;
  for (i = items.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = items[i];
    items[i] = items[j];
    items[j] = temp;
  }

  return items;
}

async function forceTrackUpdate(firstSongId, secondSongId) {
  // there is a bug where the track change event for the first song of a queue is null
  // skipping ahead and going back fixes the bug
  await TrackPlayer.skip(secondSongId);
  await TrackPlayer.skip(firstSongId);
}

export async function playSongs(
  queue: Array<Track>,
  trackIndex: number,
  updateQueue: void => void
) {
  const tracks = [...queue];

  await TrackPlayer.reset();
  await TrackPlayer.add(tracks);
  await updateQueue();

  if (trackIndex == 0 && tracks.length > 1) {
    forceTrackUpdate(tracks[0].id, tracks[1].id);
  }
  await TrackPlayer.skip(tracks[trackIndex].id);

  safePlayTrackPlayer();
}

export function playAlbums(
  albumQueue: Array<string>,
  albums: Map<string, Array<Track>>,
  updateQueue: void => void,
  index?: number = 0
) {
  const queue = albumQueue.reduce((queue: Array<Track>, albumName: string) => {
    const albumSongs = albums.get(albumName);
    if (albumSongs != undefined) {
      return [...queue, ...albumSongs];
    } else {
      return queue;
    }
  }, []);

  const trackIndex = albumQueue
    .slice(0, index)
    .reduce(
      (currIndex, albumName) =>
        currIndex + (albums.get(albumName) || []).length,
      0
    );

  playSongs(queue, trackIndex, updateQueue);
}

export async function onShuffleSongs(
  tracks: Array<Track>,
  updateQueue: void => void
): Promise<void> {
  playSongs(shuffle([...tracks]), 0, updateQueue);
}

export async function onShuffleAlbums(
  albumQueue: Array<string>,
  albums: Map<string, Array<Track>>,
  updateQueue: void => void
): Promise<void> {
  playAlbums(shuffle([...albumQueue]), albums, updateQueue);
}
