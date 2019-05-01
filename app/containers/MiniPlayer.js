//@flow
import React from "react";
import { View, StyleSheet } from "react-native";
import { connect } from "react-redux";
import TrackPlayer from "react-native-track-player";

import PlayerControls from "./PlayerControls";
import ProgressBar from "../components/ProgressBar";
import Song from "../components/Song";
import NavigationService from "../lib/NavigationService";
import { type State as ReduxState } from "../types/State";

class MiniPlayer extends TrackPlayer.ProgressComponent {
  _shouldShowPlayer = (): boolean => {
    const {
      activeTrack,
      currentPlayer,
      playbackState,
      spotifyPlayback,
      isPlayerFocused,
      isQueueFocused
    } = this.props;

    const trackPlayerCorrectState =
      currentPlayer == "TrackPlayer" &&
      (playbackState == TrackPlayer.STATE_PLAYING ||
        playbackState == TrackPlayer.STATE_PAUSED);

    const spotifyCorrectState =
      currentPlayer == "Spotify" && spotifyPlayback != "None";

    const haveSongToShow =
      activeTrack != null && (trackPlayerCorrectState || spotifyCorrectState);

    return haveSongToShow && !isPlayerFocused && !isQueueFocused;
  };

  render() {
    const { activeTrack, currentPlayer } = this.props;
    const isSpotify = currentPlayer == "Spotify";

    if (!this._shouldShowPlayer()) {
      return <></>;
    } else {
      return (
        <View style={containerStyles.miniPlayerContainer}>
          {!isSpotify && (
            <ProgressBar
              barColor="blue"
              progress={this.getProgress()}
              barStyle={componentStyles.progressBar}
            />
          )}
          <View style={containerStyles.detailsContainer}>
            <Song
              track={activeTrack}
              albumArtStyle={componentStyles.albumArt}
              songContainerStyle={containerStyles.trackDetailsContainer}
              titleStyle={componentStyles.title}
              artistStyle={componentStyles.artist}
              onPress={() =>
                NavigationService.navigate("Player", { showQueue: !isSpotify })
              }
            />
            <PlayerControls
              miniControls={true}
              controlsContainerStyle={containerStyles.controlsContainer}
            />
          </View>
        </View>
      );
    }
  }
}

const mapStateToProps = (state: ReduxState) => {
  const { activeTrack } = state.track;
  const { currentPlayer, playbackState, spotifyPlayback } = state.playback;
  const { isPlayerFocused, isQueueFocused } = state.navigation;
  return {
    activeTrack,
    currentPlayer,
    playbackState,
    spotifyPlayback,
    isPlayerFocused,
    isQueueFocused
  };
};

export default connect(
  mapStateToProps,
  null
)(MiniPlayer);

const containerStyles = StyleSheet.create({
  miniPlayerContainer: {
    backgroundColor: "whitesmoke"
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  trackDetailsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  controlsContainer: {
    width: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10
  }
});

const componentStyles = StyleSheet.create({
  albumArt: {
    width: 50,
    height: 50,
    margin: 10
  },
  title: {
    fontSize: 16,
    fontWeight: "bold"
  },
  artist: {
    fontSize: 14
  },
  progressBar: {
    height: 5
  }
});
