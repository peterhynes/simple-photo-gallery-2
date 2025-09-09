import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSelector } from 'react-redux';
import { selectAllImages } from '../store/slices/imagesSlice';
import ImageCard from './ImageCard';

const NUM_COLUMNS = 3;
const TILE_DIMENSION = Dimensions.get('window').width / NUM_COLUMNS;

const ImageGrid = () => {
  const images = useSelector(selectAllImages);

  return (
    <View style={styles.container}>
      <FlashList
        data={images}
        renderItem={({ item, index }) => <ImageCard item={item} index={index} />}
        keyExtractor={(item) => item.uri}
        numColumns={NUM_COLUMNS}
        estimatedItemSize={TILE_DIMENSION}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default ImageGrid;
