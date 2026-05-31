import * as MediaLibrary from 'expo-media-library';


export async function RequestAudioPermission() {
    const permission = await MediaLibrary.requestPermissionsAsync(
            false,
            ['audio']
        );

    return permission.granted;
}

export async function GetAudioFiles() {
    const assets = await MediaLibrary.getAssetsAsync({
            mediaType: MediaLibrary.MediaType.audio,
            first: 1000,
        });

    return assets.assets;
}

// export default function GetPermission() {
    

//     const [songs, setSongs] = useState<MediaLibrary.Asset[]>([]);

    
//     const [audioPermission, requestAudioPermission] =
//         MediaLibrary.usePermissions({
//             granularPermissions: ['audio'],
//         });
    
//     async function loadSongs() {
//         let granted = audioPermission?.granted;

//         if (!granted) {
//             const response = await requestAudioPermission();
//             granted = response.granted;
//         }

//         if (!granted){
//             // console.log("Whomp whomp");
//             return ;
//         } 

//         const assets = await MediaLibrary.getAssetsAsync({
//             mediaType: MediaLibrary.MediaType.audio,
//             first: 1000,
//         });

//         setSongs(assets.assets);

//         console.log(`Found ${assets.assets.length} audio files`);
//         console.log(JSON.stringify(assets.assets[0], null, 2));
//     }
    
//     return (
//         <View style={styles.container}>
//             <Button
//                 title="Load Audio Files"
//                 onPress={loadSongs}
//             />
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         gap: 10,
//     },
// }
// )