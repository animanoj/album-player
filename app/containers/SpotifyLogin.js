//@flow
import React, { Component } from "react";
import { Alert, View, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Button } from "react-native-elements";
import Spotify from "rn-spotify-sdk";

import { updateState, updateTrack } from "../actions";
import { type Track } from "../types/Data";
import { safePlaySpotify } from "../lib/PlayService";
import NavigationService from "../lib/NavigationService";
import {
  getAllUserTracks,
  initializeIfNeeded,
  makeSpotifySearch
} from "../lib/SpotifyService";
import SongSearch from "../components/SongSearch";

type Props = {
  updateState: ("TrackPlayer" | "Spotify", "None" | "Play" | "Pause") => void,
  updateTrack: Track => void
};

type State = {
  initialized: boolean,
  loggedIn: boolean,
  songs: Array<any>
};

class SpotifyLogin extends Component<Props, State> {
  state = {
    initialized: false,
    loggedIn: false,
    songs: []
  };

  _onPress = (): void => {
    if (this.state.loggedIn) {
      Spotify.logout().finally(() => this.setState({ loggedIn: false }));
    } else {
      Spotify.login()
        .then(loggedIn => {
          this.setState({ loggedIn });
        })
        .catch(error => Alert.alert("Error", error.message));
    }
  };

  componentDidMount() {
    initializeIfNeeded()
      .then(async loggedIn => {
        const songs = loggedIn ? await getAllUserTracks() : [];
        this.setState({ songs, loggedIn, initialized: true });
      })
      .catch(error => {
        Alert.alert("Error", error.message);
      });
  }

  render() {
    const { loggedIn, initialized, songs } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <Button
          title={loggedIn ? "Log Out" : "Log In"}
          disabled={!initialized}
          onPress={this._onPress}
          buttonStyle={styles.loginButton}
        />
        {loggedIn && (
          <SongSearch
            tracks={songs}
            onPress={track => safePlaySpotify(track.url)}
            onSubmitEditing={async search => {
              const searchTracks = await makeSpotifySearch(search);
              NavigationService.navigate("SongSpotifySearch", {
                tracks: searchTracks
              });
            }}
          />
        )}
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch: *) =>
  bindActionCreators({ updateState, updateTrack }, dispatch);

export default connect(
  null,
  mapDispatchToProps
)(SpotifyLogin);

const styles = StyleSheet.create({
  loginButton: {
    backgroundColor: "palevioletred"
  }
});
