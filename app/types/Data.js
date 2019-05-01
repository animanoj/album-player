import { ResourceObject } from "react-native-track-player";

export type Song = {
  album: string,
  author: string,
  blur: string,
  cover: string,
  duration: number,
  fileName: string,
  id: string,
  path: string,
  title: string
};

export type Track = {
  id: string,
  url: string,
  duration: number,
  title: string,
  artist: string,
  album: string,
  artwork: string | ResourceObject,
  blurredArtwork: string,
  fileName: string
};
