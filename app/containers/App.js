import React, { Component } from "react";
import { TouchableOpacity } from "react-native";
import { createStackNavigator, createAppContainer } from "react-navigation";
import { Provider } from "react-redux";
import TrackPlayer from "react-native-track-player";
import Spotify from "rn-spotify-sdk";
import { Icon } from "react-native-elements";

import HomeScreen from "./HomeScreen";
import Player from "./Player";
import MiniPlayer from "./MiniPlayer";
import AlbumList from "./AlbumList";
import SongPlaylistSearch from "./SongPlaylistSearch";
import SongSpotifySearch from "../components/SongSpotifySearch";
import AlbumSearch from "./AlbumSearch";
import SongPlaylist from "./SongPlaylist";
import AlbumPlaylist from "./AlbumPlaylist";
import Queue from "./Queue";
import AlbumSongList from "./AlbumSongList";
import configureStore from "../store";
import {
  updateState,
  updateTrack,
  saveTracks,
  loadPlaylists
} from "../actions";
import NavigationService from "../lib/NavigationService";
import {
  loadSongs,
  storeSongs,
  loadSongPlaylists,
  loadAlbumPlaylists,
  storeSongPlaylists,
  storeAlbumPlaylists
} from "../lib/StorageService";

const AppNavigator = createStackNavigator(
  {
    Home: { screen: HomeScreen, navigationOptions: { header: null } },
    Player: {
      screen: Player,
      navigationOptions: ({ navigation }) => ({
        headerRight: navigation.getParam("showQueue", false) && (
          <TouchableOpacity onPress={() => NavigationService.navigate("Queue")}>
            <Icon name="queue-music" type="MaterialIcons" />
          </TouchableOpacity>
        ),
        headerRightContainerStyle: { margin: 15 }
      })
    },
    AlbumSongs: {
      screen: AlbumSongList,
      navigationOptions: ({ navigation }) => ({
        title: `${navigation.getParam("album", "Unknown")}`
      })
    },
    ArtistAlbums: {
      screen: AlbumList,
      navigationOptions: ({ navigation }) => ({
        title: `${navigation.getParam("author", "Unknown")}`
      })
    },
    SongPlaylist: SongPlaylist,
    AlbumPlaylist: AlbumPlaylist,
    SongPlaylistSearch: SongPlaylistSearch,
    SongSpotifySearch: SongSpotifySearch,
    AlbumSearch: AlbumSearch,
    Queue: {
      screen: Queue,
      navigationOptions: () => ({ title: "Upcoming Songs" })
    }
  },
  {
    initialRouteName: "Home"
  }
);

const AppContainer = createAppContainer(AppNavigator);
const store = configureStore();

export default class App extends Component {
  _loadFromStorage = async (): Promise<void> => {
    const tracks = await loadSongs();
    store.dispatch(saveTracks(tracks));

    const songPlaylists = await loadSongPlaylists();
    const albumPlaylists = await loadAlbumPlaylists();
    store.dispatch(loadPlaylists(songPlaylists, albumPlaylists));
  };

  _saveToStorage = (): void => {
    const { track, playlist } = store.getState();
    const { songPlaylists, albumPlaylists } = playlist;

    storeSongs(track.tracks);
    storeSongPlaylists(songPlaylists);
    storeAlbumPlaylists(albumPlaylists);
  };

  _setTrackPlayerListeners = () => {
    this._onStateChanged = TrackPlayer.addEventListener(
      "playback-state",
      data => {
        const { state } = data;
        if (
          state == TrackPlayer.STATE_PLAYING ||
          state == TrackPlayer.STATE_PAUSED ||
          state == TrackPlayer.STATE_NONE
        ) {
          store.dispatch(updateState("TrackPlayer", state));
        }
      }
    );

    this._onTrackChanged = TrackPlayer.addEventListener(
      "playback-track-changed",
      async data => {
        if (data.nextTrack) {
          const track = await TrackPlayer.getTrack(data.nextTrack);
          store.dispatch(updateTrack(track));
        } else {
          store.dispatch(updateTrack(null));
        }
      }
    );

    this._onQueueEnded = TrackPlayer.addEventListener(
      "playback-queue-ended",
      async () => {
        await TrackPlayer.pause();
        await TrackPlayer.seekTo(0);
      }
    );
  };

  _setSpotifyListeners = () => {
    Spotify.addListener("trackChange", event => {
      const { currentTrack } = event.metadata;
      if (currentTrack != undefined) {
        const track = {
          title: currentTrack.name,
          artist: currentTrack.artistName,
          artwork: currentTrack.albumCoverArtURL
        };
        store.dispatch(updateTrack(track));
      }
    });

    Spotify.addListener("play", () =>
      store.dispatch(updateState("Spotify", "Play"))
    );

    Spotify.addListener("pause", () =>
      store.dispatch(updateState("Spotify", "Pause"))
    );
  };

  componentDidMount() {
    this._loadFromStorage();
    this._setTrackPlayerListeners();
    this._setSpotifyListeners();
  }

  componentWillUnmount() {
    this._onStateChanged.remove();
    this._onTrackChanged.remove();
    this._onQueueEnded.remove();

    this._saveToStorage();
  }

  render() {
    return (
      <Provider store={store}>
        <AppContainer
          ref={navigatorRef =>
            NavigationService.setTopLevelNavigator(navigatorRef)
          }
        />
        <MiniPlayer />
      </Provider>
    );
  }
}
