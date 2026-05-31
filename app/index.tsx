import { StyleSheet, Text, View, Button } from "react-native";
import { RequestAudioPermission, GetAudioFiles } from "./getPermission";
import { UseMusicPlayer } from "./music_player";
import { useState, useEffect } from "react";
import * as MediaLibrary from 'expo-media-library';
import { useAudioPlayer } from "expo-audio";


export default function Index() {

  const [songs, setSongs] = useState<MediaLibrary.Asset[]>([]);
  const [selectedSong, setSelectedSong] = useState<string | null>(null);
  // const [currentPlaying, setCurrentPlaying] = useState<MediaLibrary.Asset>();

  // const { player, status } = UseMusicPlayer(selectedSong);

  const loadSongs = async () => {
    const granted = await RequestAudioPermission();

    if (!granted) {
      console.log("Permission denied");
      return;
    }

    const songs = await GetAudioFiles();
    setSongs(songs);
    console.log("Found songs:", songs.length);
  };

  const player = useAudioPlayer(selectedSong);


  //   useEffect(() => {
  //   console.log("Status:", {
  //     playing: status?.playing,
  //     currentTime: status?.currentTime,
  //   });
  // }, [status]);

  useEffect(() => {
    console.log("Selected song:", selectedSong);
  }, [selectedSong]);

  return (
    <View style={styles.container}>

      <Text style={styles.text}>Lets Get this party started</Text>
      <Text style={styles.text}>Songs Loaded: {songs.length}</Text>

      {/* button for testing of loading files */}
      <View style={styles.button_container}>
        <Button title="Load Audio Files"
          onPress={loadSongs}
        />


        {/* for playing the first song */}
        <Button title="Play First Song"
          onPress={() => {
            if (songs.length > 0) {
              console.log("URI:", songs[0].uri);
              console.log("Filename:", songs[0].filename);

              setSelectedSong(songs[0].uri);
            }
          }}
        />
        <Button title="Play" onPress={() => {
          player.play();
          }} />
        <Button title="Pause" onPress={() => player.pause()} />
        <Button title="Restart" onPress={() => {
          player.seekTo(0);
          player.play();
        }} />


      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16161d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#84dcc6',
  },
  button_container: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
});
