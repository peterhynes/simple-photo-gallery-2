import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const MARGIN = 2;
const NUM_COLUMNS = 3;
const TILE_DIMENSION = (Dimensions.get('window').width / NUM_COLUMNS) - (MARGIN * 2);

const ImageThumbnail = ({ item }) => {
  return <View style={styles.thumbnail} />;
};

const styles = StyleSheet.create({
  thumbnail: {
    width: TILE_DIMENSION,
    height: TILE_DIMENSION,
    margin: MARGIN,
    backgroundColor: '#ccc',
    borderRadius: 8,
  },
});

export default ImageThumbnail;
