import React from 'react';
import { StyleSheet, Dimensions, Pressable } from 'react-native';
import FastImage from '@d11/react-native-fast-image';

const MARGIN = 2;
const NUM_COLUMNS = 3;
const TILE_DIMENSION = (Dimensions.get('window').width / NUM_COLUMNS) - (MARGIN * 2);

const ImageCard = ({ item, index, onPress }) => {
  const priority = index < 6 ? FastImage.priority.high : FastImage.priority.normal;

  return (
    <Pressable onPress={onPress}>
      <FastImage
        style={styles.thumbnail}
        source={{
          uri: item.uri,
          priority: priority,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
    </Pressable>
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
