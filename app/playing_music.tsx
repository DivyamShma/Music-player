// import { Button, View, StyleSheet } from 'react-native';
// import { Audio } from 'expo-av';
// import { useState } from 'react';

// export default function AudioPlay() {
//   const [sound, setSound] = useState<Audio.Sound | null>(null);

//   async function playSound() {
//     const { sound } = await Audio.Sound.createAsync(
//       require('../assets/Rarin - YESSIR!.wav')
//     );

//     setSound(sound);

//     await sound.playAsync();
//   }

//   return (
//     <View style={styles.container}>
//       <Button title="Play Sound" onPress={playSound} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//   justifyContent: 'center',
//   alignItems: 'center',
//   gap: 10,
// },
// });

// import * as MediaLibrary from 'expo-media-library';
// import { Button, View, StyleSheet } from 'react-native';


// export default function AudioPlay() {

//     const [audioPermission, requestAudioPermission] =
//         MediaLibrary.usePermissions({
//             granularPermissions: ['audio'],
//         });

//     async function PlaySound() {

//         if (!audioPermission?.granted) {
//             await requestAudioPermission();
//             return;
//         }
//         const assets = await MediaLibrary.getAssetsAsync({
//             mediaType: MediaLibrary.MediaType.audio,
//         });

//         console.log(assets.assets);

//         // return audioPermission;
//     }

//     return (
//         <View style={styles.container}>
//             <Button title="Request Audio Access" onPress={() => PlaySound()} />
//         </View>
//     );
// }



import * as MediaLibrary from 'expo-media-library';
import { Button, View, StyleSheet } from 'react-native';
import { useState } from 'react';

export default function AudioPlay() {
    

    const [songs, setSongs] = useState<MediaLibrary.Asset[]>([]);

    
    const [audioPermission, requestAudioPermission] =
        MediaLibrary.usePermissions({
            granularPermissions: ['audio'],
        });
    
    async function loadSongs() {
        let granted = audioPermission?.granted;

        if (!granted) {
            const response = await requestAudioPermission();
            granted = response.granted;
        }

        if (!granted){
            console.log("Whomp whomp");
            return ;
        } 

        const assets = await MediaLibrary.getAssetsAsync({
            mediaType: MediaLibrary.MediaType.audio,
            first: 1000,
        });

        setSongs(assets.assets);

        console.log(`Found ${assets.assets.length} audio files`);
    }
    
    return (
        <View style={styles.container}>
            <Button
                title="Load Audio Files"
                onPress={loadSongs}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
}
)