import { StyleSheet, Text, View } from "react-native";
import AudioPlay from "./playing_music";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Lets Get this party started</Text>
      <AudioPlay />
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
  // onclick:Text {
  //   color: '84dcc6',
  // },
});