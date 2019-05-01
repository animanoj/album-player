import TrackPlayer from "react-native-track-player";
import Spotify from "rn-spotify-sdk";

export async function safePlayTrackPlayer() {
  try {
    await Spotify.setPlaying(false);
  } catch (_) {
    // spotify not initialized
  }
  await TrackPlayer.play();
}

export async function safePlaySpotify(trackUri: string) {
  try {
    await TrackPlayer.pause();
  } catch (_) {
    // trackplayer not initialized
  }
  await Spotify.playURI(trackUri, 0, 0);
}
