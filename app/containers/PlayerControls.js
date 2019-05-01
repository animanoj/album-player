//@flow
import React, { Component } from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Icon } from "react-native-elements";
import TrackPlayer from "react-native-track-player";
import Spotify from "rn-spotify-sdk";

import SeekBar from "../components/SeekBar";
import { updateState } from "../actions";
import { type State as ReduxState } from "../types/State";

type Props = {
  currentPlayer: "" | "Spotify" | "TrackPlayer",
  playbackState: TrackPlayer.State,
  spotifyPlayback: "None" | "Play" | "Pause",
  controlsContainerStyle?: Object,
  sliderTextContainerStyle?: Object,
  sliderStyle?: Object,
  iconSize?: number,
  miniControls?: boolean
};

class PlayerControls extends Component<Props> {
  _chooseIcon = (): string => {
    const { playbackState, spotifyPlayback, currentPlayer } = this.props;
    if (currentPlayer == "Spotify") {
      switch (spotifyPlayback) {
        case "Play":
          return "pause";
        case "Pause":
          return "play";
        default:
          return "play";
      }
    } else {
      switch (playbackState) {
        case TrackPlayer.STATE_PLAYING:
          return "pause";
        case TrackPlayer.STATE_PAUSED:
          return "play";
        default:
          return "play";
      }
    }
  };

  _pressPauseOrPlay = async (): Promise<void> => {
    const { playbackState, spotifyPlayback, currentPlayer } = this.props;
    if (currentPlayer == "Spotify") {
      if (spotifyPlayback == "Play") {
        await Spotify.setPlaying(false);
      } else if (spotifyPlayback == "Pause") {
        await Spotify.setPlaying(true);
      }
    } else {
      if (playbackState == TrackPlayer.STATE_PLAYING) {
        await TrackPlayer.pause();
      } else if (playbackState == TrackPlayer.STATE_PAUSED) {
        await TrackPlayer.play();
      }
    }
  };

  _pressBackward = async (): Promise<void> => {
    const position = await TrackPlayer.getPosition();
    if (position > 5) {
      TrackPlayer.seekTo(0);
    } else {
      try {
        await TrackPlayer.skipToPrevious();
      } catch (_) {
        await TrackPlayer.seekTo(0);
      }
    }
  };

  _pressForward = async (): Promise<void> => {
    try {
      await TrackPlayer.skipToNext();
    } catch (_) {
      await TrackPlayer.pause();
      await TrackPlayer.seekTo(0);
    }
  };

  render() {
    const {
      props,
      _chooseIcon,
      _pressBackward,
      _pressPauseOrPlay,
      _pressForward
    } = this;

    const {
      controlsContainerStyle,
      sliderTextContainerStyle,
      sliderStyle,
      iconSize,
      miniControls = false,
      currentPlayer
    } = props;

    const playIcon = _chooseIcon();
    const isSpotify: boolean = currentPlayer == "Spotify";

    return (
      <View>
        {!(miniControls || isSpotify) && (
          <SeekBar
            {...{
              sliderTextContainerStyle,
              sliderStyle
            }}
          />
        )}
        <View style={controlsContainerStyle}>
          {!isSpotify && (
            <Icon
              name="step-backward"
              type="font-awesome"
              onPress={_pressBackward}
              size={iconSize}
            />
          )}
          <Icon
            name={playIcon}
            type="font-awesome"
            onPress={_pressPauseOrPlay}
            size={iconSize}
          />
          {!isSpotify && (
            <Icon
              name="step-forward"
              type="font-awesome"
              onPress={_pressForward}
              size={iconSize}
            />
          )}
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state: ReduxState) => {
  const { currentPlayer, playbackState, spotifyPlayback } = state.playback;
  return { currentPlayer, playbackState, spotifyPlayback };
};

const mapDispatchToProps = (dispatch: *) =>
  bindActionCreators({ updateState }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayerControls);
