import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import FastImage from '@d11/react-native-fast-image';

const MARGIN = 2;
const NUM_COLUMNS = 3;
const TILE_DIMENSION = (Dimensions.get('window').width / NUM_COLUMNS) - (MARGIN * 2);

const ImageCard = ({ item, index }) => {
  const priority = index < 6 ? FastImage.priority.high : FastImage.priority.normal;

  return (
    <FastImage
      style={styles.thumbnail}
      source={{
        uri: item.uri,
        priority: priority,
      }}
      resizeMode={FastImage.resizeMode.cover}
    />
  );
};

const styles = StyleSheet.create({
  thumbnail: {
    width: TILE_DIMENSION,
    height: TILE_DIMENSION,
    margin: MARGIN,
    borderRadius: 8,
  },
});

export default ImageCard;
