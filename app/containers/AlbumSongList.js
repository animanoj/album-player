//@flow
import React, { Component, type Element } from "react";
import { View, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ListItem } from "react-native-elements";
import { type NavigationScreenProp } from "react-navigation";
import { LargeList } from "react-native-largelist-v3";

import Album from "../components/Album";
import { fetchQueue } from "../actions";
import { playSongs } from "../lib/QueueService";
import { type Track } from "../types/Data";

type Props = {
  fetchQueue: void => void,
  navigation: NavigationScreenProp<any>
};

class AlbumSongList extends Component<Props> {
  _getNavigationProps = (): Object => {
    const { navigation } = this.props;
    return {
      album: navigation.getParam("album", ""),
      tracks: navigation.getParam("tracks", [])
    };
  };

  _renderSong = (
    item: Track,
    index: number,
    tracks: Array<Track>,
    fetchQueue: void => void
  ): Element<any> => (
    <ListItem
      topDivider
      bottomDivider
      title={item.title}
      onPress={() => playSongs(tracks, index, fetchQueue)}
    />
  );

  render() {
    const { fetchQueue } = this.props;
    const { album, tracks } = this._getNavigationProps();

    return (
      <View style={containerStyles.listContainer}>
        <Album
          cover={tracks[0].artwork}
          title={album}
          artist={tracks[0].artist}
          albumArtStyle={componentStyles.albumArt}
          albumContainerStyle={containerStyles.albumContainer}
          detailsContainerStyle={containerStyles.detailsContainer}
          titleStyle={componentStyles.title}
          artistStyle={componentStyles.artist}
        />
        <LargeList
          data={[{ items: tracks }]}
          renderIndexPath={({ row }) =>
            this._renderSong(tracks[row], row, tracks, fetchQueue)
          }
          heightForIndexPath={() => 50}
        />
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch: *) =>
  bindActionCreators({ fetchQueue }, dispatch);

export default connect(
  null,
  mapDispatchToProps
)(AlbumSongList);

const containerStyles = StyleSheet.create({
  listContainer: {
    flex: 1
  },
  albumContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    margin: 10
  },
  detailsContainer: {
    flex: 1,
    margin: 5
  }
});

const componentStyles = StyleSheet.create({
  albumArt: {
    height: 175,
    width: 175,
    margin: 5
  },
  title: {
    fontSize: 24,
    fontWeight: "bold"
  },
  artist: {
    fontSize: 20
  }
});
