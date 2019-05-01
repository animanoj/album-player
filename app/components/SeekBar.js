//@flow
import React from "react";
import { View } from "react-native";
import { Slider, Text } from "react-native-elements";
import TrackPlayer from "react-native-track-player";

const _pad = (time: string, size: number, padString: string): string => {
  while (time.length < size) {
    time = padString + time;
  }
  return time;
};

const _getSeekBarText = (time: number): string => {
  // add empty string at end to convert to string
  const hours: string = Math.floor(time / 3600) + "";
  var minutes: string = (Math.floor(time / 60) % 60) + "";
  var seconds: string = Math.floor(time % 60) + "";

  if (hours != "0") {
    minutes = _pad(minutes, 2, "0");
  }

  seconds = _pad(seconds, 2, "0");

  var seekBarText = hours != "0" ? hours + ":" : "";
  seekBarText += minutes + ":" + seconds;

  return seekBarText;
};

export default class SeekBar extends TrackPlayer.ProgressComponent {
  _onSeek = (value: number): void => {
    TrackPlayer.seekTo(value);
  };

  render() {
    const { _onSeek, state, props } = this;
    const { sliderTextContainerStyle, sliderStyle } = props;
    const { position, duration } = state;

    const currentTime = _getSeekBarText(position);
    const remainingTime = _getSeekBarText(Math.max(duration - position, 0));

    return (
      <>
        <Slider
          style={sliderStyle}
          maximumValue={duration}
          value={position}
          onValueChange={_onSeek}
        />
        <View style={sliderTextContainerStyle}>
          <Text>{currentTime}</Text>
          <Text>{"-" + remainingTime}</Text>
        </View>
      </>
    );
  }
}
