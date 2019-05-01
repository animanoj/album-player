//@flow
import React, { Component } from "react";
import { StyleSheet, View, PixelRatio } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { type NavigationScreenProp } from "react-navigation";

import PlayerControls from "./PlayerControls";
import AlbumArt from "../components/AlbumArt";
import Details from "../components/Details";
import { updatePlayerFocus } from "../actions";
import { widthPercentageToDP } from "../lib/ResponsiveHelper";
import { type State as ReduxState } from "../types/State";
import { type Track } from "../types/Data";

type Props = {
  activeTrack: Track,
  updatePlayerFocus: boolean => void,
  navigation: NavigationScreenProp<any>
};

class Player extends Component<Props> {
  componentDidMount() {
    const { updatePlayerFocus, navigation } = this.props;
    navigation.addListener("willFocus", () => updatePlayerFocus(true));
    navigation.addListener("willBlur", () => updatePlayerFocus(false));
  }

  render() {
    const { activeTrack } = this.props;
    return (
      <View style={containerStyles.playerContainer}>
        <AlbumArt
          cover={activeTrack?.artwork}
          albumArtStyle={componentStyles.albumArt}
        />
        <Details
          title={activeTrack?.title}
          artist={activeTrack?.artist}
          detailsContainerStyle={containerStyles.detailsContainerStyle}
          titleStyle={componentStyles.title}
          artistStyle={componentStyles.artist}
        />
        <PlayerControls
          controlsContainerStyle={containerStyles.controlsContainer}
          sliderTextContainerStyle={containerStyles.sliderTextContainer}
          sliderStyle={componentStyles.slider}
          iconSize={40}
        />
      </View>
    );
  }
}

const mapStateToProps = (state: ReduxState) => {
  const { activeTrack } = state.track;
  return { activeTrack };
};

const mapDispatchToProps = (dispatch: *) =>
  bindActionCreators({ updatePlayerFocus }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Player);

const containerStyles: any = StyleSheet.create({
  playerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    margin: 10
  },
  detailsContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  sliderTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  }
});

const componentStyles: any = StyleSheet.create({
  albumArt: {
    width: widthPercentageToDP("90%"),
    height: widthPercentageToDP("80%")
  },
  slider: {
    width: PixelRatio.getPixelSizeForLayoutSize(105)
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center"
  },
  artist: {
    fontSize: 20,
    textAlign: "center"
  }
});
