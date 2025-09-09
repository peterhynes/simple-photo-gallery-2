import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';

const MARGIN = 2;
const NUM_COLUMNS = 3;
const TILE_DIMENSION = (Dimensions.get('window').width / NUM_COLUMNS) - (MARGIN * 2);

const ImageCard = ({ item, index }) => {
  const priority = index < 6 ? 'high' : 'normal';

  return (
    <Image
      style={styles.thumbnail}
      source={item.uri}
      priority={priority}
      contentFit="cover"
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
