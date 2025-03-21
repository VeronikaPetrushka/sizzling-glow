import React from 'react';
import { View } from 'react-native';
import { useMusic } from '../music';

const Player = () => {
    const { isPlaying, togglePlay } = useMusic();

    return <View />;
};

export default Player;