//@flow
import React, { Component } from "react";
import { Platform } from "react-native";
import Permissions from "react-native-permissions";
import MusicFiles from "react-native-get-music-files";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  createMaterialTopTabNavigator,
  createAppContainer
} from "react-navigation";
import TrackPlayer from "react-native-track-player";

import SongList from "./SongList";
import AlbumList from "./AlbumList";
import ArtistList from "./ArtistList";
import PlaylistList from "./PlaylistList";
import SpotifyLogin from "./SpotifyLogin";
import { saveTracks } from "../actions";
import { type State as ReduxState } from "../types/State";
import { type Song, Track } from "../types/Data";

type Props = {
  tracks: Array<Track>,
  saveTracks: (Array<Track>) => void,
  navigation: any
};

const TabNavigator = createMaterialTopTabNavigator(
  {
    Songs: SongList,
    Albums: AlbumList,
    Artists: ArtistList,
    Playlist: PlaylistList,
    Spotify: SpotifyLogin
  },
  {
    initialRouteName: "Songs",
    lazy: true,
    swipeEnabled: true,
    animationEnabled: true,
    backBehavior: "none",
    tabBarOptions: {
      indicatorStyle: {
        backgroundColor: "palevioletred"
      },
      labelStyle: {
        color: "black"
      },
      style: {
        backgroundColor: "peachpuff"
      },
      scrollEnabled: true
    }
  }
);

const HomeContainer = createAppContainer(TabNavigator);

class HomeScreen extends Component<Props> {
  componentDidMount() {
    const storageString = Platform.select({
      ios: "mediaLibrary",
      android: "storage"
    });

    Permissions.request(storageString).then(response => {
      if (response == "authorized") {
        MusicFiles.getAll({
          artist: true,
          blured: true,
          cover: true,
          duration: true,
          id: true,
          title: true,
          minimumSongDuration: 10000, //in miliseconds
          fields: [
            "title",
            "artwork",
            "duration",
            "artist",
            "genre",
            "lyrics",
            "albumTitle"
          ]
        }).then((songs: Array<Song>) => {
          const newTracks: Array<Track> = songs.map((song: Song) => ({
            id: song.id,
            url: song.path,
            duration: Number.parseFloat(song.duration) / 1000,
            title: song.title,
            artist: song.author,
            album: song.album,
            artwork: song.cover || require("../img/default_album.png"),
            blurredArtwork: song.blur,
            fileName: song.fileName
          }));
          this.props.saveTracks(newTracks);
        });
      }
    });

    TrackPlayer.setupPlayer().then(() => {
      TrackPlayer.updateOptions({
        stopWithApp: true,
        capabilities: [
          TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.CAPABILITY_PAUSE,
          TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
          TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
          TrackPlayer.CAPABILITY_SEEK_TO
        ],
        compactCapabilities: [
          TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.CAPABILITY_PAUSE,
          TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
          TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS
        ]
      });
    });
  }

  render() {
    return <HomeContainer />;
  }
}

const mapStateToProps = (state: ReduxState) => {
  const { tracks } = state.track;
  return { tracks };
};

const mapDispatchToProps = (dispatch: *) =>
  bindActionCreators({ saveTracks }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);
