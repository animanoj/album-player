//@flow
import React, { Component, type Element } from "react";
import { View, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  ListItem,
  Button,
  Text,
  Input,
  ButtonGroup,
  Divider
} from "react-native-elements";
import Dialog, {
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogButton
} from "react-native-popup-dialog";
import { LargeList } from "react-native-largelist-v3";

import { addSongPlaylist, addAlbumPlaylist } from "../actions";
import NavigationService from "../lib/NavigationService";
import { type Track } from "../types/Data";
import { type State as ReduxState } from "../types/State";

type Props = {
  songPlaylists: Map<string, Array<Track>>,
  albumPlaylists: Map<string, Array<string>>,
  addSongPlaylist: (string, Array<Track>) => void,
  addAlbumPlaylist: (string, Array<string>) => void
};

type State = {
  showNewDialog: boolean,
  inputText: string,
  selectedPlaylistType: number
};

const PlaylistTypes = ["Song", "Album"];

class PlaylistList extends Component<Props, State> {
  state: State = {
    showNewDialog: false,
    inputText: "",
    selectedPlaylistType: 0
  };

  _renderPlaylistItem = (playlistName: string): Element<any> => {
    const { songPlaylists, albumPlaylists } = this.props;
    var onPress = () => {};

    if (songPlaylists.has(playlistName)) {
      onPress = () =>
        NavigationService.navigate("SongPlaylist", { playlistName });
    } else if (albumPlaylists.has(playlistName)) {
      onPress = () =>
        NavigationService.navigate("AlbumPlaylist", { playlistName });
    }

    return <ListItem title={playlistName} {...{ onPress }} />;
  };

  _renderDialogFooter = (playlistNames: Array<string>): Element<any> => {
    const { _isCreateDisabled, _createNewPlaylist } = this;
    return (
      <DialogFooter>
        <DialogButton
          text="Cancel"
          textStyle={styles.activeDialogButton}
          onPress={() => this.setState({ showNewDialog: false })}
        />
        <DialogButton
          text="Create"
          textStyle={
            _isCreateDisabled(playlistNames) ? {} : styles.activeDialogButton
          }
          onPress={() => _createNewPlaylist()}
          disabled={_isCreateDisabled(playlistNames)}
        />
      </DialogFooter>
    );
  };

  _renderDialogContent = (): Element<any> => {
    const { state, _createNewPlaylist } = this;
    return (
      <DialogContent>
        <Text>Enter a name for the new playlist.</Text>
        <Divider style={styles.divider} />
        <Text style={styles.playlistType}>Playlist Type</Text>
        <ButtonGroup
          buttons={PlaylistTypes}
          selectedIndex={state.selectedPlaylistType}
          onPress={selectedPlaylistType =>
            this.setState({ selectedPlaylistType })
          }
          selectedButtonStyle={styles.typeActiveButton}
        />
        <Input
          autoCapitalize="words"
          placeholder="Playlist Name"
          onChangeText={inputText => this.setState({ inputText })}
          onSubmitEditing={() => _createNewPlaylist()}
        />
      </DialogContent>
    );
  };

  _renderDialog = (playlistNames: Array<string>): Element<any> => {
    const { _renderDialogContent, _renderDialogFooter, state } = this;
    return (
      <Dialog
        onTouchOutside={() => this.setState({ showNewDialog: false })}
        visible={state.showNewDialog}
        dialogTitle={<DialogTitle title="Create New Playlist" />}
        footer={_renderDialogFooter(playlistNames)}
      >
        {_renderDialogContent()}
      </Dialog>
    );
  };

  _isCreateDisabled = (playlistNames: Array<string>): boolean => {
    const { inputText } = this.state;

    if (inputText.length == 0) {
      return true;
    }

    if (playlistNames.includes(inputText)) {
      return true;
    }

    return false;
  };

  _createNewPlaylist = (): void => {
    const { inputText, selectedPlaylistType } = this.state;
    const { addSongPlaylist, addAlbumPlaylist } = this.props;

    switch (PlaylistTypes[selectedPlaylistType]) {
      case "Song":
        addSongPlaylist(inputText, []);
        break;
      case "Album":
        addAlbumPlaylist(inputText, []);
        break;
    }
    this.setState({ showNewDialog: false, inputText: "" });
  };

  render() {
    const { _renderPlaylistItem, _renderDialog, props } = this;
    const { songPlaylists, albumPlaylists } = props;

    const playlistNames = [
      ...songPlaylists.keys(),
      ...albumPlaylists.keys()
    ].sort();

    return (
      <View style={{ flex: 1 }}>
        <LargeList
          data={[{ items: playlistNames }]}
          renderIndexPath={({ row }) => _renderPlaylistItem(playlistNames[row])}
          heightForIndexPath={() => 50}
        />
        <Button
          iconRight
          buttonStyle={styles.newPlaylistButton}
          title="New Playlist"
          icon={{ name: "plus-circle", type: "font-awesome" }}
          onPress={() => this.setState({ showNewDialog: true })}
        />
        {_renderDialog(playlistNames)}
      </View>
    );
  }
}

const mapStateToProps = (state: ReduxState) => {
  const { songPlaylists, albumPlaylists } = state.playlist;
  return { songPlaylists, albumPlaylists };
};

const mapDispatchToProps = (dispatch: *) =>
  bindActionCreators({ addSongPlaylist, addAlbumPlaylist }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlaylistList);

const styles = StyleSheet.create({
  activeDialogButton: {
    color: "palevioletred"
  },
  divider: {
    margin: 10
  },
  playlistType: {
    textAlign: "center"
  },
  typeActiveButton: {
    backgroundColor: "palevioletred"
  },
  newPlaylistButton: {
    backgroundColor: "palevioletred"
  }
});
