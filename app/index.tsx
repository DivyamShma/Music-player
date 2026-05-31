import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity } from "react-native";
import { RequestAudioPermission, GetAudioFiles } from "./getPermission";
import { useState, useEffect } from "react";
import * as MediaLibrary from "expo-media-library";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [songs, setSongs] = useState<MediaLibrary.Asset[]>([]);
  const [playlist, setPlaylist] = useState<MediaLibrary.Asset[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const [repeatMode, setRepeatMode] = useState(false);
  const [shuffleMode, setShuffleMode] = useState(false);

  const currentSong =
    currentIndex >= 0 && currentIndex < playlist.length
      ? playlist[currentIndex]
      : null;

  const player = useAudioPlayer(
    currentSong?.uri ?? null
  );

  const status = useAudioPlayerStatus(player);

  const LoadSongs = async () => {
    const granted = await RequestAudioPermission();

    if (!granted) {
      console.log("Permission denied");
      return;
    }

    const loadedSongs = await GetAudioFiles();

    const filteredSongs = loadedSongs.filter(
      (song) => song.duration && song.duration > 30
    );

    setSongs(filteredSongs);
    setPlaylist(filteredSongs);

    console.log(
      `Found ${filteredSongs.length} songs`
    );
  };

  const PlaySong = (index: number) => {
    if (
      index < 0 ||
      index >= playlist.length
    ) {
      return;
    }

    setCurrentIndex(index);
  };

  const PlayNext = () => {
    if (playlist.length === 0) {
      return;
    }

    let nextIndex;

    if (shuffleMode) {
      nextIndex = Math.floor(
        Math.random() * playlist.length
      );
    } else {
      nextIndex =
        (currentIndex + 1) %
        playlist.length;
    }

    PlaySong(nextIndex);
  };

  const PlayPrevious = () => {
    if (playlist.length === 0) {
      return;
    }

    const previousIndex =
      currentIndex <= 0
        ? playlist.length - 1
        : currentIndex - 1;

    PlaySong(previousIndex);
  };

  useEffect(() => {
    const LoadSavedPlaylist = async () => {
      try {
        const savedPlaylist =
          await AsyncStorage.getItem(
            "playlist"
          );

        if (savedPlaylist) {
          const parsed =
            JSON.parse(savedPlaylist);

          setPlaylist(parsed);
          setSongs(parsed);
        }
      } catch (error) {
        console.log(error);
      }
    };

    LoadSavedPlaylist();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(
      "playlist",
      JSON.stringify(playlist)
    );
  }, [playlist]);

  useEffect(() => {
    if (!currentSong) {
      return;
    }

    player.play();
  }, [currentSong]);

  useEffect(() => {
    console.log(
      "Current Song:",
      currentSong?.filename
    );
  }, [currentSong]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Local Music Player
      </Text>

      <Text style={styles.text}>
        Songs Loaded: {songs.length}
      </Text>

      <Text style={styles.text}>
        Current Song:
      </Text>

      <Text style={styles.songName}>
        {currentSong
          ? currentSong.filename
          : "No Song Selected"}
      </Text>

      <Text style={styles.text}>
        {status
          ? `${Math.floor(
              status.currentTime || 0
            )}s / ${Math.floor(
              status.duration || 0
            )}s`
          : "0s / 0s"}
      </Text>

      <View style={styles.controls}>
        <Button
          title="Load Songs"
          onPress={LoadSongs}
        />

        <Button
          title="Previous"
          onPress={PlayPrevious}
        />

        <Button
          title="Play"
          onPress={() => player.play()}
        />

        <Button
          title="Pause"
          onPress={() => player.pause()}
        />

        <Button
          title="Next"
          onPress={PlayNext}
        />

        <Button
          title={
            repeatMode
              ? "Repeat ON"
              : "Repeat OFF"
          }
          onPress={() =>
            setRepeatMode(!repeatMode)
          }
        />

        <Button
          title={
            shuffleMode
              ? "Shuffle ON"
              : "Shuffle OFF"
          }
          onPress={() =>
            setShuffleMode(!shuffleMode)
          }
        />
      </View>

      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[
              styles.songItem,
              index === currentIndex &&
                styles.activeSong,
            ]}
            onPress={() =>
              PlaySong(index)
            }
          >
            <Text style={styles.songText}>
              {item.filename}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#16161d",
    paddingTop: 50,
  },
  heading: {
    color: "#84dcc6",
    fontSize: 24,
    textAlign: "center",
    marginBottom: 10,
  },
  text: {
    color: "#84dcc6",
    textAlign: "center",
  },
  songName: {
    color: "white",
    textAlign: "center",
    marginBottom: 10,
  },
  controls: {
    gap: 10,
    padding: 10,
  },
  songItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  activeSong: {
    backgroundColor: "#2c2c36",
  },
  songText: {
    color: "white",
  },
});