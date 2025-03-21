import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Icons = ({ type, active }) => {

  let imageSource;
  let iconStyle = [styles.icon];

  switch (type) {
    case 'back':
      imageSource = require('../assets/icons/back.png');
      break;
    case 'close':
      imageSource = require('../assets/icons/close.png');
      break;
    case 'sound':
      imageSource = require('../assets/icons/sound.png');
      break;
    case 'music':
      imageSource = require('../assets/icons/music.png');
      break;
    case 'sound-off':
      imageSource = require('../assets/icons/sound-off.png');
      break;
    case 'music-off':
      imageSource = require('../assets/icons/music-off.png');
      break;
    case 'coin':
      imageSource = require('../assets/icons/coin.png');
      break;
  }

  return (
    <Image 
      source={imageSource} 
      style={iconStyle} 
    />
  );
};

const styles = StyleSheet.create({

  icon: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },

  active: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    tintColor: '#cd2027',
  },

});

export default Icons;
