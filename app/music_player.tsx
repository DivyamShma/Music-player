import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';

export function UseMusicPlayer(uri: string | null) {
    const player = useAudioPlayer(
        uri ? { uri } : null
    );

    const status = useAudioPlayerStatus(player);

    return {
        player,
        status,
    };
}